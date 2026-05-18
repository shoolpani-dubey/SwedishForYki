import vocabularyGuideMarkdown from '../../a1_a2_swedish_vocabulary.md?raw';

const vocabularyGuideSource = 'a1_a2_swedish_vocabulary.md';

const sectionDayMap = {
  'basic greetings and polite words': 1,
  'personal information': 2,
  'question words': 9,
  'common verbs': 14,
  'useful verb forms': 31,
  numbers: 4,
  'days of the week': 21,
  months: 22,
  'time words': 23,
  'family and people': 11,
  'food and drink': 16,
  'home and furniture': 48,
  clothes: 25,
  colors: 35,
  'places in town': 28,
  'transport and travel': 29,
  'body and health': 43,
  'weather and nature': 44,
  'adjectives and describing words': 36,
  'common adverbs and connectors': 34,
  'directions and position': 37,
  'shopping and money': 26,
  'school, work, and daily life': 13,
  'important nouns for everyday life': 59,
  'common phrases': 57,
  'mini example sentences': 59,
};

function normalizeHeading(text) {
  return text
    .replace(/^\d+\.\s*/, '')
    .trim()
    .toLowerCase();
}

function parseTableLine(line) {
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function parseVocabularyGuide(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let currentH2 = '';
  let currentH3 = '';

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (line.startsWith('## ')) {
      currentH2 = line.slice(3).trim();
      currentH3 = '';
      continue;
    }

    if (line.startsWith('### ')) {
      currentH3 = line.slice(4).trim();
      continue;
    }

    if (!line.startsWith('|')) {
      continue;
    }

    const headerLine = parseTableLine(line);
    const dividerLine = lines[index + 1]?.trim() ?? '';

    if (!dividerLine.startsWith('|')) {
      continue;
    }

    const rows = [];
    let rowIndex = index + 2;
    while (rowIndex < lines.length && lines[rowIndex].trim().startsWith('|')) {
      const rowCells = parseTableLine(lines[rowIndex].trim());
      if (rowCells.length === headerLine.length) {
        rows.push(
          Object.fromEntries(headerLine.map((header, cellIndex) => [header, rowCells[cellIndex]])),
        );
      }
      rowIndex += 1;
    }

    sections.push({
      key: normalizeHeading(currentH3 || currentH2),
      heading: currentH3 || currentH2.replace(/^\d+\.\s*/, ''),
      rows,
    });

    index = rowIndex - 1;
  }

  return sections;
}

function createVocabularyEntries(rows) {
  const headers = Object.keys(rows[0] ?? {});

  if (
    headers.length !== 2 ||
    headers[0] !== 'Swedish' ||
    headers[1] !== 'English'
  ) {
    return [];
  }

  return rows.map((row) => ({
    swedish: row.Swedish,
    english: row.English,
    exampleSwedish: row.Swedish,
    exampleEnglish: row.English,
  }));
}

const lessonAdditions = parseVocabularyGuide(vocabularyGuideMarkdown)
  .filter((section) => sectionDayMap[section.key])
  .map((section) => ({
    day: sectionDayMap[section.key],
    summary: `This lesson now explicitly covers the vocabulary-guide set for ${section.heading.toLowerCase()}.`,
    sourceDates: [vocabularyGuideSource],
    sections: [
      {
        heading: `Vocabulary Guide: ${section.heading}`,
        content: [
          'These items were mapped from the course vocabulary guide so the lesson coverage matches the reference list directly.',
        ],
        table: section.rows,
      },
    ],
    vocabulary: createVocabularyEntries(section.rows),
  }));

const vocabularyGuideCoverage = {
  sourceLabel: vocabularyGuideSource,
  lessonAdditions,
};

export default vocabularyGuideCoverage;
