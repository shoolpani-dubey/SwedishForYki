import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import legacyEnhancements from '../src/data/courseEnhancements.js';
import { parseTopics } from './parse-topics.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../src/data/swedishYkiCourse.json');
const legacyCoursePath = path.resolve(__dirname, '../src/data/swedishA1Course.json');
const legacyVocabularyGuidePath = path.resolve(
  __dirname,
  '../a1_a2_swedish_vocabulary.md',
);
const textbookTextPath = path.resolve(
  __dirname,
  '../src/data/textbookYkiPreparationA0A2.txt',
);

const legacyBaseCourse = JSON.parse(fs.readFileSync(legacyCoursePath, 'utf8'));
const legacyVocabularyGuideMarkdown = fs.readFileSync(legacyVocabularyGuidePath, 'utf8');
const textbookExtractedText = fs.readFileSync(textbookTextPath, 'utf8');

const levelMeta = {
  A1: {
    id: 'A1',
    title: 'A1 Foundations',
    description:
      'Build survival Swedish for greetings, daily routines, shopping, transport, health, and short social interaction.',
    objectives: [
      'Understand very common words and fixed phrases in slow, clear Swedish.',
      'Introduce yourself and manage routine service situations.',
      'Write short messages, forms, and simple personal texts.',
    ],
  },
  A2: {
    id: 'A2',
    title: 'A2 Everyday Independence',
    description:
      'Extend Swedish toward independent everyday use with longer sentences, past and future time, services, and practical writing.',
    objectives: [
      'Handle predictable situations at work, school, healthcare, and public services.',
      'Describe plans, experiences, and problems with short connected speech.',
      'Read and write common notices, emails, and simple opinion texts.',
    ],
  },
  B1: {
    id: 'B1',
    title: 'B1 YKI Readiness',
    description:
      'Train the vocabulary, grammar control, and production stamina needed for late-August YKI-style tasks.',
    objectives: [
      'Follow the main point of everyday Swedish in speech and writing.',
      'Explain opinions, reasons, experiences, and practical problems in connected Swedish.',
      'Simulate reading, listening, speaking, and writing tasks under time pressure.',
    ],
  },
};

const v = (swedish, english, exampleSwedish = swedish, exampleEnglish = english) => ({
  swedish,
  english,
  exampleSwedish,
  exampleEnglish,
});

const d = (speaker, swedish, english) => ({
  speaker,
  swedish,
  english,
});

const lessonSpec = ({
  title,
  goal,
  focus,
  grammarNote,
  vocabulary,
  dialogue,
  practice,
  ykiSkills = ['listening', 'speaking', 'reading', 'writing'],
  canDo,
  examTask,
  durationMinutes = 80,
}) => ({
  title,
  goal,
  focus,
  grammarNote,
  vocabulary,
  dialogue,
  practice,
  ykiSkills,
  canDo,
  examTask,
  durationMinutes,
});

const legacyVocabularySectionDayMap = {
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

function parseLegacyVocabularyGuide(markdown) {
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

  if (headers.length !== 2 || headers[0] !== 'Swedish' || headers[1] !== 'English') {
    return [];
  }

  return rows.map((row) => ({
    swedish: row.Swedish,
    english: row.English,
    exampleSwedish: row.Swedish,
    exampleEnglish: row.English,
  }));
}

function groupByDay(items) {
  return items.reduce((map, item) => {
    const groupedItems = map.get(item.day) ?? [];
    groupedItems.push(item);
    map.set(item.day, groupedItems);
    return map;
  }, new Map());
}

function mergeVocabulary(...lists) {
  const merged = [];
  const seen = new Set();

  lists.flat().forEach((item) => {
    if (!item) {
      return;
    }

    const key = `${item.swedish.trim().toLowerCase()}::${item.english.trim().toLowerCase()}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    merged.push(item);
  });

  return merged;
}

function normalizeExtractedParagraph(paragraph) {
  return paragraph
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function createTextbookResource({ page, day, title, resourceType, summary }) {
  const rawPage = textbookExtractedText.split('\f')[page] ?? '';
  const paragraphs = rawPage
    .split(/\n\s*\n/g)
    .map(normalizeExtractedParagraph)
    .filter(Boolean);
  const content = paragraphs.slice(1);

  return {
    day,
    resourceType,
    summary,
    sourceLabel: 'Textbook_YKI-Preparation-for-Beginners_A0-A2-Swedish.pdf',
    sourceDates: ['Learn Swedish Lab, 2025'],
    pageNumber: page + 1,
    sections: [
      {
        heading: `${title} (Textbook page ${page + 1})`,
        content,
      },
    ],
    vocabulary: [],
  };
}

const textbookPageMappings = [
  { page: 2, day: 1, title: 'Del 1 overview', resourceType: 'Textbook overview', summary: 'Textbook Part 1 overview: pronunciation, pronouns, question words, infinitive and imperative, negation, modal verbs, word order, and gender.' },
  { page: 3, day: 1, title: 'Hej! Vad heter du?', resourceType: 'Textbook page', summary: 'Textbook self-introduction and pronunciation page with a greeting dialogue and sound focus.' },
  { page: 4, day: 5, title: 'Hej! Jag har en pojkvän!', resourceType: 'Textbook page', summary: 'Textbook pronoun page using relationship talk and family references.' },
  { page: 5, day: 10, title: 'Jag har en fråga...', resourceType: 'Textbook page', summary: 'Textbook grocery dialogue focusing on question words and basic shopping interaction.' },
  { page: 6, day: 3, title: 'Du ska sitta!', resourceType: 'Textbook page', summary: 'Textbook imperative page with a short dialogue and command forms.' },
  { page: 7, day: 16, title: 'Jag kan inte plugga mer!', resourceType: 'Textbook page', summary: 'Textbook school and modal-verb page about stress, studying, and negation.' },
  { page: 8, day: 6, title: 'Jag vill ha en dator och ett datorspel!', resourceType: 'Textbook page', summary: 'Textbook en/ett page with a birthday wish-list scenario.' },
  { page: 9, day: 6, title: 'En lista på ETT ord', resourceType: 'Textbook page', summary: 'Textbook neuter noun reference list for ett-words.' },
  { page: 10, day: 16, title: 'Jobb', resourceType: 'Textbook page', summary: 'Textbook work page with occupation vocabulary and an interview dialogue.' },
  { page: 11, day: 17, title: 'Fritid', resourceType: 'Textbook page', summary: 'Textbook free-time page describing routines, hobbies, and weekend activities.' },
  { page: 12, day: 31, title: 'Min dröm', resourceType: 'Textbook page', summary: 'Textbook ambitions page about dream jobs, role models, and career change.' },
  { page: 13, day: 24, title: 'Del 2 overview', resourceType: 'Textbook overview', summary: 'Textbook Part 2 overview: adjectives, definite nouns, and preterite.' },
  { page: 14, day: 24, title: 'En rolig film, ett roligt jobb', resourceType: 'Textbook page', summary: 'Textbook adjectives page combining housing, work, and descriptive language.' },
  { page: 15, day: 20, title: 'Vilka fantastiska nyheter!', resourceType: 'Textbook page', summary: 'Textbook celebration page using past-time events and definite forms.' },
  { page: 16, day: 20, title: 'Hur var det på festen?', resourceType: 'Textbook page', summary: 'Textbook past-tense story page about a party, gifts, and yesterday events.' },
  { page: 17, day: 20, title: 'En lista på starka verb', resourceType: 'Textbook page', summary: 'Textbook irregular verb reference list for present and preterite.' },
  { page: 18, day: 40, title: 'Dagbok', resourceType: 'Textbook page', summary: 'Textbook diary page with connected past narration and relationship vocabulary.' },
  { page: 19, day: 45, title: 'Det är viktigt att ha bra vänner', resourceType: 'Textbook page', summary: 'Textbook message page with an extended informal written warning to a friend.' },
  { page: 20, day: 30, title: 'Del 3 overview', resourceType: 'Textbook overview', summary: 'Textbook Part 3 overview: plurals, adjectives, numbers, time, and weather.' },
  { page: 21, day: 40, title: 'Blommor och flaskor vin', resourceType: 'Textbook page', summary: 'Textbook plural page with a diary-style dating narrative.' },
  { page: 22, day: 6, title: 'En bil, två bilar', resourceType: 'Textbook page', summary: 'Textbook plural page with home, toys, family, and museum vocabulary.' },
  { page: 23, day: 15, title: 'Du är frisk!', resourceType: 'Textbook page', summary: 'Textbook health page with a doctor conversation about headache, water, food, and stress.' },
  { page: 24, day: 5, title: 'Många djur, många problem', resourceType: 'Textbook page', summary: 'Textbook family-and-pets page using plural forms and household discussion.' },
  { page: 25, day: 10, title: 'Det är spännande att spendera pengar!', resourceType: 'Textbook page', summary: 'Textbook shopping and clothing page with adjectives, discounts, and style talk.' },
  { page: 26, day: 10, title: 'Inköpslista', resourceType: 'Textbook page', summary: 'Textbook shopping-list page with quantities, food items, and number practice.' },
  { page: 27, day: 5, title: 'Familjen', resourceType: 'Textbook page', summary: 'Textbook family page with age, relationship, and kinship vocabulary.' },
  { page: 28, day: 4, title: 'Hur gammal är du?', resourceType: 'Textbook page', summary: 'Textbook numbers page with ages and ordinal forms.' },
  { page: 29, day: 8, title: 'Jag blev kär i...', resourceType: 'Textbook page', summary: 'Textbook clock-time page with time expressions and a school crush story.' },
  { page: 30, day: 14, title: 'Vad har ni för väder?', resourceType: 'Textbook page', summary: 'Textbook weather vocabulary page.' },
  { page: 31, day: 25, title: 'Del 4 overview', resourceType: 'Textbook overview', summary: 'Textbook Part 4 overview: definite plurals, object pronouns, weekdays, comparison, and modal verbs.' },
  { page: 32, day: 10, title: 'Skvaller', resourceType: 'Textbook page', summary: 'Textbook shopping-and-family gossip page with definite plurals and object references.' },
  { page: 33, day: 22, title: 'Vill du gå på bio med mig?', resourceType: 'Textbook page', summary: 'Textbook meeting-up page with object pronouns, delay language, and social coordination.' },
  { page: 34, day: 25, title: 'Bättre än Barbie', resourceType: 'Textbook page', summary: 'Textbook comparison page with film opinions, comparatives, and superlatives.' },
  { page: 35, day: 25, title: 'En lista på speciella adjektiv', resourceType: 'Textbook page', summary: 'Textbook comparison reference list for irregular adjectives.' },
  { page: 36, day: 8, title: 'Veckodagar', resourceType: 'Textbook page', summary: 'Textbook weekdays page combining schedules, work, and past-time narration.' },
  { page: 37, day: 46, title: 'Jag kan inte sova!', resourceType: 'Textbook page', summary: 'Textbook rules-and-modal page about sleep, health advice, and permission.' },
  { page: 38, day: 49, title: 'Klagomål', resourceType: 'Textbook page', summary: 'Textbook complaint-email page about a broken laptop and customer service.' },
  { page: 39, day: 13, title: 'Vägbeskrivning', resourceType: 'Textbook page', summary: 'Textbook directions page with walking and bus instructions.' },
  { page: 40, day: 29, title: 'Del 5 overview', resourceType: 'Textbook overview', summary: 'Textbook Part 5 overview: possessives, reflexives, future, and opinion verbs.' },
  { page: 41, day: 29, title: 'Din fru och hennes vän', resourceType: 'Textbook page', summary: 'Textbook relationship page with possessives, feelings, and discussion about truth and consequences.' },
  { page: 42, day: 19, title: 'Något eget', resourceType: 'Textbook page', summary: 'Textbook reflexive-pronoun page about siblings, possessions, and tidiness.' },
  { page: 43, day: 42, title: 'Nästa år...', resourceType: 'Textbook page', summary: 'Textbook future page with plans, hopes, and multiple future-expression patterns.' },
  { page: 44, day: 29, title: 'Tror du på mig?', resourceType: 'Textbook page', summary: 'Textbook opinions page contrasting tycker, tror, and tänker through a football discussion.' },
  { page: 45, day: 50, title: 'Vad kommer att hända nu?', resourceType: 'Textbook page', summary: 'Textbook discussion prompt page about online dating, ideal partners, and advice.' },
  { page: 46, day: 41, title: 'Del 6 overview', resourceType: 'Textbook overview', summary: 'Textbook Part 6 overview: present perfect, conjunctions, and subordinators.' },
  { page: 47, day: 41, title: 'Har du varit i Sverige någon gång?', resourceType: 'Textbook page', summary: 'Textbook present-perfect page about moving to Sweden, travel, and life experience.' },
  { page: 48, day: 41, title: 'En lista på starka verb (supinum)', resourceType: 'Textbook page', summary: 'Textbook irregular verb reference list showing present, preterite, and supine.' },
  { page: 49, day: 32, title: 'Skolan', resourceType: 'Textbook page', summary: 'Textbook school page about grades, university, and advice about future study.' },
  { page: 50, day: 30, title: 'Jobbar du för mycket?', resourceType: 'Textbook page', summary: 'Textbook work-life page about leadership, workload, pension, and burnout.' },
  { page: 51, day: 55, title: 'Balansen', resourceType: 'Textbook page', summary: 'Textbook work-balance page about mental health, entrepreneurship, and toxic work environments.' },
  { page: 52, day: 11, title: 'Restaurang', resourceType: 'Textbook page', summary: 'Textbook restaurant page with dietary preferences, changing tables, and paying the bill.' },
  { page: 53, day: 26, title: 'Boende', resourceType: 'Textbook page', summary: 'Textbook housing page with rental preferences, buying a house, budget, and renovation needs.' },
  { page: 54, day: 47, title: 'Miljö', resourceType: 'Textbook page', summary: 'Textbook environment page about climate, recycling, plastic, and food choices.' },
];

const legacyBaseLessonsByDay = new Map(legacyBaseCourse.days.map((lesson) => [lesson.day, lesson]));

const legacyVocabularyGuideAdditions = parseLegacyVocabularyGuide(legacyVocabularyGuideMarkdown)
  .filter((section) => legacyVocabularySectionDayMap[section.key])
  .map((section) => ({
    day: legacyVocabularySectionDayMap[section.key],
    resourceType: 'Vocabulary guide',
    summary: `Legacy vocabulary-guide coverage for ${section.heading.toLowerCase()}.`,
    sourceLabel: 'a1_a2_swedish_vocabulary.md',
    sourceDates: ['a1_a2_swedish_vocabulary.md'],
    sections: [
      {
        heading: `Vocabulary Guide: ${section.heading}`,
        content: [
          'These items came from the older A1-A2 vocabulary guide and are kept here so the new YKI path still includes the original reference material.',
        ],
        table: section.rows,
      },
    ],
    vocabulary: createVocabularyEntries(section.rows),
  }));

const legacyLessonAdditionsByDay = groupByDay(
  legacyEnhancements.lessonAdditions.map((addition) => ({
    ...addition,
    resourceType: 'Class notes',
    sourceLabel: legacyEnhancements.sourceLabel,
  })),
);
const legacyVocabularyGuideByDay = groupByDay(legacyVocabularyGuideAdditions);
const textbookResourcesByDay = groupByDay(
  textbookPageMappings.map((mapping) => createTextbookResource(mapping)),
);

const a1Lessons = [
  lessonSpec({
    title: 'Greetings, alphabet, and polite openings',
    goal: 'Recognize Swedish sounds and manage the first 30 seconds of a conversation.',
    focus:
      'Train Å, Ä, and Ö early and connect pronunciation to greeting routines so the first contact feels automatic.',
    grammarNote:
      'When talking about how you feel, Swedish prefers “Jag mår bra” instead of “Jag är bra.”',
    vocabulary: [
      v('hej', 'hi / hello', 'Hej, hur mår du?', 'Hi, how are you?'),
      v('hejdå', 'goodbye', 'Hejdå, vi ses imorgon.', 'Goodbye, see you tomorrow.'),
      v('tack', 'thank you', 'Tack så mycket för hjälpen.', 'Thank you very much for the help.'),
      v('varsågod', 'you are welcome / here you go', 'Varsågod, här är din kaffe.', 'Here you go, here is your coffee.'),
      v('hur mår du?', 'how are you?', 'Hur mår du idag?', 'How are you today?'),
    ],
    dialogue: [
      d('A', 'Hej! Hur mår du?', 'Hi! How are you?'),
      d('B', 'Jag mår bra, tack. Och du?', 'I am fine, thanks. And you?'),
      d('A', 'Bra också. Vi ses senare.', 'Fine too. See you later.'),
      d('B', 'Hejdå!', 'Goodbye!'),
    ],
    practice: [
      'Shadow the dialogue twice and keep the same rhythm.',
      'Say “Å, Ä, Ö” with one example word each.',
      'Switch between “hej”, “god morgon”, and “god kväll” based on the time.',
      'Record a 20-second greeting exchange and replay it.',
    ],
    canDo: [
      'I can greet, thank, and say goodbye naturally.',
      'I can answer “Hur mår du?” with a short phrase.',
      'I can hear the difference between the Swedish extra vowels in common words.',
    ],
    examTask:
      'Speaking: give a 20-second self-starting greeting without reading from notes.',
  }),
  lessonSpec({
    title: 'Name, country, and language',
    goal: 'Introduce yourself and say where you are from and which languages you speak.',
    focus:
      'Use one compact self-introduction as a memorized base that can later grow into longer YKI speaking answers.',
    grammarNote:
      'Use “Jag heter ...” for your name and “Jag kommer från ...” or “Jag bor i ...” for origin and residence.',
    vocabulary: [
      v('jag heter', 'my name is', 'Jag heter Shool.', 'My name is Shool.'),
      v('jag kommer från', 'I come from', 'Jag kommer från Indien.', 'I come from India.'),
      v('jag bor i', 'I live in', 'Jag bor i Finland.', 'I live in Finland.'),
      v('jag talar', 'I speak', 'Jag talar engelska och lite svenska.', 'I speak English and a little Swedish.'),
      v('varifrån?', 'from where?', 'Varifrån kommer du?', 'Where are you from?'),
    ],
    dialogue: [
      d('A', 'Hej, jag heter Lina. Vad heter du?', 'Hi, my name is Lina. What is your name?'),
      d('B', 'Jag heter Ravi.', 'My name is Ravi.'),
      d('A', 'Varifrån kommer du?', 'Where are you from?'),
      d('B', 'Jag kommer från Indien men jag bor i Finland.', 'I come from India but I live in Finland.'),
    ],
    practice: [
      'Say your self-introduction three times at natural speed.',
      'Replace the country, city, and language with your own details.',
      'Ask and answer “Varifrån kommer du?” with a partner or recording.',
      'Write a three-line presentation without translating word by word.',
    ],
    canDo: [
      'I can introduce myself in three short sentences.',
      'I can say where I come from and where I live.',
      'I can state which languages I speak.',
    ],
    examTask: 'Writing: produce a 40-word profile text about yourself.',
  }),
  lessonSpec({
    title: 'Classroom survival Swedish',
    goal: 'Ask for repetition, clarification, and help during study situations.',
    focus:
      'Make repair phrases automatic so you can keep learning in Swedish instead of switching to English too fast.',
    grammarNote:
      '“Kan du ...?” is the most useful polite request frame at beginner level. Add “tack” to soften it.',
    vocabulary: [
      v('jag förstår inte', 'I do not understand', 'Förlåt, jag förstår inte.', 'Sorry, I do not understand.'),
      v('kan du repetera?', 'can you repeat?', 'Kan du repetera, tack?', 'Can you repeat, please?'),
      v('vad betyder det?', 'what does that mean?', 'Vad betyder det på svenska?', 'What does that mean in Swedish?'),
      v('långsammare', 'more slowly', 'Kan du tala långsammare?', 'Can you speak more slowly?'),
      v('hjälp', 'help', 'Jag behöver hjälp med uppgiften.', 'I need help with the exercise.'),
    ],
    dialogue: [
      d('Lärare', 'Förstår du texten?', 'Do you understand the text?'),
      d('Student', 'Inte helt. Kan du repetera?', 'Not completely. Can you repeat?'),
      d('Lärare', 'Ja, självklart.', 'Yes, of course.'),
      d('Student', 'Tack. Vad betyder “uppgift”?', 'Thanks. What does “assignment” mean?'),
    ],
    practice: [
      'Say each repair phrase without hesitation.',
      'Read the dialogue aloud and keep polite intonation.',
      'Create two new questions with “kan du ...?”.',
      'Use one repair phrase during your next real study session.',
    ],
    canDo: [
      'I can ask someone to repeat or slow down.',
      'I can say that I do not understand.',
      'I can ask what a word means.',
    ],
    examTask: 'Listening: after a short audio, note two phrases you would use if you missed information.',
  }),
  lessonSpec({
    title: 'Numbers, age, and contact details',
    goal: 'Use numbers in everyday personal information tasks.',
    focus:
      'Numbers support forms, bookings, phone calls, and YKI listening tasks, so accuracy matters from the start.',
    grammarNote:
      'For age, use “Jag är ... år.” For phone numbers, chunk digits in pairs to sound more natural.',
    vocabulary: [
      v('noll', 'zero', 'Numret börjar med noll.', 'The number starts with zero.'),
      v('ett telefonnummer', 'a phone number', 'Vad är ditt telefonnummer?', 'What is your phone number?'),
      v('jag är ... år', 'I am ... years old', 'Jag är trettiofem år.', 'I am thirty-five years old.'),
      v('adress', 'address', 'Min adress är enkel att hitta.', 'My address is easy to find.'),
      v('postnummer', 'postal code', 'Vad är ditt postnummer?', 'What is your postal code?'),
    ],
    dialogue: [
      d('A', 'Hur gammal är du?', 'How old are you?'),
      d('B', 'Jag är trettiofyra år.', 'I am thirty-four years old.'),
      d('A', 'Och vad är ditt telefonnummer?', 'And what is your phone number?'),
      d('B', 'Det är noll fyrtio, tjugoett, sextioåtta, nittiotre.', 'It is zero forty, twenty-one, sixty-eight, ninety-three.'),
    ],
    practice: [
      'Count from 0 to 30 out loud.',
      'Say your age, phone number, and address clearly.',
      'Write three phone numbers you might hear and read them aloud.',
      'Practice hearing the difference between teen and tens numbers.',
    ],
    canDo: [
      'I can say my age and phone number.',
      'I can understand basic number information in slow speech.',
      'I can fill in contact details on a simple form.',
    ],
    examTask: 'Reading and writing: copy a short contact form into Swedish correctly.',
  }),
  lessonSpec({
    title: 'Family, pronouns, and close relations',
    goal: 'Talk about your family and use the most common personal pronouns.',
    focus:
      'Family language is high-frequency and useful for small talk, forms, and simple description tasks.',
    grammarNote:
      'Use the subject pronouns “jag, du, han, hon, vi, ni, de”. In speech, “dom” is common for “de”.',
    vocabulary: [
      v('familj', 'family', 'Min familj bor i två länder.', 'My family lives in two countries.'),
      v('barn', 'child / children', 'De har två barn.', 'They have two children.'),
      v('föräldrar', 'parents', 'Mina föräldrar bor i Indien.', 'My parents live in India.'),
      v('syskon', 'siblings', 'Har du syskon?', 'Do you have siblings?'),
      v('gift', 'married', 'Han är gift.', 'He is married.'),
    ],
    dialogue: [
      d('A', 'Har du syskon?', 'Do you have siblings?'),
      d('B', 'Ja, jag har en syster och en bror.', 'Yes, I have one sister and one brother.'),
      d('A', 'Var bor de?', 'Where do they live?'),
      d('B', 'De bor i Stockholm.', 'They live in Stockholm.'),
    ],
    practice: [
      'Describe your family in four sentences.',
      'Replace names with pronouns in the dialogue.',
      'Ask and answer two family questions aloud.',
      'Make a mini family tree and label it in Swedish.',
    ],
    canDo: [
      'I can say who is in my family.',
      'I can use common subject pronouns correctly.',
      'I can ask simple questions about another person’s family.',
    ],
    examTask: 'Speaking: describe a family photo for 30 seconds.',
  }),
  lessonSpec({
    title: 'Home, rooms, and basic furniture',
    goal: 'Describe where you live and name the main rooms and objects at home.',
    focus:
      'Housing language is essential in Finland and returns later in forms, neighbour talk, and rental conversations.',
    grammarNote:
      'Swedish nouns need an article. Start noticing “en” and “ett” together with the noun, not as separate facts.',
    vocabulary: [
      v('en lägenhet', 'an apartment', 'Jag bor i en lägenhet.', 'I live in an apartment.'),
      v('ett kök', 'a kitchen', 'Köket är litet men ljust.', 'The kitchen is small but bright.'),
      v('ett sovrum', 'a bedroom', 'Vi har ett sovrum.', 'We have one bedroom.'),
      v('ett bord', 'a table', 'Bordet står i vardagsrummet.', 'The table is in the living room.'),
      v('en stol', 'a chair', 'Det finns fyra stolar här.', 'There are four chairs here.'),
    ],
    dialogue: [
      d('A', 'Var bor du?', 'Where do you live?'),
      d('B', 'Jag bor i en liten lägenhet nära centrum.', 'I live in a small apartment near the center.'),
      d('A', 'Har du ett eget kök?', 'Do you have your own kitchen?'),
      d('B', 'Ja, och ett lugnt sovrum.', 'Yes, and a quiet bedroom.'),
    ],
    practice: [
      'Walk through your home and name each room in Swedish.',
      'Make five “det finns ...” sentences about your home.',
      'Practice article + noun pairs together.',
      'Write a 50-word description of your apartment.',
    ],
    canDo: [
      'I can say where I live.',
      'I can name the main rooms in a home.',
      'I can describe basic furniture and location.',
    ],
    examTask: 'Writing: describe your housing situation in a short message.',
  }),
  lessonSpec({
    title: 'Daily routines and present tense',
    goal: 'Talk about a normal day using high-frequency present-tense verbs.',
    focus:
      'A stable present-tense routine gives you a base for later time expressions and comparison tasks.',
    grammarNote:
      'In present tense, many Swedish verbs end in “-r”: “jag jobbar”, “jag studerar”, “jag äter”.',
    vocabulary: [
      v('jag vaknar', 'I wake up', 'Jag vaknar klockan sex.', 'I wake up at six o’clock.'),
      v('jag arbetar', 'I work', 'Jag arbetar hemifrån idag.', 'I work from home today.'),
      v('jag studerar', 'I study', 'Jag studerar svenska varje kväll.', 'I study Swedish every evening.'),
      v('jag äter', 'I eat', 'Jag äter lunch klockan tolv.', 'I eat lunch at twelve.'),
      v('jag sover', 'I sleep', 'Jag sover tidigt på söndagar.', 'I sleep early on Sundays.'),
    ],
    dialogue: [
      d('A', 'När vaknar du på vardagar?', 'When do you wake up on weekdays?'),
      d('B', 'Jag vaknar klockan sex och jag arbetar från åtta.', 'I wake up at six and I work from eight.'),
      d('A', 'Studerar du svenska på kvällen?', 'Do you study Swedish in the evening?'),
      d('B', 'Ja, jag studerar efter middagen.', 'Yes, I study after dinner.'),
    ],
    practice: [
      'Say your whole weekday routine in time order.',
      'Underline the present-tense verbs in the dialogue.',
      'Change the dialogue to weekend routines.',
      'Write six routine sentences from wake-up to sleep.',
    ],
    canDo: [
      'I can describe my usual day.',
      'I can use common present-tense verbs in short sentences.',
      'I can ask someone about their routine.',
    ],
    examTask: 'Speaking: give a 45-second description of a normal weekday.',
  }),
  lessonSpec({
    title: 'Time, weekdays, and appointments',
    goal: 'Tell the time and talk about schedules and simple appointments.',
    focus:
      'YKI tasks often involve practical timing information, so reading and saying time needs daily rehearsal.',
    grammarNote:
      'Use “klockan” with clock times. For appointments, combine time with day: “på tisdag klockan tre”.',
    vocabulary: [
      v('klockan', 'o’clock', 'Mötet börjar klockan tre.', 'The meeting starts at three o’clock.'),
      v('vardag', 'weekday', 'På vardagar arbetar jag.', 'On weekdays I work.'),
      v('måndag', 'Monday', 'Vi ses på måndag.', 'See you on Monday.'),
      v('en tid', 'an appointment / a time', 'Jag har en tid hos läkaren.', 'I have an appointment with the doctor.'),
      v('sen', 'late', 'Bussen är sen idag.', 'The bus is late today.'),
    ],
    dialogue: [
      d('A', 'När börjar kursen?', 'When does the course start?'),
      d('B', 'På tisdag klockan nio.', 'On Tuesday at nine o’clock.'),
      d('A', 'Har du en tid hos läkaren också?', 'Do you also have an appointment with the doctor?'),
      d('B', 'Ja, på torsdag eftermiddag.', 'Yes, on Thursday afternoon.'),
    ],
    practice: [
      'Read 10 clock times aloud.',
      'Say your weekly study schedule in Swedish.',
      'Create three appointment sentences with day + time.',
      'Listen to time information and write it down from memory.',
    ],
    canDo: [
      'I can tell the time.',
      'I can say what happens on different weekdays.',
      'I can mention a simple appointment clearly.',
    ],
    examTask: 'Listening: hear three appointment times and note them accurately.',
  }),
  lessonSpec({
    title: 'Food, drinks, and breakfast talk',
    goal: 'Name everyday food and say what you eat and drink.',
    focus:
      'Food vocabulary gives fast speaking wins because it connects to routines, shopping, and restaurant tasks.',
    grammarNote:
      'After “jag vill ha” use the noun directly: “Jag vill ha kaffe”, “Jag vill ha en smörgås.”',
    vocabulary: [
      v('kaffe', 'coffee', 'Jag dricker kaffe på morgonen.', 'I drink coffee in the morning.'),
      v('te', 'tea', 'Hon vill ha te utan socker.', 'She wants tea without sugar.'),
      v('bröd', 'bread', 'Vi köper färskt bröd.', 'We buy fresh bread.'),
      v('mjölk', 'milk', 'Finns det mjölk i kylskåpet?', 'Is there milk in the fridge?'),
      v('frukost', 'breakfast', 'Frukost är min viktigaste måltid.', 'Breakfast is my most important meal.'),
    ],
    dialogue: [
      d('A', 'Vad äter du till frukost?', 'What do you eat for breakfast?'),
      d('B', 'Jag äter bröd och dricker kaffe.', 'I eat bread and drink coffee.'),
      d('A', 'Tar du mjölk i kaffet?', 'Do you take milk in the coffee?'),
      d('B', 'Ja, lite mjölk.', 'Yes, a little milk.'),
    ],
    practice: [
      'Describe your real breakfast using three full sentences.',
      'Make a shopping mini-list with five food words.',
      'Practice “jag vill ha ...” with different foods.',
      'Read the dialogue and replace breakfast with dinner.',
    ],
    canDo: [
      'I can name common food and drink items.',
      'I can say what I eat and drink.',
      'I can understand simple breakfast talk.',
    ],
    examTask: 'Writing: make a simple shopping list in Swedish.',
  }),
  lessonSpec({
    title: 'Grocery shopping basics',
    goal: 'Ask for items, quantities, and prices in a supermarket.',
    focus:
      'Shopping language is practical and gives good listening training because numbers, products, and questions combine together.',
    grammarNote:
      'For questions in shops, keep the verb in second position: “Var finns ...?”, “Hur mycket kostar ...?”',
    vocabulary: [
      v('hur mycket kostar det?', 'how much does it cost?', 'Hur mycket kostar det här?', 'How much does this cost?'),
      v('billig', 'cheap', 'Den här är billigare.', 'This one is cheaper.'),
      v('dyr', 'expensive', 'Kött är dyrt idag.', 'Meat is expensive today.'),
      v('ett kilo', 'a kilo', 'Jag vill ha ett kilo potatis.', 'I want one kilo of potatoes.'),
      v('kvitto', 'receipt', 'Kan jag få kvittot?', 'Can I get the receipt?'),
    ],
    dialogue: [
      d('Kund', 'Ursäkta, var finns riset?', 'Excuse me, where is the rice?'),
      d('Personal', 'Det finns på hylla fyra.', 'It is on shelf four.'),
      d('Kund', 'Och hur mycket kostar äpplena?', 'And how much do the apples cost?'),
      d('Personal', 'Tre euro per kilo.', 'Three euros per kilo.'),
    ],
    practice: [
      'Ask for three products and three prices aloud.',
      'Say one product with a quantity: “ett kilo”, “två liter”, “en burk”.',
      'Role-play cashier and customer.',
      'Write four supermarket questions you might really use.',
    ],
    canDo: [
      'I can ask where products are.',
      'I can ask for prices and quantities.',
      'I can manage a basic supermarket exchange.',
    ],
    examTask: 'Listening: identify item, quantity, and price from a short dialogue.',
  }),
  lessonSpec({
    title: 'Cafe and restaurant phrases',
    goal: 'Order politely and talk about simple preferences in a cafe or restaurant.',
    focus:
      'Ordering language is repetitive and useful for building confidence in short spontaneous speech.',
    grammarNote:
      'Use modal verbs for polite requests: “Jag skulle vilja ha ...” sounds softer than only “Jag vill ha ...”.',
    vocabulary: [
      v('meny', 'menu', 'Kan jag få menyn?', 'Can I get the menu?'),
      v('jag skulle vilja ha', 'I would like to have', 'Jag skulle vilja ha soppa.', 'I would like soup.'),
      v('utan', 'without', 'Kaffe utan mjölk, tack.', 'Coffee without milk, please.'),
      v('med', 'with', 'En sallad med kyckling.', 'A salad with chicken.'),
      v('notan', 'the bill', 'Kan vi få notan?', 'Can we get the bill?'),
    ],
    dialogue: [
      d('Servitör', 'Hej, vad vill du beställa?', 'Hi, what would you like to order?'),
      d('Gäst', 'Jag skulle vilja ha en soppa och kaffe utan mjölk.', 'I would like a soup and coffee without milk.'),
      d('Servitör', 'Självklart. Något mer?', 'Of course. Anything else?'),
      d('Gäst', 'Nej tack. Kan jag få notan senare?', 'No thanks. Can I get the bill later?'),
    ],
    practice: [
      'Order a full meal aloud.',
      'Make three “med / utan” combinations.',
      'Act out waiter-customer roles.',
      'Write a short cafe dialogue from memory.',
    ],
    canDo: [
      'I can order food and drinks politely.',
      'I can ask for something with or without an ingredient.',
      'I can ask for the bill.',
    ],
    examTask: 'Speaking: role-play a two-turn order without reading.',
  }),
  lessonSpec({
    title: 'Transport, tickets, and commuting',
    goal: 'Use basic Swedish for buses, trains, and everyday commuting.',
    focus:
      'Transport vocabulary appears in real life constantly and supports direction, delay, and schedule tasks.',
    grammarNote:
      'Use “med” for transport mode: “Jag åker med buss”, “Jag kommer med tåg.”',
    vocabulary: [
      v('buss', 'bus', 'Bussen går om fem minuter.', 'The bus leaves in five minutes.'),
      v('tåg', 'train', 'Tåget är försenat idag.', 'The train is delayed today.'),
      v('biljett', 'ticket', 'Jag behöver en biljett till Åbo.', 'I need a ticket to Turku.'),
      v('hållplats', 'stop', 'Var är nästa hållplats?', 'Where is the next stop?'),
      v('försenad', 'delayed', 'Tåget är tio minuter försenat.', 'The train is ten minutes delayed.'),
    ],
    dialogue: [
      d('A', 'När går bussen till centrum?', 'When does the bus to the center leave?'),
      d('B', 'Om sju minuter från hållplats tre.', 'In seven minutes from stop three.'),
      d('A', 'Behöver jag köpa biljett här?', 'Do I need to buy a ticket here?'),
      d('B', 'Ja, eller i appen.', 'Yes, or in the app.'),
    ],
    practice: [
      'Describe your usual commute in Swedish.',
      'Ask for a ticket and a departure time.',
      'Listen to timetable information and repeat it.',
      'Write a two-sentence delay message to a friend.',
    ],
    canDo: [
      'I can ask about departures and tickets.',
      'I can understand simple delay information.',
      'I can describe how I travel.',
    ],
    examTask: 'Reading: identify departure, destination, and platform from a timetable.',
  }),
  lessonSpec({
    title: 'Places in town and simple directions',
    goal: 'Find places and ask where things are in town.',
    focus:
      'Direction tasks train both vocabulary and the Swedish sentence pattern with location words.',
    grammarNote:
      'Use “var ligger ...?” for location and “gå / sväng / fortsätt” for basic route instructions.',
    vocabulary: [
      v('centrum', 'center / downtown', 'Jag arbetar i centrum.', 'I work in the center.'),
      v('sjukhus', 'hospital', 'Sjukhuset ligger nära stationen.', 'The hospital is near the station.'),
      v('bank', 'bank', 'Finns det en bank här?', 'Is there a bank here?'),
      v('sväng vänster', 'turn left', 'Sväng vänster vid ljuset.', 'Turn left at the traffic light.'),
      v('rakt fram', 'straight ahead', 'Gå rakt fram två kvarter.', 'Go straight ahead two blocks.'),
    ],
    dialogue: [
      d('A', 'Ursäkta, var ligger banken?', 'Excuse me, where is the bank?'),
      d('B', 'Gå rakt fram och sväng vänster.', 'Go straight ahead and turn left.'),
      d('A', 'Är det långt?', 'Is it far?'),
      d('B', 'Nej, bara fem minuter till fots.', 'No, only five minutes on foot.'),
    ],
    practice: [
      'Give directions from your home to one real place.',
      'Ask “var ligger ...?” with five town words.',
      'Draw a small map and describe the route aloud.',
      'Practice left/right/straight with gestures.',
    ],
    canDo: [
      'I can ask where a place is.',
      'I can understand short directions.',
      'I can describe a simple route.',
    ],
    examTask: 'Listening: follow a short route and mark the destination.',
  }),
  lessonSpec({
    title: 'Weather, seasons, and clothing',
    goal: 'Talk about weather and choose suitable clothes.',
    focus:
      'Weather is small-talk material but also practical in Finland, so link it to clothing and daily choices.',
    grammarNote:
      'Weather often uses “det”: “Det regnar”, “Det är kallt”, “Det blåser mycket.”',
    vocabulary: [
      v('det regnar', 'it is raining', 'Det regnar hela morgonen.', 'It is raining all morning.'),
      v('kallt', 'cold', 'Det är kallt ute.', 'It is cold outside.'),
      v('varmt', 'warm', 'Det är varmt idag.', 'It is warm today.'),
      v('jacka', 'jacket', 'Jag behöver en varm jacka.', 'I need a warm jacket.'),
      v('stövlar', 'boots', 'Barnen har regnstövlar.', 'The children have rain boots.'),
    ],
    dialogue: [
      d('A', 'Hur är vädret idag?', 'How is the weather today?'),
      d('B', 'Det regnar och det är ganska kallt.', 'It is raining and it is quite cold.'),
      d('A', 'Då tar jag min varma jacka.', 'Then I will take my warm jacket.'),
      d('B', 'Bra idé.', 'Good idea.'),
    ],
    practice: [
      'Describe today’s weather in two versions: short and detailed.',
      'Choose clothes for rain, snow, and sun.',
      'Practice three “det är ...” sentences.',
      'Write a weather message to a friend.',
    ],
    canDo: [
      'I can describe simple weather conditions.',
      'I can say what clothes I need.',
      'I can understand common weather phrases.',
    ],
    examTask: 'Speaking: compare today’s weather with yesterday’s in 30 seconds.',
  }),
  lessonSpec({
    title: 'Body, pain, and simple health talk',
    goal: 'Say what hurts and understand basic health questions.',
    focus:
      'Health language needs precise nouns and short answer patterns because real situations can be stressful.',
    grammarNote:
      'Use “Jag har ont i ...” for pain and “Jag är sjuk” for being ill.',
    vocabulary: [
      v('huvud', 'head', 'Jag har ont i huvudet.', 'I have a headache.'),
      v('mage', 'stomach', 'Barnet har ont i magen.', 'The child has a stomach ache.'),
      v('feber', 'fever', 'Jag tror att jag har feber.', 'I think I have a fever.'),
      v('sjuk', 'ill / sick', 'Jag är sjuk idag.', 'I am sick today.'),
      v('läkare', 'doctor', 'Jag behöver prata med en läkare.', 'I need to speak with a doctor.'),
    ],
    dialogue: [
      d('Sjukskötare', 'Vad är problemet?', 'What is the problem?'),
      d('Patient', 'Jag har ont i huvudet och jag känner mig sjuk.', 'I have a headache and I feel sick.'),
      d('Sjukskötare', 'Har du feber?', 'Do you have a fever?'),
      d('Patient', 'Ja, lite feber.', 'Yes, a little fever.'),
    ],
    practice: [
      'Point to body parts and name them.',
      'Say three pain sentences with “Jag har ont i ...”.',
      'Role-play patient and nurse.',
      'Write a short message to work saying you are ill.',
    ],
    canDo: [
      'I can describe a simple health problem.',
      'I can understand basic questions about pain and fever.',
      'I can ask for a doctor or appointment.',
    ],
    examTask: 'Writing: send a short message cancelling an appointment because you are sick.',
  }),
  lessonSpec({
    title: 'Work, school, and daily responsibilities',
    goal: 'Talk about your job, studies, and common daily obligations.',
    focus:
      'This topic supports self-description and transitions well into A2 service and workplace situations.',
    grammarNote:
      'Use present tense for ongoing roles: “Jag arbetar som ...”, “Jag studerar ...”.',
    vocabulary: [
      v('arbete', 'work', 'Jag har mycket arbete idag.', 'I have a lot of work today.'),
      v('studier', 'studies', 'Mina studier tar tid.', 'My studies take time.'),
      v('möte', 'meeting', 'Jag har ett möte klockan två.', 'I have a meeting at two o’clock.'),
      v('uppgift', 'task / assignment', 'Den här uppgiften är svår.', 'This task is difficult.'),
      v('rast', 'break', 'Vi har rast efter lektionen.', 'We have a break after the lesson.'),
    ],
    dialogue: [
      d('A', 'Vad gör du på dagarna?', 'What do you do during the day?'),
      d('B', 'Jag arbetar deltid och jag studerar svenska på kvällen.', 'I work part time and study Swedish in the evening.'),
      d('A', 'Har du många möten?', 'Do you have many meetings?'),
      d('B', 'Inte så många, men många uppgifter.', 'Not so many, but many tasks.'),
    ],
    practice: [
      'Describe your week with work or study words.',
      'Create four sentences with “jag har ...”.',
      'Explain your responsibilities in simple Swedish.',
      'Write a short paragraph about your current routine.',
    ],
    canDo: [
      'I can say whether I work or study.',
      'I can talk about meetings, tasks, and breaks.',
      'I can describe a normal responsibility.',
    ],
    examTask: 'Speaking: explain your current work or study situation in 45 seconds.',
  }),
  lessonSpec({
    title: 'Hobbies, likes, and free time',
    goal: 'Talk about what you like doing and how you spend your free time.',
    focus:
      'Preference language is important because it appears in introductions, conversations, and opinion tasks.',
    grammarNote:
      'Use “jag gillar att ...” with an infinitive verb: “Jag gillar att läsa”, “Jag gillar att springa.”',
    vocabulary: [
      v('fritid', 'free time', 'På fritiden läser jag mycket.', 'In my free time I read a lot.'),
      v('jag gillar att', 'I like to', 'Jag gillar att simma.', 'I like to swim.'),
      v('träna', 'to exercise', 'Jag tränar tre gånger i veckan.', 'I exercise three times a week.'),
      v('läsa', 'to read', 'Jag läser en svensk bok.', 'I am reading a Swedish book.'),
      v('musik', 'music', 'Musik hjälper mig att slappna av.', 'Music helps me relax.'),
    ],
    dialogue: [
      d('A', 'Vad gör du på fritiden?', 'What do you do in your free time?'),
      d('B', 'Jag gillar att läsa och träna.', 'I like to read and exercise.'),
      d('A', 'Lyssnar du på musik också?', 'Do you listen to music too?'),
      d('B', 'Ja, varje dag.', 'Yes, every day.'),
    ],
    practice: [
      'Talk for 30 seconds about your hobbies.',
      'Make three “jag gillar att ...” sentences.',
      'Ask another person about free time activities.',
      'Write a short text about one hobby and why you like it.',
    ],
    canDo: [
      'I can describe my free time activities.',
      'I can say what I like to do.',
      'I can ask someone about hobbies.',
    ],
    examTask: 'Writing: describe one hobby and why it matters to you.',
  }),
  lessonSpec({
    title: 'Calendar, months, and dates',
    goal: 'Use dates, months, and common calendar language.',
    focus:
      'Dates are essential for forms, bookings, messages, and official communication in Finland.',
    grammarNote:
      'For dates, learn the fixed patterns: “den tredje juni”, “i augusti”, “på fredag”.',
    vocabulary: [
      v('januari', 'January', 'Kursen börjar i januari.', 'The course starts in January.'),
      v('augusti', 'August', 'YKI-provet är i augusti.', 'The YKI test is in August.'),
      v('datum', 'date', 'Vilket datum är mötet?', 'What date is the meeting?'),
      v('födelsedag', 'birthday', 'Min födelsedag är i november.', 'My birthday is in November.'),
      v('kalender', 'calendar', 'Jag skriver allt i min kalender.', 'I write everything in my calendar.'),
    ],
    dialogue: [
      d('A', 'Vilket datum är kursstarten?', 'What date is the course start?'),
      d('B', 'Den femte augusti.', 'On the fifth of August.'),
      d('A', 'Bra, jag skriver det i min kalender.', 'Good, I will write it in my calendar.'),
      d('B', 'Gör det direkt.', 'Do it right away.'),
    ],
    practice: [
      'Say today’s date and your birthday in Swedish.',
      'Read all twelve months aloud.',
      'Write three dates in Swedish words.',
      'Make two appointment sentences with a full date.',
    ],
    canDo: [
      'I can say months and dates.',
      'I can understand simple calendar information.',
      'I can mention important dates in messages.',
    ],
    examTask: 'Reading: find the date and time in a short event notice.',
  }),
  lessonSpec({
    title: 'Household tasks and chores',
    goal: 'Talk about cleaning, cooking, and simple home responsibilities.',
    focus:
      'Chore vocabulary helps with everyday conversation and gives more material for present-tense practice.',
    grammarNote:
      'Use frequency words to make routines clearer: “ofta”, “ibland”, “alltid”, “sällan”.',
    vocabulary: [
      v('städa', 'to clean', 'Jag städar på lördagar.', 'I clean on Saturdays.'),
      v('tvätta', 'to wash', 'Jag tvättar kläder ikväll.', 'I wash clothes tonight.'),
      v('laga mat', 'to cook', 'Min partner lagar mat idag.', 'My partner cooks today.'),
      v('disk', 'dishes', 'Disken är klar nu.', 'The dishes are done now.'),
      v('sopor', 'garbage', 'Jag tar ut soporna.', 'I take out the garbage.'),
    ],
    dialogue: [
      d('A', 'Vem lagar mat hemma hos er?', 'Who cooks at your home?'),
      d('B', 'Vi lagar mat tillsammans.', 'We cook together.'),
      d('A', 'Och vem tar ut soporna?', 'And who takes out the garbage?'),
      d('B', 'Det gör jag oftast.', 'I usually do that.'),
    ],
    practice: [
      'Describe your household tasks over one week.',
      'Use frequency words with each chore.',
      'Create a shared-home dialogue.',
      'Write a simple to-do list for home tasks.',
    ],
    canDo: [
      'I can talk about home chores.',
      'I can say who does different tasks.',
      'I can use simple frequency words.',
    ],
    examTask: 'Writing: send a short home-task message to a family member or flatmate.',
  }),
  lessonSpec({
    title: 'Simple past: yesterday and last weekend',
    goal: 'Start talking about completed actions in the past.',
    focus:
      'Past-time control begins early so that narratives do not become a last-minute B1 problem.',
    grammarNote:
      'A1 Swedish can start with a few common past forms as chunks: “var”, “gjorde”, “åt”, “gick”, “såg”.',
    vocabulary: [
      v('igår', 'yesterday', 'Igår arbetade jag hemma.', 'Yesterday I worked at home.'),
      v('förra helgen', 'last weekend', 'Förra helgen vilade jag.', 'Last weekend I rested.'),
      v('jag gick', 'I went', 'Jag gick till butiken.', 'I went to the store.'),
      v('jag åt', 'I ate', 'Jag åt middag sent.', 'I ate dinner late.'),
      v('jag såg', 'I saw', 'Jag såg en bra film.', 'I saw a good movie.'),
    ],
    dialogue: [
      d('A', 'Vad gjorde du igår?', 'What did you do yesterday?'),
      d('B', 'Jag gick till jobbet och jag åt lunch med en vän.', 'I went to work and ate lunch with a friend.'),
      d('A', 'Gjorde du något på kvällen?', 'Did you do anything in the evening?'),
      d('B', 'Ja, jag såg en film hemma.', 'Yes, I watched a movie at home.'),
    ],
    practice: [
      'Tell three things you did yesterday.',
      'Memorize five common past forms as units.',
      'Write a four-line last weekend diary.',
      'Contrast one sentence in present and past.',
    ],
    canDo: [
      'I can mention simple past actions.',
      'I can answer “Vad gjorde du igår?”',
      'I can understand a short past-time conversation.',
    ],
    examTask: 'Speaking: give a 30-second answer about yesterday.',
  }),
  lessonSpec({
    title: 'Plans and near future',
    goal: 'Talk about tomorrow, next week, and your short-term plans.',
    focus:
      'Future meaning at A1 can stay simple, but it must be usable for appointments, invitations, and planning.',
    grammarNote:
      'Swedish often uses present tense for the future with a time word: “Imorgon jobbar jag hemma.”',
    vocabulary: [
      v('imorgon', 'tomorrow', 'Imorgon studerar jag hemma.', 'Tomorrow I study at home.'),
      v('nästa vecka', 'next week', 'Nästa vecka börjar kursen.', 'Next week the course begins.'),
      v('plan', 'plan', 'Min plan är att träna mer.', 'My plan is to exercise more.'),
      v('ska', 'will / going to', 'Jag ska ringa läkaren.', 'I am going to call the doctor.'),
      v('senare', 'later', 'Vi pratar senare.', 'We will talk later.'),
    ],
    dialogue: [
      d('A', 'Vad ska du göra imorgon?', 'What are you going to do tomorrow?'),
      d('B', 'Jag ska arbeta på morgonen och studera senare.', 'I will work in the morning and study later.'),
      d('A', 'Har du några planer för helgen?', 'Do you have any plans for the weekend?'),
      d('B', 'Ja, jag ska träffa vänner.', 'Yes, I am going to meet friends.'),
    ],
    practice: [
      'Describe tomorrow from morning to evening.',
      'Make three future sentences with a time word.',
      'Say one weekend plan and one study plan.',
      'Write a short plan for next week.',
    ],
    canDo: [
      'I can talk about simple future plans.',
      'I can mention tomorrow and next week clearly.',
      'I can understand common planning questions.',
    ],
    examTask: 'Writing: send a short message about your plans for tomorrow.',
  }),
  lessonSpec({
    title: 'Messages, invitations, and social replies',
    goal: 'Write and answer very short social messages in Swedish.',
    focus:
      'Text-message Swedish is practical and gives low-stress writing output with immediate usefulness.',
    grammarNote:
      'Keep messages short and direct. Swedish often drops extra words when the context is obvious.',
    vocabulary: [
      v('vill du ...?', 'do you want to ...?', 'Vill du fika imorgon?', 'Do you want to have coffee tomorrow?'),
      v('tyvärr', 'unfortunately', 'Tyvärr kan jag inte komma.', 'Unfortunately I cannot come.'),
      v('gärna', 'gladly', 'Ja, gärna!', 'Yes, gladly!'),
      v('kanske', 'maybe', 'Kanske på lördag?', 'Maybe on Saturday?'),
      v('vi hörs', 'we will talk / be in touch', 'Vi hörs senare.', 'We will be in touch later.'),
    ],
    dialogue: [
      d('Meddelande 1', 'Hej! Vill du fika imorgon?', 'Hi! Do you want to have coffee tomorrow?'),
      d('Meddelande 2', 'Ja, gärna. Vilken tid?', 'Yes, gladly. What time?'),
      d('Meddelande 1', 'Klockan fem passar bra.', 'Five o’clock works well.'),
      d('Meddelande 2', 'Perfekt, vi hörs!', 'Perfect, talk later!'),
    ],
    practice: [
      'Write one invitation, one acceptance, and one refusal.',
      'Practice short message rhythm out loud.',
      'Change the invitation from coffee to a walk or study session.',
      'Answer each model message without English support.',
    ],
    canDo: [
      'I can invite someone in a short message.',
      'I can accept or refuse politely.',
      'I can arrange a simple time to meet.',
    ],
    examTask: 'Writing: answer a short invitation with time and place.',
  }),
  lessonSpec({
    title: 'A1 consolidation and mini mock',
    goal: 'Review A1 material and combine it into short YKI-style micro tasks.',
    focus:
      'Consolidation matters more than adding new words. This lesson tests whether you can retrieve core phrases fast enough.',
    grammarNote:
      'At A1, speed with basic patterns is more valuable than knowing many isolated rules.',
    vocabulary: [
      v('repetition', 'repetition', 'Repetition hjälper min svenska.', 'Repetition helps my Swedish.'),
      v('övning', 'exercise', 'Dagens övning är kort men viktig.', 'Today’s exercise is short but important.'),
      v('självkontroll', 'self-check', 'Jag gör en snabb självkontroll.', 'I do a quick self-check.'),
      v('förbättra', 'improve', 'Jag vill förbättra uttalet.', 'I want to improve the pronunciation.'),
      v('mål', 'goal', 'Mitt mål är tydligt.', 'My goal is clear.'),
    ],
    dialogue: [
      d('A', 'Hur känns A1 nu?', 'How does A1 feel now?'),
      d('B', 'Bättre. Jag kan prata lite mer utan att tänka så länge.', 'Better. I can speak a bit more without thinking so long.'),
      d('A', 'Vad behöver du träna mer?', 'What do you need to practice more?'),
      d('B', 'Tider, uttal och längre svar.', 'Times, pronunciation, and longer answers.'),
    ],
    practice: [
      'Give a one-minute self-introduction including work, home, and hobbies.',
      'Write a 60-word message about your normal week.',
      'Review all numbers, weekdays, months, and time phrases.',
      'Do one speaking run without looking at notes.',
    ],
    canDo: [
      'I can combine core A1 topics into connected speech.',
      'I can notice my weak areas before moving to A2.',
      'I can complete short reading, listening, speaking, and writing drills.',
    ],
    examTask: 'Mini mock: read a notice, answer a message, and speak for one minute on a daily-life topic.',
    durationMinutes: 95,
  }),
];

const a2Lessons = [
  lessonSpec({
    title: 'Describing people, appearance, and personality',
    goal: 'Use richer adjectives to describe people clearly and politely.',
    focus:
      'A2 starts by expanding description so that your speaking stops sounding like disconnected labels.',
    grammarNote:
      'Swedish adjectives often change with “ett” nouns and plurals. Begin noticing “snäll”, “snällt”, “snälla”.',
    vocabulary: [
      v('vänlig', 'friendly', 'Hon är väldigt vänlig.', 'She is very friendly.'),
      v('lugn', 'calm', 'Han verkar lugn.', 'He seems calm.'),
      v('stressad', 'stressed', 'Jag känner mig stressad idag.', 'I feel stressed today.'),
      v('blyg', 'shy', 'Barnet är lite blygt först.', 'The child is a little shy at first.'),
      v('utseende', 'appearance', 'Vi pratar om personlighet, inte bara utseende.', 'We are talking about personality, not only appearance.'),
    ],
    dialogue: [
      d('A', 'Hur är din nya kollega?', 'What is your new colleague like?'),
      d('B', 'Hon är vänlig, lugn och väldigt tydlig.', 'She is friendly, calm, and very clear.'),
      d('A', 'Är hon också social?', 'Is she also social?'),
      d('B', 'Ja, men inte högljudd.', 'Yes, but not loud.'),
    ],
    practice: [
      'Describe yourself with five adjectives.',
      'Describe one friend and one colleague in balanced language.',
      'Practice adjective agreement with en/ett/plural nouns.',
      'Write a short paragraph about an ideal classmate.',
    ],
    canDo: [
      'I can describe people beyond basic appearance.',
      'I can use several common adjectives in context.',
      'I can give a balanced spoken description.',
    ],
    examTask: 'Speaking: describe a person for 45 seconds and explain why you use those adjectives.',
  }),
  lessonSpec({
    title: 'Comparison, preference, and choosing between options',
    goal: 'Compare alternatives and explain simple preferences.',
    focus:
      'Comparison supports shopping, housing, work, and opinion tasks, so it is worth making automatic.',
    grammarNote:
      'Use comparative forms like “billigare”, “bättre”, “större”, and pair them with “än”.',
    vocabulary: [
      v('bättre', 'better', 'Den här lösningen är bättre.', 'This solution is better.'),
      v('sämre', 'worse', 'Vädret är sämre idag.', 'The weather is worse today.'),
      v('billigare', 'cheaper', 'Tåget är billigare än bilen.', 'The train is cheaper than the car.'),
      v('hellre', 'rather / prefer', 'Jag går hellre än kör.', 'I would rather walk than drive.'),
      v('än', 'than', 'Hon studerar mer än jag.', 'She studies more than I do.'),
    ],
    dialogue: [
      d('A', 'Vilken lägenhet gillar du mer?', 'Which apartment do you like more?'),
      d('B', 'Den andra. Den är större och billigare.', 'The second one. It is bigger and cheaper.'),
      d('A', 'Men den första ligger närmare centrum.', 'But the first one is closer to the center.'),
      d('B', 'Sant, men jag vill hellre ha mer plats.', 'True, but I would rather have more space.'),
    ],
    practice: [
      'Compare two cities, two foods, and two study methods.',
      'Make five comparative sentences with “än”.',
      'Explain one preference with a reason.',
      'Write a short comparison paragraph.',
    ],
    canDo: [
      'I can compare two options clearly.',
      'I can say what I prefer and why.',
      'I can understand everyday comparison language.',
    ],
    examTask: 'Writing: choose between two options and justify your choice in 60 words.',
  }),
  lessonSpec({
    title: 'Housing ads and renting language',
    goal: 'Understand the main vocabulary in rental ads and simple housing talk.',
    focus:
      'This topic is central to real life in Finland and very useful for reading tasks with practical information.',
    grammarNote:
      'Swedish often makes compact noun phrases in ads: “tvårumslägenhet”, “hyra per månad”, “möblerad bostad”.',
    vocabulary: [
      v('hyra', 'rent', 'Hyran är 850 euro per månad.', 'The rent is 850 euros per month.'),
      v('möblerad', 'furnished', 'Lägenheten är möblerad.', 'The apartment is furnished.'),
      v('balkong', 'balcony', 'Det finns en liten balkong.', 'There is a small balcony.'),
      v('deposition', 'deposit', 'Behöver man betala deposition?', 'Do you need to pay a deposit?'),
      v('ledig', 'available', 'Rummet är ledigt från september.', 'The room is available from September.'),
    ],
    dialogue: [
      d('A', 'Jag såg en annons för en möblerad lägenhet.', 'I saw an ad for a furnished apartment.'),
      d('B', 'Hur hög är hyran?', 'How high is the rent?'),
      d('A', 'Åttahundrafemtio euro och en månads deposition.', 'Eight hundred and fifty euros and one month’s deposit.'),
      d('B', 'Låter rimligt om läget är bra.', 'Sounds reasonable if the location is good.'),
    ],
    practice: [
      'Read a housing ad and underline five key facts.',
      'Explain what kind of apartment you need.',
      'Make three questions to a landlord.',
      'Write a short response to a rental ad.',
    ],
    canDo: [
      'I can identify rent, location, and basic housing details.',
      'I can ask simple rental questions.',
      'I can describe my housing needs.',
    ],
    examTask: 'Reading: extract price, size, and availability from a housing ad.',
  }),
  lessonSpec({
    title: 'Moving, furniture, and practical home problems',
    goal: 'Handle simple conversations about moving and household problems.',
    focus:
      'A2 needs problem vocabulary, not only labels, because YKI tasks often involve practical complications.',
    grammarNote:
      'Use “måste” for necessity and “behöver” for need: “Jag måste flytta”, “Jag behöver en säng.”',
    vocabulary: [
      v('flytta', 'to move', 'Vi ska flytta nästa månad.', 'We are going to move next month.'),
      v('soffa', 'sofa', 'Soffan är för stor för rummet.', 'The sofa is too big for the room.'),
      v('säng', 'bed', 'Jag behöver en ny säng.', 'I need a new bed.'),
      v('trasig', 'broken', 'Lampan är trasig.', 'The lamp is broken.'),
      v('verktyg', 'tools', 'Har du några verktyg?', 'Do you have any tools?'),
    ],
    dialogue: [
      d('A', 'När flyttar ni?', 'When are you moving?'),
      d('B', 'Nästa helg, men soffan är för stor.', 'Next weekend, but the sofa is too big.'),
      d('A', 'Behöver ni hjälp?', 'Do you need help?'),
      d('B', 'Ja, och några verktyg.', 'Yes, and some tools.'),
    ],
    practice: [
      'List what you need when moving house.',
      'Describe one broken thing at home.',
      'Ask for help and offer help politely.',
      'Write a short message about a moving problem.',
    ],
    canDo: [
      'I can talk about moving and furniture.',
      'I can describe a simple home problem.',
      'I can ask for practical help.',
    ],
    examTask: 'Writing: message a friend to ask for moving help.',
  }),
  lessonSpec({
    title: 'Healthcare visits and appointment language',
    goal: 'Book, change, and discuss a healthcare appointment in more detail.',
    focus:
      'This lesson extends A1 health language into service interaction, which is common in YKI everyday tasks.',
    grammarNote:
      'Use “skulle vilja boka”, “behöver ändra”, and “kan komma” for polite service interaction.',
    vocabulary: [
      v('boka', 'to book', 'Jag vill boka en tid.', 'I want to book an appointment.'),
      v('ändra', 'to change', 'Jag behöver ändra min tid.', 'I need to change my appointment.'),
      v('symtom', 'symptoms', 'Mina symtom började igår.', 'My symptoms started yesterday.'),
      v('recept', 'prescription', 'Behöver jag ett recept?', 'Do I need a prescription?'),
      v('vårdcentral', 'health center', 'Jag ringer vårdcentralen.', 'I am calling the health center.'),
    ],
    dialogue: [
      d('Reception', 'Vårdcentralen, hur kan jag hjälpa dig?', 'Health center, how can I help you?'),
      d('Patient', 'Jag skulle vilja boka en tid. Jag har haft feber sedan igår.', 'I would like to book an appointment. I have had a fever since yesterday.'),
      d('Reception', 'Kan du komma i morgon klockan nio?', 'Can you come tomorrow at nine?'),
      d('Patient', 'Ja, det går bra.', 'Yes, that works.'),
    ],
    practice: [
      'Role-play booking and changing an appointment.',
      'Describe symptoms using full sentences.',
      'Listen for date, time, and location details.',
      'Write a short health-center message.',
    ],
    canDo: [
      'I can book or change a healthcare appointment.',
      'I can describe simple symptoms.',
      'I can understand basic healthcare service language.',
    ],
    examTask: 'Listening: extract appointment time and health issue from a phone dialogue.',
  }),
  lessonSpec({
    title: 'Feelings, reactions, and everyday opinions',
    goal: 'Express emotions and simple opinions with more nuance.',
    focus:
      'A2 needs emotional vocabulary because real conversations and writing tasks often ask how you feel about something.',
    grammarNote:
      'Use “jag tycker att ...” for opinions and “jag känner mig ...” for emotions or temporary states.',
    vocabulary: [
      v('orolig', 'worried', 'Jag är lite orolig för provet.', 'I am a little worried about the test.'),
      v('stolt', 'proud', 'Jag är stolt över mina framsteg.', 'I am proud of my progress.'),
      v('lättad', 'relieved', 'Jag blev lättad efter samtalet.', 'I felt relieved after the call.'),
      v('jag tycker att', 'I think that', 'Jag tycker att kursen är bra.', 'I think the course is good.'),
      v('viktig', 'important', 'Det här är viktigt för mig.', 'This is important to me.'),
    ],
    dialogue: [
      d('A', 'Hur känner du inför provet?', 'How do you feel about the test?'),
      d('B', 'Lite orolig men också motiverad.', 'A little worried but also motivated.'),
      d('A', 'Vad tycker du är viktigast att träna?', 'What do you think is most important to practice?'),
      d('B', 'Att prata längre utan stopp.', 'To speak longer without stopping.'),
    ],
    practice: [
      'Describe your feelings about Swedish study.',
      'Use “jag tycker att ...” with three school or work topics.',
      'Contrast positive and negative reactions.',
      'Write a short reflection about your learning this week.',
    ],
    canDo: [
      'I can express several emotions clearly.',
      'I can give a simple opinion with a reason.',
      'I can reflect briefly on my progress.',
    ],
    examTask: 'Speaking: explain how you feel about an upcoming challenge and why.',
  }),
  lessonSpec({
    title: 'Work tasks, schedules, and collaboration',
    goal: 'Describe job tasks, planning, and cooperation with others.',
    focus:
      'This lesson expands workplace language from A1 into more functional interaction.',
    grammarNote:
      'Use sequence words like “först”, “sedan”, and “till slut” to explain tasks clearly.',
    vocabulary: [
      v('ansvar', 'responsibility', 'Jag har ansvar för rapporten.', 'I am responsible for the report.'),
      v('schema', 'schedule', 'Mitt schema ändras ofta.', 'My schedule changes often.'),
      v('kollega', 'colleague', 'Min kollega hjälper mig ibland.', 'My colleague helps me sometimes.'),
      v('deadline', 'deadline', 'Vi har deadline på fredag.', 'We have a deadline on Friday.'),
      v('samarbeta', 'to collaborate', 'Vi måste samarbeta bättre.', 'We need to collaborate better.'),
    ],
    dialogue: [
      d('A', 'Vad ansvarar du för på jobbet?', 'What are you responsible for at work?'),
      d('B', 'Jag planerar möten och skriver rapporter.', 'I plan meetings and write reports.'),
      d('A', 'Arbetar du mycket med kollegor?', 'Do you work a lot with colleagues?'),
      d('B', 'Ja, vi samarbetar varje dag.', 'Yes, we collaborate every day.'),
    ],
    practice: [
      'Describe a work or study process in order.',
      'Explain one responsibility and one difficulty.',
      'Use “först, sedan, till slut” in a spoken answer.',
      'Write a short summary of a normal workday.',
    ],
    canDo: [
      'I can explain work tasks more clearly.',
      'I can mention schedules, deadlines, and collaboration.',
      'I can give a structured answer about responsibilities.',
    ],
    examTask: 'Speaking: explain a normal work task step by step.',
  }),
  lessonSpec({
    title: 'Job search, CV basics, and applications',
    goal: 'Understand and produce simple Swedish related to jobs and applications.',
    focus:
      'Employment language is a high-value topic in integration and citizenship-related contexts.',
    grammarNote:
      'Formal Swedish often becomes more compact. Keep sentences clear and factual instead of overly complex.',
    vocabulary: [
      v('ansökan', 'application', 'Jag skickade min ansökan igår.', 'I sent my application yesterday.'),
      v('erfarenhet', 'experience', 'Jag har erfarenhet av kundservice.', 'I have experience in customer service.'),
      v('kompetens', 'competence / skills', 'Mina viktigaste kompetenser är ...', 'My most important skills are ...'),
      v('heltid', 'full time', 'Jag söker ett heltidsjobb.', 'I am looking for a full-time job.'),
      v('intervju', 'interview', 'Jag har en intervju på måndag.', 'I have an interview on Monday.'),
    ],
    dialogue: [
      d('A', 'Har du skickat din ansökan?', 'Have you sent your application?'),
      d('B', 'Ja, och jag beskrev min erfarenhet tydligt.', 'Yes, and I described my experience clearly.'),
      d('A', 'Söker du heltid eller deltid?', 'Are you looking for full time or part time?'),
      d('B', 'Helst heltid.', 'Preferably full time.'),
    ],
    practice: [
      'List your skills in simple Swedish.',
      'Write three sentences for a mini CV profile.',
      'Practice introducing your work experience aloud.',
      'Read one job ad and identify what the employer wants.',
    ],
    canDo: [
      'I can talk about work experience and skills.',
      'I can understand basic job-ad language.',
      'I can write a short application-style text.',
    ],
    examTask: 'Writing: produce a 70-word self-presentation for a job application.',
  }),
  lessonSpec({
    title: 'School, courses, and learning discussions',
    goal: 'Discuss courses, assignments, deadlines, and learning plans.',
    focus:
      'Education language is relevant both for your current studies and for YKI reflection tasks.',
    grammarNote:
      'With “för att”, you can explain purpose: “Jag studerar svenska för att klara provet.”',
    vocabulary: [
      v('kurs', 'course', 'Den här kursen hjälper mig mycket.', 'This course helps me a lot.'),
      v('inlämning', 'submission', 'Nästa inlämning är på fredag.', 'The next submission is on Friday.'),
      v('mål', 'goal', 'Mitt mål är B1-nivå.', 'My goal is B1 level.'),
      v('öva', 'to practice', 'Jag övar varje dag.', 'I practice every day.'),
      v('för att', 'in order to', 'Jag läser varje morgon för att förstå mer.', 'I read every morning in order to understand more.'),
    ],
    dialogue: [
      d('A', 'Varför studerar du svenska så intensivt?', 'Why are you studying Swedish so intensively?'),
      d('B', 'För att jag vill klara YKI-provet i augusti.', 'Because I want to pass the YKI test in August.'),
      d('A', 'Hur ofta övar du?', 'How often do you practice?'),
      d('B', 'Sex dagar i veckan.', 'Six days a week.'),
    ],
    practice: [
      'State your language goal in three different ways.',
      'Explain your study plan with purpose phrases.',
      'Discuss one difficulty and one solution.',
      'Write a short weekly learning plan.',
    ],
    canDo: [
      'I can talk about my studies and goals.',
      'I can explain why I learn Swedish.',
      'I can discuss deadlines and practice plans.',
    ],
    examTask: 'Speaking: explain your language goal and daily study method.',
  }),
  lessonSpec({
    title: 'Phone, internet, and digital problems',
    goal: 'Handle common digital-life issues in Swedish.',
    focus:
      'Digital-service tasks are common, practical, and good for problem-solution language.',
    grammarNote:
      'For technical problems, use “fungerar inte”, “kan inte”, and “måste” to explain the issue quickly.',
    vocabulary: [
      v('internet', 'internet', 'Internet fungerar inte hemma.', 'The internet is not working at home.'),
      v('lösenord', 'password', 'Jag glömde mitt lösenord.', 'I forgot my password.'),
      v('app', 'app', 'Jag använder appen för biljetter.', 'I use the app for tickets.'),
      v('uppdatera', 'to update', 'Jag måste uppdatera telefonen.', 'I have to update the phone.'),
      v('skärm', 'screen', 'Skärmen är svart.', 'The screen is black.'),
    ],
    dialogue: [
      d('A', 'Varför svarade du inte?', 'Why did you not answer?'),
      d('B', 'Min telefon fungerade inte och internet var nere.', 'My phone was not working and the internet was down.'),
      d('A', 'Har du provat att uppdatera appen?', 'Have you tried updating the app?'),
      d('B', 'Ja, nu fungerar den igen.', 'Yes, now it works again.'),
    ],
    practice: [
      'Describe one real digital problem you have had.',
      'Call imagined customer service and explain the issue.',
      'Use “fungerar inte” in five contexts.',
      'Write a short support message.',
    ],
    canDo: [
      'I can explain simple digital problems.',
      'I can ask for help with a phone or app.',
      'I can understand basic troubleshooting phrases.',
    ],
    examTask: 'Writing: report a technical problem to support in 60 words.',
  }),
  lessonSpec({
    title: 'Banking, payments, and everyday money',
    goal: 'Talk about paying, transferring, and everyday financial routines.',
    focus:
      'Money language appears in shopping, bills, housing, and official situations, so A2 should cover it directly.',
    grammarNote:
      'Use “betala”, “överföra”, and “kostar” precisely, because small verb differences matter in service talk.',
    vocabulary: [
      v('betala', 'to pay', 'Jag betalar med kort.', 'I pay by card.'),
      v('kontant', 'cash', 'Tar ni kontant?', 'Do you accept cash?'),
      v('räkning', 'bill', 'Jag måste betala räkningen idag.', 'I must pay the bill today.'),
      v('överföra', 'to transfer', 'Kan du överföra pengarna?', 'Can you transfer the money?'),
      v('konto', 'account', 'Pengarna finns på mitt konto.', 'The money is in my account.'),
    ],
    dialogue: [
      d('A', 'Hur vill du betala?', 'How do you want to pay?'),
      d('B', 'Med kort, tack.', 'By card, thanks.'),
      d('A', 'Har du också betalat hyran?', 'Have you also paid the rent?'),
      d('B', 'Ja, jag överförde pengarna i morse.', 'Yes, I transferred the money this morning.'),
    ],
    practice: [
      'Explain how you usually pay for things.',
      'Describe one bill and one transfer situation.',
      'Ask two questions at a bank or customer desk.',
      'Write a short message about a payment problem.',
    ],
    canDo: [
      'I can talk about payments and bills.',
      'I can understand common banking words.',
      'I can explain a simple money-related problem.',
    ],
    examTask: 'Listening: identify payment method, amount, and problem from a short dialogue.',
  }),
  lessonSpec({
    title: 'Public services, forms, and identity details',
    goal: 'Understand basic public-service language and form-filling vocabulary.',
    focus:
      'This is core integration vocabulary and highly relevant for citizenship-related preparation.',
    grammarNote:
      'Forms often use nouns instead of full sentences. Practice mapping those labels to real-life meaning.',
    vocabulary: [
      v('personnummer', 'personal identity number', 'Här är mitt personnummer.', 'Here is my personal identity number.'),
      v('blankett', 'form', 'Jag måste fylla i en blankett.', 'I need to fill in a form.'),
      v('underskrift', 'signature', 'Sätt din underskrift här.', 'Put your signature here.'),
      v('myndighet', 'authority', 'Jag kontaktade myndigheten igår.', 'I contacted the authority yesterday.'),
      v('intyg', 'certificate', 'De bad om ett intyg.', 'They asked for a certificate.'),
    ],
    dialogue: [
      d('A', 'Har du fyllt i blanketten?', 'Have you filled in the form?'),
      d('B', 'Nästan, men jag saknar ett intyg.', 'Almost, but I am missing a certificate.'),
      d('A', 'Glöm inte underskriften.', 'Do not forget the signature.'),
      d('B', 'Nej, det gör jag inte.', 'No, I will not.'),
    ],
    practice: [
      'Read one simple form and explain each field.',
      'Spell out your identity details aloud.',
      'Practice the verbs “fylla i”, “skicka”, and “bifoga”.',
      'Write a short request for missing information.',
    ],
    canDo: [
      'I can understand common form words.',
      'I can speak about identity details more confidently.',
      'I can ask what a required document means.',
    ],
    examTask: 'Reading: match form labels with their meanings.',
  }),
  lessonSpec({
    title: 'Family logistics, childcare, and schedules',
    goal: 'Talk about family planning, childcare, and shared responsibilities.',
    focus:
      'This topic adds real-life planning language and stretches your control of time expressions.',
    grammarNote:
      'Swedish often keeps the verb second even after time phrases: “På morgonen lämnar jag barnen.”',
    vocabulary: [
      v('hämta', 'to pick up', 'Jag hämtar barnen klockan fyra.', 'I pick up the children at four.'),
      v('lämna', 'to drop off', 'Hon lämnar barnet på dagis.', 'She drops the child off at daycare.'),
      v('dagis', 'daycare / preschool', 'Dagis öppnar klockan sju.', 'Daycare opens at seven.'),
      v('ansvara för', 'to be responsible for', 'Vi ansvarar för olika saker hemma.', 'We are responsible for different things at home.'),
      v('schemaändring', 'schedule change', 'Det blev en schemaändring idag.', 'There was a schedule change today.'),
    ],
    dialogue: [
      d('A', 'Kan du hämta barnen idag?', 'Can you pick up the children today?'),
      d('B', 'Ja, men jag måste lämna dem tidigt i morgon.', 'Yes, but I must drop them off early tomorrow.'),
      d('A', 'Bra, då delar vi på det.', 'Good, then we share it.'),
      d('B', 'Perfekt.', 'Perfect.'),
    ],
    practice: [
      'Describe a family schedule in time order.',
      'Use “på morgonen / på eftermiddagen / på kvällen” with V2 order.',
      'Negotiate one shared responsibility aloud.',
      'Write a short logistics message to a family member.',
    ],
    canDo: [
      'I can talk about childcare and family schedules.',
      'I can describe who does what and when.',
      'I can adapt to a schedule change in Swedish.',
    ],
    examTask: 'Writing: explain a family schedule change in a short message.',
  }),
  lessonSpec({
    title: 'Travel planning, bookings, and accommodation',
    goal: 'Use Swedish for booking transport and accommodation.',
    focus:
      'Travel vocabulary combines dates, prices, preferences, and questions in a useful A2 package.',
    grammarNote:
      'Questions about bookings often use “finns det”, “kan jag få”, and “skulle vilja boka”.',
    vocabulary: [
      v('boka', 'to book', 'Jag vill boka ett rum.', 'I want to book a room.'),
      v('enkelrum', 'single room', 'Finns det ett enkelrum?', 'Is there a single room?'),
      v('ankomst', 'arrival', 'Vad är ankomsttiden?', 'What is the arrival time?'),
      v('avgång', 'departure', 'Tågets avgång är klockan sju.', 'The train’s departure is at seven.'),
      v('övernatta', 'to stay overnight', 'Vi ska övernatta i Stockholm.', 'We are going to stay overnight in Stockholm.'),
    ],
    dialogue: [
      d('A', 'Jag skulle vilja boka ett enkelrum för två nätter.', 'I would like to book a single room for two nights.'),
      d('B', 'Vilket datum anländer du?', 'What date do you arrive?'),
      d('A', 'Den tolfte juli, sent på kvällen.', 'On the twelfth of July, late in the evening.'),
      d('B', 'Det finns ett rum ledigt.', 'There is a room available.'),
    ],
    practice: [
      'Book a room aloud with date and number of nights.',
      'Ask about arrival and departure times.',
      'Compare two travel options.',
      'Write a short booking request.',
    ],
    canDo: [
      'I can book travel or accommodation.',
      'I can understand the main details in a booking conversation.',
      'I can ask follow-up questions about dates and times.',
    ],
    examTask: 'Listening: note arrival date, room type, and length of stay.',
  }),
  lessonSpec({
    title: 'Leisure events, plans, and recommendations',
    goal: 'Suggest activities and react to other people’s plans.',
    focus:
      'Recommendation language helps you sound more interactive and less memorized.',
    grammarNote:
      'Use “vi kan ...”, “du borde ...”, and “ska vi ...?” for suggestions with different levels of force.',
    vocabulary: [
      v('föreslå', 'to suggest', 'Kan du föreslå något billigt?', 'Can you suggest something cheap?'),
      v('utställning', 'exhibition', 'Det finns en ny utställning i stan.', 'There is a new exhibition in town.'),
      v('konsert', 'concert', 'Vi går på konsert på fredag.', 'We are going to a concert on Friday.'),
      v('borde', 'should', 'Du borde prova det här.', 'You should try this.'),
      v('passar', 'suits / works', 'Lördag passar bäst för mig.', 'Saturday works best for me.'),
    ],
    dialogue: [
      d('A', 'Vad ska vi göra i helgen?', 'What should we do this weekend?'),
      d('B', 'Vi kan gå på en utställning eller en konsert.', 'We can go to an exhibition or a concert.'),
      d('A', 'Konsert låter roligare.', 'A concert sounds more fun.'),
      d('B', 'Bra, lördag passar bäst för mig.', 'Good, Saturday works best for me.'),
    ],
    practice: [
      'Suggest three weekend activities.',
      'Accept one idea and reject one politely.',
      'Explain why one activity fits better.',
      'Write a short recommendation message.',
    ],
    canDo: [
      'I can suggest activities and react to suggestions.',
      'I can give simple recommendations.',
      'I can explain a preference in connected speech.',
    ],
    examTask: 'Speaking: recommend an activity to a friend and explain why.',
  }),
  lessonSpec({
    title: 'Accidents, urgency, and emergency help',
    goal: 'Describe simple accidents and ask for urgent help.',
    focus:
      'Emergency language should be practiced before you need it; short accurate sentences matter most.',
    grammarNote:
      'In urgent talk, simple present or past with clear facts is better than complex sentences.',
    vocabulary: [
      v('olycka', 'accident', 'Det har varit en liten olycka.', 'There has been a small accident.'),
      v('ramla', 'to fall', 'Han ramlade på gatan.', 'He fell on the street.'),
      v('blöda', 'to bleed', 'Det blöder från handen.', 'It is bleeding from the hand.'),
      v('ambulans', 'ambulance', 'Behöver vi ringa ambulans?', 'Do we need to call an ambulance?'),
      v('akut', 'urgent / emergency', 'Det känns akut.', 'It feels urgent.'),
    ],
    dialogue: [
      d('A', 'Vad har hänt?', 'What has happened?'),
      d('B', 'Han ramlade och nu blöder handen.', 'He fell and now the hand is bleeding.'),
      d('A', 'Ska jag ringa ambulans?', 'Should I call an ambulance?'),
      d('B', 'Ja, tack. Det känns akut.', 'Yes, please. It feels urgent.'),
    ],
    practice: [
      'State the problem in one clear emergency sentence.',
      'Name where the injury is and what happened.',
      'Practice speaking slowly but clearly under stress.',
      'Write a short description of an accident for a report.',
    ],
    canDo: [
      'I can explain a basic accident situation.',
      'I can ask for urgent help.',
      'I can understand core emergency words.',
    ],
    examTask: 'Listening: identify the accident, injury, and requested help.',
  }),
  lessonSpec({
    title: 'Past tense stories and sequencing events',
    goal: 'Tell a short story about a past event in chronological order.',
    focus:
      'Narration begins here in a more systematic way because B1 requires connected experiences, not isolated past forms.',
    grammarNote:
      'Sequence markers such as “först”, “sedan”, “efter det”, and “till slut” make imperfect grammar easier to follow.',
    vocabulary: [
      v('först', 'first', 'Först gick jag till stationen.', 'First I went to the station.'),
      v('sedan', 'then', 'Sedan träffade jag min vän.', 'Then I met my friend.'),
      v('efter det', 'after that', 'Efter det åt vi middag.', 'After that we ate dinner.'),
      v('till slut', 'in the end', 'Till slut åkte jag hem.', 'In the end I went home.'),
      v('hände', 'happened', 'Det här hände igår.', 'This happened yesterday.'),
    ],
    dialogue: [
      d('A', 'Hur gick resan i går?', 'How did the trip go yesterday?'),
      d('B', 'Först missade jag bussen, sedan tog jag tåget.', 'First I missed the bus, then I took the train.'),
      d('A', 'Vad hände efter det?', 'What happened after that?'),
      d('B', 'Till slut kom jag fram i tid ändå.', 'In the end I arrived on time anyway.'),
    ],
    practice: [
      'Tell a four-step story from real life.',
      'Use all four sequence markers in one answer.',
      'Write a short story about a difficult day.',
      'Retell the dialogue without looking.',
    ],
    canDo: [
      'I can tell a simple story in time order.',
      'I can connect past events more clearly.',
      'I can understand sequencing words in conversation.',
    ],
    examTask: 'Speaking: narrate a small problem from yesterday in 60 seconds.',
  }),
  lessonSpec({
    title: 'Perfect tense and life experience',
    goal: 'Talk about experiences and actions connected to the present.',
    focus:
      'This tense is frequent in Swedish conversation and useful for biography, migration, and work experience.',
    grammarNote:
      'Perfect tense uses “har” + supine: “Jag har bott”, “Jag har arbetat”, “Jag har lärt mig”.',
    vocabulary: [
      v('jag har bott', 'I have lived', 'Jag har bott i Finland i tre år.', 'I have lived in Finland for three years.'),
      v('jag har arbetat', 'I have worked', 'Jag har arbetat inom IT.', 'I have worked in IT.'),
      v('erfarenhet', 'experience', 'Det var en viktig erfarenhet.', 'It was an important experience.'),
      v('ännu', 'yet', 'Jag har inte gjort det ännu.', 'I have not done that yet.'),
      v('redan', 'already', 'Jag har redan skickat mejlet.', 'I have already sent the email.'),
    ],
    dialogue: [
      d('A', 'Hur länge har du bott i Finland?', 'How long have you lived in Finland?'),
      d('B', 'Jag har bott här i tre år.', 'I have lived here for three years.'),
      d('A', 'Har du redan gjort anmälan?', 'Have you already done the registration?'),
      d('B', 'Ja, jag har redan skickat allt.', 'Yes, I have already sent everything.'),
    ],
    practice: [
      'Say three things you have done and one thing you have not done yet.',
      'Describe your language-learning experience using perfect tense.',
      'Contrast “igår gjorde jag” with “jag har gjort”.',
      'Write a short life-experience paragraph.',
    ],
    canDo: [
      'I can talk about experience and duration.',
      'I can use already/yet in simple ways.',
      'I can answer biography-style questions more naturally.',
    ],
    examTask: 'Writing: summarize your experience in Finland in 70 words.',
  }),
  lessonSpec({
    title: 'Future intentions, promises, and commitments',
    goal: 'Explain plans and intentions with stronger A2 control.',
    focus:
      'This lesson strengthens planning language so you can sound more definite and organized.',
    grammarNote:
      'Combine future time with modal meaning: “Jag ska ...”, “Jag tänker ...”, “Jag hoppas att ...”.',
    vocabulary: [
      v('jag tänker', 'I intend / I am thinking of', 'Jag tänker söka kursen.', 'I intend to apply for the course.'),
      v('lova', 'to promise', 'Jag lovar att ringa imorgon.', 'I promise to call tomorrow.'),
      v('bestämma', 'to decide', 'Vi måste bestämma idag.', 'We must decide today.'),
      v('hoppas', 'to hope', 'Jag hoppas att det går bra.', 'I hope it goes well.'),
      v('förbereda', 'to prepare', 'Jag förbereder mig inför provet.', 'I prepare for the test.'),
    ],
    dialogue: [
      d('A', 'Hur tänker du förbereda dig för augusti?', 'How are you planning to prepare for August?'),
      d('B', 'Jag tänker studera varje morgon och göra mockprov varje vecka.', 'I plan to study every morning and do mock tests every week.'),
      d('A', 'Bra plan. När bestämmer du vilodagar?', 'Good plan. When do you decide rest days?'),
      d('B', 'Jag håller söndagar fria.', 'I keep Sundays free.'),
    ],
    practice: [
      'State three firm study commitments.',
      'Use “jag tänker”, “jag ska”, and “jag hoppas” correctly.',
      'Explain your next-month plan in order.',
      'Write a short commitment note to yourself.',
    ],
    canDo: [
      'I can talk about intentions and commitments.',
      'I can describe a realistic preparation plan.',
      'I can sound more precise about the future.',
    ],
    examTask: 'Speaking: explain how you will prepare for an important event.',
  }),
  lessonSpec({
    title: 'Subordinate clauses and connectors',
    goal: 'Link ideas into longer A2 sentences with common connectors.',
    focus:
      'This lesson is a structural bridge to B1 because connected language matters more than isolated grammar rules.',
    grammarNote:
      'Practice “att”, “för att”, “när”, “om”, “eftersom”, and notice word order after subordinate clauses.',
    vocabulary: [
      v('eftersom', 'because / since', 'Jag stannade hemma eftersom jag var sjuk.', 'I stayed home because I was sick.'),
      v('om', 'if / about', 'Om det regnar tar jag bussen.', 'If it rains, I take the bus.'),
      v('när', 'when', 'När jag kommer hem lagar jag mat.', 'When I come home I cook.'),
      v('fast', 'although / though', 'Jag gick ut fast det regnade.', 'I went out although it was raining.'),
      v('därför att', 'because', 'Jag övar därför att jag behöver bättre flyt.', 'I practice because I need better fluency.'),
    ],
    dialogue: [
      d('A', 'Varför studerade du hemma igår?', 'Why did you study at home yesterday?'),
      d('B', 'Eftersom biblioteket var stängt.', 'Because the library was closed.'),
      d('A', 'Vad gör du om du blir trött?', 'What do you do if you get tired?'),
      d('B', 'När jag blir trött tar jag en kort paus.', 'When I get tired I take a short break.'),
    ],
    practice: [
      'Combine short sentences with connectors.',
      'Say one sentence with “om”, “när”, and “eftersom”.',
      'Notice verb-second order after opening clauses.',
      'Write a connected paragraph with at least four connectors.',
    ],
    canDo: [
      'I can link reasons, time, and conditions.',
      'I can produce longer connected sentences.',
      'I can understand common connector words while reading.',
    ],
    examTask: 'Writing: explain a problem and its reason using connected sentences.',
  }),
  lessonSpec({
    title: 'Reading notices, instructions, and warning signs',
    goal: 'Understand short practical texts quickly and accurately.',
    focus:
      'Practical reading is one of the most useful preparation areas because it appears in daily life and in test tasks.',
    grammarNote:
      'Notices often omit subjects. Focus on key nouns, imperatives, dates, and conditions.',
    vocabulary: [
      v('stängt', 'closed', 'Biblioteket är stängt på söndag.', 'The library is closed on Sunday.'),
      v('öppet', 'open', 'Butiken är öppen till nio.', 'The shop is open until nine.'),
      v('förbjudet', 'forbidden', 'Rökning förbjuden.', 'Smoking forbidden.'),
      v('gäller', 'applies / is valid', 'Erbjudandet gäller till fredag.', 'The offer is valid until Friday.'),
      v('anmälan', 'registration', 'Anmälan måste göras idag.', 'Registration must be done today.'),
    ],
    dialogue: [
      d('A', 'Vad står det på dörren?', 'What does it say on the door?'),
      d('B', 'Att kontoret är stängt efter klockan tre.', 'That the office is closed after three o’clock.'),
      d('A', 'Och den andra skylten?', 'And the other sign?'),
      d('B', 'Att anmälan gäller bara online.', 'That registration only applies online.'),
    ],
    practice: [
      'Read five notices and identify action, place, and time.',
      'Translate key message, not every word.',
      'Practice scanning for dates and restrictions.',
      'Write one notice yourself in simple Swedish.',
    ],
    canDo: [
      'I can understand the main point of short practical texts.',
      'I can find dates, times, and restrictions quickly.',
      'I can write a very short notice.',
    ],
    examTask: 'Reading: match three notices with the correct situation.',
  }),
  lessonSpec({
    title: 'Email structure, polite requests, and replies',
    goal: 'Write clearer everyday emails for school, work, and services.',
    focus:
      'Email writing is one of the easiest places to gain points because structure can be trained directly.',
    grammarNote:
      'Use simple openings and closings consistently: “Hej ...”, “Tack på förhand”, “Vänliga hälsningar”.',
    vocabulary: [
      v('ämne', 'subject', 'Vad ska jag skriva i ämnesraden?', 'What should I write in the subject line?'),
      v('vänliga hälsningar', 'kind regards', 'Vänliga hälsningar, Shool', 'Kind regards, Shool'),
      v('bifoga', 'to attach', 'Jag bifogar dokumentet.', 'I attach the document.'),
      v('bekräfta', 'to confirm', 'Kan du bekräfta tiden?', 'Can you confirm the time?'),
      v('så snart som möjligt', 'as soon as possible', 'Svara gärna så snart som möjligt.', 'Please reply as soon as possible.'),
    ],
    dialogue: [
      d('A', 'Hur börjar du mejlet?', 'How do you begin the email?'),
      d('B', 'Hej, jag skriver eftersom ...', 'Hi, I am writing because ...'),
      d('A', 'Och hur avslutar du?', 'And how do you finish?'),
      d('B', 'Tack på förhand och vänliga hälsningar.', 'Thanks in advance and kind regards.'),
    ],
    practice: [
      'Write a short email asking for information.',
      'Write another email confirming a time.',
      'Practice polite openings and closings aloud.',
      'Edit one message to make it shorter and clearer.',
    ],
    canDo: [
      'I can structure a simple Swedish email.',
      'I can make polite requests in writing.',
      'I can confirm or ask for information clearly.',
    ],
    examTask: 'Writing: send a 70-word email asking for practical information.',
  }),
  lessonSpec({
    title: 'Rules, habits, and what people should do',
    goal: 'Talk about rules, expectations, and repeated behavior.',
    focus:
      'This topic prepares you for housing, school, work, and society-related discussions later on.',
    grammarNote:
      'Use modal verbs like “måste”, “får”, “bör”, and “kan inte” to express obligation and permission.',
    vocabulary: [
      v('regel', 'rule', 'Det är en viktig regel.', 'It is an important rule.'),
      v('måste', 'must', 'Du måste komma i tid.', 'You must come on time.'),
      v('får', 'may / are allowed to', 'Här får man inte röka.', 'You may not smoke here.'),
      v('vana', 'habit', 'Det är en bra vana.', 'It is a good habit.'),
      v('respektera', 'to respect', 'Vi måste respektera andra.', 'We must respect others.'),
    ],
    dialogue: [
      d('A', 'Vilka regler finns i huset?', 'What rules are there in the building?'),
      d('B', 'Man måste vara tyst efter tio och man får inte röka inne.', 'You must be quiet after ten and you may not smoke inside.'),
      d('A', 'Det låter rimligt.', 'That sounds reasonable.'),
      d('B', 'Ja, alla måste respektera det.', 'Yes, everyone must respect that.'),
    ],
    practice: [
      'List three rules at home, work, or school.',
      'Contrast “måste” and “får”.',
      'Explain one good study habit and one bad one.',
      'Write a short rule reminder message.',
    ],
    canDo: [
      'I can express obligation and permission.',
      'I can discuss simple rules and habits.',
      'I can understand common prohibition notices.',
    ],
    examTask: 'Speaking: explain two rules and why they exist.',
  }),
  lessonSpec({
    title: 'Environment, recycling, and everyday sustainability',
    goal: 'Discuss simple environmental routines and recycling in Swedish.',
    focus:
      'This topic is realistic for Finland and useful for opinion and instruction tasks.',
    grammarNote:
      'Use verbs like “sortera”, “återvinna”, and “spara” with clear objects for practical speech.',
    vocabulary: [
      v('återvinna', 'to recycle', 'Vi återvinner plast och glas.', 'We recycle plastic and glass.'),
      v('sortera', 'to sort', 'Jag sorterar soporna hemma.', 'I sort the garbage at home.'),
      v('energi', 'energy', 'Vi försöker spara energi.', 'We try to save energy.'),
      v('miljö', 'environment', 'Det är bra för miljön.', 'It is good for the environment.'),
      v('spara', 'to save', 'Jag sparar vatten när jag duschar.', 'I save water when I shower.'),
    ],
    dialogue: [
      d('A', 'Hur återvinner ni hemma?', 'How do you recycle at home?'),
      d('B', 'Vi sorterar plast, glas och papper.', 'We sort plastic, glass, and paper.'),
      d('A', 'Gör du något mer för miljön?', 'Do you do anything else for the environment?'),
      d('B', 'Ja, jag försöker spara energi.', 'Yes, I try to save energy.'),
    ],
    practice: [
      'Describe your recycling routine.',
      'Give two environmental recommendations.',
      'Compare two habits: one sustainable and one less sustainable.',
      'Write a short tip list for a neighbour.',
    ],
    canDo: [
      'I can talk about recycling and saving resources.',
      'I can give basic environmental advice.',
      'I can understand simple sustainability texts.',
    ],
    examTask: 'Writing: give practical recycling advice in 60 words.',
  }),
  lessonSpec({
    title: 'News basics and short spoken summaries',
    goal: 'Understand and summarize the main point of simple news-like content.',
    focus:
      'This is a bridge from practical texts to more abstract B1 reading and listening.',
    grammarNote:
      'Do not chase every word. Find topic, place, people, and result first.',
    vocabulary: [
      v('nyhet', 'news item', 'Det var en intressant nyhet.', 'It was an interesting news item.'),
      v('rapportera', 'to report', 'Kan du rapportera kort?', 'Can you report briefly?'),
      v('hända', 'to happen', 'Vad har hänt?', 'What has happened?'),
      v('orsak', 'reason / cause', 'Vad var orsaken?', 'What was the reason?'),
      v('resultat', 'result', 'Vad blev resultatet?', 'What was the result?'),
    ],
    dialogue: [
      d('A', 'Förstod du nyheten?', 'Did you understand the news item?'),
      d('B', 'Inte allt, men jag förstod ämnet och resultatet.', 'Not everything, but I understood the topic and the result.'),
      d('A', 'Kan du sammanfatta kort?', 'Can you summarize briefly?'),
      d('B', 'Ja, det handlade om kollektivtrafik i staden.', 'Yes, it was about public transport in the city.'),
    ],
    practice: [
      'Listen to a short clip and summarize the main idea.',
      'Use who-what-where-why to structure a summary.',
      'Ignore minor unknown words and keep the main point.',
      'Write a three-sentence summary of a simple text.',
    ],
    canDo: [
      'I can catch the main idea in simple news-like material.',
      'I can give a short summary.',
      'I can identify cause and result at a basic level.',
    ],
    examTask: 'Listening: summarize a short announcement in three bullet points.',
  }),
  lessonSpec({
    title: 'Problems, complaints, and customer-service talk',
    goal: 'Explain a problem and ask for a solution politely.',
    focus:
      'Complaint language is high-value because it forces precise description plus polite interaction.',
    grammarNote:
      'A useful complaint structure is: problem, evidence, request. Keep each step short and factual.',
    vocabulary: [
      v('klaga', 'to complain', 'Jag vill inte klaga, men ...', 'I do not want to complain, but ...'),
      v('fel', 'wrong / fault', 'Det är något fel med beställningen.', 'There is something wrong with the order.'),
      v('byta', 'to exchange', 'Kan jag byta den här?', 'Can I exchange this?'),
      v('återbetalning', 'refund', 'Kan jag få återbetalning?', 'Can I get a refund?'),
      v('kvitto', 'receipt', 'Jag har kvittot kvar.', 'I still have the receipt.'),
    ],
    dialogue: [
      d('Kund', 'Hej, det är något fel med den här produkten.', 'Hi, there is something wrong with this product.'),
      d('Personal', 'Vad verkar vara problemet?', 'What seems to be the problem?'),
      d('Kund', 'Den fungerar inte och jag har kvittot kvar.', 'It does not work and I still have the receipt.'),
      d('Personal', 'Okej, vi kan byta den eller ge återbetalning.', 'Okay, we can exchange it or give a refund.'),
    ],
    practice: [
      'Describe one product or service problem clearly.',
      'Ask for exchange, repair, or refund.',
      'Practice a calm complaint tone.',
      'Write a short complaint email.',
    ],
    canDo: [
      'I can explain a customer-service problem.',
      'I can ask for a specific solution.',
      'I can understand common complaint vocabulary.',
    ],
    examTask: 'Writing: complain politely about a service problem in 80 words.',
  }),
  lessonSpec({
    title: 'Longer speaking turns and discourse markers',
    goal: 'Speak for one to two minutes with clearer structure.',
    focus:
      'A2 to B1 transition depends on length, so this lesson trains pacing and simple discourse markers.',
    grammarNote:
      'Use markers like “för det första”, “också”, “dessutom”, “men”, and “så” to hold the floor.',
    vocabulary: [
      v('för det första', 'first of all', 'För det första behöver jag mer tid.', 'First of all I need more time.'),
      v('dessutom', 'in addition', 'Dessutom är det dyrt.', 'In addition it is expensive.'),
      v('egentligen', 'actually', 'Egentligen vill jag bo närmare jobbet.', 'Actually I want to live closer to work.'),
      v('sammanfatta', 'to summarize', 'Kan du sammanfatta din idé?', 'Can you summarize your idea?'),
      v('hålla igång', 'to keep going', 'Jag försöker hålla igång samtalet.', 'I try to keep the conversation going.'),
    ],
    dialogue: [
      d('A', 'Hur kan du prata längre på provet?', 'How can you speak longer in the test?'),
      d('B', 'Jag använder enkla strukturer och några tydliga markörer.', 'I use simple structures and a few clear markers.'),
      d('A', 'Som vilka?', 'Like which ones?'),
      d('B', 'För det första, dessutom, men, och till slut.', 'First of all, in addition, but, and in the end.'),
    ],
    practice: [
      'Speak for 90 seconds on one familiar topic.',
      'Insert at least four discourse markers.',
      'Restart smoothly if you lose a word.',
      'Write a mini speaking outline before you answer.',
    ],
    canDo: [
      'I can speak in longer stretches.',
      'I can structure an answer with basic connectors.',
      'I can recover when I get stuck.',
    ],
    examTask: 'Speaking: give a 90-second answer on your daily life with clear structure.',
  }),
  lessonSpec({
    title: 'A2 review, production check, and B1 bridge',
    goal: 'Consolidate A2 and identify what must change to reach B1.',
    focus:
      'This lesson checks whether you can read, listen, speak, and write with practical independence before moving into exam-heavy B1 work.',
    grammarNote:
      'At the end of A2, the priority is control of core structures under pressure, not rare grammar forms.',
    vocabulary: [
      v('självständighet', 'independence', 'Jag behöver mer självständighet i språket.', 'I need more independence in the language.'),
      v('strategi', 'strategy', 'Min strategi är tydlig.', 'My strategy is clear.'),
      v('flyt', 'fluency / flow', 'Jag vill ha bättre flyt när jag talar.', 'I want better flow when I speak.'),
      v('noggrannhet', 'accuracy', 'Jag tränar både flyt och noggrannhet.', 'I practice both fluency and accuracy.'),
      v('utveckling', 'development', 'Jag ser tydlig utveckling nu.', 'I can see clear development now.'),
    ],
    dialogue: [
      d('A', 'Vad är din största skillnad nu jämfört med A1?', 'What is your biggest difference now compared with A1?'),
      d('B', 'Jag kan förklara mer och skriva tydligare meddelanden.', 'I can explain more and write clearer messages.'),
      d('A', 'Vad behöver du för B1?', 'What do you need for B1?'),
      d('B', 'Mer flyt, längre svar och bättre strategier.', 'More fluency, longer answers, and better strategies.'),
    ],
    practice: [
      'Complete one reading, one listening, one writing, and one speaking task.',
      'Review perfect tense, connectors, and polite email structure.',
      'Give a two-minute summary of your life in Finland so far.',
      'List your top five B1 priorities.',
    ],
    canDo: [
      'I can combine A2 skills in realistic tasks.',
      'I can identify the gap between A2 and B1.',
      'I can start planning more exam-like practice.',
    ],
    examTask: 'Bridge mock: write one formal message and speak for two minutes on a familiar topic.',
    durationMinutes: 95,
  }),
];

const b1Lessons = [
  lessonSpec({
    title: 'Society, citizenship, and civic vocabulary',
    goal: 'Build core vocabulary for society, citizenship, and participation.',
    focus:
      'B1 begins with the language of society because it connects directly to your long-term citizenship goal and to more abstract YKI topics.',
    grammarNote:
      'At B1, expand noun-based vocabulary but keep sentence structures simple and controlled.',
    vocabulary: [
      v('medborgarskap', 'citizenship', 'Medborgarskap är ett långsiktigt mål.', 'Citizenship is a long-term goal.'),
      v('samhälle', 'society', 'Jag vill förstå samhället bättre.', 'I want to understand society better.'),
      v('deltagande', 'participation', 'Språket hjälper deltagande i samhället.', 'Language helps participation in society.'),
      v('rättighet', 'right', 'Alla har samma rättigheter.', 'Everyone has the same rights.'),
      v('skyldighet', 'responsibility / duty', 'Man har också skyldigheter.', 'You also have responsibilities.'),
    ],
    dialogue: [
      d('A', 'Varför är svenska viktigt för dig?', 'Why is Swedish important to you?'),
      d('B', 'För att kunna delta mer aktivt i samhället.', 'In order to participate more actively in society.'),
      d('A', 'Tänker du också på medborgarskap?', 'Are you also thinking about citizenship?'),
      d('B', 'Ja, det är ett viktigt mål för mig.', 'Yes, it is an important goal for me.'),
    ],
    practice: [
      'Explain why language matters for participation.',
      'Define right and responsibility with one example each.',
      'Speak for two minutes about integration goals.',
      'Write a short reflection on why B1 matters.',
    ],
    canDo: [
      'I can talk about society and participation in simple B1 Swedish.',
      'I can explain why language learning matters for citizenship goals.',
      'I can use more abstract vocabulary without losing clarity.',
    ],
    examTask: 'Speaking: explain how Swedish can support participation in society.',
  }),
  lessonSpec({
    title: 'Background, migration, and personal journey',
    goal: 'Describe your life path, moves, and motivations in connected Swedish.',
    focus:
      'This is a high-probability speaking and writing topic because it allows personal but meaningful production.',
    grammarNote:
      'Mix perfect tense for lived experience with past tense for specific events when needed.',
    vocabulary: [
      v('bakgrund', 'background', 'Min bakgrund är internationell.', 'My background is international.'),
      v('flytta till', 'to move to', 'Jag flyttade till Finland för arbete.', 'I moved to Finland for work.'),
      v('anpassa sig', 'to adapt', 'Det tar tid att anpassa sig.', 'It takes time to adapt.'),
      v('motivation', 'motivation', 'Min motivation är stark.', 'My motivation is strong.'),
      v('erfarenhet', 'experience', 'Jag har fått mycket erfarenhet här.', 'I have gained a lot of experience here.'),
    ],
    dialogue: [
      d('A', 'Kan du berätta lite om din bakgrund?', 'Can you tell me a little about your background?'),
      d('B', 'Jag kommer från Indien och flyttade till Finland för arbete.', 'I come from India and moved to Finland for work.'),
      d('A', 'Hur har det varit att anpassa sig?', 'How has it been to adapt?'),
      d('B', 'Utmanande men också lärorikt.', 'Challenging but also educational.'),
    ],
    practice: [
      'Build a two-minute “my journey” answer with time markers.',
      'Explain one challenge and one positive experience.',
      'Record your answer and cut unnecessary pauses.',
      'Write an 80-word personal background text.',
    ],
    canDo: [
      'I can describe my migration or life journey coherently.',
      'I can combine time, reason, and experience.',
      'I can produce a more personal B1 answer with structure.',
    ],
    examTask: 'Writing: explain your path to Finland and your current goal.',
  }),
  lessonSpec({
    title: 'Healthcare, wellbeing, and longer symptom descriptions',
    goal: 'Explain health concerns, routines, and wellbeing with greater precision.',
    focus:
      'At B1 you need to go beyond one-word symptoms and explain situations, changes, and advice.',
    grammarNote:
      'Use connectors to show development: “först”, “sedan”, “nu”, “därför”.',
    vocabulary: [
      v('välmående', 'wellbeing', 'Mitt välmående blir bättre när jag sover bra.', 'My wellbeing improves when I sleep well.'),
      v('besvär', 'trouble / discomfort', 'Jag har haft besvär med ryggen.', 'I have had trouble with my back.'),
      v('undersökning', 'examination', 'Läkaren bokade en undersökning.', 'The doctor booked an examination.'),
      v('behandling', 'treatment', 'Behandlingen började i april.', 'The treatment started in April.'),
      v('råd', 'advice', 'Jag fick bra råd av läkaren.', 'I got good advice from the doctor.'),
    ],
    dialogue: [
      d('A', 'Hur mår du nu jämfört med förra veckan?', 'How do you feel now compared with last week?'),
      d('B', 'Bättre, men jag har fortfarande lite besvär med ryggen.', 'Better, but I still have some trouble with my back.'),
      d('A', 'Vad sa läkaren?', 'What did the doctor say?'),
      d('B', 'Att jag behöver vila mer och börja behandlingen.', 'That I need to rest more and start the treatment.'),
    ],
    practice: [
      'Describe a health issue, change, and advice received.',
      'Explain one healthy routine and why it matters.',
      'Summarize a doctor visit in four sentences.',
      'Write a short wellbeing reflection.',
    ],
    canDo: [
      'I can explain a health situation in more detail.',
      'I can describe change over time.',
      'I can give and understand basic advice about wellbeing.',
    ],
    examTask: 'Speaking: explain a health concern and what you have done about it.',
  }),
  lessonSpec({
    title: 'Work rights, responsibilities, and workplace culture',
    goal: 'Discuss expectations, rights, and norms at work.',
    focus:
      'This topic brings together obligation, opinion, and social reasoning, all of which matter at B1.',
    grammarNote:
      'Opinion + reason is the core pattern here: “Jag tycker att ... eftersom ...”.',
    vocabulary: [
      v('arbetsmiljö', 'work environment', 'En bra arbetsmiljö är viktig.', 'A good work environment is important.'),
      v('ansvar', 'responsibility', 'Alla har ansvar för säkerheten.', 'Everyone has responsibility for safety.'),
      v('respekt', 'respect', 'Respekt mellan kollegor är avgörande.', 'Respect between colleagues is crucial.'),
      v('rättvisa', 'fairness', 'Rättvisa regler skapar trygghet.', 'Fair rules create security.'),
      v('balans', 'balance', 'Balans mellan jobb och fritid är viktig.', 'Balance between work and free time is important.'),
    ],
    dialogue: [
      d('A', 'Vad är viktigast på en bra arbetsplats?', 'What is most important in a good workplace?'),
      d('B', 'Respekt, tydligt ansvar och en trygg arbetsmiljö.', 'Respect, clear responsibility, and a safe work environment.'),
      d('A', 'Tycker du att balans också är viktig?', 'Do you think balance is also important?'),
      d('B', 'Ja, annars orkar man inte i längden.', 'Yes, otherwise you cannot manage in the long run.'),
    ],
    practice: [
      'Give three qualities of a good workplace.',
      'Explain one work right and one responsibility.',
      'Agree or disagree with a statement and justify it.',
      'Write a short opinion paragraph about work culture.',
    ],
    canDo: [
      'I can discuss workplace expectations and values.',
      'I can support an opinion with reasons.',
      'I can use more abstract B1 vocabulary in a familiar domain.',
    ],
    examTask: 'Writing: explain what makes a good workplace in 100 words.',
  }),
  lessonSpec({
    title: 'Official communication and practical bureaucracy',
    goal: 'Understand and produce clearer language for official contacts.',
    focus:
      'Official communication rewards calm structure and precise requests, which can be trained directly.',
    grammarNote:
      'At B1, clarity beats complexity. Keep one request or point per sentence when writing to authorities.',
    vocabulary: [
      v('ärende', 'matter / case', 'Jag skriver om ett viktigt ärende.', 'I am writing about an important matter.'),
      v('handläggare', 'case worker', 'Min handläggare svarade snabbt.', 'My case worker answered quickly.'),
      v('beslut', 'decision', 'Jag väntar på ett beslut.', 'I am waiting for a decision.'),
      v('komplettera', 'to supplement', 'Jag måste komplettera ansökan.', 'I need to supplement the application.'),
      v('begära', 'to request', 'Jag vill begära mer information.', 'I want to request more information.'),
    ],
    dialogue: [
      d('A', 'Har du fått något beslut ännu?', 'Have you received any decision yet?'),
      d('B', 'Nej, men handläggaren bad mig komplettera ansökan.', 'No, but the case worker asked me to supplement the application.'),
      d('A', 'Ska du skriva tillbaka idag?', 'Are you going to write back today?'),
      d('B', 'Ja, jag vill begära tydligare information.', 'Yes, I want to request clearer information.'),
    ],
    practice: [
      'Write a short official request with clear structure.',
      'Identify action words in an official letter.',
      'Practice polite but direct language.',
      'Summarize an official message in plain Swedish.',
    ],
    canDo: [
      'I can understand common official-contact words.',
      'I can write a clearer request to an authority.',
      'I can describe the status of a case or application.',
    ],
    examTask: 'Writing: send a concise official message asking for clarification.',
  }),
  lessonSpec({
    title: 'Neighbour issues, housing contracts, and compromise',
    goal: 'Discuss housing conflicts and practical solutions.',
    focus:
      'This topic requires description, opinion, and diplomacy, which is good B1 practice.',
    grammarNote:
      'Problem-solving answers work well with this structure: situation, effect, suggestion, compromise.',
    vocabulary: [
      v('granne', 'neighbour', 'Jag vill ha en bra relation med grannarna.', 'I want a good relationship with the neighbours.'),
      v('störning', 'disturbance', 'Det har varit störningar på nätterna.', 'There have been disturbances at night.'),
      v('hyresavtal', 'rental contract', 'Hyresavtalet säger att huset ska vara lugnt.', 'The rental contract says the building should be quiet.'),
      v('kompromiss', 'compromise', 'Vi behöver en kompromiss.', 'We need a compromise.'),
      v('gemensam', 'shared / common', 'Det är ett gemensamt utrymme.', 'It is a shared space.'),
    ],
    dialogue: [
      d('A', 'Har du pratat med grannen?', 'Have you talked to the neighbour?'),
      d('B', 'Ja, om störningarna på kvällarna.', 'Yes, about the disturbances in the evenings.'),
      d('A', 'Hur reagerade hen?', 'How did they react?'),
      d('B', 'Ganska bra. Vi försökte hitta en kompromiss.', 'Quite well. We tried to find a compromise.'),
    ],
    practice: [
      'Describe a housing problem calmly.',
      'Suggest two solutions and one compromise.',
      'Refer to a building rule or contract clause in simple terms.',
      'Write a message to a building manager.',
    ],
    canDo: [
      'I can explain a housing conflict clearly.',
      'I can suggest practical solutions.',
      'I can use polite language in a difficult situation.',
    ],
    examTask: 'Speaking: explain a neighbour problem and propose a fair solution.',
  }),
  lessonSpec({
    title: 'Finances, taxes, and benefits vocabulary',
    goal: 'Understand the main language of personal finances and public support.',
    focus:
      'B1 everyday language should include basic financial administration because it affects real autonomy.',
    grammarNote:
      'Focus on meaning relations: income, expense, support, payment, deadline.',
    vocabulary: [
      v('inkomst', 'income', 'Min inkomst varierar lite.', 'My income varies a little.'),
      v('utgift', 'expense', 'Hyran är min största utgift.', 'The rent is my biggest expense.'),
      v('skatt', 'tax', 'Jag behöver förstå skatten bättre.', 'I need to understand the tax better.'),
      v('bidrag', 'benefit / allowance', 'Vem kan få bidrag?', 'Who can receive a benefit?'),
      v('deklaration', 'tax return', 'Jag gjorde deklarationen online.', 'I did the tax return online.'),
    ],
    dialogue: [
      d('A', 'Vilken utgift är störst för dig just nu?', 'Which expense is biggest for you right now?'),
      d('B', 'Hyran, utan tvekan.', 'The rent, without doubt.'),
      d('A', 'Har du redan gjort deklarationen?', 'Have you already done the tax return?'),
      d('B', 'Ja, men jag behövde hjälp med några delar.', 'Yes, but I needed help with a few parts.'),
    ],
    practice: [
      'Explain your main monthly expenses.',
      'Describe a simple tax or benefit question.',
      'Read a short finance text and identify deadline and action.',
      'Write a request for financial guidance.',
    ],
    canDo: [
      'I can discuss basic personal finance topics.',
      'I can understand common tax and benefit vocabulary.',
      'I can ask for help with an administrative money issue.',
    ],
    examTask: 'Reading: identify action, amount, and deadline in a finance-related message.',
  }),
  lessonSpec({
    title: 'Media, information sources, and trust',
    goal: 'Discuss where you get information and how reliable it feels.',
    focus:
      'This topic brings B1 opinion language into a current everyday area without needing specialist vocabulary.',
    grammarNote:
      'Use balancing structures such as “å ena sidan ... å andra sidan ...” when comparing sources.',
    vocabulary: [
      v('källa', 'source', 'Det är viktigt att tänka på källan.', 'It is important to think about the source.'),
      v('pålitlig', 'reliable', 'Vilka källor är mest pålitliga?', 'Which sources are most reliable?'),
      v('sociala medier', 'social media', 'Jag använder sociala medier varje dag.', 'I use social media every day.'),
      v('nyhetsflöde', 'news feed', 'Mitt nyhetsflöde är fullt av olika ämnen.', 'My news feed is full of different topics.'),
      v('kontrollera', 'to check / verify', 'Jag försöker kontrollera informationen.', 'I try to verify the information.'),
    ],
    dialogue: [
      d('A', 'Var får du oftast dina nyheter ifrån?', 'Where do you most often get your news from?'),
      d('B', 'Från nätet, men jag försöker kontrollera källan.', 'From the internet, but I try to verify the source.'),
      d('A', 'Litar du på sociala medier?', 'Do you trust social media?'),
      d('B', 'Inte helt. Det beror på vem som delar informationen.', 'Not completely. It depends on who shares the information.'),
    ],
    practice: [
      'Compare two information sources.',
      'Explain how you decide if something is reliable.',
      'Give one advantage and one risk of social media.',
      'Write a short opinion text about media habits.',
    ],
    canDo: [
      'I can talk about information sources and trust.',
      'I can compare media habits with reasons.',
      'I can use opinion language in a more abstract topic.',
    ],
    examTask: 'Writing: discuss which information source you trust most and why.',
  }),
  lessonSpec({
    title: 'Environment, local issues, and public debate',
    goal: 'Discuss local environmental or community issues at B1 level.',
    focus:
      'This is useful practice for opinion-based YKI tasks because the topic allows examples, reasons, and solutions.',
    grammarNote:
      'For opinion tasks, use a three-part structure: problem, cause, suggestion.',
    vocabulary: [
      v('lokal', 'local', 'Det är en viktig lokal fråga.', 'It is an important local issue.'),
      v('förorening', 'pollution', 'Förorening påverkar hälsan.', 'Pollution affects health.'),
      v('trafik', 'traffic', 'Trafiken är för tät i centrum.', 'Traffic is too heavy in the center.'),
      v('lösning', 'solution', 'Vi behöver en långsiktig lösning.', 'We need a long-term solution.'),
      v('påverka', 'to affect / influence', 'Det påverkar alla som bor här.', 'It affects everyone who lives here.'),
    ],
    dialogue: [
      d('A', 'Vilken lokal fråga tycker du är viktigast?', 'Which local issue do you think is most important?'),
      d('B', 'Trafiken i centrum, eftersom den påverkar både buller och luft.', 'Traffic in the center, because it affects both noise and air.'),
      d('A', 'Vad skulle vara en bra lösning?', 'What would be a good solution?'),
      d('B', 'Bättre kollektivtrafik och fler cykelvägar.', 'Better public transport and more bike lanes.'),
    ],
    practice: [
      'Choose one local issue and explain why it matters.',
      'Suggest two realistic solutions.',
      'Practice linking cause and effect clearly.',
      'Write a short public-opinion paragraph.',
    ],
    canDo: [
      'I can discuss a local issue with reasons.',
      'I can suggest solutions in connected Swedish.',
      'I can handle a more abstract topic without losing structure.',
    ],
    examTask: 'Speaking: explain a local problem and suggest improvements.',
  }),
  lessonSpec({
    title: 'Culture, traditions, and comparison across countries',
    goal: 'Describe cultural habits and compare them respectfully.',
    focus:
      'Cultural comparison is common in conversations and allows rich but still familiar B1 production.',
    grammarNote:
      'Be careful with generalizations. Use softeners like “ofta”, “ibland”, and “i min erfarenhet”.',
    vocabulary: [
      v('tradition', 'tradition', 'Det är en viktig tradition.', 'It is an important tradition.'),
      v('högtid', 'holiday / celebration', 'Vilken högtid betyder mest för dig?', 'Which celebration means the most to you?'),
      v('likhet', 'similarity', 'Det finns många likheter.', 'There are many similarities.'),
      v('skillnad', 'difference', 'Den största skillnaden är maten.', 'The biggest difference is the food.'),
      v('vana', 'custom / habit', 'Det är en vanlig vana här.', 'It is a common habit here.'),
    ],
    dialogue: [
      d('A', 'Finns det stora skillnader mellan länderna för dig?', 'Are there big differences between the countries for you?'),
      d('B', 'Ja, särskilt när det gäller högtider och sociala vanor.', 'Yes, especially regarding celebrations and social habits.'),
      d('A', 'Finns det också likheter?', 'Are there similarities too?'),
      d('B', 'Absolut, familjen är viktig på båda ställena.', 'Absolutely, family is important in both places.'),
    ],
    practice: [
      'Compare one Finnish and one Indian or personal tradition.',
      'Use respectful comparison language.',
      'Explain one custom that surprised you.',
      'Write a short comparison text.',
    ],
    canDo: [
      'I can compare cultural habits carefully.',
      'I can describe traditions and their meaning.',
      'I can use comparison language in a more nuanced way.',
    ],
    examTask: 'Writing: compare two traditions and explain one difference that matters to you.',
  }),
  lessonSpec({
    title: 'Planning a project and dividing tasks',
    goal: 'Discuss goals, steps, responsibilities, and timelines.',
    focus:
      'Project talk strengthens structure, future language, and collaborative reasoning.',
    grammarNote:
      'Use “behöver”, “ska”, “ansvara för”, and time markers to keep plans concrete.',
    vocabulary: [
      v('projekt', 'project', 'Vi börjar ett nytt projekt nästa vecka.', 'We start a new project next week.'),
      v('steg', 'step', 'Första steget är att samla information.', 'The first step is to gather information.'),
      v('ansvarig', 'responsible', 'Vem är ansvarig för första delen?', 'Who is responsible for the first part?'),
      v('deadline', 'deadline', 'Deadline är ganska tight.', 'The deadline is fairly tight.'),
      v('resurs', 'resource', 'Vi behöver fler resurser.', 'We need more resources.'),
    ],
    dialogue: [
      d('A', 'Hur ska vi dela upp projektet?', 'How should we divide the project?'),
      d('B', 'Först måste vi bestämma stegen och vem som är ansvarig.', 'First we need to decide the steps and who is responsible.'),
      d('A', 'När är deadline?', 'When is the deadline?'),
      d('B', 'Om två veckor.', 'In two weeks.'),
    ],
    practice: [
      'Explain a project in steps.',
      'Assign tasks and deadlines in spoken Swedish.',
      'Negotiate one realistic timeline.',
      'Write a short project plan.',
    ],
    canDo: [
      'I can plan and explain a simple project.',
      'I can discuss responsibility and timing.',
      'I can use task language with clearer structure.',
    ],
    examTask: 'Speaking: explain how you would organize a small community project.',
  }),
  lessonSpec({
    title: 'Narrating events in order with detail',
    goal: 'Tell a fuller story with context, sequence, and result.',
    focus:
      'B1 storytelling needs not only order but also background, cause, and consequence.',
    grammarNote:
      'A useful narrative frame is: background, trigger, action, result, reflection.',
    vocabulary: [
      v('bakgrund', 'background', 'Lite bakgrund först.', 'A little background first.'),
      v('plötsligt', 'suddenly', 'Plötsligt ändrades allt.', 'Suddenly everything changed.'),
      v('reaktion', 'reaction', 'Min första reaktion var stress.', 'My first reaction was stress.'),
      v('konsekvens', 'consequence', 'Konsekvensen blev att jag kom sent.', 'The consequence was that I arrived late.'),
      v('lärdom', 'lesson learned', 'Jag lärde mig mycket av det.', 'I learned a lot from it.'),
    ],
    dialogue: [
      d('A', 'Kan du berätta vad som hände?', 'Can you tell what happened?'),
      d('B', 'Ja, först lite bakgrund. Jag var på väg till ett viktigt möte.', 'Yes, first a little background. I was on my way to an important meeting.'),
      d('A', 'Och sedan?', 'And then?'),
      d('B', 'Plötsligt blev tåget inställt, och konsekvensen blev att jag kom sent.', 'Suddenly the train was cancelled, and the consequence was that I arrived late.'),
    ],
    practice: [
      'Tell a complete story with five parts.',
      'Add one reflection or lesson learned at the end.',
      'Practice keeping the order clear.',
      'Write a 100-word event narrative.',
    ],
    canDo: [
      'I can narrate an event with more detail.',
      'I can connect cause, action, and result.',
      'I can make my story easier to follow.',
    ],
    examTask: 'Speaking: narrate an unexpected event and what you learned.',
  }),
  lessonSpec({
    title: 'Reasons, consequences, and explaining decisions',
    goal: 'Justify choices and explain outcomes more convincingly.',
    focus:
      'This lesson strengthens argument structure, which is central in B1 speaking and writing.',
    grammarNote:
      'Use clear logic markers: “eftersom”, “därför”, “så”, “resultatet blev att ...”.',
    vocabulary: [
      v('orsak', 'reason / cause', 'Den viktigaste orsaken var tiden.', 'The most important reason was time.'),
      v('beslut', 'decision', 'Det var ett svårt beslut.', 'It was a difficult decision.'),
      v('på grund av', 'because of', 'På grund av vädret stannade vi hemma.', 'Because of the weather we stayed home.'),
      v('följd', 'result / consequence', 'En följd blev högre kostnader.', 'A consequence was higher costs.'),
      v('motivera', 'to justify', 'Kan du motivera ditt val?', 'Can you justify your choice?'),
    ],
    dialogue: [
      d('A', 'Varför valde du den kursen?', 'Why did you choose that course?'),
      d('B', 'Främst på grund av schemat och lärarens fokus.', 'Mainly because of the schedule and the teacher’s focus.'),
      d('A', 'Vad blev följden av det valet?', 'What was the consequence of that choice?'),
      d('B', 'Att jag kunde studera mer regelbundet.', 'That I could study more regularly.'),
    ],
    practice: [
      'Explain three decisions you have made recently.',
      'Give a cause and a consequence for each.',
      'Use two different reason markers in one answer.',
      'Write a short decision-justification text.',
    ],
    canDo: [
      'I can justify choices more clearly.',
      'I can explain causes and consequences.',
      'I can build stronger spoken and written arguments.',
    ],
    examTask: 'Writing: explain a decision you made and why it was right for you.',
  }),
  lessonSpec({
    title: 'Comparing options and making recommendations',
    goal: 'Evaluate alternatives and recommend one solution.',
    focus:
      'Recommendation tasks are common because they reveal vocabulary, reasons, and overall clarity.',
    grammarNote:
      'A strong B1 answer compares first, then recommends with evidence.',
    vocabulary: [
      v('fördel', 'advantage', 'Det finns flera fördelar.', 'There are several advantages.'),
      v('nackdel', 'disadvantage', 'Den största nackdelen är priset.', 'The biggest disadvantage is the price.'),
      v('rekommendera', 'to recommend', 'Jag skulle rekommendera alternativ B.', 'I would recommend option B.'),
      v('passa bäst', 'suit best', 'Det passar bäst för familjer.', 'It suits families best.'),
      v('alternativ', 'alternative', 'Vilket alternativ föredrar du?', 'Which alternative do you prefer?'),
    ],
    dialogue: [
      d('A', 'Vilket alternativ rekommenderar du?', 'Which option do you recommend?'),
      d('B', 'Det andra, eftersom det är billigare och mer flexibelt.', 'The second one, because it is cheaper and more flexible.'),
      d('A', 'Finns det några nackdelar?', 'Are there any disadvantages?'),
      d('B', 'Ja, det tar lite längre tid.', 'Yes, it takes a little longer.'),
    ],
    practice: [
      'Compare two study methods or housing options.',
      'Give one recommendation with two reasons.',
      'Use “fördel” and “nackdel” explicitly.',
      'Write a 100-word recommendation text.',
    ],
    canDo: [
      'I can compare alternatives in a balanced way.',
      'I can recommend one option and justify it.',
      'I can structure evaluative language better.',
    ],
    examTask: 'Speaking: compare two options and recommend one clearly.',
  }),
  lessonSpec({
    title: 'Formal phone calls and spoken service interaction',
    goal: 'Handle longer phone calls with customer service or institutions.',
    focus:
      'Phone calls are hard because there is no visual support, so B1 needs deliberate training here.',
    grammarNote:
      'Use signposting when calling: reason for call, key details, request, confirmation.',
    vocabulary: [
      v('jag ringer angående', 'I am calling regarding', 'Jag ringer angående min bokning.', 'I am calling regarding my booking.'),
      v('koppla', 'to connect / transfer', 'Kan du koppla mig vidare?', 'Can you transfer me onward?'),
      v('upprepa', 'to repeat', 'Kan du upprepa sista delen?', 'Can you repeat the last part?'),
      v('bekräftelse', 'confirmation', 'Jag vill ha en bekräftelse via mejl.', 'I would like a confirmation by email.'),
      v('linjen', 'the line', 'Linjen är dålig idag.', 'The line is bad today.'),
    ],
    dialogue: [
      d('A', 'Hej, jag ringer angående min bokning nästa vecka.', 'Hi, I am calling regarding my booking next week.'),
      d('B', 'Självklart, kan du ge ditt namn?', 'Of course, can you give your name?'),
      d('A', 'Ja, och kan du också upprepa tiden?', 'Yes, and can you also repeat the time?'),
      d('B', 'Absolut, jag skickar en bekräftelse via mejl.', 'Absolutely, I will send a confirmation by email.'),
    ],
    practice: [
      'Make a full phone-call outline before speaking.',
      'Practice asking for repetition without panic.',
      'State key details clearly the first time.',
      'Role-play a service call and summarize it after.',
    ],
    canDo: [
      'I can manage a more formal phone call.',
      'I can ask for clarification while staying in Swedish.',
      'I can confirm details at the end of a call.',
    ],
    examTask: 'Listening and speaking: simulate a service call and note the agreed action.',
  }),
  lessonSpec({
    title: 'Formal emails, requests, and follow-up writing',
    goal: 'Write clearer B1 emails with purpose, context, and request.',
    focus:
      'B1 writing quality improves quickly when structure becomes predictable and reusable.',
    grammarNote:
      'A strong practical email has four parts: reason, context, request, closing.',
    vocabulary: [
      v('angående', 'regarding', 'Jag skriver angående min ansökan.', 'I am writing regarding my application.'),
      v('förtydliga', 'to clarify', 'Kan du förtydliga nästa steg?', 'Can you clarify the next step?'),
      v('uppföljning', 'follow-up', 'Detta är en uppföljning på mitt tidigare mejl.', 'This is a follow-up to my earlier email.'),
      v('vänligen', 'please / kindly', 'Vänligen återkom när du kan.', 'Please get back when you can.'),
      v('tacksam', 'grateful', 'Jag vore tacksam för ett svar.', 'I would be grateful for a response.'),
    ],
    dialogue: [
      d('A', 'Vad saknas i ditt mejl?', 'What is missing in your email?'),
      d('B', 'Jag måste förtydliga varför jag skriver.', 'I need to clarify why I am writing.'),
      d('A', 'Och efter det?', 'And after that?'),
      d('B', 'Sedan lägger jag min fråga och en tydlig avslutning.', 'Then I add my question and a clear closing.'),
    ],
    practice: [
      'Rewrite one short message as a more formal email.',
      'Add context, request, and follow-up sentence.',
      'Check that each paragraph has one clear function.',
      'Write a 100-word formal request.',
    ],
    canDo: [
      'I can write a clearer formal email.',
      'I can follow up on an earlier contact.',
      'I can make requests with better structure and tone.',
    ],
    examTask: 'Writing: compose a formal follow-up email requesting clarification.',
  }),
  lessonSpec({
    title: 'Numbers, trends, and simple statistics',
    goal: 'Describe simple figures, changes, and comparisons.',
    focus:
      'B1 tasks sometimes use numbers or trends, and many learners freeze when speaking about them.',
    grammarNote:
      'Keep it simple: level, change, comparison, possible reason.',
    vocabulary: [
      v('öka', 'to increase', 'Priset har ökat mycket.', 'The price has increased a lot.'),
      v('minska', 'to decrease', 'Kostnaden minskade lite.', 'The cost decreased a little.'),
      v('skillnad', 'difference', 'Det är stor skillnad mellan åren.', 'There is a big difference between the years.'),
      v('ungefär', 'approximately', 'Det kostar ungefär hundra euro.', 'It costs approximately one hundred euros.'),
      v('procent', 'percent', 'Andelen steg med tio procent.', 'The share rose by ten percent.'),
    ],
    dialogue: [
      d('A', 'Hur ser du på siffrorna?', 'How do you see the numbers?'),
      d('B', 'Det verkar som att kostnaderna har ökat medan användningen har minskat lite.', 'It seems that the costs have increased while the usage has decreased a little.'),
      d('A', 'Är skillnaden stor?', 'Is the difference big?'),
      d('B', 'Ja, ganska stor faktiskt.', 'Yes, fairly big actually.'),
    ],
    practice: [
      'Describe a simple chart in plain language.',
      'Use increase/decrease words with time references.',
      'Compare two figures and guess one reason.',
      'Write a short numeric summary.',
    ],
    canDo: [
      'I can describe simple changes in numbers.',
      'I can compare figures without overcomplicating the language.',
      'I can mention approximate amounts clearly.',
    ],
    examTask: 'Speaking: describe a simple trend from a chart in 60 seconds.',
  }),
  lessonSpec({
    title: 'Reading longer texts and extracting the main argument',
    goal: 'Read medium-length texts for main point, support, and tone.',
    focus:
      'B1 reading requires faster filtering, not perfect word-by-word understanding.',
    grammarNote:
      'Find the topic sentence, repeated vocabulary, and author position before translating unknown words.',
    vocabulary: [
      v('huvudidé', 'main idea', 'Vad är textens huvudidé?', 'What is the main idea of the text?'),
      v('argument', 'argument', 'Författaren har två tydliga argument.', 'The writer has two clear arguments.'),
      v('exempel', 'example', 'Vilket exempel använder texten?', 'Which example does the text use?'),
      v('ton', 'tone', 'Tonen känns ganska positiv.', 'The tone feels rather positive.'),
      v('slutsats', 'conclusion', 'Vad är textens slutsats?', 'What is the text’s conclusion?'),
    ],
    dialogue: [
      d('A', 'Förstod du allt i texten?', 'Did you understand everything in the text?'),
      d('B', 'Nej, men jag förstod huvudidén och slutsatsen.', 'No, but I understood the main idea and the conclusion.'),
      d('A', 'Räcker det först?', 'Is that enough at first?'),
      d('B', 'Ja, sedan kan jag gå tillbaka till detaljerna.', 'Yes, then I can go back to the details.'),
    ],
    practice: [
      'Read a text in two passes: fast overview, then detail check.',
      'Underline topic, argument, and conclusion.',
      'Summarize the text in four sentences.',
      'Note which unknown words were actually unnecessary.',
    ],
    canDo: [
      'I can read for main idea before details.',
      'I can identify a basic argument structure.',
      'I can summarize a longer text more efficiently.',
    ],
    examTask: 'Reading: summarize the main argument of a medium-length article.',
  }),
  lessonSpec({
    title: 'Listening for gist, detail, and speaker intention',
    goal: 'Improve listening strategy for longer spoken input.',
    focus:
      'Strong B1 listening depends on strategy: prediction, selective note-taking, and tolerance for unknown words.',
    grammarNote:
      'You do not need every word. Focus on purpose, speaker attitude, and repeated details.',
    vocabulary: [
      v('huvudpoäng', 'main point', 'Vad var huvudpoängen?', 'What was the main point?'),
      v('detalj', 'detail', 'Vilka detaljer hörde du?', 'Which details did you hear?'),
      v('avsikt', 'intention', 'Vad var talarens avsikt?', 'What was the speaker’s intention?'),
      v('sammanhang', 'context', 'Sammanhanget hjälper förståelsen.', 'Context helps understanding.'),
      v('nyckelord', 'keyword', 'Skriv bara nyckelord först.', 'Write only keywords first.'),
    ],
    dialogue: [
      d('A', 'Vad ska du lyssna efter först?', 'What should you listen for first?'),
      d('B', 'Huvudpoängen och sammanhanget.', 'The main point and the context.'),
      d('A', 'Och sedan?', 'And then?'),
      d('B', 'Sedan lyssnar jag efter några viktiga detaljer.', 'Then I listen for a few important details.'),
    ],
    practice: [
      'Predict topic before listening.',
      'Take keyword notes only on first listen.',
      'Listen again for one specific detail set: time, place, decision, reason.',
      'Summarize speaker intention in one sentence.',
    ],
    canDo: [
      'I can listen more strategically.',
      'I can separate main point from detail.',
      'I can summarize what a speaker wants or means.',
    ],
    examTask: 'Listening: note gist first, then add four supporting details.',
  }),
  lessonSpec({
    title: 'Discussion strategies and turn-taking',
    goal: 'Keep a conversation going, respond, and invite others in.',
    focus:
      'B1 speaking is interactive, not just monologue, so discussion management matters.',
    grammarNote:
      'Conversation can stay simple if the functions are strong: agree, disagree, ask back, summarize, and shift topic.',
    vocabulary: [
      v('vad tycker du?', 'what do you think?', 'Vad tycker du om det?', 'What do you think about that?'),
      v('jag håller med', 'I agree', 'Jag håller med till viss del.', 'I agree to some extent.'),
      v('inte riktigt', 'not really', 'Inte riktigt, jag ser det annorlunda.', 'Not really, I see it differently.'),
      v('utveckla', 'to develop / elaborate', 'Kan du utveckla det?', 'Can you elaborate on that?'),
      v('sammanfatta', 'to summarize', 'Om jag ska sammanfatta ...', 'If I am to summarize ...'),
    ],
    dialogue: [
      d('A', 'Vad tycker du om distansarbete?', 'What do you think about remote work?'),
      d('B', 'Jag håller med om att det är flexibelt, men inte alltid lätt socialt.', 'I agree that it is flexible, but it is not always easy socially.'),
      d('A', 'Kan du utveckla det?', 'Can you elaborate on that?'),
      d('B', 'Ja, man missar spontana samtal med kollegor.', 'Yes, you miss spontaneous conversations with colleagues.'),
    ],
    practice: [
      'Respond to an opinion with agreement plus nuance.',
      'Disagree politely and give one reason.',
      'Ask a follow-up question that keeps the discussion open.',
      'Practice a two-minute paired discussion outline.',
    ],
    canDo: [
      'I can manage turn-taking better.',
      'I can react to another person’s opinion.',
      'I can keep a discussion moving even with simple language.',
    ],
    examTask: 'Speaking: discuss a topic for two minutes using response phrases and follow-up questions.',
  }),
  lessonSpec({
    title: 'Disagreement, nuance, and polite argument',
    goal: 'Express disagreement clearly without sounding abrupt.',
    focus:
      'Polite disagreement is a core B1 skill because it combines language control with social tone.',
    grammarNote:
      'Use softeners: “jag är inte helt säker”, “jag ser det lite annorlunda”, “kanske beror det på ...”.',
    vocabulary: [
      v('jag är inte helt säker', 'I am not entirely sure', 'Jag är inte helt säker på det.', 'I am not entirely sure about that.'),
      v('annorlunda', 'differently', 'Jag ser det annorlunda.', 'I see it differently.'),
      v('delvis', 'partly', 'Jag håller med delvis.', 'I partly agree.'),
      v('perspektiv', 'perspective', 'Det beror på perspektiv.', 'It depends on perspective.'),
      v('resonemang', 'reasoning', 'Jag förstår ditt resonemang.', 'I understand your reasoning.'),
    ],
    dialogue: [
      d('A', 'Alla borde arbeta hemma mer.', 'Everyone should work from home more.'),
      d('B', 'Jag är inte helt säker. Det beror på jobbet och personen.', 'I am not entirely sure. It depends on the job and the person.'),
      d('A', 'Så du håller inte med?', 'So you do not agree?'),
      d('B', 'Jag håller med delvis, men inte helt.', 'I partly agree, but not completely.'),
    ],
    practice: [
      'Disagree with three statements politely.',
      'Use softeners before your main point.',
      'Acknowledge the other perspective first.',
      'Write a short balanced response to an opinion.',
    ],
    canDo: [
      'I can disagree more naturally and politely.',
      'I can express nuance instead of yes/no answers.',
      'I can sound more mature in discussion tasks.',
    ],
    examTask: 'Speaking: respond to an opinion with partial agreement and a counterpoint.',
  }),
  lessonSpec({
    title: 'Hypothetical situations and conditionals',
    goal: 'Discuss what you would do in imagined situations.',
    focus:
      'Hypothetical language often appears in speaking prompts and lets you show flexible thinking at B1.',
    grammarNote:
      'A practical B1 frame is “Om jag hade mer tid skulle jag ...”, but simpler “om ... så ...” answers are also fine.',
    vocabulary: [
      v('om jag kunde', 'if I could', 'Om jag kunde skulle jag resa mer.', 'If I could, I would travel more.'),
      v('skulle', 'would', 'Jag skulle välja det andra alternativet.', 'I would choose the other option.'),
      v('möjlighet', 'opportunity', 'Det skulle vara en bra möjlighet.', 'That would be a good opportunity.'),
      v('risk', 'risk', 'Det finns också en risk.', 'There is also a risk.'),
      v('i så fall', 'in that case', 'I så fall behöver vi mer tid.', 'In that case we need more time.'),
    ],
    dialogue: [
      d('A', 'Vad skulle du göra om du fick en extra ledig dag?', 'What would you do if you got an extra day off?'),
      d('B', 'Jag skulle vila först och sedan studera lite svenska i lugn och ro.', 'I would rest first and then study some Swedish calmly.'),
      d('A', 'Och om du hade mer pengar?', 'And if you had more money?'),
      d('B', 'I så fall skulle jag resa oftare.', 'In that case I would travel more often.'),
    ],
    practice: [
      'Answer five “what would you do if ...?” questions.',
      'Balance opportunity and risk in one answer.',
      'Use one conditional structure about study, work, and home.',
      'Write a short hypothetical paragraph.',
    ],
    canDo: [
      'I can respond to hypothetical prompts.',
      'I can use basic conditional language to explore options.',
      'I can sound more flexible in discussion tasks.',
    ],
    examTask: 'Speaking: explain what you would do in a practical hypothetical situation.',
  }),
  lessonSpec({
    title: 'Problem-case speaking simulation',
    goal: 'Handle a complex practical problem in a timed speaking task.',
    focus:
      'This lesson combines description, emotion, options, and decision-making under pressure.',
    grammarNote:
      'Use a simple emergency framework: state the problem, explain why it matters, suggest options, choose one.',
    vocabulary: [
      v('situation', 'situation', 'Situationen blev snabbt stressig.', 'The situation became stressful quickly.'),
      v('alternativ', 'alternative', 'Det finns två alternativ.', 'There are two alternatives.'),
      v('prioritera', 'to prioritize', 'Jag måste prioritera nu.', 'I need to prioritize now.'),
      v('lösa', 'to solve', 'Hur kan vi lösa det här?', 'How can we solve this?'),
      v('besluta', 'to decide', 'Vi måste besluta direkt.', 'We must decide immediately.'),
    ],
    dialogue: [
      d('A', 'Vad är det största problemet just nu?', 'What is the biggest problem right now?'),
      d('B', 'Att tiden är knapp och att vi saknar viktig information.', 'That time is short and we lack important information.'),
      d('A', 'Vilka alternativ finns?', 'What alternatives are there?'),
      d('B', 'Två realistiska alternativ, men jag föredrar det första.', 'Two realistic alternatives, but I prefer the first.'),
    ],
    practice: [
      'Do a two-minute timed answer with no notes after 30 seconds.',
      'State problem, options, and choice clearly.',
      'Reduce filler words and repetition.',
      'Listen back and note one content gap and one language gap.',
    ],
    canDo: [
      'I can manage a problem-solving speaking task.',
      'I can stay structured under time pressure.',
      'I can make a choice and justify it.',
    ],
    examTask: 'Speaking mock: solve a practical problem in two minutes.',
  }),
  lessonSpec({
    title: 'Opinion writing with structure and support',
    goal: 'Write a B1 opinion text with introduction, reasons, and conclusion.',
    focus:
      'Opinion writing is one of the most trainable B1 tasks because structure can be standardized.',
    grammarNote:
      'Use a three-part frame: opinion, two reasons/examples, short conclusion.',
    vocabulary: [
      v('enligt mig', 'in my opinion', 'Enligt mig behöver vi mer kollektivtrafik.', 'In my opinion we need more public transport.'),
      v('dessutom', 'in addition', 'Dessutom skulle det vara billigare.', 'In addition it would be cheaper.'),
      v('till exempel', 'for example', 'Till exempel sparar det tid.', 'For example it saves time.'),
      v('sammanfattningsvis', 'to summarize', 'Sammanfattningsvis tycker jag att ...', 'To summarize I think that ...'),
      v('argumentera', 'to argue', 'Jag vill argumentera tydligt.', 'I want to argue clearly.'),
    ],
    dialogue: [
      d('A', 'Hur bygger du din åsiktstext?', 'How do you build your opinion text?'),
      d('B', 'Först skriver jag min åsikt, sedan två skäl och ett kort slut.', 'First I write my opinion, then two reasons and a short ending.'),
      d('A', 'Och exempel?', 'And examples?'),
      d('B', 'Ja, minst ett konkret exempel.', 'Yes, at least one concrete example.'),
    ],
    practice: [
      'Write an opinion paragraph on a familiar topic.',
      'Add one concrete example for each main reason.',
      'Check that each paragraph has a clear function.',
      'Edit the text for repetition and missing connectors.',
    ],
    canDo: [
      'I can write a structured opinion text.',
      'I can support my view with reasons and examples.',
      'I can conclude without repeating the same sentence.',
    ],
    examTask: 'Writing: produce a 120-word opinion text with two reasons.',
  }),
  lessonSpec({
    title: 'Experience reports and reflective writing',
    goal: 'Write about an experience and what you learned from it.',
    focus:
      'Reflective writing is useful for personal prompts and encourages more natural B1 narrative language.',
    grammarNote:
      'Combine event narration with reflection using “det fick mig att ...”, “jag lärde mig att ...”.',
    vocabulary: [
      v('erfara', 'to experience', 'Jag har erfarit något liknande tidigare.', 'I have experienced something similar before.'),
      v('reflektera', 'to reflect', 'Efteråt reflekterade jag mycket.', 'Afterwards I reflected a lot.'),
      v('utmaning', 'challenge', 'Det var en stor utmaning.', 'It was a big challenge.'),
      v('utvecklas', 'to develop', 'Jag har utvecklats sedan dess.', 'I have developed since then.'),
      v('insikt', 'insight', 'Jag fick en viktig insikt.', 'I gained an important insight.'),
    ],
    dialogue: [
      d('A', 'Vad lärde du dig av situationen?', 'What did you learn from the situation?'),
      d('B', 'Att jag måste planera bättre och be om hjälp tidigare.', 'That I must plan better and ask for help earlier.'),
      d('A', 'Tror du att det hjälpte din utveckling?', 'Do you think it helped your development?'),
      d('B', 'Ja, absolut.', 'Yes, absolutely.'),
    ],
    practice: [
      'Write about one challenge, action, and lesson learned.',
      'Add one reflection sentence after the event description.',
      'Balance narrative and reflection.',
      'Read your text aloud to check flow.',
    ],
    canDo: [
      'I can write about experiences in a more thoughtful way.',
      'I can include reflection, not just facts.',
      'I can connect past events to present learning.',
    ],
    examTask: 'Writing: describe an experience and what it taught you.',
  }),
  lessonSpec({
    title: 'Applications, forms, and semi-formal production',
    goal: 'Complete semi-formal writing tasks with practical clarity.',
    focus:
      'This lesson blends official language with productive skills under a time limit.',
    grammarNote:
      'Semi-formal writing should be clear, concise, and complete, without trying to sound overly advanced.',
    vocabulary: [
      v('ansökningsblankett', 'application form', 'Ansökningsblanketten var lång.', 'The application form was long.'),
      v('uppgift', 'information / entry', 'Vilken uppgift saknas här?', 'What information is missing here?'),
      v('bifogad', 'attached', 'Dokumenten finns bifogade.', 'The documents are attached.'),
      v('kontaktperson', 'contact person', 'Vem är kontaktperson?', 'Who is the contact person?'),
      v('uppdaterad', 'updated', 'Här är den uppdaterade versionen.', 'Here is the updated version.'),
    ],
    dialogue: [
      d('A', 'Behöver du skicka fler uppgifter?', 'Do you need to send more information?'),
      d('B', 'Ja, en uppdaterad blankett och ett nytt dokument.', 'Yes, an updated form and a new document.'),
      d('A', 'Vet du vem kontaktpersonen är?', 'Do you know who the contact person is?'),
      d('B', 'Ja, nu vet jag det.', 'Yes, now I know.'),
    ],
    practice: [
      'Fill a mock form using Swedish labels.',
      'Write a short cover message for attached documents.',
      'Check that all requested information is included.',
      'Rewrite one vague sentence to make it precise.',
    ],
    canDo: [
      'I can produce clearer semi-formal practical writing.',
      'I can understand form-related requests.',
      'I can attach and reference supporting information properly.',
    ],
    examTask: 'Writing: respond to a practical application-related prompt.',
  }),
  lessonSpec({
    title: 'Listening mock strategies and recovery tactics',
    goal: 'Practice listening under mock conditions and improve recovery after misses.',
    focus:
      'At this stage, strategy training prevents one missed detail from damaging the whole task.',
    grammarNote:
      'No new grammar: the target is control, selective attention, and recovery.',
    vocabulary: [
      v('förutsäga', 'to predict', 'Jag försöker förutsäga ämnet först.', 'I try to predict the topic first.'),
      v('fokusera', 'to focus', 'Sedan fokuserar jag på nyckelorden.', 'Then I focus on the keywords.'),
      v('återhämta sig', 'to recover', 'Jag måste återhämta mig snabbt efter en miss.', 'I need to recover quickly after a miss.'),
      v('anteckning', 'note', 'Anteckningarna ska vara korta.', 'The notes should be short.'),
      v('signalord', 'signal word', 'Signalord hjälper mycket.', 'Signal words help a lot.'),
    ],
    dialogue: [
      d('A', 'Vad gör du när du missar en detalj?', 'What do you do when you miss a detail?'),
      d('B', 'Jag försöker återhämta mig direkt och lyssna efter nästa signalord.', 'I try to recover immediately and listen for the next signal word.'),
      d('A', 'Skriver du mycket?', 'Do you write a lot?'),
      d('B', 'Nej, bara korta anteckningar.', 'No, only short notes.'),
    ],
    practice: [
      'Do one listening run with note limits.',
      'Mark where you lost the thread and how you recovered.',
      'Listen for signposts like reason, result, change, next step.',
      'Summarize from notes only after the audio ends.',
    ],
    canDo: [
      'I can listen more strategically in mock conditions.',
      'I can recover after missing a detail.',
      'I can keep notes short and useful.',
    ],
    examTask: 'Listening mock: complete a full note-and-summary cycle.',
  }),
  lessonSpec({
    title: 'Reading mock strategies and time management',
    goal: 'Improve scanning, prioritization, and answer discipline in reading tasks.',
    focus:
      'Reading performance often improves through better process rather than better vocabulary alone.',
    grammarNote:
      'No new grammar: the target is reading sequence, answer discipline, and time allocation.',
    vocabulary: [
      v('skumma', 'to skim', 'Först skummar jag texten.', 'First I skim the text.'),
      v('sökläsa', 'to scan', 'Sedan sökläser jag efter detaljer.', 'Then I scan for details.'),
      v('tidsgräns', 'time limit', 'Jag behöver en tydlig tidsgräns.', 'I need a clear time limit.'),
      v('prioritera', 'to prioritize', 'Jag måste prioritera de lättare frågorna först.', 'I need to prioritize the easier questions first.'),
      v('bevis', 'evidence', 'Vilket bevis finns i texten?', 'What evidence is in the text?'),
    ],
    dialogue: [
      d('A', 'Hur börjar du med en längre text?', 'How do you start with a longer text?'),
      d('B', 'Jag skummar den först för att hitta ämne och struktur.', 'I skim it first to find the topic and structure.'),
      d('A', 'Och sedan?', 'And then?'),
      d('B', 'Sedan går jag tillbaka för detaljerna.', 'Then I go back for the details.'),
    ],
    practice: [
      'Time one skim pass and one detail pass.',
      'Answer only from text evidence, not guesswork from one word.',
      'Mark the lines that support each answer.',
      'Review where you spent too much time.',
    ],
    canDo: [
      'I can manage reading time better.',
      'I can separate scanning from detailed reading.',
      'I can support answers with evidence from the text.',
    ],
    examTask: 'Reading mock: complete a timed reading task with review notes.',
  }),
  lessonSpec({
    title: 'Speaking mock 1: familiar life and practical topics',
    goal: 'Simulate a timed speaking task on familiar B1 themes.',
    focus:
      'The aim is not perfect grammar but stable structure, sufficient detail, and recoverable fluency.',
    grammarNote:
      'Reuse the strongest frames you already know: opinion + reason, event + result, problem + solution.',
    vocabulary: [
      v('struktur', 'structure', 'Struktur hjälper mig att hålla fokus.', 'Structure helps me keep focus.'),
      v('flyt', 'fluency', 'Jag behöver lite mer flyt.', 'I need a little more fluency.'),
      v('paus', 'pause', 'En kort paus är okej.', 'A short pause is okay.'),
      v('omformulera', 'to rephrase', 'Jag försöker omformulera när ett ord saknas.', 'I try to rephrase when a word is missing.'),
      v('exempel', 'example', 'Ett konkret exempel hjälper mycket.', 'A concrete example helps a lot.'),
    ],
    dialogue: [
      d('A', 'Vad gör du om du glömmer ett ord?', 'What do you do if you forget a word?'),
      d('B', 'Jag gör en kort paus och försöker omformulera.', 'I take a short pause and try to rephrase.'),
      d('A', 'Vad hjälper mest annars?', 'What helps most otherwise?'),
      d('B', 'En tydlig struktur och ett konkret exempel.', 'A clear structure and a concrete example.'),
    ],
    practice: [
      'Do two timed answers on familiar topics.',
      'Use one example in every answer.',
      'Listen back for pauses longer than three seconds.',
      'Repeat the answer with a cleaner structure.',
    ],
    canDo: [
      'I can complete a timed familiar-topic speaking task.',
      'I can recover from missing vocabulary.',
      'I can improve the second version of an answer quickly.',
    ],
    examTask: 'Speaking mock: complete two familiar-topic monologues under time pressure.',
    durationMinutes: 95,
  }),
  lessonSpec({
    title: 'Speaking mock 2: opinions, comparison, and discussion',
    goal: 'Simulate a more demanding speaking task with evaluation and interaction.',
    focus:
      'This mock moves beyond description into judgement, comparison, and response.',
    grammarNote:
      'Prioritize interaction functions: compare, recommend, agree partly, ask back, conclude.',
    vocabulary: [
      v('värdera', 'to evaluate', 'Jag behöver värdera alternativen.', 'I need to evaluate the alternatives.'),
      v('jämförelse', 'comparison', 'En tydlig jämförelse hjälper lyssnaren.', 'A clear comparison helps the listener.'),
      v('slutsats', 'conclusion', 'Min slutsats är enkel.', 'My conclusion is simple.'),
      v('balanserad', 'balanced', 'Jag vill ge ett balanserat svar.', 'I want to give a balanced answer.'),
      v('vidare', 'further', 'Kan du utveckla det vidare?', 'Can you develop that further?'),
    ],
    dialogue: [
      d('A', 'Vilket alternativ passar bäst och varför?', 'Which option suits best and why?'),
      d('B', 'Det andra, men jag ser också två tydliga nackdelar.', 'The second, but I also see two clear disadvantages.'),
      d('A', 'Kan du utveckla det vidare?', 'Can you develop that further?'),
      d('B', 'Ja, främst handlar det om tid och kostnad.', 'Yes, it mainly concerns time and cost.'),
    ],
    practice: [
      'Do one comparison task and one discussion task.',
      'Give a recommendation plus two reasons.',
      'Respond to a challenge question without changing to English.',
      'End each answer with a short conclusion.',
    ],
    canDo: [
      'I can handle a more evaluative speaking task.',
      'I can discuss, compare, and conclude more clearly.',
      'I can stay balanced instead of giving a one-sided answer.',
    ],
    examTask: 'Speaking mock: comparison and discussion under timed conditions.',
    durationMinutes: 95,
  }),
  lessonSpec({
    title: 'Writing mock: practical message plus opinion text',
    goal: 'Complete two B1 writing tasks with timing and self-check.',
    focus:
      'The target is task completion, clarity, and enough support, not literary style.',
    grammarNote:
      'Leave three minutes for a final check: greeting, request, reason, connector, ending, agreement.',
    vocabulary: [
      v('utkast', 'draft', 'Först skriver jag ett snabbt utkast.', 'First I write a quick draft.'),
      v('bearbeta', 'to revise', 'Sedan bearbetar jag texten.', 'Then I revise the text.'),
      v('sammanhang', 'coherence', 'Jag kontrollerar sammanhanget.', 'I check the coherence.'),
      v('rubrik', 'heading', 'En tydlig rubrik hjälper.', 'A clear heading helps.'),
      v('slutkontroll', 'final check', 'Slutkontrollen fångar småfel.', 'The final check catches small mistakes.'),
    ],
    dialogue: [
      d('A', 'Vad gör du efter första utkastet?', 'What do you do after the first draft?'),
      d('B', 'Jag läser igenom texten och kontrollerar sammanhanget.', 'I read through the text and check the coherence.'),
      d('A', 'Hinner du en slutkontroll?', 'Do you have time for a final check?'),
      d('B', 'Ja, om jag håller mig till planen.', 'Yes, if I stick to the plan.'),
    ],
    practice: [
      'Write one practical message and one opinion text with a timer.',
      'Check that both tasks actually answer the prompt.',
      'Mark one sentence that could be clearer and rewrite it.',
      'Count whether you gave enough reasons or details.',
    ],
    canDo: [
      'I can complete two writing tasks within a time limit.',
      'I can revise for clarity and task completion.',
      'I can use a consistent final-check routine.',
    ],
    examTask: 'Writing mock: practical email plus short opinion text under exam timing.',
    durationMinutes: 100,
  }),
  lessonSpec({
    title: 'Integrated mock debrief and targeted repair',
    goal: 'Analyze recent mock performance and repair the patterns that still break under pressure.',
    focus:
      'This lesson turns mock results into action. Instead of doing another random review, isolate the exact speaking, writing, reading, and listening failures that repeat.',
    grammarNote:
      'Repair should target reusable frames: opinion + reason, practical request, event + result, comparison + recommendation.',
    vocabulary: [
      v('misstag', 'mistake', 'Jag vill förstå mina vanligaste misstag.', 'I want to understand my most common mistakes.'),
      v('mönster', 'pattern', 'Jag ser ett tydligt mönster nu.', 'I can see a clear pattern now.'),
      v('reparera', 'to repair / fix', 'Nu ska jag reparera svagheterna systematiskt.', 'Now I will repair the weaknesses systematically.'),
      v('prioritet', 'priority', 'Min första prioritet är muntligt flyt.', 'My first priority is spoken fluency.'),
      v('åtgärd', 'action', 'Vilken åtgärd hjälper mest direkt?', 'Which action helps most immediately?'),
    ],
    dialogue: [
      d('A', 'Vad visade mockprovet tydligast?', 'What did the mock test show most clearly?'),
      d('B', 'Att jag fortfarande tappar struktur när jag blir stressad.', 'That I still lose structure when I get stressed.'),
      d('A', 'Vad blir din första åtgärd?', 'What will be your first action?'),
      d('B', 'Att träna korta, stabila svar med bättre övergångar.', 'To practice short, stable answers with better transitions.'),
    ],
    practice: [
      'Review one recent speaking answer and mark where structure broke.',
      'Rewrite one writing answer with clearer task focus and connectors.',
      'List the three listening or reading signals you miss most often.',
      'Build a final two-day repair plan with only high-impact items.',
    ],
    canDo: [
      'I can identify repeated error patterns instead of reviewing randomly.',
      'I can prioritize the fixes that matter most before the test window.',
      'I can turn mock feedback into specific next actions.',
    ],
    examTask: 'Integrated mock repair: diagnose one weak point in each skill and create a targeted correction drill.',
    durationMinutes: 95,
  }),
  lessonSpec({
    title: 'Final consolidation and late-August test week',
    goal: 'Stabilize confidence, reduce overload, and enter the test period with clear routines.',
    focus:
      'The final week should sharpen retrieval and confidence, not introduce new topics.',
    grammarNote:
      'Trust high-frequency structures you can use well. Clear B1 Swedish beats ambitious but unstable Swedish.',
    vocabulary: [
      v('återblick', 'review / look back', 'En återblick hjälper mig att se framsteg.', 'A review helps me see progress.'),
      v('självförtroende', 'self-confidence', 'Mitt självförtroende är bättre nu.', 'My self-confidence is better now.'),
      v('lugn', 'calm', 'Jag vill vara lugn på provdagen.', 'I want to be calm on test day.'),
      v('förberedelse', 'preparation', 'Förberedelsen är snart klar.', 'The preparation is almost finished.'),
      v('genomföra', 'to carry out / complete', 'Jag kan genomföra uppgifterna steg för steg.', 'I can complete the tasks step by step.'),
    ],
    dialogue: [
      d('A', 'Hur känns det nu inför provet?', 'How does it feel now before the test?'),
      d('B', 'Jag känner mig lugnare och mer förberedd.', 'I feel calmer and more prepared.'),
      d('A', 'Vad ska du fokusera på sista dagarna?', 'What will you focus on in the last days?'),
      d('B', 'Repetition, sömn och korta mockar.', 'Review, sleep, and short mocks.'),
    ],
    practice: [
      'Review your strongest speaking openings and endings.',
      'Do one light reading and one light listening set without overloading.',
      'Write one final practical message and one short opinion paragraph.',
      'Prepare a calm pre-test routine for sleep, food, and travel.',
    ],
    canDo: [
      'I can enter the test period with a stable routine.',
      'I can trust my strongest Swedish structures under pressure.',
      'I can review strategically instead of cramming randomly.',
    ],
    examTask: 'Final mock selection: one short task from each skill plus a recovery plan for test day.',
    durationMinutes: 100,
  }),
];

const allLevelSpecs = [
  { id: 'A1', specs: a1Lessons },
  { id: 'A2', specs: a2Lessons },
  { id: 'B1', specs: b1Lessons },
];

function makeLesson({ day, levelId, spec }) {
  const legacyLesson = legacyBaseLessonsByDay.get(day) ?? null;
  const legacyResources = [
    ...(legacyLessonAdditionsByDay.get(day) ?? []),
    ...(legacyVocabularyGuideByDay.get(day) ?? []),
    ...(textbookResourcesByDay.get(day) ?? []),
  ];
  const mergedVocabulary = mergeVocabulary(
    spec.vocabulary,
    legacyLesson?.vocabulary ?? [],
    ...legacyResources.map((resource) => resource.vocabulary ?? []),
  );

  // A day is what you study: words, short grammar tips, dialogues and the
  // reference tables from the original course (alphabet, numbers, countries…).
  const companionSections = legacyLesson?.sections ?? [];
  const companionDialogue = companionSections.find((section) => section.dialogue);
  const companionTips = companionSections
    .filter((section) => section.heading === 'Grammar note')
    .flatMap((section) => section.content ?? []);

  return {
    day,
    level: levelId,
    title: spec.title,
    goal: spec.goal,
    vocabulary: mergedVocabulary,
    tips: [spec.grammarNote, ...companionTips].filter(
      (tip, index, tips) => tip && tips.indexOf(tip) === index,
    ),
    dialogues: [
      { title: spec.title, lines: spec.dialogue },
      ...(companionDialogue && legacyLesson.title !== spec.title
        ? [{ title: legacyLesson.title, lines: companionDialogue.dialogue }]
        : []),
    ],
    tables: companionSections
      .filter((section) => section.table && section.heading !== 'Core phrases')
      .map((section) => ({ heading: section.heading, rows: section.table })),
  };
}

const lessons = [];
const levels = [];
let currentDay = 1;

allLevelSpecs.forEach(({ id, specs }) => {
  const startDay = currentDay;
  const levelLessons = specs.map((spec) =>
    makeLesson({
      day: currentDay++,
      levelId: id,
      spec,
    }),
  );
  const endDay = currentDay - 1;

  levels.push({
    ...levelMeta[id],
    startDay,
    endDay,
    lessonCount: levelLessons.length,
    lessons: levelLessons.map((lesson) => ({ day: lesson.day, title: lesson.title })),
  });

  lessons.push(...levelLessons);
});

const ykiGrammarTopics = [
  {
    id: 'sounds-and-pronunciation',
    category: 'Pronunciation',
    title: 'Swedish vowels, stress, and intelligibility',
    summary:
      'Focus on Å, Ä, Ö, vowel length, and the rhythm that makes beginner Swedish easier to understand.',
    rules: [
      'Train mouth shape, not only spelling.',
      'Keep common chunks like “Jag mår bra” as sound units.',
      'Short and long vowel differences can change meaning quickly.',
    ],
    examples: [
      { swedish: 'Hej, hur mår du?', english: 'Hi, how are you?' },
      { swedish: 'Det är kallt ute.', english: 'It is cold outside.' },
    ],
    relatedDays: [1, 3, 15, 79],
  },
  {
    id: 'pronouns-and-basic-verbs',
    category: 'Core grammar',
    title: 'Pronouns and the highest-frequency verbs',
    summary:
      'Control of “jag, du, han, hon, vi, ni, de” plus verbs like vara, ha, göra, gå is essential for fluency.',
    rules: [
      'Learn pronoun + verb together in short phrases.',
      'Use “jag heter”, “jag bor”, “jag har”, “jag tycker” as reusable frames.',
      'Spoken “dom” often replaces written “de/dem”.',
    ],
    examples: [
      { swedish: 'Jag bor i Finland.', english: 'I live in Finland.' },
      { swedish: 'De har två barn.', english: 'They have two children.' },
    ],
    relatedDays: [2, 5, 13, 55],
  },
  {
    id: 'articles-and-nouns',
    category: 'Core grammar',
    title: 'Noun gender, articles, and basic noun phrases',
    summary:
      'Swedish nouns are easier when learned as full chunks with article and adjective, not as isolated words.',
    rules: [
      'Memorize “en/ett + noun” together.',
      'Notice definite forms such as “bilen”, “köket”, “lägenheten”.',
      'Adjectives change form depending on the noun phrase.',
    ],
    examples: [
      { swedish: 'en liten lägenhet', english: 'a small apartment' },
      { swedish: 'det stora bordet', english: 'the big table' },
    ],
    relatedDays: [6, 9, 25, 27],
  },
  {
    id: 'present-tense',
    category: 'Core grammar',
    title: 'Present tense for routines and facts',
    summary:
      'Present tense is the base for talking about routine, work, study, and future plans with time words.',
    rules: [
      'Most present forms are stable and reusable after a short period of drilling.',
      'Combine present tense with time phrases early.',
      'High-frequency verbs should become automatic in speech.',
    ],
    examples: [
      { swedish: 'Jag arbetar hemifrån idag.', english: 'I work from home today.' },
      { swedish: 'Vi träffas på fredag.', english: 'We meet on Friday.' },
    ],
    relatedDays: [7, 8, 16, 43],
  },
  {
    id: 'questions-and-v2',
    category: 'Sentence structure',
    title: 'Questions and verb-second word order',
    summary:
      'Swedish relies heavily on the verb-second principle, especially after time and place phrases.',
    rules: [
      'In main clauses the verb usually comes second.',
      'Questions and reordered sentences still keep a clear structure.',
      'Practice V2 inside useful patterns, not as an abstract rule only.',
    ],
    examples: [
      { swedish: 'På morgonen studerar jag svenska.', english: 'In the morning I study Swedish.' },
      { swedish: 'Var ligger banken?', english: 'Where is the bank?' },
    ],
    relatedDays: [10, 12, 36, 67],
  },
  {
    id: 'modals-and-polite-requests',
    category: 'Functional grammar',
    title: 'Modal verbs and polite request frames',
    summary:
      'Kan, vill, skulle, måste, får, and bör are central for service encounters, permissions, and rules.',
    rules: [
      'Use modals to soften requests and clarify obligation.',
      'Polite forms matter more than complex grammar in real service talk.',
      'Contrast permission, necessity, and preference clearly.',
    ],
    examples: [
      { swedish: 'Kan du repetera?', english: 'Can you repeat?' },
      { swedish: 'Jag skulle vilja boka en tid.', english: 'I would like to book an appointment.' },
    ],
    relatedDays: [3, 11, 29, 47, 67],
  },
  {
    id: 'past-tense',
    category: 'Time and narrative',
    title: 'Past tense for everyday narration',
    summary:
      'Past tense lets you explain events, routines from yesterday, and practical problems in time order.',
    rules: [
      'Start with the most frequent past forms and high-value chunks.',
      'Sequence markers often matter more than perfect verb accuracy.',
      'Past tense and perfect tense serve different functions; train both.',
    ],
    examples: [
      { swedish: 'Igår gick jag till jobbet.', english: 'Yesterday I went to work.' },
      { swedish: 'Först missade jag bussen.', english: 'First I missed the bus.' },
    ],
    relatedDays: [17, 39, 66, 77],
  },
  {
    id: 'perfect-tense',
    category: 'Time and narrative',
    title: 'Perfect tense for experience and present relevance',
    summary:
      'Perfect tense is useful for biography, work experience, and integration-related topics.',
    rules: [
      'Use har + supine for completed actions linked to the present.',
      'Pair perfect tense with “redan”, “ännu”, and duration phrases.',
      'Distinguish between life experience and one finished past event.',
    ],
    examples: [
      { swedish: 'Jag har bott i Finland i tre år.', english: 'I have lived in Finland for three years.' },
      { swedish: 'Jag har redan skickat mejlet.', english: 'I have already sent the email.' },
    ],
    relatedDays: [40, 56],
  },
  {
    id: 'future-and-intention',
    category: 'Time and planning',
    title: 'Future meaning, intentions, and planning',
    summary:
      'Swedish future meaning often stays simple and practical through time words and modal expressions.',
    rules: [
      'Present tense plus time word is often enough.',
      'Use ska and tänker for clearer intention when needed.',
      'Planning answers should include sequence and reason.',
    ],
    examples: [
      { swedish: 'Imorgon studerar jag hemma.', english: 'Tomorrow I study at home.' },
      { swedish: 'Jag tänker söka kursen.', english: 'I intend to apply for the course.' },
    ],
    relatedDays: [18, 41, 63, 74],
  },
  {
    id: 'connectors-and-subordination',
    category: 'Sentence structure',
    title: 'Connectors and subordinate clauses',
    summary:
      'Connected B1 Swedish depends on common linking words more than on advanced grammar terminology.',
    rules: [
      'Use because, when, if, although, and therefore actively.',
      'Check word order after opening clauses.',
      'Connected sentences should still stay short enough to control.',
    ],
    examples: [
      { swedish: 'När jag kommer hem lagar jag mat.', english: 'When I come home I cook.' },
      { swedish: 'Jag stannade hemma eftersom jag var sjuk.', english: 'I stayed home because I was sick.' },
    ],
    relatedDays: [42, 65, 72],
  },
  {
    id: 'comparison-and-opinion',
    category: 'Production',
    title: 'Comparison, opinion, and recommendation language',
    summary:
      'B1 answers become stronger when comparison and opinion phrases are easy to access.',
    rules: [
      'Compare first, then judge or recommend.',
      'Support opinions with at least one reason and one example.',
      'Softened disagreement sounds more natural than direct contradiction.',
    ],
    examples: [
      { swedish: 'Det här alternativet är bättre eftersom det är billigare.', english: 'This option is better because it is cheaper.' },
      { swedish: 'Jag håller med delvis, men ...', english: 'I partly agree, but ...' },
    ],
    relatedDays: [26, 57, 68, 73, 76],
  },
  {
    id: 'formal-writing',
    category: 'Writing',
    title: 'Formal and semi-formal writing patterns',
    summary:
      'Practical emails, requests, and short official texts are high-return preparation for YKI writing.',
    rules: [
      'State reason, context, request, and closing clearly.',
      'One idea per sentence is often enough.',
      'Leave time to check task completion and tone.',
    ],
    examples: [
      { swedish: 'Jag skriver angående min ansökan.', english: 'I am writing regarding my application.' },
      { swedish: 'Jag vore tacksam för ett svar.', english: 'I would be grateful for a response.' },
    ],
    relatedDays: [34, 46, 69, 78, 83],
  },
  {
    id: 'yki-strategies',
    category: 'Exam strategy',
    title: 'YKI task strategies for reading, listening, speaking, and writing',
    summary:
      'Retrieval practice, note control, timed output, and post-task review matter as much as new vocabulary in the final stretch.',
    rules: [
      'Predict topic before listening or reading.',
      'Answer the task directly before adding extra detail.',
      'Reuse strong structures rather than chasing rare words under pressure.',
    ],
    examples: [
      { swedish: 'Först skummar jag texten.', english: 'First I skim the text.' },
      { swedish: 'Om jag ska sammanfatta ...', english: 'If I am to summarize ...' },
    ],
    relatedDays: [24, 54, 79, 80, 81, 82, 83, 84],
  },
];

const legacyGrammarTopics = legacyEnhancements.grammarTopics.map((topic) => ({
  ...topic,
  sourceLabel: legacyEnhancements.sourceLabel,
  origin: 'legacy',
}));

const grammarTopics = [...ykiGrammarTopics, ...legacyGrammarTopics].reduce((topics, topic) => {
  if (topics.some((existingTopic) => existingTopic.id === topic.id)) {
    return topics;
  }

  topics.push(topic);
  return topics;
}, []);

const topics = parseTopics(path.resolve(__dirname, '../src/data/topics'));

// The topic files are B1 vocabulary, so each word group joins the B1 day on
// the closest subject. Every group must be placed exactly once.
const topicWordDays = {
  'samhalle-uppehallstillstand-och-medborgarskap': 52,
  'manniskan-och-omgivningen-biografi-viktiga-verb': 53,
  'manniskan-och-omgivningen-familj-och-relationer': 53,
  'halsa-och-valmaende-sjukdomar-och-symtom': 54,
  'arbete-och-utbildning-arbetsplatsen': 55,
  'samhalle-myndigheter-i-finland': 56,
  'manniskan-och-omgivningen-bostad-och-problem-i-hemmet': 57,
  'samhalle-skatt-forsakring-och-social-trygghet': 58,
  'fritid-och-hobbyer-nat-medier-och-underhallning': 59,
  'natur-och-miljo-atervinning-och-sopsortering': 60,
  'fritid-och-hobbyer-konst-och-kultur': 61,
  'manniskan-och-omgivningen-fest-och-firande': 61,
  'vardagsliv-rutiner-och-tid': 62,
  'natur-och-miljo-naturkatastrofer': 63,
  'arbete-och-utbildning-tre-uttryck-som-boken-ber-dig-anvanda': 64,
  'arbete-och-utbildning-utbildning-och-presentation': 64,
  'fritid-och-hobbyer-resa-och-semester': 65,
  'halsa-och-valmaende-vard-och-medicin': 66,
  'vardagsliv-att-handla': 67,
  'fritid-och-hobbyer-bibliotek-och-litteratur': 69,
  'vardagsliv-vagbeskrivning-och-trafik': 70,
  'manniskan-och-omgivningen-f-uttryck': 71,
  'vardagsliv-restaurang-och-kafe': 74,
  'vardagsliv-frisor-och-utseende': 74,
  'fritid-och-hobbyer-motion-och-idrott': 75,
  'halsa-och-valmaende-valmaende-och-kanslor': 76,
  'natur-och-miljo-arstider-och-vader': 80,
  'halsa-och-valmaende-kroppen': 80,
  'natur-och-miljo-naturen-i-finland': 81,
};

const groupIds = topics.flatMap((topic) => topic.wordGroups.map((group) => group.id));
const unplaced = groupIds.filter((id) => !(id in topicWordDays));
const unknown = Object.keys(topicWordDays).filter((id) => !groupIds.includes(id));
if (unplaced.length || unknown.length) {
  throw new Error(
    `Topic word groups and topicWordDays disagree.\nNot placed on a day: ${unplaced.join(', ') || '-'}\nNo such group: ${unknown.join(', ') || '-'}`,
  );
}

lessons.forEach((lesson) => {
  lesson.topicWords = [];
});
topics.forEach((topic) => {
  topic.wordGroups.forEach((group) => {
    const lesson = lessons.find((entry) => entry.day === topicWordDays[group.id]);
    const known = new Set(
      lesson.vocabulary.map((item) => `${item.swedish.toLowerCase()}::${item.english.toLowerCase()}`),
    );
    const words = group.words
      .filter((word) => !known.has(`${word.swedish.toLowerCase()}::${word.english.toLowerCase()}`))
      .map((word) => ({
        swedish: word.swedish,
        english: word.english,
        exampleSwedish: word.examples[0]?.sv ?? '',
        exampleEnglish: word.examples[0]?.en ?? '',
      }));
    lesson.topicWords.push({
      topicId: topic.id,
      topicNumber: topic.number,
      topicTitle: topic.title,
      title: group.title,
      titleEn: group.titleEn,
      words,
    });
  });
});

const course = {
  courseTitle: 'Swedish for YKI: A1 to B1',
  description:
    'Words and sentences for the YKI exam: 84 short daily lessons from A1 to B1, and 7 B1 exam topics.',
  levels,
  days: lessons,
  topics,
  grammarTopics,
};

fs.writeFileSync(outputPath, JSON.stringify(course, null, 2));
console.log(`Generated ${lessons.length} lessons and ${topics.length} topics in ${outputPath}`);
