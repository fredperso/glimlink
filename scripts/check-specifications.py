#!/usr/bin/env python3
"""Vérifie la structure et la traçabilité, sans prétendre vérifier le sens métier."""
import datetime
import hashlib
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

REPOSITORY = Path(__file__).resolve().parent.parent
ROOT = REPOSITORY / 'specificaiton'
errors = []
covered = set()
requirements = {}
mandatory = ['README.md', 'SOURCE_V3.md', 'TRACEABILITE.md', 'JOURNAL.md']
for name in mandatory:
    if not (ROOT / name).is_file():
        errors.append(f'Fichier requis absent : {name}')

specifications = sorted(ROOT.glob('spec-*.md'))
if not specifications:
    errors.append('Aucune spécification thématique')
index = (ROOT / 'README.md').read_text() if (ROOT / 'README.md').exists() else ''
for path in sorted(ROOT.glob('*.md')):
    content = path.read_text()
    match = re.match(r'^---\n(.*?)\n---\n', content, re.S)
    if not match:
        errors.append(f'{path.name} : métadonnées absentes')
        continue
    fields = dict(re.findall(r'^([a-z_]+): *(.*)$', match.group(1), re.M))
    for key in ['title', 'date_created', 'last_updated']:
        if not fields.get(key):
            errors.append(f'{path.name} : {key} absent')
    try:
        created = datetime.date.fromisoformat(fields.get('date_created', ''))
        updated = datetime.date.fromisoformat(fields.get('last_updated', ''))
        if updated < created:
            errors.append(f'{path.name} : date de mise à jour antérieure à la création')
    except ValueError:
        errors.append(f'{path.name} : date non valide')
    for target in re.findall(r'(?<!!)\[[^]\n]+\]\(([^\n)]+)\)', content):
        url = urlsplit(target.strip('<>'))
        if url.scheme or not url.path:
            continue
        destination = (path.parent / unquote(url.path)).resolve()
        if not destination.exists():
            errors.append(f'{path.name} : lien local absent {target}')
    if path in specifications:
        headings = re.findall(r'^## (\d+)\. ', content, re.M)
        if headings != [str(number) for number in range(1, 12)]:
            errors.append(f'{path.name} : les 11 rubriques doivent être présentes et ordonnées')
        for key in ['version', 'status', 'product_version', 'pdf_revision', 'pdf_sections', 'maquette_revision']:
            if not fields.get(key):
                errors.append(f'{path.name} : {key} absent')
        try:
            value = fields.get('pdf_sections', '')
            array = re.fullmatch(r'\[(.*)\]', value)
            if not array:
                raise ValueError('liste simple attendue')
            tokens = [token.strip().strip("\"'") for token in array.group(1).split(',')]
            if not tokens or any(not token.isdigit() and token not in {'A', 'B'} for token in tokens):
                raise ValueError('section inconnue')
            covered.update(int(token) if token.isdigit() else token for token in tokens)
        except (ValueError, TypeError):
            errors.append(f'{path.name} : sections PDF non valides')
        if f']({path.name})' not in index:
            errors.append(f'{path.name} : absent de l’index')
        for identifier in re.findall(r'^\| +((?:[A-Z]+-)?[A-Z]+-\d{3}) +\|', content, re.M):
            if identifier in requirements:
                errors.append(f'{path.name} : identifiant dupliqué {identifier} ({requirements[identifier]})')
            requirements[identifier] = path.name

expected = set(range(1, 21)) | {'A', 'B'}
if covered != expected:
    errors.append(f'Couverture PDF incorrecte : manquants={expected - covered}, inconnus={covered - expected}')
source = (ROOT / 'SOURCE_V3.md').read_text() if (ROOT / 'SOURCE_V3.md').exists() else ''
pdf = REPOSITORY / 'Glimlink_Specifications_Fonctionnelles_Detaillees_V3.pdf'
if not pdf.exists() or hashlib.sha256(pdf.read_bytes()).hexdigest() not in source:
    errors.append('Empreinte du PDF absente ou différente de l’archive')
if {int(value) for value in re.findall(r'^## (\d+)\. ', source, re.M)} != set(range(1,21)):
    errors.append('Archive source : sections 1 à 20 incomplètes')
recipe = ROOT / 'spec-process-recette.md'
if recipe.exists():
    text = recipe.read_text()
    for number in range(1,13):
        if f'V3-{number:02}' not in text:
            errors.append(f'Recette : V3-{number:02} absent')
rule = (REPOSITORY / 'AGENTS.md').read_text()
if 'Mandatory Specification Maintenance' not in rule or 'specificaiton/JOURNAL.md' not in rule:
    errors.append('Règle de maintenance absente de AGENTS.md')
if errors:
    print('Échec du contrôle documentaire :')
    for error in errors:
        print(f'- {error}')
    sys.exit(1)
print(f'OK : {len(specifications)} spécifications, {len(list(ROOT.glob("*.md")))} fichiers Markdown, {len(requirements)} exigences identifiées, 20 sections PDF + annexes A/B, recette V3-01 à V3-12, liens locaux et règle de maintenance.')
print('La conformité métier et la mise à jour à chaque demande nécessitent aussi une revue humaine.')
