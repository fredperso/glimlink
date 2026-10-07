import {
  notifications,
  readNotifications,
  simulateNotification,
} from '../src/domain/notifications.ts';
import { applySwipe, undoSwipe } from '../src/domain/swipe.ts';
import { normalizeSkills, addSkill, skillKey } from '../src/domain/skills.ts';
import { calendarDay, monthDates, monthSummary } from '../src/domain/calendar.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { initialStore } from '../src/domain/fixtures.ts';
import {
  adviserNeeds,
  adviserStore,
  adviserRequests,
  pendingCorrections,
  requestChanges,
  relaxationSuggestions,
  checkAvailability,
  companyStore,
  savePersonalDetails,
  classifyStudent,
  publishStudent,
  requestSelection,
  saveDraft,
  visibleStudents,
} from '../src/domain/model.ts';

test('V3-01 — un brouillon ne produit ni résultat ni alerte avant publication', () => {
  const store = initialStore();
  const need = store.needs[0];
  assert.ok(!visibleStudents(store, need).some((s) => s.id === 'draft-zoe'));
  assert.ok(!store.alerts.some((a) => a.studentId === 'draft-zoe'));
  const draft = store.students.find((s) => s.id === 'draft-zoe')!;
  draft.draft.license = 'yes';
  const published = publishStudent(store, draft.id);
  assert.ok(visibleStudents(published, need).some((s) => s.id === draft.id));
  assert.ok(published.alerts.some((a) => a.studentId === draft.id && a.needId === need.id));
});
test('V3-02 — une correction publiée reste la source des contrôles', () => {
  const store = initialStore();
  const student = store.students[0];
  student.draft.skills = normalizeSkills(['Facturation vérifiée']);
  student.draft.license = 'no';
  const published = publishStudent(store, student.id);
  const result = visibleStudents(published, store.needs[0]).find((s) => s.id === student.id)!;
  assert.deepEqual(result.published!.skills, normalizeSkills(['Facturation vérifiée']));
  assert.equal(classifyStudent(published, result, store.needs[0]), 'conflict');
});
test('V3-03 — enregistrer un brouillon ne remplace pas les corrections publiées', () => {
  const student = initialStore().students[0];
  const next = saveDraft(student, {
    ...student.draft,
    skills: normalizeSkills(['Nouvelle proposition']),
  });
  assert.deepEqual(next.published!.skills, student.published!.skills);
  assert.deepEqual(next.draft.skills, normalizeSkills(['Nouvelle proposition']));
});
test('V3-04 — permis inconnu distinct de permis non détenu', () => {
  const store = initialStore();
  const student = store.students[0].published!;
  const unknown = checkAvailability(
    { ...student, license: 'unknown' },
    store.calendars[0],
    store.needs[0],
  );
  const denied = checkAvailability(
    { ...student, license: 'no' },
    store.calendars[0],
    store.needs[0],
  );
  assert.ok(unknown.some((c) => c.kind === 'unknown' && c.text.includes('Permis')));
  assert.ok(!unknown.some((c) => c.kind === 'conflict'));
  assert.ok(denied.some((c) => c.kind === 'conflict'));
});
test('V3-05 — le calendrier modifié est hérité par deux profils de la promotion', () => {
  const store = initialStore();
  const need = store.needs[0];
  const pair = store.students.filter((s) => ['sophie', 'ines'].includes(s.id));
  assert.ok(pair.every((s) => classifyStudent(store, s, need) === 'main'));
  store.calendars[0].courseDays.push('Vendredi');
  assert.ok(pair.every((s) => classifyStudent(store, s, need) === 'conflict'));
});
test('V3-06 — vendredi sans cours est potentiellement compatible', () => {
  const store = initialStore();
  const checks = checkAvailability(
    store.students[0].published!,
    store.calendars[0],
    store.needs[0],
  );
  assert.ok(checks.some((c) => c.kind === 'ok' && c.text.includes('vendredi')));
  assert.ok(!checks.some((c) => c.kind !== 'ok'));
});
test('V3-07 — cours le mardi et présence obligatoire mardi indiquent un conflit', () => {
  const store = initialStore();
  const checks = checkAvailability(store.students[0].published!, store.calendars[0], {
    ...store.needs[0],
    requiredDays: ['Mardi'],
  });
  assert.ok(checks.some((c) => c.kind === 'conflict' && c.text.includes('mardi')));
});
test('V3-08 — calendrier absent, variable ou hors période ne confirme pas la présence', () => {
  const store = initialStore();
  for (const calendar of [
    undefined,
    { ...store.calendars[0], mode: 'variable' as const },
    { ...store.calendars[0], end: '2026-12-01' },
  ]) {
    const checks = checkAvailability(store.students[0].published!, calendar, store.needs[0]);
    assert.ok(checks.some((c) => c.kind === 'unknown'));
    assert.ok(!checks.some((c) => c.text.startsWith('Pas de conflit')));
  }
});
test('V3-09 — un jour sans cours ne neutralise pas une indisponibilité ou une date tardive', () => {
  const store = initialStore();
  const checks = checkAvailability(
    { ...store.students[0].published!, availableFrom: '2027-01-01', unavailableDays: ['Vendredi'] },
    store.calendars[0],
    store.needs[0],
  );
  assert.equal(checks.filter((c) => c.kind === 'conflict').length, 2);
});
test('V3-10 — profil retiré absent des résultats et des nouvelles demandes', () => {
  const store = initialStore();
  const student = store.students.find((s) => s.id === 'lucas')!;
  student.status = 'withdrawn';
  assert.ok(!visibleStudents(store, store.needs[0]).some((s) => s.id === student.id));
  const requested = requestSelection(store, store.needs[0].id, '');
  assert.deepEqual(requested.requests[0].studentIds, ['ines']);
});
test('V3-11 — la projection entreprise exclut les données personnelles et les brouillons', () => {
  const store = initialStore();
  const student = store.students[0];
  assert.ok(student.personalDetails?.lastName);
  student.draft.firstName = 'Prénom non validé';
  Object.assign(student.published!, { email: 'secret@example.com' });
  const response = companyStore(store);
  const exposed = response.students.find((item) => item.id === student.id)!;
  assert.equal(exposed.published!.firstName, 'Sophie');
  assert.equal(exposed.draft.firstName, 'Sophie');
  assert.ok(!('personalDetails' in exposed));
  assert.ok(!('email' in exposed.published!));
  assert.ok(
    !response.students.some((item) => item.status === 'draft' || item.school === 'campus-b'),
  );
  const json = JSON.stringify(response);
  assert.ok(!json.includes('secret@example.com'));
  assert.ok(!json.includes(student.personalDetails!.email));
  assert.ok(!('personalDetails' in visibleStudents(store, store.needs[0])[0]));
});
test('Le conseiller enregistre les coordonnées de son vivier sans publier ses corrections', () => {
  const store = initialStore();
  const student = store.students[0];
  student.draft.firstName = 'Sophie corrigée';
  const changed = savePersonalDetails(
    store,
    student.id,
    { ...student.personalDetails!, lastName: '  DUPONT  ', email: 'updated@example.com' },
    { role: 'adviser', school: 'campus-a' },
  );
  assert.equal(changed.students[0].personalDetails!.lastName, 'DUPONT');
  assert.equal(changed.students[0].personalDetails!.email, 'updated@example.com');
  assert.equal(changed.students[0].draft.firstName, 'Sophie corrigée');
  assert.deepEqual(changed.students[0].published, student.published);
  assert.equal(store.students[0].personalDetails!.lastName, 'DURAND');
  assert.ok(!JSON.stringify(companyStore(changed)).includes('updated@example.com'));
});
test('Les coordonnées refusent une modification entreprise ou hors périmètre conseiller', () => {
  const store = initialStore();
  const details = store.students[0].personalDetails!;
  assert.equal(
    savePersonalDetails(store, 'sophie', details, { role: 'company', school: 'campus-a' }),
    store,
  );
  assert.equal(
    savePersonalDetails(store, 'other-campus', details, { role: 'adviser', school: 'campus-a' }),
    store,
  );
});
test('Publier ou importer un nouveau CV préserve les coordonnées privées', () => {
  const store = initialStore();
  const personal = structuredClone(store.students[0].personalDetails);
  const published = publishStudent(store, 'sophie');
  assert.deepEqual(published.students[0].personalDetails, personal);
  assert.ok(!('email' in published.students[0].published!));
  const changed = saveDraft(published.students[0], {
    ...published.students[0].draft,
    skills: normalizeSkills(['Compétence corrigée']),
  });
  assert.deepEqual(changed.personalDetails, personal);
});
test('V3-12 — un vivier non autorisé ne fournit aucun résultat', () => {
  const store = initialStore();
  assert.ok(!visibleStudents(store, store.needs[0]).some((s) => s.school === 'campus-b'));
});
test('Aucun résultat avant validation explicite du brief ou après fermeture du besoin', () => {
  const store = initialStore();
  assert.deepEqual(visibleStudents(store, { ...store.needs[0], validated: false }), []);
  assert.deepEqual(visibleStudents(store, { ...store.needs[0], status: 'closed' }), []);
});
test('Une sélection identique ne produit pas de demande en double', () => {
  const store = initialStore();
  const next = requestSelection(store, store.needs[0].id, '');
  assert.equal(requestSelection(next, store.needs[0].id, '').requests.length, 1);
});
test('La zone À découvrir ne masque pas un conflit obligatoire connu', () => {
  const store = initialStore();
  const student = store.students.find((s) => s.id === 'adam')!;
  assert.equal(classifyStudent(store, student, store.needs[0]), 'discover');
  student.published!.license = 'no';
  assert.equal(classifyStudent(store, student, store.needs[0]), 'conflict');
});

test('Calendrier — grille du mois alignée sur lundi et année bissextile', () => {
  const february = monthDates(2028, 1);
  assert.equal(february[0], null);
  assert.equal(february[1], '2028-02-01');
  assert.equal(february.filter(Boolean).length, 29);
  assert.equal(february.length % 7, 0);
});
test('Calendrier — les exceptions respectent les limites et les week-ends', () => {
  const calendar = initialStore().calendars[0];
  calendar.exceptions = [
    {
      id: 'exception',
      start: '2026-11-02',
      end: '2026-11-08',
      kind: 'course',
      label: 'Regroupement',
    },
  ];
  assert.equal(calendarDay(calendar, '2026-11-06'), 'course');
  assert.equal(calendarDay(calendar, '2026-11-07'), 'weekend');
  assert.equal(calendarDay(calendar, '2026-08-31'), 'outside');
  const counts = monthSummary(calendar, 2026, 10);
  assert.equal(
    Object.values(counts).reduce((sum, value) => sum + value, 0),
    30,
  );
});
test('Calendrier — une exception de cours crée un conflit sur une date demandée', () => {
  const store = initialStore();
  const calendar = store.calendars[0];
  calendar.exceptions = [
    {
      id: 'exception',
      start: '2026-11-06',
      end: '2026-11-06',
      kind: 'course',
      label: 'Regroupement',
    },
  ];
  assert.ok(
    checkAvailability(store.students[0].published!, calendar, store.needs[0]).some(
      (item) => item.kind === 'conflict' && item.text.includes('vendredi'),
    ),
  );
});
test('Calendrier — une exception sans cours libère uniquement sa période', () => {
  const store = initialStore();
  const calendar = store.calendars[0];
  calendar.exceptions = [
    {
      id: 'exception',
      start: '2026-11-02',
      end: '2026-11-06',
      kind: 'potential',
      label: 'Sans cours',
    },
  ];
  const need = {
    ...store.needs[0],
    start: '2026-11-02',
    end: '2026-11-06',
    requiredDays: ['Mardi'] as const,
  };
  assert.equal(calendarDay(calendar, '2026-11-03'), 'potential');
  assert.equal(calendarDay(calendar, '2026-11-10'), 'course');
  assert.ok(
    !checkAvailability(store.students[0].published!, calendar, {
      ...need,
      requiredDays: [...need.requiredDays],
    }).some((item) => item.kind === 'conflict'),
  );
  assert.ok(
    checkAvailability(store.students[0].published!, calendar, {
      ...need,
      end: '2026-11-13',
      requiredDays: [...need.requiredDays],
    }).some((item) => item.kind === 'conflict'),
  );
});
test('Calendrier — un cours connu et un planning variable affichent conflit et incertitude', () => {
  const store = initialStore();
  const calendar = {
    ...store.calendars[0],
    mode: 'variable' as const,
    exceptions: [
      {
        id: 'exception',
        start: '2026-11-06',
        end: '2026-11-06',
        kind: 'course' as const,
        label: 'Regroupement',
      },
    ],
  };
  const checks = checkAvailability(store.students[0].published!, calendar, store.needs[0]);
  assert.ok(checks.some((item) => item.kind === 'conflict' && item.text.includes('vendredi')));
  assert.ok(
    checks.some((item) => item.kind === 'unknown' && item.text.includes('Rythme variable')),
  );
});

test('Compétences — migration des libellés existants sans inventer un niveau ou un lien formation', () => {
  const skills = normalizeSkills([' Excel ', 'Relation client', 'EXCEL', '']);
  assert.equal(skills.length, 2);
  assert.deepEqual(
    skills.map((skill) => skill.name),
    ['Excel', 'Relation client'],
  );
  assert.ok(
    skills.every(
      (skill) =>
        skill.status === 'acquired' && skill.level === 'unknown' && skill.trainingId === null,
    ),
  );
  assert.equal(skillKey('  Gestion   de devis '), skillKey('gestion de devis'));
});
test('Compétences — les propositions de formation restent en acquisition et les doublons sont refusés', () => {
  const skills = normalizeSkills(['Excel']);
  const learning = {
    id: 'target',
    name: 'Tableaux de bord',
    level: 'unknown' as const,
    status: 'learning' as const,
    trainingId: 'gpm',
  };
  const next = addSkill(skills, learning);
  assert.equal(next[1].status, 'learning');
  assert.equal(next[1].level, 'unknown');
  assert.equal(addSkill(next, { ...learning, id: 'duplicate', name: 'TABLEAUX DE BORD' }), next);
});
test('Compétences — niveau et acquisition changent dans le brouillon puis après validation seulement', () => {
  const store = initialStore();
  const student = store.students[0];
  const draft = saveDraft(student, {
    ...student.draft,
    skills: student.draft.skills.map((skill, index) =>
      index === 0 ? { ...skill, level: 'advanced', status: 'learning', trainingId: 'gpm' } : skill,
    ),
  });
  const pending = {
    ...store,
    students: store.students.map((item) => (item.id === student.id ? draft : item)),
  };
  const before = companyStore(pending).students[0].published!.skills[0];
  assert.equal(before.status, 'acquired');
  assert.equal(before.level, 'autonomous');
  const validated = publishStudent(pending, student.id);
  const after = companyStore(validated).students[0].published!.skills[0];
  assert.equal(after.status, 'learning');
  assert.equal(after.level, 'advanced');
  assert.equal(after.trainingId, 'gpm');
  assert.deepEqual(validated.students[0].personalDetails, student.personalDetails);
});
test('Compétences — une suppression non publiée conserve la version entreprise', () => {
  const store = initialStore();
  const student = store.students[0];
  const removed = student.draft.skills[0];
  const changed = saveDraft(student, { ...student.draft, skills: student.draft.skills.slice(1) });
  assert.ok(changed.published!.skills.some((skill) => skill.id === removed.id));
  assert.ok(!changed.draft.skills.some((skill) => skill.id === removed.id));
});
test('Compétences — projection structurée sans champs annexes et niveaux inconnus préservés', () => {
  const result = normalizeSkills([
    {
      id: 'x',
      name: 'Excel',
      level: 'constructor',
      status: 'learning',
      trainingId: 'gpm',
      email: 'private@example.com',
    },
    null,
  ]);
  assert.equal(result[0].level, 'unknown');
  assert.equal(result[0].status, 'learning');
  assert.ok(!JSON.stringify(result).includes('private@example.com'));
});

test('Audit — les corrections d’un profil publié restent repérables jusqu’à validation', () => {
  const store = initialStore();
  const student = store.students[0];
  assert.equal(pendingCorrections(student), false);
  const next = saveDraft(student, { ...student.draft, mobility: 'Déplacements dans la métropole' });
  assert.equal(next.status, 'published');
  assert.equal(pendingCorrections(next), true);
  assert.equal(next.published!.mobility, undefined);
  store.students[0] = next;
  const validated = publishStudent(store, student.id).students[0];
  assert.equal(pendingCorrections(validated), false);
  assert.equal(validated.validatedBy, 'Mathilde JEANNE');
  assert.equal(validated.published!.mobility, 'Déplacements dans la métropole');
});

test('Audit — compteurs et listes conseiller excluent les demandes et besoins hors campus', () => {
  const store = initialStore();
  store.needs.push({ ...store.needs[0], id: 'foreign-need', schools: ['campus-b'] });
  store.requests.push({
    id: 'foreign-request',
    needId: 'foreign-need',
    studentIds: [store.students.find((s) => s.school === 'campus-b')!.id],
    message: '',
    date: '',
    status: 'received',
  });
  assert.ok(!adviserNeeds(store).some((n) => n.id === 'foreign-need'));
  assert.equal(adviserRequests(store).length, 0);
});

test('Audit — isolation des entreprises indépendante des viviers indiqués dans un besoin', () => {
  const store = initialStore();
  store.needs[0].schools.push('campus-b');
  store.requests.push({
    id: 'alba-request',
    needId: 'need-admin',
    studentIds: ['sophie'],
    message: '',
    date: '',
    status: 'received',
    followUp: 'NOTE CONSEILLER CONFIDENTIELLE',
  });
  const alba = companyStore(store);
  assert.ok(!visibleStudents(store, store.needs[0]).some((s) => s.school === 'campus-b'));
  assert.ok(!alba.needs.some((n) => n.id === 'need-bloom'));
  assert.ok(!alba.students.some((s) => s.school === 'campus-b'));
  assert.ok(!JSON.stringify(alba.requests).includes('NOTE CONSEILLER CONFIDENTIELLE'));
  const bloom = companyStore({ ...store, activeCompanyId: 'bloom-studio' });
  assert.deepEqual(
    bloom.needs.map((n) => n.id),
    ['need-bloom'],
  );
  assert.equal(bloom.requests.length, 0);
  assert.equal(bloom.alerts.length, 0);
});

test('Audit — modifications de brief et calendrier signalées sans altérer le contexte initial', () => {
  const store = requestSelection(initialStore(), 'need-admin', 'Préparer un échange');
  const request = store.requests[0];
  assert.ok(request.snapshot);
  assert.deepEqual(requestChanges(store, request), []);
  const originalMissions = [...request.snapshot.need.missions];
  store.needs[0].missions = ['Une nouvelle mission confirmée'];
  const selected = store.students.find((s) => s.id === request.studentIds[0])!;
  selected.published!.availableFrom = '2027-03-01';
  store.calendars.find((c) => c.id === selected.published!.trainingId)!.courseDays = ['Vendredi'];
  const changes = requestChanges(store, request);
  assert.ok(changes.some((change) => change.includes('brief')));
  assert.ok(changes.some((change) => change.includes('disponibilités')));
  assert.ok(changes.some((change) => change.includes('calendrier')));
  assert.deepEqual(request.snapshot.need.missions, originalMissions);
  assert.ok(!JSON.stringify(request.snapshot).includes('personalDetails'));
});

test('Audit — les assouplissements sont chiffrés sans modifier le besoin ni compter un autre vivier', () => {
  const store = initialStore();
  const need = { ...store.needs[0], requiredDays: ['Mardi'] as const };
  const original = JSON.stringify(store);
  const suggestions = relaxationSuggestions(store, {
    ...need,
    requiredDays: [...need.requiredDays],
  });
  assert.ok(
    suggestions.some((suggestion) => suggestion.label.includes('mardi') && suggestion.count > 0),
  );
  assert.equal(JSON.stringify(store), original);
  assert.ok(
    suggestions.every(
      (suggestion) => suggestion.count <= visibleStudents(store, store.needs[0]).length,
    ),
  );
});

test('Audit — les références historiques ne révèlent pas un profil hors périmètre', () => {
  const store = requestSelection(initialStore(), 'need-admin', '');
  const request = store.requests[0];
  const foreign = store.students.find((student) => student.school === 'campus-b')!;
  request.studentIds.push(foreign.id);
  request.snapshot!.students.push({ id: foreign.id, details: foreign.published! });
  for (const projection of [companyStore(store), adviserStore(store)]) {
    assert.ok(!projection.requests[0].studentIds.includes(foreign.id));
    assert.ok(
      !projection.requests[0].snapshot!.students.some((student) => student.id === foreign.id),
    );
  }
});

test('Swipe — sélectionner avance sans doublon et reste limité au besoin', () => {
  const store = initialStore();
  const decision = { needId: 'need-admin', studentId: 'sophie', direction: 'right' as const };
  const next = applySwipe(store, decision);
  assert.ok(next.needs[0].selected.includes('sophie'));
  assert.equal(
    applySwipe(next, decision).needs[0].selected.filter((id) => id === 'sophie').length,
    1,
  );
  assert.deepEqual(next.needs[1], store.needs[1]);
});
test('Swipe — passer un candidat ne retire pas les autres sélections et peut être annulé', () => {
  const store = initialStore();
  const decision = { needId: 'need-admin', studentId: 'sophie', direction: 'left' as const };
  const next = applySwipe(store, decision);
  assert.ok(next.needs[0].passed.includes('sophie'));
  assert.deepEqual(next.needs[0].selected, store.needs[0].selected);
  assert.deepEqual(undoSwipe(next, decision).needs[0], store.needs[0]);
});
test('Swipe — annuler une sélection préserve les profils retenus auparavant', () => {
  const store = initialStore();
  const decision = { needId: 'need-admin', studentId: 'sophie', direction: 'right' as const };
  assert.deepEqual(undoSwipe(applySwipe(store, decision), decision).needs[0], store.needs[0]);
});
test('Swipe — un profil retiré ou hors vivier ne peut pas être sélectionné', () => {
  const store = initialStore();
  store.students[0].status = 'withdrawn';
  for (const studentId of [
    'sophie',
    store.students.find((student) => student.school === 'campus-b')!.id,
  ])
    assert.equal(applySwipe(store, { needId: 'need-admin', studentId, direction: 'right' }), store);
  store.needs[0].status = 'closed';
  assert.equal(
    applySwipe(store, { needId: 'need-admin', studentId: 'nora', direction: 'right' }),
    store,
  );
});

test('Notifications — la simulation entreprise ne publie ni brouillon ni profil hors vivier', () => {
  const store = initialStore();
  const next = simulateNotification(store, 'company');
  const alert = next.alerts[0];
  assert.equal(next.alerts.length, store.alerts.length + 1);
  assert.ok(alert.id.startsWith('simulation-'));
  const need = next.needs.find((item) => item.id === alert.needId)!;
  assert.ok(visibleStudents(next, need).some((student) => student.id === alert.studentId));
  assert.deepEqual(next.students, store.students);
  const closed = {
    ...store,
    needs: store.needs.map((need) => ({ ...need, status: 'closed' as const })),
  };
  assert.equal(simulateNotification(closed, 'company'), closed);
});

test('Notifications — lire une alerte reste limité au compte entreprise', () => {
  const store = initialStore();
  store.alerts.push({
    id: 'foreign-alert',
    needId: 'need-com',
    studentId: 'maya',
    read: false,
    date: '',
  });
  const next = readNotifications(
    store,
    'company',
    store.alerts.map((alert) => alert.id),
  );
  assert.equal(next.alerts.find((alert) => alert.id === 'alert-nora')?.read, true);
  assert.equal(next.alerts.find((alert) => alert.id === 'foreign-alert')?.read, false);
  assert.ok(notifications(next, 'company').every((item) => item.id !== 'foreign-alert'));
});

test('Notifications — une demande simulée conserve les sélections et un instantané publié', () => {
  const store = initialStore();
  const next = simulateNotification(store, 'adviser');
  assert.equal(next.requests.length, 1);
  assert.deepEqual(next.needs, store.needs);
  const request = next.requests[0];
  assert.ok(request.snapshot);
  assert.ok(request.message.startsWith('[Simulation]'));
  assert.equal(request.status, 'received');
  assert.equal(notifications(next, 'adviser')[0].read, false);
  const read = readNotifications(next, 'adviser', [request.id]);
  assert.equal(notifications(read, 'adviser')[0].read, true);
  assert.equal(read.requests[0].status, 'received');
  assert.equal(companyStore(read).requests[0].adviserNotificationRead, undefined);
  assert.equal(
    read.requests[0].snapshot?.students[0].details.note,
    request.snapshot.students[0].details.note,
  );
});

test('Notifications — la lecture conseiller ne modifie aucune demande hors vivier', () => {
  const store = simulateNotification(initialStore(), 'adviser');
  const outsider = store.students.find((student) => student.school !== 'campus-a')!;
  store.requests.push({
    id: 'outside-request',
    needId: store.needs[0].id,
    studentIds: [outsider.id],
    message: 'Hors périmètre',
    date: '',
    status: 'received',
  });
  const next = readNotifications(
    store,
    'adviser',
    store.requests.map((request) => request.id),
  );
  assert.equal(
    next.requests.find((request) => request.id === 'outside-request')?.adviserNotificationRead,
    undefined,
  );
  assert.equal(
    notifications(next, 'adviser').some((item) => item.id === 'outside-request'),
    false,
  );
});
