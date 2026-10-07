import { useLayoutEffect, useState } from 'react';
import { useApp } from '../context.tsx';
import { pendingCorrections, type Student } from '../domain/model.ts';
import Select from './Select.tsx';
import { Avatar, Badge, Button, Empty, Icon } from './ui.tsx';

export default function TalentsTable({
  students,
  filterKey,
}: {
  students: Student[];
  filterKey: string;
}) {
  const { store, openModal } = useApp();
  const [paging, setPaging] = useState({ filterKey, page: 1, size: 5 });
  useLayoutEffect(() => {
    setPaging((previous) => ({ ...previous, filterKey, page: 1 }));
  }, [filterKey]);
  const pages = Math.max(1, Math.ceil(students.length / paging.size));
  const page = Math.min(paging.filterKey === filterKey ? paging.page : 1, pages);
  const start = (page - 1) * paging.size;
  const rows = students.slice(start, start + paging.size);
  return (
    <section aria-label="Liste paginée des talents">
      <div className="talents-table-panel student-list">
        <table className="talent-table" role="table">
          <caption className="sr-only">Talents du vivier conseiller</caption>
          <thead role="rowgroup">
            <tr role="row">
              {['Candidat', 'Formation', 'Compétences', 'Statut', 'Action'].map((title) => (
                <th key={title} scope="col" role="columnheader">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {rows.map((student) => (
              <tr key={student.id} className="student-row" role="row">
                <td className="talent-name" role="cell">
                  <div>
                    <Avatar variant={student.avatar} small />
                    <strong>
                      {student.draft.firstName} {student.personalDetails?.lastName}
                    </strong>
                  </div>
                </td>
                <td data-label="Formation" role="cell">
                  {store.calendars.find((calendar) => calendar.id === student.draft.trainingId)
                    ?.title ?? 'Formation à renseigner'}
                </td>
                <td data-label="Compétences" role="cell">
                  {student.draft.skills
                    .map(
                      (skill) => `${skill.name}${skill.status === 'learning' ? ' (en cours)' : ''}`,
                    )
                    .join(' · ') || 'Non renseignées'}
                </td>
                <td data-label="Statut" role="cell">
                  <Badge
                    tone={
                      student.status === 'published'
                        ? 'green'
                        : student.status === 'draft'
                          ? 'warning'
                          : 'neutral'
                    }
                  >
                    {student.status === 'published'
                      ? pendingCorrections(student)
                        ? 'Corrections à valider'
                        : 'Publié'
                      : student.status === 'draft'
                        ? 'À valider'
                        : 'Retiré'}
                  </Badge>
                </td>
                <td className="talent-action" role="cell">
                  <Button
                    variant="secondary"
                    onClick={() => openModal({ kind: 'student', studentId: student.id })}
                  >
                    {student.status === 'draft' ? 'Vérifier la fiche' : 'Ouvrir la fiche'}
                    <Icon name="arrow" size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!students.length && (
          <Empty title="Aucun talent avec ces filtres">
            Essayez un autre prénom, une autre compétence ou un autre statut.
          </Empty>
        )}
      </div>
      <div className="talents-pagination">
        <p role="status" aria-live="polite" aria-atomic="true">
          {students.length
            ? `${start + 1}–${Math.min(start + paging.size, students.length)} sur ${students.length} talents`
            : '0 talent'}
        </p>
        <label>
          Talents par page
          <Select
            name="pageSize"
            value={paging.size}
            onChange={(event) =>
              setPaging({ filterKey, page: 1, size: Number(event.target.value) })
            }
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </label>
        <nav aria-label="Pagination des talents">
          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPaging({ ...paging, filterKey, page: page - 1 })}
          >
            Précédent
          </Button>
          <span>
            Page {page} sur {pages}
          </span>
          <Button
            variant="secondary"
            disabled={page === pages}
            onClick={() => setPaging({ ...paging, filterKey, page: page + 1 })}
          >
            Suivant
          </Button>
        </nav>
      </div>
    </section>
  );
}
