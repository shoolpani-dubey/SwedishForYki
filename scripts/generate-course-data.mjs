import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../src/data/swedishA1Course.json');

const phaseByDay = (day) => {
  if (day <= 10) return 'Foundations';
  if (day <= 20) return 'Daily Life Basics';
  if (day <= 30) return 'Time and Town';
  if (day <= 40) return 'Grammar and Control';
  if (day <= 50) return 'Real-world Situations';
  return 'A1 Consolidation';
};

const makeTableFromVocab = (vocabulary) =>
  vocabulary.map((item) => ({
    Swedish: item.swedish,
    English: item.english,
    'Example Swedish': item.exampleSwedish,
    'Example English': item.exampleEnglish,
  }));

const makeExercises = (vocabulary) => {
  const items = vocabulary.slice(0, 4);
  return [
    {
      prompt: 'Translate these into English',
      items: items.map((item) => item.swedish),
      answers: items.map((item) => item.english),
    },
    {
      prompt: 'Translate these into Swedish',
      items: items.map((item) => item.english),
      answers: items.map((item) => item.swedish),
    },
  ];
};

const makeLesson = ({
  day,
  title,
  goal,
  focus,
  grammarNote,
  vocabulary,
  dialogue,
  sectionList,
  extraSections = [],
}) => ({
  day,
  title,
  phase: phaseByDay(day),
  durationMinutes: 60,
  goal,
  sections: [
    {
      heading: 'Lesson focus',
      content: [focus],
    },
    {
      heading: 'Core phrases',
      table: makeTableFromVocab(vocabulary),
    },
    {
      heading: 'Grammar note',
      content: [grammarNote],
    },
    ...(extraSections.length ? extraSections : []),
    {
      heading: 'Mini-dialogue',
      dialogue,
    },
    {
      heading: 'Speaking practice',
      list: sectionList,
    },
  ],
  vocabulary,
  exercises: makeExercises(vocabulary),
});

const lessons = [
  makeLesson({
    day: 1,
    title: 'Alphabet, pronunciation, greetings',
    goal: 'Learn Swedish letters Å, Ä, Ö, basic pronunciation, greetings, polite words, and a simple “How are you?” dialogue.',
    focus:
      'Start the course by learning the extra Swedish letters, greeting people politely, and answering a simple question about how you feel.',
    grammarNote:
      'Swedish often says “Jag mår bra” for “I am fine.” Literally it means “I feel well,” so do not replace it with “Jag är bra.”',
    vocabulary: [
      {
        swedish: 'hej',
        english: 'hi / hello',
        exampleSwedish: 'Hej, hur mår du?',
        exampleEnglish: 'Hi, how are you?',
      },
      {
        swedish: 'hejdå',
        english: 'goodbye',
        exampleSwedish: 'Hejdå, vi ses imorgon.',
        exampleEnglish: 'Goodbye, see you tomorrow.',
      },
      {
        swedish: 'hur mår du?',
        english: 'how are you?',
        exampleSwedish: 'Hur mår du idag?',
        exampleEnglish: 'How are you today?',
      },
      {
        swedish: 'jag mår bra',
        english: 'I am fine',
        exampleSwedish: 'Jag mår bra, tack.',
        exampleEnglish: 'I am fine, thanks.',
      },
      {
        swedish: 'tack',
        english: 'thanks',
        exampleSwedish: 'Tack så mycket!',
        exampleEnglish: 'Thank you very much!',
      },
      {
        swedish: 'varsågod',
        english: 'you are welcome / here you go',
        exampleSwedish: 'Varsågod, kaffet är klart.',
        exampleEnglish: 'Here you go, the coffee is ready.',
      },
    ],
    extraSections: [
      {
        heading: 'Swedish alphabet',
        table: [
          {
            Letter: 'Å å',
            'Approx sound': 'like the o in more',
          },
          {
            Letter: 'Ä ä',
            'Approx sound': 'like the e in bed',
          },
          {
            Letter: 'Ö ö',
            'Approx sound': 'round your lips and say e',
          },
        ],
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hej!', english: 'Hi!' },
      { speaker: 'B', swedish: 'Hej! Hur mår du?', english: 'Hi! How are you?' },
      { speaker: 'A', swedish: 'Jag mår bra, tack. Och du?', english: 'I am fine, thanks. And you?' },
      { speaker: 'B', swedish: 'Jag mår också bra.', english: 'I am also fine.' },
    ],
    sectionList: [
      'Say “Hej” and “Hejdå” five times.',
      'Practice “Hur mår du?” slowly, then at natural speed.',
      'Answer with “Jag mår bra, tack.”',
      'Read the mini-dialogue aloud twice.',
    ],
  }),
  makeLesson({
    day: 2,
    title: 'Saying your name and where you are from',
    goal: 'Introduce yourself, say your name, and tell someone where you are from.',
    focus:
      'Today you build your first self-introduction in Swedish: your name, your country, and a simple question back to the other person.',
    grammarNote:
      '“Jag heter” means “my name is.” To say where you are from, use “Jag kommer från ...” or “Jag är från ...” in simple beginner speech.',
    vocabulary: [
      {
        swedish: 'jag heter',
        english: 'my name is',
        exampleSwedish: 'Jag heter Shool.',
        exampleEnglish: 'My name is Shool.',
      },
      {
        swedish: 'jag kommer från',
        english: 'I come from',
        exampleSwedish: 'Jag kommer från Indien.',
        exampleEnglish: 'I come from India.',
      },
      {
        swedish: 'varifrån?',
        english: 'from where?',
        exampleSwedish: 'Varifrån kommer du?',
        exampleEnglish: 'Where are you from?',
      },
      {
        swedish: 'Sverige',
        english: 'Sweden',
        exampleSwedish: 'Hon kommer från Sverige.',
        exampleEnglish: 'She comes from Sweden.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hej! Jag heter Anna.', english: 'Hi! My name is Anna.' },
      { speaker: 'B', swedish: 'Hej! Jag heter Ravi.', english: 'Hi! My name is Ravi.' },
      { speaker: 'A', swedish: 'Varifrån kommer du?', english: 'Where are you from?' },
      { speaker: 'B', swedish: 'Jag kommer från Indien.', english: 'I come from India.' },
    ],
    sectionList: [
      'Say your full introduction aloud three times.',
      'Replace the country with your own country.',
      'Ask “Varifrån kommer du?” and answer it.',
      'Write two short introduction lines about yourself.',
    ],
  }),
  makeLesson({
    day: 3,
    title: 'Classroom phrases and polite requests',
    goal: 'Use basic classroom Swedish to ask for repetition, help, and clarification.',
    focus:
      'This lesson gives you survival Swedish for learning: asking someone to repeat, saying you do not understand, and asking what a word means.',
    grammarNote:
      '“Kan du ...?” means “Can you ...?” and is a useful polite frame for requests. “Jag förstår inte” means “I do not understand.”',
    vocabulary: [
      {
        swedish: 'jag förstår inte',
        english: 'I do not understand',
        exampleSwedish: 'Förlåt, jag förstår inte.',
        exampleEnglish: 'Sorry, I do not understand.',
      },
      {
        swedish: 'kan du repetera?',
        english: 'can you repeat?',
        exampleSwedish: 'Kan du repetera, tack?',
        exampleEnglish: 'Can you repeat, please?',
      },
      {
        swedish: 'vad betyder det?',
        english: 'what does that mean?',
        exampleSwedish: 'Vad betyder det på engelska?',
        exampleEnglish: 'What does that mean in English?',
      },
      {
        swedish: 'hjälp',
        english: 'help',
        exampleSwedish: 'Jag behöver hjälp.',
        exampleEnglish: 'I need help.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Förstår du?', english: 'Do you understand?' },
      { speaker: 'B', swedish: 'Inte riktigt. Kan du repetera?', english: 'Not really. Can you repeat?' },
      { speaker: 'A', swedish: 'Självklart.', english: 'Of course.' },
      { speaker: 'B', swedish: 'Tack! Vad betyder “från”?', english: 'Thanks! What does “från” mean?' },
    ],
    sectionList: [
      'Practice “Jag förstår inte” without translating in your head.',
      'Ask for repetition politely three times.',
      'Choose one Swedish word and ask what it means.',
      'Read the dialogue with a pause after each line.',
    ],
  }),
  makeLesson({
    day: 4,
    title: 'Numbers 0-20, age, and phone numbers',
    goal: 'Count from 0 to 20, say your age, and read simple numbers aloud.',
    focus:
      'Today you train Swedish numbers so you can say your age and begin hearing number patterns clearly.',
    grammarNote:
      'To say your age, Swedish uses “Jag är ... år.” The word “år” means “years old” in this context.',
    vocabulary: [
      {
        swedish: 'noll',
        english: 'zero',
        exampleSwedish: 'Numret börjar med noll.',
        exampleEnglish: 'The number starts with zero.',
      },
      {
        swedish: 'tio',
        english: 'ten',
        exampleSwedish: 'Jag har tio böcker.',
        exampleEnglish: 'I have ten books.',
      },
      {
        swedish: 'tjugo',
        english: 'twenty',
        exampleSwedish: 'Hon är tjugo år.',
        exampleEnglish: 'She is twenty years old.',
      },
      {
        swedish: 'år',
        english: 'years old / year',
        exampleSwedish: 'Jag är trettio år.',
        exampleEnglish: 'I am thirty years old.',
      },
    ],
    extraSections: [
      {
        heading: 'Number pattern',
        table: [
          { Swedish: 'ett, två, tre', English: 'one, two, three' },
          { Swedish: 'fyra, fem, sex', English: 'four, five, six' },
          { Swedish: 'sju, åtta, nio', English: 'seven, eight, nine' },
        ],
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur gammal är du?', english: 'How old are you?' },
      { speaker: 'B', swedish: 'Jag är trettio år.', english: 'I am thirty years old.' },
      { speaker: 'A', swedish: 'Vad är ditt telefonnummer?', english: 'What is your phone number?' },
      { speaker: 'B', swedish: 'Det börjar med noll sju.', english: 'It starts with zero seven.' },
    ],
    sectionList: [
      'Count from 0 to 20 twice.',
      'Say your age in Swedish three times.',
      'Read a phone number digit by digit.',
      'Test yourself by covering the English column.',
    ],
  }),
  makeLesson({
    day: 5,
    title: 'Countries, languages, and nationalities',
    goal: 'Name a few countries, languages, and nationalities in Swedish.',
    focus:
      'You will connect country names with the languages people speak and practice short identity sentences.',
    grammarNote:
      'After “Jag talar ...” use the language name, for example “Jag talar engelska.” Nationalities often change form depending on gender and number, so start by recognizing them.',
    vocabulary: [
      {
        swedish: 'engelska',
        english: 'English',
        exampleSwedish: 'Jag talar engelska.',
        exampleEnglish: 'I speak English.',
      },
      {
        swedish: 'svenska',
        english: 'Swedish',
        exampleSwedish: 'Jag lär mig svenska.',
        exampleEnglish: 'I am learning Swedish.',
      },
      {
        swedish: 'indisk',
        english: 'Indian',
        exampleSwedish: 'Han är indisk.',
        exampleEnglish: 'He is Indian.',
      },
      {
        swedish: 'språk',
        english: 'language',
        exampleSwedish: 'Vilket språk talar du?',
        exampleEnglish: 'Which language do you speak?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vilket språk talar du?', english: 'Which language do you speak?' },
      { speaker: 'B', swedish: 'Jag talar engelska och lite svenska.', english: 'I speak English and a little Swedish.' },
      { speaker: 'A', swedish: 'Var kommer du från?', english: 'Where are you from?' },
      { speaker: 'B', swedish: 'Jag kommer från Indien.', english: 'I come from India.' },
    ],
    sectionList: [
      'Say three languages you know or study.',
      'Make one sentence with “Jag talar ...”.',
      'Practice “lite svenska” for natural rhythm.',
      'Read the dialogue until it feels smooth.',
    ],
  }),
  makeLesson({
    day: 6,
    title: 'Subject pronouns',
    goal: 'Use the subject pronouns jag, du, han, hon, vi, ni, and de.',
    focus:
      'You are learning the basic people-words that appear in nearly every sentence in Swedish.',
    grammarNote:
      'Swedish subject pronouns usually stay before the verb in simple statements: “Jag bor här.” “Hon studerar.”',
    vocabulary: [
      {
        swedish: 'jag',
        english: 'I',
        exampleSwedish: 'Jag bor i Helsingfors.',
        exampleEnglish: 'I live in Helsinki.',
      },
      {
        swedish: 'du',
        english: 'you',
        exampleSwedish: 'Du talar tydligt.',
        exampleEnglish: 'You speak clearly.',
      },
      {
        swedish: 'vi',
        english: 'we',
        exampleSwedish: 'Vi lär oss svenska.',
        exampleEnglish: 'We are learning Swedish.',
      },
      {
        swedish: 'de',
        english: 'they',
        exampleSwedish: 'De kommer snart.',
        exampleEnglish: 'They are coming soon.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Bor du här?', english: 'Do you live here?' },
      { speaker: 'B', swedish: 'Ja, jag bor här.', english: 'Yes, I live here.' },
      { speaker: 'A', swedish: 'Och dina vänner?', english: 'And your friends?' },
      { speaker: 'B', swedish: 'De bor också här.', english: 'They also live here.' },
    ],
    sectionList: [
      'Read the pronouns aloud as a chain: jag, du, han, hon, vi, ni, de.',
      'Make one sentence with “jag” and one with “vi”.',
      'Switch a sentence from “jag” to “du”.',
      'Listen to your own pronunciation while reading the dialogue.',
    ],
  }),
  makeLesson({
    day: 7,
    title: 'Verb är: to be',
    goal: 'Use the verb är in basic statements and questions.',
    focus:
      'This lesson gives you one of the most important verbs in Swedish so you can describe identity, location, and simple facts.',
    grammarNote:
      'The present form is “är” for all persons: jag är, du är, vi är. Swedish does not change it like English does with am / is / are.',
    vocabulary: [
      {
        swedish: 'är',
        english: 'am / is / are',
        exampleSwedish: 'Jag är hemma.',
        exampleEnglish: 'I am at home.',
      },
      {
        swedish: 'student',
        english: 'student',
        exampleSwedish: 'Hon är student.',
        exampleEnglish: 'She is a student.',
      },
      {
        swedish: 'hemma',
        english: 'at home',
        exampleSwedish: 'Vi är hemma nu.',
        exampleEnglish: 'We are at home now.',
      },
      {
        swedish: 'trött',
        english: 'tired',
        exampleSwedish: 'Jag är trött idag.',
        exampleEnglish: 'I am tired today.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Är du student?', english: 'Are you a student?' },
      { speaker: 'B', swedish: 'Ja, jag är student.', english: 'Yes, I am a student.' },
      { speaker: 'A', swedish: 'Är du trött idag?', english: 'Are you tired today?' },
      { speaker: 'B', swedish: 'Lite, men jag mår bra.', english: 'A little, but I am fine.' },
    ],
    sectionList: [
      'Make three “Jag är ...” sentences.',
      'Ask one yes/no question with “Är du ...?”',
      'Replace “student” with your own role.',
      'Read the dialogue with clear stress on “är”.',
    ],
  }),
  makeLesson({
    day: 8,
    title: 'Simple sentence order',
    goal: 'Build short Swedish statements with subject + verb + extra information.',
    focus:
      'You now practice the default Swedish word order so your beginner sentences sound stable and clear.',
    grammarNote:
      'A safe beginner pattern is subject + verb + object/place/time: “Jag läser svenska hemma.” Keep that pattern until it feels automatic.',
    vocabulary: [
      {
        swedish: 'läser',
        english: 'read / study',
        exampleSwedish: 'Jag läser svenska varje dag.',
        exampleEnglish: 'I study Swedish every day.',
      },
      {
        swedish: 'jobbar',
        english: 'work',
        exampleSwedish: 'Han jobbar i stan.',
        exampleEnglish: 'He works in town.',
      },
      {
        swedish: 'hemma',
        english: 'at home',
        exampleSwedish: 'Jag pluggar hemma.',
        exampleEnglish: 'I study at home.',
      },
      {
        swedish: 'varje dag',
        english: 'every day',
        exampleSwedish: 'Vi övar varje dag.',
        exampleEnglish: 'We practice every day.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad gör du varje dag?', english: 'What do you do every day?' },
      { speaker: 'B', swedish: 'Jag läser svenska hemma.', english: 'I study Swedish at home.' },
      { speaker: 'A', swedish: 'Jobbar du också?', english: 'Do you also work?' },
      { speaker: 'B', swedish: 'Ja, jag jobbar i stan.', english: 'Yes, I work in town.' },
    ],
    sectionList: [
      'Write two sentences using subject + verb + place.',
      'Say one sentence with “varje dag”.',
      'Swap the verb in the model sentence.',
      'Read the dialogue and notice the basic order.',
    ],
  }),
  makeLesson({
    day: 9,
    title: 'Questions: what, who, where',
    goal: 'Ask and answer basic information questions.',
    focus:
      'You will use question words to keep a conversation going instead of only answering yes or no.',
    grammarNote:
      'Common question words are “vad” (what), “vem” (who), and “var” (where). In simple questions the verb usually comes before the subject.',
    vocabulary: [
      {
        swedish: 'vad',
        english: 'what',
        exampleSwedish: 'Vad heter du?',
        exampleEnglish: 'What is your name?',
      },
      {
        swedish: 'vem',
        english: 'who',
        exampleSwedish: 'Vem är han?',
        exampleEnglish: 'Who is he?',
      },
      {
        swedish: 'var',
        english: 'where',
        exampleSwedish: 'Var bor du?',
        exampleEnglish: 'Where do you live?',
      },
      {
        swedish: 'bor',
        english: 'live',
        exampleSwedish: 'Jag bor i Espoo.',
        exampleEnglish: 'I live in Espoo.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad heter du?', english: 'What is your name?' },
      { speaker: 'B', swedish: 'Jag heter Lina.', english: 'My name is Lina.' },
      { speaker: 'A', swedish: 'Var bor du?', english: 'Where do you live?' },
      { speaker: 'B', swedish: 'Jag bor i Uppsala.', english: 'I live in Uppsala.' },
    ],
    sectionList: [
      'Ask one question with “vad”, one with “vem”, and one with “var”.',
      'Answer using full sentences, not single words.',
      'Practice “Var bor du?” at natural speed.',
      'Read the dialogue aloud with correct question intonation.',
    ],
  }),
  makeLesson({
    day: 10,
    title: 'Review and speaking practice',
    goal: 'Review Days 1-9 and combine greetings, introductions, and basic questions.',
    focus:
      'This is the first consolidation day. You will recycle earlier material into one longer beginner conversation.',
    grammarNote:
      'Review days matter because A1 progress comes from reusing the same structures until they become quick and familiar.',
    vocabulary: [
      {
        swedish: 'också',
        english: 'also',
        exampleSwedish: 'Jag bor också här.',
        exampleEnglish: 'I also live here.',
      },
      {
        swedish: 'lite',
        english: 'a little',
        exampleSwedish: 'Jag talar lite svenska.',
        exampleEnglish: 'I speak a little Swedish.',
      },
      {
        swedish: 'nu',
        english: 'now',
        exampleSwedish: 'Jag är hemma nu.',
        exampleEnglish: 'I am at home now.',
      },
      {
        swedish: 'igen',
        english: 'again',
        exampleSwedish: 'Kan du säga det igen?',
        exampleEnglish: 'Can you say that again?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hej! Jag heter Sara. Vad heter du?', english: 'Hi! My name is Sara. What is your name?' },
      { speaker: 'B', swedish: 'Jag heter Amir. Jag kommer från Iran.', english: 'My name is Amir. I come from Iran.' },
      { speaker: 'A', swedish: 'Var bor du nu?', english: 'Where do you live now?' },
      { speaker: 'B', swedish: 'Jag bor i Stockholm och jag talar lite svenska.', english: 'I live in Stockholm and I speak a little Swedish.' },
    ],
    sectionList: [
      'Introduce yourself for 30 seconds without looking.',
      'Ask and answer three questions from earlier days.',
      'Repeat one line until you can say it smoothly.',
      'Record yourself if possible and listen back once.',
    ],
  }),
  makeLesson({
    day: 11,
    title: 'Family words',
    goal: 'Talk about close family members and ask simple family questions.',
    focus:
      'Today you learn the most common family words so you can describe the people around you.',
    grammarNote:
      'To ask “Do you have ...?” use “Har du ...?” and answer with “Ja, jag har ...” or “Nej, jag har inte ...”.',
    vocabulary: [
      {
        swedish: 'familj',
        english: 'family',
        exampleSwedish: 'Min familj bor i Indien.',
        exampleEnglish: 'My family lives in India.',
      },
      {
        swedish: 'mamma',
        english: 'mother',
        exampleSwedish: 'Min mamma heter Anita.',
        exampleEnglish: 'My mother is called Anita.',
      },
      {
        swedish: 'pappa',
        english: 'father',
        exampleSwedish: 'Min pappa jobbar hemma.',
        exampleEnglish: 'My father works at home.',
      },
      {
        swedish: 'syskon',
        english: 'siblings',
        exampleSwedish: 'Jag har två syskon.',
        exampleEnglish: 'I have two siblings.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Har du syskon?', english: 'Do you have siblings?' },
      { speaker: 'B', swedish: 'Ja, jag har en syster.', english: 'Yes, I have a sister.' },
      { speaker: 'A', swedish: 'Var bor din familj?', english: 'Where does your family live?' },
      { speaker: 'B', swedish: 'Min familj bor i Delhi.', english: 'My family lives in Delhi.' },
    ],
    sectionList: [
      'Say four family words aloud.',
      'Make one sentence with “min mamma” and one with “min pappa”.',
      'Answer “Har du syskon?” with a full sentence.',
      'Read the dialogue and replace the city with your own.',
    ],
  }),
  makeLesson({
    day: 12,
    title: 'Possessives: my, your, his, her',
    goal: 'Use possessive words to talk about people and things that belong to someone.',
    focus:
      'You are learning to attach ownership to nouns, which makes your Swedish much more personal and precise.',
    grammarNote:
      'Common possessives are “min / mitt / mina” for my and “din / ditt / dina” for your. At this stage, recognize the forms and use common chunks like “min familj”.',
    vocabulary: [
      {
        swedish: 'min',
        english: 'my',
        exampleSwedish: 'Min bok är här.',
        exampleEnglish: 'My book is here.',
      },
      {
        swedish: 'din',
        english: 'your',
        exampleSwedish: 'Vad heter din lärare?',
        exampleEnglish: 'What is your teacher called?',
      },
      {
        swedish: 'hans',
        english: 'his',
        exampleSwedish: 'Hans telefon är ny.',
        exampleEnglish: 'His phone is new.',
      },
      {
        swedish: 'hennes',
        english: 'her',
        exampleSwedish: 'Hennes vän är svensk.',
        exampleEnglish: 'Her friend is Swedish.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Är det din bok?', english: 'Is that your book?' },
      { speaker: 'B', swedish: 'Ja, det är min bok.', english: 'Yes, it is my book.' },
      { speaker: 'A', swedish: 'Vem är han?', english: 'Who is he?' },
      { speaker: 'B', swedish: 'Han är hennes bror.', english: 'He is her brother.' },
    ],
    sectionList: [
      'Point at three objects and say “min ...” or “din ...”.',
      'Say one example with “hans” and one with “hennes”.',
      'Answer the dialogue without reading the English.',
      'Notice that possessives come before the noun.',
    ],
  }),
  makeLesson({
    day: 13,
    title: 'Jobs and studies',
    goal: 'Say what you do, where you study, or what kind of work you have.',
    focus:
      'This lesson helps you answer one of the most common small-talk questions: what you do.',
    grammarNote:
      'Use “Jag är ...” for professions in simple introductions and “Jag studerar ...” or “Jag jobbar som ...” for more detail.',
    vocabulary: [
      {
        swedish: 'lärare',
        english: 'teacher',
        exampleSwedish: 'Hon är lärare.',
        exampleEnglish: 'She is a teacher.',
      },
      {
        swedish: 'ingenjör',
        english: 'engineer',
        exampleSwedish: 'Han är ingenjör.',
        exampleEnglish: 'He is an engineer.',
      },
      {
        swedish: 'student',
        english: 'student',
        exampleSwedish: 'Jag är student.',
        exampleEnglish: 'I am a student.',
      },
      {
        swedish: 'jobbar som',
        english: 'work as',
        exampleSwedish: 'Jag jobbar som designer.',
        exampleEnglish: 'I work as a designer.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad jobbar du med?', english: 'What do you work with?' },
      { speaker: 'B', swedish: 'Jag jobbar som ingenjör.', english: 'I work as an engineer.' },
      { speaker: 'A', swedish: 'Studerar du också svenska?', english: 'Do you also study Swedish?' },
      { speaker: 'B', swedish: 'Ja, jag är student på kvällstid.', english: 'Yes, I am a student in the evenings.' },
    ],
    sectionList: [
      'Say your own work or study sentence three times.',
      'Practice “Jag jobbar som ...”.',
      'Ask someone “Vad jobbar du med?”',
      'Read the dialogue and switch the profession.',
    ],
  }),
  makeLesson({
    day: 14,
    title: 'Common verbs in present tense',
    goal: 'Use a small set of common present-tense verbs in short sentences.',
    focus:
      'You are moving from fixed phrases toward flexible sentence building with common everyday verbs.',
    grammarNote:
      'In the present tense, many Swedish verbs end in -r: bor, läser, skriver, talar. Learn them as whole forms first.',
    vocabulary: [
      {
        swedish: 'bor',
        english: 'live',
        exampleSwedish: 'Jag bor nära centrum.',
        exampleEnglish: 'I live near the center.',
      },
      {
        swedish: 'talar',
        english: 'speak',
        exampleSwedish: 'Hon talar svenska.',
        exampleEnglish: 'She speaks Swedish.',
      },
      {
        swedish: 'skriver',
        english: 'write',
        exampleSwedish: 'Vi skriver ett meddelande.',
        exampleEnglish: 'We write a message.',
      },
      {
        swedish: 'dricker',
        english: 'drink',
        exampleSwedish: 'Jag dricker kaffe.',
        exampleEnglish: 'I drink coffee.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Dricker du kaffe?', english: 'Do you drink coffee?' },
      { speaker: 'B', swedish: 'Ja, jag dricker kaffe varje morgon.', english: 'Yes, I drink coffee every morning.' },
      { speaker: 'A', swedish: 'Skriver du på svenska?', english: 'Do you write in Swedish?' },
      { speaker: 'B', swedish: 'Lite grann, jag skriver enkla meningar.', english: 'A little, I write simple sentences.' },
    ],
    sectionList: [
      'Make one sentence with each verb.',
      'Read the verbs aloud and notice the final -r sound.',
      'Ask two yes/no questions using the verbs.',
      'Rebuild the dialogue with your own answers.',
    ],
  }),
  makeLesson({
    day: 15,
    title: 'Likes and dislikes',
    goal: 'Say what you like and do not like in Swedish.',
    focus:
      'Today you add opinions to your Swedish so you can talk about food, hobbies, and language learning preferences.',
    grammarNote:
      'Use “Jag gillar ...” for “I like ...” and “Jag gillar inte ...” for “I do not like ...”. The negation comes after the verb.',
    vocabulary: [
      {
        swedish: 'jag gillar',
        english: 'I like',
        exampleSwedish: 'Jag gillar kaffe.',
        exampleEnglish: 'I like coffee.',
      },
      {
        swedish: 'jag gillar inte',
        english: 'I do not like',
        exampleSwedish: 'Jag gillar inte te.',
        exampleEnglish: 'I do not like tea.',
      },
      {
        swedish: 'musik',
        english: 'music',
        exampleSwedish: 'Jag gillar svensk musik.',
        exampleEnglish: 'I like Swedish music.',
      },
      {
        swedish: 'film',
        english: 'film / movie',
        exampleSwedish: 'Hon gillar svensk film.',
        exampleEnglish: 'She likes Swedish film.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Gillar du svensk musik?', english: 'Do you like Swedish music?' },
      { speaker: 'B', swedish: 'Ja, jag gillar svensk musik.', english: 'Yes, I like Swedish music.' },
      { speaker: 'A', swedish: 'Gillar du te?', english: 'Do you like tea?' },
      { speaker: 'B', swedish: 'Nej, jag gillar inte te.', english: 'No, I do not like tea.' },
    ],
    sectionList: [
      'Say three things you like.',
      'Say two things you do not like.',
      'Practice the difference between “gillar” and “gillar inte”.',
      'Answer the dialogue with your real preferences.',
    ],
  }),
  makeLesson({
    day: 16,
    title: 'Food and drinks',
    goal: 'Recognize and use common food and drink words in short sentences.',
    focus:
      'This vocabulary lesson prepares you for cafés, restaurants, and everyday talk about meals.',
    grammarNote:
      'When naming food in basic speech, short noun phrases are enough: “en kaffe” is common in cafés, although “en kopp kaffe” is more literal.',
    vocabulary: [
      {
        swedish: 'kaffe',
        english: 'coffee',
        exampleSwedish: 'Jag vill ha kaffe.',
        exampleEnglish: 'I want coffee.',
      },
      {
        swedish: 'te',
        english: 'tea',
        exampleSwedish: 'Hon dricker te.',
        exampleEnglish: 'She drinks tea.',
      },
      {
        swedish: 'bröd',
        english: 'bread',
        exampleSwedish: 'Vi köper färskt bröd.',
        exampleEnglish: 'We buy fresh bread.',
      },
      {
        swedish: 'vatten',
        english: 'water',
        exampleSwedish: 'Kan jag få vatten?',
        exampleEnglish: 'Can I get water?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad vill du ha?', english: 'What would you like?' },
      { speaker: 'B', swedish: 'Jag vill ha kaffe och bröd.', english: 'I would like coffee and bread.' },
      { speaker: 'A', swedish: 'Något att dricka mer?', english: 'Anything else to drink?' },
      { speaker: 'B', swedish: 'Ja, ett glas vatten.', english: 'Yes, a glass of water.' },
    ],
    sectionList: [
      'Name four food or drink items from memory.',
      'Say “Jag vill ha ...” with two different items.',
      'Ask for water politely.',
      'Read the café dialogue twice.',
    ],
  }),
  makeLesson({
    day: 17,
    title: 'Ordering in a café',
    goal: 'Order simple items in a café and understand basic service phrases.',
    focus:
      'You will combine food vocabulary with polite requests in a realistic café exchange.',
    grammarNote:
      'A very useful pattern is “Jag skulle vilja ha ...” for a polite “I would like ...”, but “Jag vill ha ...” is acceptable at beginner level.',
    vocabulary: [
      {
        swedish: 'jag skulle vilja ha',
        english: 'I would like',
        exampleSwedish: 'Jag skulle vilja ha en kaffe.',
        exampleEnglish: 'I would like a coffee.',
      },
      {
        swedish: 'meny',
        english: 'menu',
        exampleSwedish: 'Kan jag få menyn?',
        exampleEnglish: 'Can I get the menu?',
      },
      {
        swedish: 'nota',
        english: 'bill',
        exampleSwedish: 'Kan vi få notan?',
        exampleEnglish: 'Can we get the bill?',
      },
      {
        swedish: 'utan',
        english: 'without',
        exampleSwedish: 'Kaffe utan socker, tack.',
        exampleEnglish: 'Coffee without sugar, please.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hej, vad får det lov att vara?', english: 'Hello, what would you like?' },
      { speaker: 'B', swedish: 'Jag skulle vilja ha en kaffe utan socker.', english: 'I would like a coffee without sugar.' },
      { speaker: 'A', swedish: 'Något mer?', english: 'Anything else?' },
      { speaker: 'B', swedish: 'Ja, kan jag få notan senare?', english: 'Yes, can I get the bill later?' },
    ],
    sectionList: [
      'Order one drink and one snack aloud.',
      'Practice “utan” with sugar or milk.',
      'Ask for the bill politely.',
      'Read the dialogue and play both roles.',
    ],
  }),
  makeLesson({
    day: 18,
    title: 'en and ett nouns',
    goal: 'Recognize the two Swedish noun genders and use them in simple phrases.',
    focus:
      'Swedish nouns are often learned with en or ett. This lesson helps you treat the article as part of the word.',
    grammarNote:
      'There is no perfect rule for en and ett at A1 level, so memorize common noun phrases like “en bok” and “ett hus.”',
    vocabulary: [
      {
        swedish: 'en bok',
        english: 'a book',
        exampleSwedish: 'Jag läser en bok.',
        exampleEnglish: 'I am reading a book.',
      },
      {
        swedish: 'ett hus',
        english: 'a house',
        exampleSwedish: 'Det är ett stort hus.',
        exampleEnglish: 'It is a big house.',
      },
      {
        swedish: 'en stol',
        english: 'a chair',
        exampleSwedish: 'Här är en stol.',
        exampleEnglish: 'Here is a chair.',
      },
      {
        swedish: 'ett bord',
        english: 'a table',
        exampleSwedish: 'Boken ligger på ett bord.',
        exampleEnglish: 'The book is on a table.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Är det en bok?', english: 'Is it a book?' },
      { speaker: 'B', swedish: 'Ja, det är en bok.', english: 'Yes, it is a book.' },
      { speaker: 'A', swedish: 'Och där borta?', english: 'And over there?' },
      { speaker: 'B', swedish: 'Det är ett bord och en stol.', english: 'It is a table and a chair.' },
    ],
    sectionList: [
      'Read each noun together with en or ett.',
      'Make two sentences with object words around you.',
      'Do not memorize the noun without its article.',
      'Use the dialogue as a pointing exercise in your room.',
    ],
  }),
  makeLesson({
    day: 19,
    title: 'Plurals introduction',
    goal: 'Recognize and use a few common plural forms.',
    focus:
      'You are taking the first step into Swedish plural nouns so you can talk about more than one thing.',
    grammarNote:
      'Swedish plural patterns vary, so begin with high-frequency pairs such as bok / böcker and stol / stolar.',
    vocabulary: [
      {
        swedish: 'böcker',
        english: 'books',
        exampleSwedish: 'Jag har två böcker.',
        exampleEnglish: 'I have two books.',
      },
      {
        swedish: 'stolar',
        english: 'chairs',
        exampleSwedish: 'Det finns fyra stolar här.',
        exampleEnglish: 'There are four chairs here.',
      },
      {
        swedish: 'barn',
        english: 'children',
        exampleSwedish: 'Barnen leker ute.',
        exampleEnglish: 'The children are playing outside.',
      },
      {
        swedish: 'många',
        english: 'many',
        exampleSwedish: 'Vi har många frågor.',
        exampleEnglish: 'We have many questions.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur många böcker har du?', english: 'How many books do you have?' },
      { speaker: 'B', swedish: 'Jag har många böcker.', english: 'I have many books.' },
      { speaker: 'A', swedish: 'Finns det stolar här?', english: 'Are there chairs here?' },
      { speaker: 'B', swedish: 'Ja, det finns fyra stolar.', english: 'Yes, there are four chairs.' },
    ],
    sectionList: [
      'Say singular and plural pairs aloud.',
      'Make one sentence with a number and one plural noun.',
      'Practice “många” with two different nouns.',
      'Read the dialogue and stress the plural endings.',
    ],
  }),
  makeLesson({
    day: 20,
    title: 'Review and roleplay',
    goal: 'Review family, food, and noun basics with short roleplays.',
    focus:
      'This review day mixes people, objects, and café language so you can start switching topics naturally.',
    grammarNote:
      'Roleplay is useful because it forces you to retrieve language quickly instead of only recognizing it.',
    vocabulary: [
      {
        swedish: 'fråga',
        english: 'question',
        exampleSwedish: 'Jag har en fråga.',
        exampleEnglish: 'I have a question.',
      },
      {
        swedish: 'svar',
        english: 'answer',
        exampleSwedish: 'Det är mitt svar.',
        exampleEnglish: 'That is my answer.',
      },
      {
        swedish: 'snabbt',
        english: 'quickly',
        exampleSwedish: 'Kan du svara snabbt?',
        exampleEnglish: 'Can you answer quickly?',
      },
      {
        swedish: 'tillsammans',
        english: 'together',
        exampleSwedish: 'Vi övar tillsammans.',
        exampleEnglish: 'We practice together.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Ska vi öva tillsammans?', english: 'Shall we practice together?' },
      { speaker: 'B', swedish: 'Ja, ställ en fråga.', english: 'Yes, ask a question.' },
      { speaker: 'A', swedish: 'Vad vill du ha på kaféet?', english: 'What would you like at the café?' },
      { speaker: 'B', swedish: 'Jag skulle vilja ha kaffe och bröd.', english: 'I would like coffee and bread.' },
    ],
    sectionList: [
      'Do a one-minute self-introduction from memory.',
      'Ask three questions from previous lessons.',
      'Roleplay a café or classroom exchange.',
      'Repeat weak vocabulary aloud five times.',
    ],
  }),
  makeLesson({
    day: 21,
    title: 'Days of the week',
    goal: 'Say the days of the week and talk about simple weekly routines.',
    focus:
      'You will learn calendar vocabulary that helps you speak about plans, work, and study habits.',
    grammarNote:
      'To say “on Monday” Swedish often uses just the day word in context, but “på måndag” means “on Monday / this coming Monday.”',
    vocabulary: [
      {
        swedish: 'måndag',
        english: 'Monday',
        exampleSwedish: 'Jag studerar svenska på måndag.',
        exampleEnglish: 'I study Swedish on Monday.',
      },
      {
        swedish: 'onsdag',
        english: 'Wednesday',
        exampleSwedish: 'Vi har lektion på onsdag.',
        exampleEnglish: 'We have class on Wednesday.',
      },
      {
        swedish: 'fredag',
        english: 'Friday',
        exampleSwedish: 'Jag jobbar hemma på fredag.',
        exampleEnglish: 'I work at home on Friday.',
      },
      {
        swedish: 'helg',
        english: 'weekend',
        exampleSwedish: 'På helgen vilar jag.',
        exampleEnglish: 'On the weekend I rest.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'När studerar du svenska?', english: 'When do you study Swedish?' },
      { speaker: 'B', swedish: 'Jag studerar på måndag och onsdag.', english: 'I study on Monday and Wednesday.' },
      { speaker: 'A', swedish: 'Vad gör du på fredag?', english: 'What do you do on Friday?' },
      { speaker: 'B', swedish: 'Jag jobbar och sedan vilar jag på helgen.', english: 'I work and then I rest on the weekend.' },
    ],
    sectionList: [
      'Say all seven days in order.',
      'Describe your study days in Swedish.',
      'Practice “på måndag” and “på fredag”.',
      'Read the dialogue and replace the days.',
    ],
  }),
  makeLesson({
    day: 22,
    title: 'Months and dates',
    goal: 'Recognize common month names and say simple dates.',
    focus:
      'Today you build calendar control so you can speak about birthdays, meetings, and seasons.',
    grammarNote:
      'Dates in Swedish are often said with ordinal-like forms in speech, but at A1 level it is fine to recognize and read simple dates slowly.',
    vocabulary: [
      {
        swedish: 'januari',
        english: 'January',
        exampleSwedish: 'Kursen börjar i januari.',
        exampleEnglish: 'The course starts in January.',
      },
      {
        swedish: 'maj',
        english: 'May',
        exampleSwedish: 'Det är ljust i maj.',
        exampleEnglish: 'It is bright in May.',
      },
      {
        swedish: 'augusti',
        english: 'August',
        exampleSwedish: 'Vi reser i augusti.',
        exampleEnglish: 'We travel in August.',
      },
      {
        swedish: 'datum',
        english: 'date',
        exampleSwedish: 'Vilket datum är det idag?',
        exampleEnglish: 'What is the date today?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'När fyller du år?', english: 'When is your birthday?' },
      { speaker: 'B', swedish: 'I maj.', english: 'In May.' },
      { speaker: 'A', swedish: 'Vilket datum är mötet?', english: 'What is the date of the meeting?' },
      { speaker: 'B', swedish: 'Det är den tolfte augusti.', english: 'It is on the twelfth of August.' },
    ],
    sectionList: [
      'Say three months that matter to you.',
      'Practice asking for today’s date.',
      'Read a sample date slowly and clearly.',
      'Repeat the dialogue and change the month.',
    ],
  }),
  makeLesson({
    day: 23,
    title: 'Telling time',
    goal: 'Ask for and say simple times in Swedish.',
    focus:
      'You need time language for meetings, classes, transport, and daily routine questions.',
    grammarNote:
      'A practical beginner structure is “Klockan är ...” for “The time is ...” and “När börjar ...?” for asking when something starts.',
    vocabulary: [
      {
        swedish: 'klockan är',
        english: 'the time is',
        exampleSwedish: 'Klockan är tre.',
        exampleEnglish: 'The time is three.',
      },
      {
        swedish: 'halv',
        english: 'half (before the next hour)',
        exampleSwedish: 'Klockan är halv tre.',
        exampleEnglish: 'It is half past two / half to three in Swedish style.',
      },
      {
        swedish: 'börjar',
        english: 'starts',
        exampleSwedish: 'Lektionen börjar klockan nio.',
        exampleEnglish: 'The lesson starts at nine o’clock.',
      },
      {
        swedish: 'sen',
        english: 'late',
        exampleSwedish: 'Jag är sen idag.',
        exampleEnglish: 'I am late today.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad är klockan?', english: 'What time is it?' },
      { speaker: 'B', swedish: 'Klockan är halv tre.', english: 'It is half past two / Swedish half three.' },
      { speaker: 'A', swedish: 'När börjar lektionen?', english: 'When does the lesson start?' },
      { speaker: 'B', swedish: 'Den börjar klockan tre.', english: 'It starts at three.' },
    ],
    sectionList: [
      'Practice full hours first, then half hours.',
      'Ask “Vad är klockan?” three times.',
      'Say when your lesson or work starts.',
      'Read the dialogue and focus on “halv”.',
    ],
  }),
  makeLesson({
    day: 24,
    title: 'Daily routine',
    goal: 'Describe your day using common routine verbs.',
    focus:
      'This lesson lets you speak about waking up, working, eating, and sleeping in simple sequence.',
    grammarNote:
      'To describe routine, combine time words with present verbs: “Jag vaknar klockan sju. Sedan äter jag frukost.”',
    vocabulary: [
      {
        swedish: 'vaknar',
        english: 'wake up',
        exampleSwedish: 'Jag vaknar klockan sju.',
        exampleEnglish: 'I wake up at seven.',
      },
      {
        swedish: 'äter frukost',
        english: 'eat breakfast',
        exampleSwedish: 'Vi äter frukost hemma.',
        exampleEnglish: 'We eat breakfast at home.',
      },
      {
        swedish: 'börjar jobba',
        english: 'start work',
        exampleSwedish: 'Jag börjar jobba klockan nio.',
        exampleEnglish: 'I start work at nine.',
      },
      {
        swedish: 'sover',
        english: 'sleep',
        exampleSwedish: 'Barnen sover tidigt.',
        exampleEnglish: 'The children sleep early.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'När vaknar du?', english: 'When do you wake up?' },
      { speaker: 'B', swedish: 'Jag vaknar klockan sju och äter frukost.', english: 'I wake up at seven and eat breakfast.' },
      { speaker: 'A', swedish: 'När börjar du jobba?', english: 'When do you start work?' },
      { speaker: 'B', swedish: 'Jag börjar jobba klockan nio.', english: 'I start work at nine.' },
    ],
    sectionList: [
      'Describe your morning in three sentences.',
      'Use one time expression in each sentence.',
      'Practice “sedan” silently between actions if it helps sequencing.',
      'Read the dialogue with your real routine.',
    ],
  }),
  makeLesson({
    day: 25,
    title: 'Shopping vocabulary',
    goal: 'Use basic shopping words for clothes, sizes, and buying things.',
    focus:
      'You will learn how to identify things in a shop and ask basic questions about them.',
    grammarNote:
      'Polite shopping questions often begin with “Har ni ...?” meaning “Do you have ...?” when talking to a shop assistant.',
    vocabulary: [
      {
        swedish: 'butik',
        english: 'shop / store',
        exampleSwedish: 'Det finns en butik här.',
        exampleEnglish: 'There is a shop here.',
      },
      {
        swedish: 'storlek',
        english: 'size',
        exampleSwedish: 'Vilken storlek har du?',
        exampleEnglish: 'What size do you have?',
      },
      {
        swedish: 'tröja',
        english: 'sweater / shirt',
        exampleSwedish: 'Jag gillar den här tröjan.',
        exampleEnglish: 'I like this sweater.',
      },
      {
        swedish: 'köpa',
        english: 'buy',
        exampleSwedish: 'Jag vill köpa skor.',
        exampleEnglish: 'I want to buy shoes.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Kan jag hjälpa dig?', english: 'Can I help you?' },
      { speaker: 'B', swedish: 'Ja, jag vill köpa en tröja.', english: 'Yes, I want to buy a sweater.' },
      { speaker: 'A', swedish: 'Vilken storlek?', english: 'What size?' },
      { speaker: 'B', swedish: 'Medium, tack.', english: 'Medium, thanks.' },
    ],
    sectionList: [
      'Name three things you might buy.',
      'Ask a shop if they have your size.',
      'Practice “Jag vill köpa ...”.',
      'Read the dialogue like a real shop exchange.',
    ],
  }),
  makeLesson({
    day: 26,
    title: 'Prices and money',
    goal: 'Ask about prices and understand simple money language.',
    focus:
      'Price questions are essential for shops, cafés, and transport. This lesson gives you the minimum set.',
    grammarNote:
      'Use “Hur mycket kostar det?” for “How much does it cost?” Swedish currency is kronor, often spoken as “kronor” or “spänn” informally.',
    vocabulary: [
      {
        swedish: 'hur mycket kostar det?',
        english: 'how much does it cost?',
        exampleSwedish: 'Hur mycket kostar det här?',
        exampleEnglish: 'How much does this cost?',
      },
      {
        swedish: 'krona',
        english: 'krona',
        exampleSwedish: 'Det kostar femtio kronor.',
        exampleEnglish: 'It costs fifty kronor.',
      },
      {
        swedish: 'billig',
        english: 'cheap',
        exampleSwedish: 'Den här är billig.',
        exampleEnglish: 'This one is cheap.',
      },
      {
        swedish: 'dyr',
        english: 'expensive',
        exampleSwedish: 'Den är för dyr.',
        exampleEnglish: 'It is too expensive.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur mycket kostar tröjan?', english: 'How much does the sweater cost?' },
      { speaker: 'B', swedish: 'Den kostar trehundra kronor.', english: 'It costs three hundred kronor.' },
      { speaker: 'A', swedish: 'Okej, den är lite dyr.', english: 'Okay, it is a little expensive.' },
      { speaker: 'B', swedish: 'Den blå är billigare.', english: 'The blue one is cheaper.' },
    ],
    sectionList: [
      'Ask about the price of two imaginary items.',
      'Say one item is cheap and one is expensive.',
      'Practice the word “kronor”.',
      'Read the dialogue and replace the item name.',
    ],
  }),
  makeLesson({
    day: 27,
    title: 'Asking for help',
    goal: 'Ask for help politely in public places.',
    focus:
      'This lesson gives you useful emergency and support language for everyday situations.',
    grammarNote:
      'A strong survival frame is “Kan du hjälpa mig?” meaning “Can you help me?” Add “ursäkta” first to sound polite.',
    vocabulary: [
      {
        swedish: 'kan du hjälpa mig?',
        english: 'can you help me?',
        exampleSwedish: 'Ursäkta, kan du hjälpa mig?',
        exampleEnglish: 'Excuse me, can you help me?',
      },
      {
        swedish: 'jag letar efter',
        english: 'I am looking for',
        exampleSwedish: 'Jag letar efter stationen.',
        exampleEnglish: 'I am looking for the station.',
      },
      {
        swedish: 'problem',
        english: 'problem',
        exampleSwedish: 'Jag har ett problem.',
        exampleEnglish: 'I have a problem.',
      },
      {
        swedish: 'kan du visa mig?',
        english: 'can you show me?',
        exampleSwedish: 'Kan du visa mig vägen?',
        exampleEnglish: 'Can you show me the way?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Ursäkta, kan du hjälpa mig?', english: 'Excuse me, can you help me?' },
      { speaker: 'B', swedish: 'Ja, självklart.', english: 'Yes, of course.' },
      { speaker: 'A', swedish: 'Jag letar efter stationen.', english: 'I am looking for the station.' },
      { speaker: 'B', swedish: 'Jag kan visa dig vägen.', english: 'I can show you the way.' },
    ],
    sectionList: [
      'Practice the full help request slowly and clearly.',
      'Replace “stationen” with another place.',
      'Say one sentence with “Jag har ett problem.”',
      'Read the dialogue and switch roles.',
    ],
  }),
  makeLesson({
    day: 28,
    title: 'Directions and places in town',
    goal: 'Understand and give simple directions in a town.',
    focus:
      'You will learn place words and directional language useful for maps, streets, and asking for locations.',
    grammarNote:
      'Common direction phrases are “till höger” (to the right), “till vänster” (to the left), and “rakt fram” (straight ahead).',
    vocabulary: [
      {
        swedish: 'station',
        english: 'station',
        exampleSwedish: 'Stationen ligger nära centrum.',
        exampleEnglish: 'The station is near the center.',
      },
      {
        swedish: 'till höger',
        english: 'to the right',
        exampleSwedish: 'Sväng till höger här.',
        exampleEnglish: 'Turn right here.',
      },
      {
        swedish: 'till vänster',
        english: 'to the left',
        exampleSwedish: 'Biblioteket ligger till vänster.',
        exampleEnglish: 'The library is on the left.',
      },
      {
        swedish: 'rakt fram',
        english: 'straight ahead',
        exampleSwedish: 'Gå rakt fram i två minuter.',
        exampleEnglish: 'Go straight ahead for two minutes.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Var ligger stationen?', english: 'Where is the station?' },
      { speaker: 'B', swedish: 'Gå rakt fram och sväng till höger.', english: 'Go straight ahead and turn right.' },
      { speaker: 'A', swedish: 'Är den långt bort?', english: 'Is it far away?' },
      { speaker: 'B', swedish: 'Nej, den ligger nära.', english: 'No, it is nearby.' },
    ],
    sectionList: [
      'Point and say right, left, and straight ahead.',
      'Give directions from your home to one nearby place.',
      'Practice “Var ligger ...?”',
      'Read the dialogue and follow the route with your hand.',
    ],
  }),
  makeLesson({
    day: 29,
    title: 'Transport vocabulary',
    goal: 'Talk about buses, trains, tickets, and simple travel plans.',
    focus:
      'Transport language helps you move independently and understand basic travel conversations.',
    grammarNote:
      'To say how you travel, use “Jag åker ...” plus transport: “Jag åker buss.” “Jag åker tåg.”',
    vocabulary: [
      {
        swedish: 'buss',
        english: 'bus',
        exampleSwedish: 'Jag åker buss till jobbet.',
        exampleEnglish: 'I take the bus to work.',
      },
      {
        swedish: 'tåg',
        english: 'train',
        exampleSwedish: 'Tåget går klockan sex.',
        exampleEnglish: 'The train leaves at six.',
      },
      {
        swedish: 'biljett',
        english: 'ticket',
        exampleSwedish: 'Jag behöver en biljett.',
        exampleEnglish: 'I need a ticket.',
      },
      {
        swedish: 'avgår',
        english: 'departs',
        exampleSwedish: 'Bussen avgår snart.',
        exampleEnglish: 'The bus departs soon.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur åker du till stan?', english: 'How do you get to town?' },
      { speaker: 'B', swedish: 'Jag åker buss.', english: 'I take the bus.' },
      { speaker: 'A', swedish: 'Har du biljett?', english: 'Do you have a ticket?' },
      { speaker: 'B', swedish: 'Ja, men tåget avgår snart.', english: 'Yes, but the train departs soon.' },
    ],
    sectionList: [
      'Say how you travel to one place.',
      'Ask for a ticket in Swedish.',
      'Practice “avgår snart”.',
      'Read the dialogue and replace bus with train.',
    ],
  }),
  makeLesson({
    day: 30,
    title: 'Review and mini test',
    goal: 'Review time, routines, shopping, and transport with short recall tasks.',
    focus:
      'This review day checks how well you can switch between routine language and outside-the-home situations.',
    grammarNote:
      'At this stage, fluency comes from recall speed. Short self-tests are more useful than rereading everything passively.',
    vocabulary: [
      {
        swedish: 'minnas',
        english: 'remember',
        exampleSwedish: 'Jag försöker minnas orden.',
        exampleEnglish: 'I try to remember the words.',
      },
      {
        swedish: 'glömma',
        english: 'forget',
        exampleSwedish: 'Ibland glömmer jag ett ord.',
        exampleEnglish: 'Sometimes I forget a word.',
      },
      {
        swedish: 'test',
        english: 'test',
        exampleSwedish: 'Idag gör vi ett litet test.',
        exampleEnglish: 'Today we do a small test.',
      },
      {
        swedish: 'redo',
        english: 'ready',
        exampleSwedish: 'Är du redo?',
        exampleEnglish: 'Are you ready?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Är du redo för ett litet test?', english: 'Are you ready for a small test?' },
      { speaker: 'B', swedish: 'Ja, jag försöker minnas allt.', english: 'Yes, I am trying to remember everything.' },
      { speaker: 'A', swedish: 'Hur kommer du till jobbet?', english: 'How do you get to work?' },
      { speaker: 'B', swedish: 'Jag åker buss klockan åtta.', english: 'I take the bus at eight.' },
    ],
    sectionList: [
      'Answer ten old questions without opening previous days.',
      'Describe one weekday routine.',
      'Roleplay a shop or transport situation.',
      'Repeat weak answers until they come quickly.',
    ],
  }),
  makeLesson({
    day: 31,
    title: 'Present tense verbs',
    goal: 'Strengthen your control of present tense with more frequent verbs.',
    focus:
      'You already know some present-tense verbs. Today you expand that set so you can talk more freely.',
    grammarNote:
      'Keep learning verbs as ready-to-use present forms first. Later you can study infinitives and verb classes in more detail.',
    vocabulary: [
      {
        swedish: 'går',
        english: 'go / walk',
        exampleSwedish: 'Jag går till skolan.',
        exampleEnglish: 'I walk to school.',
      },
      {
        swedish: 'kommer',
        english: 'come',
        exampleSwedish: 'Hon kommer sent.',
        exampleEnglish: 'She comes late.',
      },
      {
        swedish: 'ser',
        english: 'see',
        exampleSwedish: 'Vi ser filmen ikväll.',
        exampleEnglish: 'We are watching the film tonight.',
      },
      {
        swedish: 'hör',
        english: 'hear',
        exampleSwedish: 'Jag hör dig tydligt.',
        exampleEnglish: 'I hear you clearly.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Går du till jobbet?', english: 'Do you walk to work?' },
      { speaker: 'B', swedish: 'Nej, jag kommer med buss.', english: 'No, I come by bus.' },
      { speaker: 'A', swedish: 'Hör du läraren?', english: 'Do you hear the teacher?' },
      { speaker: 'B', swedish: 'Ja, och jag ser tavlan också.', english: 'Yes, and I see the board too.' },
    ],
    sectionList: [
      'Make one sentence with each verb.',
      'Ask one question using “går” and one using “ser”.',
      'Notice that these verbs are short but common.',
      'Read the dialogue and personalize the travel answer.',
    ],
  }),
  makeLesson({
    day: 32,
    title: 'Word order in statements',
    goal: 'Practice stable word order in simple Swedish statements.',
    focus:
      'Today you train the backbone of Swedish sentences so your statements stay natural when they get longer.',
    grammarNote:
      'A strong beginner default is time or subject first, then the verb in second position: “Idag studerar jag svenska.” “Jag studerar svenska idag.”',
    vocabulary: [
      {
        swedish: 'idag',
        english: 'today',
        exampleSwedish: 'Idag jobbar jag hemma.',
        exampleEnglish: 'Today I work at home.',
      },
      {
        swedish: 'imorgon',
        english: 'tomorrow',
        exampleSwedish: 'Imorgon studerar vi mer.',
        exampleEnglish: 'Tomorrow we study more.',
      },
      {
        swedish: 'sedan',
        english: 'then',
        exampleSwedish: 'Sedan äter jag middag.',
        exampleEnglish: 'Then I eat dinner.',
      },
      {
        swedish: 'ibland',
        english: 'sometimes',
        exampleSwedish: 'Ibland läser jag sent.',
        exampleEnglish: 'Sometimes I study late.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad gör du idag?', english: 'What are you doing today?' },
      { speaker: 'B', swedish: 'Idag jobbar jag hemma.', english: 'Today I work at home.' },
      { speaker: 'A', swedish: 'Och imorgon?', english: 'And tomorrow?' },
      { speaker: 'B', swedish: 'Imorgon studerar jag svenska.', english: 'Tomorrow I study Swedish.' },
    ],
    sectionList: [
      'Start three sentences with a time word.',
      'Keep the verb near the beginning of the sentence.',
      'Say one sentence with “ibland”.',
      'Read the dialogue and pay attention to verb position.',
    ],
  }),
  makeLesson({
    day: 33,
    title: 'Word order in questions',
    goal: 'Build yes/no questions and information questions more confidently.',
    focus:
      'You are practicing the switch that happens in Swedish questions, where the verb often comes before the subject.',
    grammarNote:
      'Compare “Du bor här.” with “Bor du här?” For question-word questions, the question word comes first: “Var bor du?”',
    vocabulary: [
      {
        swedish: 'bor du ...?',
        english: 'do you live ...?',
        exampleSwedish: 'Bor du i stan?',
        exampleEnglish: 'Do you live in town?',
      },
      {
        swedish: 'har du ...?',
        english: 'do you have ...?',
        exampleSwedish: 'Har du syskon?',
        exampleEnglish: 'Do you have siblings?',
      },
      {
        swedish: 'gillar du ...?',
        english: 'do you like ...?',
        exampleSwedish: 'Gillar du kaffe?',
        exampleEnglish: 'Do you like coffee?',
      },
      {
        swedish: 'varför',
        english: 'why',
        exampleSwedish: 'Varför lär du dig svenska?',
        exampleEnglish: 'Why are you learning Swedish?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Bor du i Stockholm?', english: 'Do you live in Stockholm?' },
      { speaker: 'B', swedish: 'Nej, jag bor i Uppsala.', english: 'No, I live in Uppsala.' },
      { speaker: 'A', swedish: 'Varför lär du dig svenska?', english: 'Why are you learning Swedish?' },
      { speaker: 'B', swedish: 'För att jag vill jobba här.', english: 'Because I want to work here.' },
    ],
    sectionList: [
      'Convert three statements into questions.',
      'Ask one question with each model pattern.',
      'Practice “Varför ...?” with your own reason.',
      'Read the dialogue and feel the question rhythm.',
    ],
  }),
  makeLesson({
    day: 34,
    title: 'Negation with inte',
    goal: 'Use inte correctly in simple sentences and answers.',
    focus:
      'Negation is essential for clear communication. Today you practice saying what is not true or what you do not do.',
    grammarNote:
      'In simple statements, “inte” usually comes after the verb: “Jag bor inte här.” “Jag gillar inte kaffe.”',
    vocabulary: [
      {
        swedish: 'inte',
        english: 'not',
        exampleSwedish: 'Jag förstår inte.',
        exampleEnglish: 'I do not understand.',
      },
      {
        swedish: 'aldrig',
        english: 'never',
        exampleSwedish: 'Jag dricker aldrig kaffe sent.',
        exampleEnglish: 'I never drink coffee late.',
      },
      {
        swedish: 'ingen',
        english: 'no / none',
        exampleSwedish: 'Jag har ingen biljett.',
        exampleEnglish: 'I have no ticket.',
      },
      {
        swedish: 'fortfarande',
        english: 'still',
        exampleSwedish: 'Jag är fortfarande trött.',
        exampleEnglish: 'I am still tired.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Bor du här?', english: 'Do you live here?' },
      { speaker: 'B', swedish: 'Nej, jag bor inte här.', english: 'No, I do not live here.' },
      { speaker: 'A', swedish: 'Har du biljett?', english: 'Do you have a ticket?' },
      { speaker: 'B', swedish: 'Nej, jag har ingen biljett ännu.', english: 'No, I do not have a ticket yet.' },
    ],
    sectionList: [
      'Negate four earlier positive sentences.',
      'Practice the position of “inte” after the verb.',
      'Say one sentence with “aldrig”.',
      'Read the dialogue and emphasize the negative word.',
    ],
  }),
  makeLesson({
    day: 35,
    title: 'Adjectives',
    goal: 'Use basic adjectives to describe people, objects, and situations.',
    focus:
      'You are adding descriptive power to your Swedish with common beginner adjectives.',
    grammarNote:
      'At A1 level, start with common adjective chunks and pay attention to frequent forms in context rather than memorizing every agreement rule immediately.',
    vocabulary: [
      {
        swedish: 'stor',
        english: 'big',
        exampleSwedish: 'Det är ett stort hus.',
        exampleEnglish: 'It is a big house.',
      },
      {
        swedish: 'liten',
        english: 'small',
        exampleSwedish: 'Jag bor i en liten lägenhet.',
        exampleEnglish: 'I live in a small apartment.',
      },
      {
        swedish: 'ny',
        english: 'new',
        exampleSwedish: 'Min telefon är ny.',
        exampleEnglish: 'My phone is new.',
      },
      {
        swedish: 'gammal',
        english: 'old',
        exampleSwedish: 'Bilen är gammal.',
        exampleEnglish: 'The car is old.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur är din lägenhet?', english: 'What is your apartment like?' },
      { speaker: 'B', swedish: 'Den är liten men fin.', english: 'It is small but nice.' },
      { speaker: 'A', swedish: 'Är huset nytt?', english: 'Is the house new?' },
      { speaker: 'B', swedish: 'Nej, huset är gammalt.', english: 'No, the house is old.' },
    ],
    sectionList: [
      'Describe three objects around you.',
      'Use one adjective for something positive and one for something negative.',
      'Practice the pair stor / liten.',
      'Read the dialogue and replace the noun.',
    ],
  }),
  makeLesson({
    day: 36,
    title: 'Describing people and things',
    goal: 'Describe appearance, personality, and everyday objects using simple adjectives.',
    focus:
      'This lesson expands adjective use from objects to people and common descriptions.',
    grammarNote:
      'Short two-part descriptions are enough at A1 level: “Hon är snäll.” “Det är en fin bok.” Build confidence before adding complexity.',
    vocabulary: [
      {
        swedish: 'snäll',
        english: 'kind',
        exampleSwedish: 'Min lärare är snäll.',
        exampleEnglish: 'My teacher is kind.',
      },
      {
        swedish: 'rolig',
        english: 'funny / enjoyable',
        exampleSwedish: 'Filmen är rolig.',
        exampleEnglish: 'The film is funny.',
      },
      {
        swedish: 'fin',
        english: 'nice / pretty',
        exampleSwedish: 'Det är en fin stad.',
        exampleEnglish: 'It is a nice city.',
      },
      {
        swedish: 'svår',
        english: 'difficult',
        exampleSwedish: 'Svenska är ibland svår.',
        exampleEnglish: 'Swedish is sometimes difficult.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur är din lärare?', english: 'What is your teacher like?' },
      { speaker: 'B', swedish: 'Hon är snäll och rolig.', english: 'She is kind and funny.' },
      { speaker: 'A', swedish: 'Är svenskan svår?', english: 'Is Swedish difficult?' },
      { speaker: 'B', swedish: 'Ibland, men den är också fin.', english: 'Sometimes, but it is also beautiful.' },
    ],
    sectionList: [
      'Describe one person and one place.',
      'Use two adjectives in the same sentence.',
      'Practice “ibland svår” naturally.',
      'Read the dialogue and replace the teacher with another person.',
    ],
  }),
  makeLesson({
    day: 37,
    title: 'Prepositions',
    goal: 'Use simple location prepositions in everyday sentences.',
    focus:
      'Prepositions help you explain where things are, which is essential in the home, city, and classroom.',
    grammarNote:
      'Start with a few high-frequency location words: på (on), i (in), under (under), bredvid (next to).',
    vocabulary: [
      {
        swedish: 'på',
        english: 'on',
        exampleSwedish: 'Boken ligger på bordet.',
        exampleEnglish: 'The book is on the table.',
      },
      {
        swedish: 'i',
        english: 'in',
        exampleSwedish: 'Nycklarna är i väskan.',
        exampleEnglish: 'The keys are in the bag.',
      },
      {
        swedish: 'under',
        english: 'under',
        exampleSwedish: 'Katten sover under stolen.',
        exampleEnglish: 'The cat sleeps under the chair.',
      },
      {
        swedish: 'bredvid',
        english: 'next to',
        exampleSwedish: 'Skolan ligger bredvid biblioteket.',
        exampleEnglish: 'The school is next to the library.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Var är min bok?', english: 'Where is my book?' },
      { speaker: 'B', swedish: 'Den ligger på bordet.', english: 'It is on the table.' },
      { speaker: 'A', swedish: 'Och nycklarna?', english: 'And the keys?' },
      { speaker: 'B', swedish: 'De är i väskan bredvid stolen.', english: 'They are in the bag next to the chair.' },
    ],
    sectionList: [
      'Describe where four objects are in your room.',
      'Practice the difference between “på” and “i”.',
      'Make one sentence with “bredvid”.',
      'Read the dialogue while looking around a real room.',
    ],
  }),
  makeLesson({
    day: 38,
    title: 'Modal verbs',
    goal: 'Use can, must, want to, and may in simple statements.',
    focus:
      'Modal verbs let you speak about ability, obligation, and desire, which makes your Swedish much more functional.',
    grammarNote:
      'After a modal verb like “kan”, “vill”, or “måste”, the next verb stays in the infinitive: “Jag kan tala.” “Jag vill gå.”',
    vocabulary: [
      {
        swedish: 'kan',
        english: 'can',
        exampleSwedish: 'Jag kan tala lite svenska.',
        exampleEnglish: 'I can speak a little Swedish.',
      },
      {
        swedish: 'vill',
        english: 'want to',
        exampleSwedish: 'Jag vill köpa kaffe.',
        exampleEnglish: 'I want to buy coffee.',
      },
      {
        swedish: 'måste',
        english: 'must / have to',
        exampleSwedish: 'Jag måste gå nu.',
        exampleEnglish: 'I have to go now.',
      },
      {
        swedish: 'får',
        english: 'may / am allowed to',
        exampleSwedish: 'Får jag sitta här?',
        exampleEnglish: 'May I sit here?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Kan du hjälpa mig?', english: 'Can you help me?' },
      { speaker: 'B', swedish: 'Ja, men jag måste gå snart.', english: 'Yes, but I have to go soon.' },
      { speaker: 'A', swedish: 'Får jag fråga en sak först?', english: 'May I ask one thing first?' },
      { speaker: 'B', swedish: 'Ja, självklart.', english: 'Yes, of course.' },
    ],
    sectionList: [
      'Make one sentence with each modal verb.',
      'Use an infinitive after every modal.',
      'Ask permission with “Får jag ...?”',
      'Read the dialogue and emphasize the modal verbs.',
    ],
  }),
  makeLesson({
    day: 39,
    title: 'Talking about plans',
    goal: 'Use simple future language to talk about what you are going to do.',
    focus:
      'This lesson prepares you for invitations, schedules, and short future plans.',
    grammarNote:
      'A practical beginner future form is “ska” + infinitive: “Jag ska studera.” It often means “am going to.”',
    vocabulary: [
      {
        swedish: 'ska',
        english: 'going to / will',
        exampleSwedish: 'Jag ska plugga ikväll.',
        exampleEnglish: 'I am going to study tonight.',
      },
      {
        swedish: 'ikväll',
        english: 'this evening',
        exampleSwedish: 'Vi ska laga mat ikväll.',
        exampleEnglish: 'We are going to cook this evening.',
      },
      {
        swedish: 'imorgon',
        english: 'tomorrow',
        exampleSwedish: 'Hon ska resa imorgon.',
        exampleEnglish: 'She is going to travel tomorrow.',
      },
      {
        swedish: 'plan',
        english: 'plan',
        exampleSwedish: 'Vad är din plan för helgen?',
        exampleEnglish: 'What is your plan for the weekend?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad ska du göra ikväll?', english: 'What are you going to do this evening?' },
      { speaker: 'B', swedish: 'Jag ska plugga svenska.', english: 'I am going to study Swedish.' },
      { speaker: 'A', swedish: 'Och imorgon?', english: 'And tomorrow?' },
      { speaker: 'B', swedish: 'Imorgon ska jag träffa en vän.', english: 'Tomorrow I am going to meet a friend.' },
    ],
    sectionList: [
      'Say your plan for tonight and tomorrow.',
      'Practice “ska” + verb as one chunk.',
      'Ask someone about their weekend plan.',
      'Read the dialogue and swap in your own activities.',
    ],
  }),
  makeLesson({
    day: 40,
    title: 'Review and writing practice',
    goal: 'Review grammar control from Days 31-39 and write short personal sentences.',
    focus:
      'This day combines verbs, questions, negation, adjectives, prepositions, and simple future plans in short writing tasks.',
    grammarNote:
      'Writing reveals gaps that speaking can hide. Keep your sentences short and correct rather than long and confusing.',
    vocabulary: [
      {
        swedish: 'mening',
        english: 'sentence',
        exampleSwedish: 'Skriv en kort mening.',
        exampleEnglish: 'Write a short sentence.',
      },
      {
        swedish: 'rätta',
        english: 'correct',
        exampleSwedish: 'Den här meningen är rätt.',
        exampleEnglish: 'This sentence is correct.',
      },
      {
        swedish: 'fel',
        english: 'wrong / error',
        exampleSwedish: 'Jag ser ett fel här.',
        exampleEnglish: 'I see an error here.',
      },
      {
        swedish: 'försöka',
        english: 'try',
        exampleSwedish: 'Jag försöker skriva på svenska.',
        exampleEnglish: 'I am trying to write in Swedish.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Kan du skriva fem meningar?', english: 'Can you write five sentences?' },
      { speaker: 'B', swedish: 'Ja, jag ska försöka.', english: 'Yes, I am going to try.' },
      { speaker: 'A', swedish: 'Är de rätt?', english: 'Are they correct?' },
      { speaker: 'B', swedish: 'Inte alla, men jag lär mig.', english: 'Not all of them, but I am learning.' },
    ],
    sectionList: [
      'Write five short personal sentences.',
      'Include one negative sentence and one future sentence.',
      'Read your own writing aloud once.',
      'Rewrite any sentence that feels unstable.',
    ],
  }),
  makeLesson({
    day: 41,
    title: 'At the supermarket',
    goal: 'Use basic shopping language for food, quantities, and finding items in a supermarket.',
    focus:
      'You are moving into real-world errands with useful words for daily shopping.',
    grammarNote:
      'A practical pattern is “Var finns ...?” meaning “Where is ...?” Use it when you cannot find an item.',
    vocabulary: [
      {
        swedish: 'mjölk',
        english: 'milk',
        exampleSwedish: 'Jag behöver mjölk.',
        exampleEnglish: 'I need milk.',
      },
      {
        swedish: 'frukt',
        english: 'fruit',
        exampleSwedish: 'Vi köper frukt varje vecka.',
        exampleEnglish: 'We buy fruit every week.',
      },
      {
        swedish: 'kvitto',
        english: 'receipt',
        exampleSwedish: 'Kan jag få kvittot?',
        exampleEnglish: 'Can I get the receipt?',
      },
      {
        swedish: 'var finns ...?',
        english: 'where is ...?',
        exampleSwedish: 'Var finns brödet?',
        exampleEnglish: 'Where is the bread?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Ursäkta, var finns mjölken?', english: 'Excuse me, where is the milk?' },
      { speaker: 'B', swedish: 'Den finns längst bak i butiken.', english: 'It is at the back of the store.' },
      { speaker: 'A', swedish: 'Tack. Kan jag få kvittot också?', english: 'Thanks. Can I get the receipt too?' },
      { speaker: 'B', swedish: 'Ja, självklart.', english: 'Yes, of course.' },
    ],
    sectionList: [
      'Name five food items you buy often.',
      'Ask where an item is in a store.',
      'Practice asking for a receipt.',
      'Read the supermarket dialogue twice.',
    ],
  }),
  makeLesson({
    day: 42,
    title: 'At a restaurant',
    goal: 'Order food, ask for recommendations, and make short restaurant requests.',
    focus:
      'You already practiced café language. Now you expand it to full meal situations.',
    grammarNote:
      'At A1 level, short requests are fine: “Jag tar ...” or “Jag skulle vilja ha ...” both work in restaurants.',
    vocabulary: [
      {
        swedish: 'förrätt',
        english: 'starter',
        exampleSwedish: 'Vi delar en förrätt.',
        exampleEnglish: 'We are sharing a starter.',
      },
      {
        swedish: 'huvudrätt',
        english: 'main course',
        exampleSwedish: 'Jag beställer en huvudrätt.',
        exampleEnglish: 'I am ordering a main course.',
      },
      {
        swedish: 'vegetarisk',
        english: 'vegetarian',
        exampleSwedish: 'Har ni något vegetariskt?',
        exampleEnglish: 'Do you have anything vegetarian?',
      },
      {
        swedish: 'rekommenderar',
        english: 'recommend',
        exampleSwedish: 'Vad rekommenderar du?',
        exampleEnglish: 'What do you recommend?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Har ni något vegetariskt?', english: 'Do you have anything vegetarian?' },
      { speaker: 'B', swedish: 'Ja, vi har en vegetarisk huvudrätt.', english: 'Yes, we have a vegetarian main course.' },
      { speaker: 'A', swedish: 'Vad rekommenderar du?', english: 'What do you recommend?' },
      { speaker: 'B', swedish: 'Soppan är mycket populär.', english: 'The soup is very popular.' },
    ],
    sectionList: [
      'Ask for a vegetarian option.',
      'Use “Vad rekommenderar du?” naturally.',
      'Order a starter or main course aloud.',
      'Read the dialogue and change the food choice.',
    ],
  }),
  makeLesson({
    day: 43,
    title: 'At the doctor',
    goal: 'Use very basic health language to describe common problems.',
    focus:
      'This lesson gives you simple, high-value phrases for health situations without trying to cover advanced medical Swedish.',
    grammarNote:
      'To describe pain, use “Jag har ont i ...” meaning “I have pain in ...” or “my ... hurts.”',
    vocabulary: [
      {
        swedish: 'jag har ont i',
        english: 'I have pain in',
        exampleSwedish: 'Jag har ont i huvudet.',
        exampleEnglish: 'I have a headache.',
      },
      {
        swedish: 'huvud',
        english: 'head',
        exampleSwedish: 'Mitt huvud gör ont.',
        exampleEnglish: 'My head hurts.',
      },
      {
        swedish: 'feber',
        english: 'fever',
        exampleSwedish: 'Jag tror att jag har feber.',
        exampleEnglish: 'I think I have a fever.',
      },
      {
        swedish: 'medicin',
        english: 'medicine',
        exampleSwedish: 'Behöver jag medicin?',
        exampleEnglish: 'Do I need medicine?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad är problemet?', english: 'What is the problem?' },
      { speaker: 'B', swedish: 'Jag har ont i huvudet och jag har feber.', english: 'I have a headache and I have a fever.' },
      { speaker: 'A', swedish: 'Hur länge har du varit sjuk?', english: 'How long have you been ill?' },
      { speaker: 'B', swedish: 'Sedan igår.', english: 'Since yesterday.' },
    ],
    sectionList: [
      'Practice “Jag har ont i ...” with two body parts.',
      'Say whether you have fever or not.',
      'Ask if medicine is needed.',
      'Read the doctor dialogue calmly and clearly.',
    ],
  }),
  makeLesson({
    day: 44,
    title: 'Weather',
    goal: 'Describe simple weather conditions and react to them.',
    focus:
      'Weather is frequent small-talk material and also useful for planning your day.',
    grammarNote:
      'A common structure is “Det är ...” followed by the weather adjective or condition: “Det är kallt.” “Det regnar.”',
    vocabulary: [
      {
        swedish: 'soligt',
        english: 'sunny',
        exampleSwedish: 'Det är soligt idag.',
        exampleEnglish: 'It is sunny today.',
      },
      {
        swedish: 'regnar',
        english: 'raining',
        exampleSwedish: 'Det regnar ute.',
        exampleEnglish: 'It is raining outside.',
      },
      {
        swedish: 'kallt',
        english: 'cold',
        exampleSwedish: 'Det är kallt i morse.',
        exampleEnglish: 'It is cold this morning.',
      },
      {
        swedish: 'varmt',
        english: 'warm',
        exampleSwedish: 'Det är varmt i juli.',
        exampleEnglish: 'It is warm in July.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur är vädret idag?', english: 'How is the weather today?' },
      { speaker: 'B', swedish: 'Det är soligt men lite kallt.', english: 'It is sunny but a little cold.' },
      { speaker: 'A', swedish: 'Regnar det senare?', english: 'Will it rain later?' },
      { speaker: 'B', swedish: 'Kanske ikväll.', english: 'Maybe this evening.' },
    ],
    sectionList: [
      'Describe the weather today in two sentences.',
      'Use both positive and negative weather words.',
      'Practice “Det är ...” with three adjectives.',
      'Read the dialogue and replace the weather.',
    ],
  }),
  makeLesson({
    day: 45,
    title: 'Hobbies',
    goal: 'Talk about simple hobbies and free-time activities.',
    focus:
      'This lesson helps you share interests and understand common social conversation topics.',
    grammarNote:
      'Many hobby sentences use the present tense: “Jag spelar ...” “Jag läser ...” “Jag tränar ...”. Keep them short.',
    vocabulary: [
      {
        swedish: 'läsa',
        english: 'read',
        exampleSwedish: 'Jag gillar att läsa böcker.',
        exampleEnglish: 'I like to read books.',
      },
      {
        swedish: 'träna',
        english: 'exercise',
        exampleSwedish: 'Hon tränar tre gånger i veckan.',
        exampleEnglish: 'She exercises three times a week.',
      },
      {
        swedish: 'spela',
        english: 'play',
        exampleSwedish: 'Vi spelar fotboll på söndag.',
        exampleEnglish: 'We play football on Sunday.',
      },
      {
        swedish: 'fritid',
        english: 'free time',
        exampleSwedish: 'Vad gör du på fritiden?',
        exampleEnglish: 'What do you do in your free time?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad gör du på fritiden?', english: 'What do you do in your free time?' },
      { speaker: 'B', swedish: 'Jag gillar att läsa och träna.', english: 'I like to read and exercise.' },
      { speaker: 'A', swedish: 'Spelar du också musik?', english: 'Do you also play music?' },
      { speaker: 'B', swedish: 'Lite grann, ibland.', english: 'A little, sometimes.' },
    ],
    sectionList: [
      'Say two hobbies you enjoy.',
      'Ask someone about their free time.',
      'Practice “Jag gillar att ...”.',
      'Read the dialogue and replace the hobbies.',
    ],
  }),
  makeLesson({
    day: 46,
    title: 'Invitations',
    goal: 'Invite someone to do something at a simple time and place.',
    focus:
      'You will use question forms and future language to invite someone politely.',
    grammarNote:
      'A very useful pattern is “Vill du ...?” meaning “Do you want to ...?” Add a time or place after it.',
    vocabulary: [
      {
        swedish: 'vill du ...?',
        english: 'do you want to ...?',
        exampleSwedish: 'Vill du fika imorgon?',
        exampleEnglish: 'Do you want to have coffee tomorrow?',
      },
      {
        swedish: 'träffas',
        english: 'meet',
        exampleSwedish: 'Ska vi träffas i stan?',
        exampleEnglish: 'Shall we meet in town?',
      },
      {
        swedish: 'klockan sex',
        english: 'at six o’clock',
        exampleSwedish: 'Vi ses klockan sex.',
        exampleEnglish: 'See you at six o’clock.',
      },
      {
        swedish: 'gärna',
        english: 'gladly / sure',
        exampleSwedish: 'Ja, gärna!',
        exampleEnglish: 'Yes, gladly!',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vill du fika imorgon?', english: 'Do you want to have coffee tomorrow?' },
      { speaker: 'B', swedish: 'Ja, gärna!', english: 'Yes, gladly!' },
      { speaker: 'A', swedish: 'Ska vi träffas i stan klockan sex?', english: 'Shall we meet in town at six?' },
      { speaker: 'B', swedish: 'Det passar bra.', english: 'That works well.' },
    ],
    sectionList: [
      'Invite someone to coffee, a walk, or a meal.',
      'Accept using “Ja, gärna!”',
      'Set a time and place in Swedish.',
      'Read the dialogue and swap the activity.',
    ],
  }),
  makeLesson({
    day: 47,
    title: 'Accepting and declining',
    goal: 'Accept or decline invitations politely.',
    focus:
      'This lesson gives you social control: saying yes clearly and saying no politely with a reason.',
    grammarNote:
      'A simple declining structure is “Tyvärr, jag kan inte ...” meaning “Unfortunately, I cannot ...”.',
    vocabulary: [
      {
        swedish: 'det passar bra',
        english: 'that works well',
        exampleSwedish: 'Ja, det passar bra.',
        exampleEnglish: 'Yes, that works well.',
      },
      {
        swedish: 'tyvärr',
        english: 'unfortunately',
        exampleSwedish: 'Tyvärr kan jag inte komma.',
        exampleEnglish: 'Unfortunately I cannot come.',
      },
      {
        swedish: 'en annan gång',
        english: 'another time',
        exampleSwedish: 'Kanske en annan gång.',
        exampleEnglish: 'Maybe another time.',
      },
      {
        swedish: 'upptagen',
        english: 'busy',
        exampleSwedish: 'Jag är upptagen ikväll.',
        exampleEnglish: 'I am busy this evening.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vill du följa med på bio?', english: 'Do you want to come to the cinema?' },
      { speaker: 'B', swedish: 'Tyvärr, jag är upptagen ikväll.', english: 'Unfortunately, I am busy this evening.' },
      { speaker: 'A', swedish: 'Okej, kanske en annan gång.', english: 'Okay, maybe another time.' },
      { speaker: 'B', swedish: 'Ja, gärna nästa vecka.', english: 'Yes, gladly next week.' },
    ],
    sectionList: [
      'Accept one invitation and decline one politely.',
      'Give a short reason when you decline.',
      'Practice “en annan gång”.',
      'Read the dialogue and switch who says no.',
    ],
  }),
  makeLesson({
    day: 48,
    title: 'Describing your home',
    goal: 'Talk about rooms, furniture, and simple home descriptions.',
    focus:
      'You will use room vocabulary and adjectives to describe where you live.',
    grammarNote:
      'Useful frames are “Jag bor i ...” and “Det finns ...” for describing what is in your home.',
    vocabulary: [
      {
        swedish: 'kök',
        english: 'kitchen',
        exampleSwedish: 'Köket är litet men fint.',
        exampleEnglish: 'The kitchen is small but nice.',
      },
      {
        swedish: 'sovrum',
        english: 'bedroom',
        exampleSwedish: 'Mitt sovrum är ljust.',
        exampleEnglish: 'My bedroom is bright.',
      },
      {
        swedish: 'soffa',
        english: 'sofa',
        exampleSwedish: 'Det finns en soffa i vardagsrummet.',
        exampleEnglish: 'There is a sofa in the living room.',
      },
      {
        swedish: 'lägenhet',
        english: 'apartment',
        exampleSwedish: 'Jag bor i en liten lägenhet.',
        exampleEnglish: 'I live in a small apartment.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur är din lägenhet?', english: 'What is your apartment like?' },
      { speaker: 'B', swedish: 'Den är liten men mysig.', english: 'It is small but cozy.' },
      { speaker: 'A', swedish: 'Har du ett stort kök?', english: 'Do you have a big kitchen?' },
      { speaker: 'B', swedish: 'Nej, men jag har en fin soffa i vardagsrummet.', english: 'No, but I have a nice sofa in the living room.' },
    ],
    sectionList: [
      'Describe your home in three sentences.',
      'Name two rooms and two pieces of furniture.',
      'Use “Det finns ...” at least once.',
      'Read the dialogue and change the home type.',
    ],
  }),
  makeLesson({
    day: 49,
    title: 'Travel and hotel basics',
    goal: 'Use simple Swedish for check-in, hotel questions, and travel needs.',
    focus:
      'This lesson covers very practical beginner travel phrases that are useful immediately.',
    grammarNote:
      'When asking for something in a hotel, short polite questions work well: “Har ni ...?” “Kan jag få ...?”',
    vocabulary: [
      {
        swedish: 'rum',
        english: 'room',
        exampleSwedish: 'Jag har bokat ett rum.',
        exampleEnglish: 'I have booked a room.',
      },
      {
        swedish: 'bokning',
        english: 'booking',
        exampleSwedish: 'Jag har en bokning i mitt namn.',
        exampleEnglish: 'I have a booking in my name.',
      },
      {
        swedish: 'nyckel',
        english: 'key',
        exampleSwedish: 'Kan jag få nyckeln?',
        exampleEnglish: 'Can I get the key?',
      },
      {
        swedish: 'frukost ingår',
        english: 'breakfast is included',
        exampleSwedish: 'Ingår frukost i priset?',
        exampleEnglish: 'Is breakfast included in the price?',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hej, jag har en bokning.', english: 'Hello, I have a booking.' },
      { speaker: 'B', swedish: 'Vilket namn, tack?', english: 'Which name, please?' },
      { speaker: 'A', swedish: 'Shool Dubey. Ingår frukost?', english: 'Shool Dubey. Is breakfast included?' },
      { speaker: 'B', swedish: 'Ja, och här är din nyckel.', english: 'Yes, and here is your key.' },
    ],
    sectionList: [
      'Practice saying you have a booking.',
      'Ask if breakfast is included.',
      'Ask politely for a key or room number.',
      'Read the check-in dialogue aloud.',
    ],
  }),
  makeLesson({
    day: 50,
    title: 'Review and conversation practice',
    goal: 'Review real-world Swedish from shopping, weather, hobbies, invitations, and travel.',
    focus:
      'This review day aims to make your Swedish feel more social and practical through longer spoken combinations.',
    grammarNote:
      'Use earlier chunks instead of searching for perfect grammar. A1 fluency grows from reliable phrases used often.',
    vocabulary: [
      {
        swedish: 'samtal',
        english: 'conversation',
        exampleSwedish: 'Vi har ett kort samtal på svenska.',
        exampleEnglish: 'We have a short conversation in Swedish.',
      },
      {
        swedish: 'fortsätta',
        english: 'continue',
        exampleSwedish: 'Kan vi fortsätta på svenska?',
        exampleEnglish: 'Can we continue in Swedish?',
      },
      {
        swedish: 'långsamt',
        english: 'slowly',
        exampleSwedish: 'Kan du prata långsamt?',
        exampleEnglish: 'Can you speak slowly?',
      },
      {
        swedish: 'klart',
        english: 'clear / done',
        exampleSwedish: 'Nu är det klart.',
        exampleEnglish: 'Now it is done.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Kan vi fortsätta på svenska?', english: 'Can we continue in Swedish?' },
      { speaker: 'B', swedish: 'Ja, men prata långsamt.', english: 'Yes, but speak slowly.' },
      { speaker: 'A', swedish: 'Självklart. Vad gör du i helgen?', english: 'Of course. What are you doing this weekend?' },
      { speaker: 'B', swedish: 'Jag ska träffa vänner och kanske resa lite.', english: 'I am going to meet friends and maybe travel a little.' },
    ],
    sectionList: [
      'Have a one-minute conversation with yourself or a partner.',
      'Combine invitations, plans, and weather talk.',
      'Ask for slower speech if needed.',
      'Repeat the dialogue until it feels conversational.',
    ],
  }),
  makeLesson({
    day: 51,
    title: 'Past tense introduction',
    goal: 'Recognize the idea of past tense and use a few high-frequency examples.',
    focus:
      'This is a light introduction to talking about what happened before now, enough for basic A1 conversation.',
    grammarNote:
      'Start with common past forms as chunks, such as “var” (was) and “gjorde” (did). You do not need all Swedish past-tense rules yet.',
    vocabulary: [
      {
        swedish: 'igår',
        english: 'yesterday',
        exampleSwedish: 'Igår jobbade jag hemma.',
        exampleEnglish: 'Yesterday I worked at home.',
      },
      {
        swedish: 'var',
        english: 'was / were',
        exampleSwedish: 'Jag var trött igår.',
        exampleEnglish: 'I was tired yesterday.',
      },
      {
        swedish: 'gjorde',
        english: 'did',
        exampleSwedish: 'Vad gjorde du igår?',
        exampleEnglish: 'What did you do yesterday?',
      },
      {
        swedish: 'åt',
        english: 'ate',
        exampleSwedish: 'Vi åt middag sent.',
        exampleEnglish: 'We ate dinner late.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad gjorde du igår?', english: 'What did you do yesterday?' },
      { speaker: 'B', swedish: 'Jag jobbade och sedan åt jag middag hemma.', english: 'I worked and then I ate dinner at home.' },
      { speaker: 'A', swedish: 'Var du trött?', english: 'Were you tired?' },
      { speaker: 'B', swedish: 'Ja, jag var ganska trött.', english: 'Yes, I was quite tired.' },
    ],
    sectionList: [
      'Say one thing you did yesterday.',
      'Practice “Vad gjorde du igår?”',
      'Use “var” in two personal sentences.',
      'Read the dialogue and replace the activities.',
    ],
  }),
  makeLesson({
    day: 52,
    title: 'Talking about yesterday',
    goal: 'Build short personal stories about yesterday with simple sequence words.',
    focus:
      'You will extend past-time talk from isolated sentences to small, connected events.',
    grammarNote:
      'Use time words like “först” (first) and “sedan” (then) to organize a simple story even if the grammar stays basic.',
    vocabulary: [
      {
        swedish: 'först',
        english: 'first',
        exampleSwedish: 'Först jobbade jag.',
        exampleEnglish: 'First I worked.',
      },
      {
        swedish: 'sedan',
        english: 'then',
        exampleSwedish: 'Sedan lagade jag mat.',
        exampleEnglish: 'Then I cooked.',
      },
      {
        swedish: 'efteråt',
        english: 'afterwards',
        exampleSwedish: 'Efteråt såg jag en film.',
        exampleEnglish: 'Afterwards I watched a film.',
      },
      {
        swedish: 'somnade',
        english: 'fell asleep',
        exampleSwedish: 'Jag somnade tidigt.',
        exampleEnglish: 'I fell asleep early.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur var din dag igår?', english: 'How was your day yesterday?' },
      { speaker: 'B', swedish: 'Först jobbade jag, sedan lagade jag mat.', english: 'First I worked, then I cooked.' },
      { speaker: 'A', swedish: 'Vad gjorde du efteråt?', english: 'What did you do afterwards?' },
      { speaker: 'B', swedish: 'Efteråt såg jag en film och somnade tidigt.', english: 'Afterwards I watched a film and fell asleep early.' },
    ],
    sectionList: [
      'Tell a three-step story about yesterday.',
      'Use först, sedan, and efteråt in order.',
      'Practice one past activity aloud.',
      'Read the dialogue until you can retell it.',
    ],
  }),
  makeLesson({
    day: 53,
    title: 'Future with ska',
    goal: 'Strengthen future expressions with ska and personal plans.',
    focus:
      'You already met “ska.” Today you use it more actively to talk about tomorrow, next week, and intentions.',
    grammarNote:
      '“Ska” is very common for planned future actions: “Jag ska resa nästa vecka.” Keep the following verb in the infinitive.',
    vocabulary: [
      {
        swedish: 'nästa vecka',
        english: 'next week',
        exampleSwedish: 'Jag ska resa nästa vecka.',
        exampleEnglish: 'I am going to travel next week.',
      },
      {
        swedish: 'snart',
        english: 'soon',
        exampleSwedish: 'Vi ska äta snart.',
        exampleEnglish: 'We are going to eat soon.',
      },
      {
        swedish: 'planerar',
        english: 'plan',
        exampleSwedish: 'Jag planerar att studera mer.',
        exampleEnglish: 'I plan to study more.',
      },
      {
        swedish: 'senare',
        english: 'later',
        exampleSwedish: 'Jag ska ringa senare.',
        exampleEnglish: 'I am going to call later.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad ska du göra nästa vecka?', english: 'What are you going to do next week?' },
      { speaker: 'B', swedish: 'Jag ska resa och träffa familjen.', english: 'I am going to travel and meet my family.' },
      { speaker: 'A', swedish: 'När ska du ringa dem?', english: 'When are you going to call them?' },
      { speaker: 'B', swedish: 'Jag ska ringa senare idag.', english: 'I am going to call later today.' },
    ],
    sectionList: [
      'Say one plan for later today and one for next week.',
      'Keep “ska” + infinitive together.',
      'Ask a future question with “Vad ska du ...?”',
      'Read the dialogue and replace the plan.',
    ],
  }),
  makeLesson({
    day: 54,
    title: 'Writing short messages',
    goal: 'Write very short messages, reminders, and practical notes in Swedish.',
    focus:
      'This lesson helps you turn spoken Swedish into short written communication used in everyday life.',
    grammarNote:
      'Short messages often omit extra words. Clear, simple Swedish is better than trying to sound advanced.',
    vocabulary: [
      {
        swedish: 'meddelande',
        english: 'message',
        exampleSwedish: 'Jag skriver ett meddelande.',
        exampleEnglish: 'I am writing a message.',
      },
      {
        swedish: 'sen',
        english: 'late',
        exampleSwedish: 'Jag blir sen idag.',
        exampleEnglish: 'I will be late today.',
      },
      {
        swedish: 'kommer snart',
        english: 'coming soon',
        exampleSwedish: 'Jag kommer snart.',
        exampleEnglish: 'I am coming soon.',
      },
      {
        swedish: 'hälsningar',
        english: 'regards',
        exampleSwedish: 'Hälsningar, Shool.',
        exampleEnglish: 'Regards, Shool.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad skriver du?', english: 'What are you writing?' },
      { speaker: 'B', swedish: 'Ett kort meddelande: “Jag blir sen idag.”', english: 'A short message: “I will be late today.”' },
      { speaker: 'A', swedish: 'Bra, det är tydligt.', english: 'Good, that is clear.' },
      { speaker: 'B', swedish: 'Tack, jag skriver enkelt.', english: 'Thanks, I write simply.' },
    ],
    sectionList: [
      'Write a two-line message in Swedish.',
      'Say that you are late or coming soon.',
      'Finish with a simple closing if you want.',
      'Read your written message aloud once.',
    ],
  }),
  makeLesson({
    day: 55,
    title: 'Reading simple texts',
    goal: 'Read short beginner texts and identify the main idea.',
    focus:
      'Today is about reading tolerance: understanding enough without translating every single word.',
    grammarNote:
      'When reading, focus on known anchors such as names, places, time words, and common verbs before worrying about every detail.',
    vocabulary: [
      {
        swedish: 'text',
        english: 'text',
        exampleSwedish: 'Jag läser en kort text.',
        exampleEnglish: 'I read a short text.',
      },
      {
        swedish: 'rubrik',
        english: 'title / heading',
        exampleSwedish: 'Vad är rubriken?',
        exampleEnglish: 'What is the heading?',
      },
      {
        swedish: 'huvudidé',
        english: 'main idea',
        exampleSwedish: 'Jag förstår huvudidén.',
        exampleEnglish: 'I understand the main idea.',
      },
      {
        swedish: 'okänt ord',
        english: 'unknown word',
        exampleSwedish: 'Det finns ett okänt ord här.',
        exampleEnglish: 'There is an unknown word here.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Förstår du texten?', english: 'Do you understand the text?' },
      { speaker: 'B', swedish: 'Inte varje ord, men jag förstår huvudidén.', english: 'Not every word, but I understand the main idea.' },
      { speaker: 'A', swedish: 'Bra. Vad är rubriken?', english: 'Good. What is the heading?' },
      { speaker: 'B', swedish: 'Den handlar om en familj i Stockholm.', english: 'It is about a family in Stockholm.' },
    ],
    sectionList: [
      'Read a short section without stopping at every unknown word.',
      'Find the topic, place, and time in the text.',
      'Write one English sentence about the main idea.',
      'Read the dialogue and keep a calm reading pace.',
    ],
  }),
  makeLesson({
    day: 56,
    title: 'Listening-style practice',
    goal: 'Train yourself to catch key words in simple spoken Swedish.',
    focus:
      'Even without audio, you can practice listening strategy by reading dialogues, pausing, and predicting meaning.',
    grammarNote:
      'In listening, you rarely hear every word perfectly. Focus on key items such as names, verbs, time words, and familiar chunks.',
    vocabulary: [
      {
        swedish: 'lyssna',
        english: 'listen',
        exampleSwedish: 'Lyssna noga på frågan.',
        exampleEnglish: 'Listen carefully to the question.',
      },
      {
        swedish: 'höra',
        english: 'hear',
        exampleSwedish: 'Jag hör ordet “imorgon”.',
        exampleEnglish: 'I hear the word “tomorrow”.',
      },
      {
        swedish: 'snabb',
        english: 'fast',
        exampleSwedish: 'Hon pratar ganska snabbt.',
        exampleEnglish: 'She speaks quite fast.',
      },
      {
        swedish: 'lugn',
        english: 'calm',
        exampleSwedish: 'Försök vara lugn när du lyssnar.',
        exampleEnglish: 'Try to stay calm when you listen.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Pratar jag för snabbt?', english: 'Am I speaking too fast?' },
      { speaker: 'B', swedish: 'Lite, men jag hör nyckelorden.', english: 'A little, but I hear the key words.' },
      { speaker: 'A', swedish: 'Bra. Vad hör du?', english: 'Good. What do you hear?' },
      { speaker: 'B', swedish: 'Jag hör “imorgon”, “stationen” och “klockan sex”.', english: 'I hear “tomorrow”, “the station”, and “six o’clock”.' },
    ],
    sectionList: [
      'Read the dialogue once silently and once aloud.',
      'Underline the key words you catch first.',
      'Retell the main idea in English or simple Swedish.',
      'Do not panic if some words are unclear.',
    ],
  }),
  makeLesson({
    day: 57,
    title: 'Speaking test practice',
    goal: 'Practice typical A1-style speaking prompts about yourself and everyday life.',
    focus:
      'This lesson pulls together the whole course into short oral answers like those often used in beginner exams or interviews.',
    grammarNote:
      'A good A1 answer is short, clear, and complete. One or two solid sentences are better than a long broken answer.',
    vocabulary: [
      {
        swedish: 'berätta',
        english: 'tell',
        exampleSwedish: 'Berätta om dig själv.',
        exampleEnglish: 'Tell me about yourself.',
      },
      {
        swedish: 'presentera',
        english: 'introduce',
        exampleSwedish: 'Kan du presentera dig?',
        exampleEnglish: 'Can you introduce yourself?',
      },
      {
        swedish: 'svara',
        english: 'answer',
        exampleSwedish: 'Svara med två meningar.',
        exampleEnglish: 'Answer with two sentences.',
      },
      {
        swedish: 'fråga tillbaka',
        english: 'ask back',
        exampleSwedish: 'Försök fråga tillbaka.',
        exampleEnglish: 'Try to ask a question back.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Kan du presentera dig?', english: 'Can you introduce yourself?' },
      { speaker: 'B', swedish: 'Jag heter Shool. Jag kommer från Indien och jag bor i Finland.', english: 'My name is Shool. I come from India and I live in Finland.' },
      { speaker: 'A', swedish: 'Vad gör du på fritiden?', english: 'What do you do in your free time?' },
      { speaker: 'B', swedish: 'Jag läser, tränar och lär mig svenska.', english: 'I read, exercise, and learn Swedish.' },
    ],
    sectionList: [
      'Answer five common A1 questions aloud.',
      'Keep each answer to one or two sentences.',
      'Add one question back to the other person.',
      'Repeat weak answers until they are smoother.',
    ],
  }),
  makeLesson({
    day: 58,
    title: 'A1 grammar review',
    goal: 'Review the main grammar patterns from the course in one place.',
    focus:
      'This day is for noticing the patterns you already use: word order, negation, questions, modal verbs, and simple time reference.',
    grammarNote:
      'The point of review is not to memorize grammar terms. It is to make your most useful patterns faster and more reliable.',
    vocabulary: [
      {
        swedish: 'ordföljd',
        english: 'word order',
        exampleSwedish: 'Svensk ordföljd är viktig.',
        exampleEnglish: 'Swedish word order is important.',
      },
      {
        swedish: 'fråga',
        english: 'question',
        exampleSwedish: 'Gör om meningen till en fråga.',
        exampleEnglish: 'Turn the sentence into a question.',
      },
      {
        swedish: 'negation',
        english: 'negation',
        exampleSwedish: 'Negationen “inte” kommer ofta efter verbet.',
        exampleEnglish: 'The negation “inte” often comes after the verb.',
      },
      {
        swedish: 'regel',
        english: 'rule',
        exampleSwedish: 'Det här är en användbar regel.',
        exampleEnglish: 'This is a useful rule.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Vad behöver du repetera mest?', english: 'What do you need to review the most?' },
      { speaker: 'B', swedish: 'Frågor och ordföljd.', english: 'Questions and word order.' },
      { speaker: 'A', swedish: 'Och negation med “inte”?', english: 'And negation with “inte”?' },
      { speaker: 'B', swedish: 'Ja, den också.', english: 'Yes, that too.' },
    ],
    sectionList: [
      'Choose three grammar patterns that still feel weak.',
      'Write one example sentence for each.',
      'Read them aloud and correct them if needed.',
      'Use the dialogue as a quick self-check prompt.',
    ],
  }),
  makeLesson({
    day: 59,
    title: 'Full A1 revision',
    goal: 'Review the whole course through self-introduction, everyday tasks, and short conversations.',
    focus:
      'This is the final full revision day before the last test lesson. Try to use as much Swedish as possible.',
    grammarNote:
      'Revision works best when you actively produce language: speaking, writing, and answering prompts from memory.',
    vocabulary: [
      {
        swedish: 'repetition',
        english: 'revision / repetition',
        exampleSwedish: 'Repetition hjälper mycket.',
        exampleEnglish: 'Revision helps a lot.',
      },
      {
        swedish: 'säker',
        english: 'sure / confident',
        exampleSwedish: 'Jag känner mig mer säker nu.',
        exampleEnglish: 'I feel more confident now.',
      },
      {
        swedish: 'fortfarande',
        english: 'still',
        exampleSwedish: 'Det är fortfarande svårt ibland.',
        exampleEnglish: 'It is still difficult sometimes.',
      },
      {
        swedish: 'framsteg',
        english: 'progress',
        exampleSwedish: 'Du gör framsteg varje vecka.',
        exampleEnglish: 'You make progress every week.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur känns svenskan nu?', english: 'How does Swedish feel now?' },
      { speaker: 'B', swedish: 'Jag känner mig mer säker, men jag behöver fortfarande repetition.', english: 'I feel more confident, but I still need revision.' },
      { speaker: 'A', swedish: 'Det är normalt. Du gör framsteg.', english: 'That is normal. You are making progress.' },
      { speaker: 'B', swedish: 'Tack, jag fortsätter.', english: 'Thanks, I will continue.' },
    ],
    sectionList: [
      'Do a full self-introduction with extra detail.',
      'Roleplay a café, shop, and travel situation.',
      'Write five sentences about yesterday and tomorrow.',
      'Mark the last vocabulary items that still feel weak.',
    ],
  }),
  makeLesson({
    day: 60,
    title: 'Final A1 test and next steps',
    goal: 'Check your A1 foundations and prepare a clear path for continuing after the course.',
    focus:
      'The goal today is not perfection. It is to confirm that you can handle basic Swedish in common beginner situations and know what to practice next.',
    grammarNote:
      'A1 is about simple communication: introducing yourself, asking and answering everyday questions, and surviving common real-life situations.',
    vocabulary: [
      {
        swedish: 'nästa steg',
        english: 'next step',
        exampleSwedish: 'Vad är nästa steg för mig?',
        exampleEnglish: 'What is the next step for me?',
      },
      {
        swedish: 'fortsätta',
        english: 'continue',
        exampleSwedish: 'Jag vill fortsätta med svenska.',
        exampleEnglish: 'I want to continue with Swedish.',
      },
      {
        swedish: 'öva',
        english: 'practice',
        exampleSwedish: 'Jag ska öva varje dag.',
        exampleEnglish: 'I am going to practice every day.',
      },
      {
        swedish: 'mål',
        english: 'goal',
        exampleSwedish: 'Mitt nästa mål är A2.',
        exampleEnglish: 'My next goal is A2.',
      },
    ],
    dialogue: [
      { speaker: 'A', swedish: 'Hur gick testet?', english: 'How did the test go?' },
      { speaker: 'B', swedish: 'Det gick ganska bra.', english: 'It went quite well.' },
      { speaker: 'A', swedish: 'Vad är ditt nästa steg?', english: 'What is your next step?' },
      { speaker: 'B', swedish: 'Jag vill fortsätta och öva varje dag.', english: 'I want to continue and practice every day.' },
    ],
    sectionList: [
      'Introduce yourself, describe your day, and make one future plan.',
      'Ask and answer ten common A1 questions.',
      'Write a short message and a short past-tense summary.',
      'Choose your next step: more listening, more speaking, or starting A2.',
    ],
  }),
];

const course = {
  courseTitle: 'Swedish A1 - 60 Day Beginner Course',
  description:
    'A complete 60-day Swedish A1 course presented one day at a time. Each lesson includes Swedish-English phrases, a short dialogue, grammar support, and practice tasks.',
  estimatedDays: lessons.length,
  estimatedHours: lessons.reduce((sum, lesson) => sum + lesson.durationMinutes, 0) / 60,
  days: lessons,
};

fs.writeFileSync(outputPath, `${JSON.stringify(course, null, 2)}\n`, 'utf8');
console.log(`Wrote ${lessons.length} lessons to ${outputPath}`);
