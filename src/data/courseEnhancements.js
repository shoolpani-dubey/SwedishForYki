const teacherRewriteSourceDate = 'Teacher rewrite, May 18, 2026';

const createTeachingAddition = ({
  day,
  summary,
  content,
  errors,
  tasks,
  vocabulary = [],
}) => ({
  day,
  summary,
  sourceDates: [teacherRewriteSourceDate],
  sections: [
    {
      heading: 'Teaching focus',
      content,
    },
    {
      heading: 'Common mistakes to watch',
      list: errors,
    },
    {
      heading: 'Guided practice',
      list: tasks,
    },
  ],
  vocabulary,
});

const courseEnhancements = {
  sourceLabel:
    'Analyzed class notes from Apr 15 to May 9, 2026, plus Learn Swedish Lab reading extracts, the Swedish A1-A2 tutorial, and a teacher-led lesson expansion from May 18, 2026',
  lessonAdditions: [
    {
      day: 1,
      summary:
        'Your Apr 15 notes deepen the opening lesson with vowel training, sound harmony, and the most common Swedish sound-change patterns.',
      sourceDates: ['Apr 15, 2026', 'Learn Swedish Lab, 2025'],
      grammarTopicIds: ['vowels-and-pronunciation', 'sound-changes'],
      sections: [
        {
          heading: 'Class note pronunciation clinic',
          content: [
            'Your notes confirm that the first big A1 hurdle is vowel control. Focus on the shape of your mouth, not only the spelling, because Swedish changes meaning quickly when vowel quality changes.',
            'The strongest beginner pairs in your notes are tack / tak, kaffe / kafé, ful / full, and gratis / grattis. These are good reminders that vowel length and consonant length matter together.',
          ],
        },
        {
          heading: 'Sound-change patterns from class',
          table: [
            {
              Pattern: 'G + y/i/e/o/ä',
              Result: 'soft j-sound',
              Example: 'ger, gör, Sverige',
            },
            {
              Pattern: 'K + y/i/e/ö/ä',
              Result: 'tj-sound',
              Example: 'Kina, köper, kylskåp',
            },
            {
              Pattern: 'sk + y/i/e/ö/ä',
              Result: 'sh-sound',
              Example: 'skiner, skjorta, sjuk',
            },
            {
              Pattern: 'hj / dj / lj at the start',
              Result: 'first letter is often silent',
              Example: 'hjälp, djur, ljus',
            },
          ],
        },
        {
          heading: 'Learn Swedish Lab opener',
          dialogue: [
            {
              speaker: 'Anna',
              swedish: 'Hej, jag heter Anna. Vad heter du?',
              english: 'Hi, my name is Anna. What is your name?',
            },
            {
              speaker: 'Tomas',
              swedish: 'Hej, jag heter Tomas. Jag gillar din rosa skjorta!',
              english: 'Hi, my name is Tomas. I like your pink shirt!',
            },
            {
              speaker: 'Anna',
              swedish: 'Tack! Varifrån kommer du?',
              english: 'Thanks! Where are you from?',
            },
            {
              speaker: 'Tomas',
              swedish: 'Jag kommer från USA men jag bor i Finland nu.',
              english: 'I come from the USA, but I live in Finland now.',
            },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'kylskåp',
          english: 'fridge',
          exampleSwedish: 'Jag köper ett kylskåp i Kina.',
          exampleEnglish: 'I am buying a fridge in China.',
        },
        {
          swedish: 'skiner',
          english: 'shines',
          exampleSwedish: 'Solen skiner.',
          exampleEnglish: 'The sun is shining.',
        },
        {
          swedish: 'hjälp',
          english: 'help',
          exampleSwedish: 'Hjälp!',
          exampleEnglish: 'Help!',
        },
      ],
    },
    {
      day: 2,
      summary:
        'Your introduction notes fit directly into the self-introduction lesson: name, country, and languages spoken.',
      sourceDates: ['Apr 15, 2026', 'Apr 17, 2026'],
      grammarTopicIds: ['vowels-and-pronunciation'],
      sections: [
        {
          heading: 'Class note self-introduction upgrade',
          list: [
            'Jag heter ...',
            'Jag bor i Finland.',
            'Jag kommer från ...',
            'Jag talar engelska och lite svenska.',
          ],
        },
        {
          heading: 'Useful country and language set from class',
          table: [
            {
              Swedish: 'Sverige / Finland / Spanien / USA',
              English: 'Sweden / Finland / Spain / USA',
            },
            {
              Swedish: 'finska / spanska / tyska / kinesiska',
              English: 'Finnish / Spanish / German / Chinese',
            },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'lite svenska',
          english: 'a little Swedish',
          exampleSwedish: 'Jag talar engelska och lite svenska.',
          exampleEnglish: 'I speak English and a little Swedish.',
        },
        {
          swedish: 'finska',
          english: 'Finnish',
          exampleSwedish: 'Hon talar finska.',
          exampleEnglish: 'She speaks Finnish.',
        },
      ],
    },
    {
      day: 6,
      summary:
        'Your Apr 17 notes add the full beginner pronoun set and the spoken form dom for de.',
      sourceDates: ['Apr 17, 2026', 'Learn Swedish Lab, 2025'],
      grammarTopicIds: ['personal-pronouns', 'v2-word-order'],
      sections: [
        {
          heading: 'Pronouns from class',
          table: [
            { Swedish: 'jag', English: 'I' },
            { Swedish: 'du', English: 'you' },
            { Swedish: 'han / hon', English: 'he / she' },
            { Swedish: 'vi / ni', English: 'we / you all' },
            { Swedish: 'de / dom', English: 'they' },
          ],
        },
        {
          heading: 'Pronouns in context',
          dialogue: [
            {
              speaker: 'Nora',
              swedish: 'Hej, Maria! Hur är det?',
              english: 'Hi, Maria! How are things?',
            },
            {
              speaker: 'Maria',
              swedish: 'Hej, jag mår bra. Och du?',
              english: 'Hi, I am fine. And you?',
            },
            {
              speaker: 'Nora',
              swedish: 'Jag mår toppen! Jag har en ny pojkvän! Han heter Andreas!',
              english: 'I feel great! I have a new boyfriend! His name is Andreas!',
            },
            {
              speaker: 'Maria',
              swedish: 'Han har en fru. Hon heter Lena. De har två barn.',
              english: 'He has a wife. Her name is Lena. They have two children.',
            },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'dom',
          english: 'they (spoken form of de)',
          exampleSwedish: 'Dom andra kommer snart.',
          exampleEnglish: 'The others are coming soon.',
        },
        {
          swedish: 'hen',
          english: 'they / gender-neutral he or she',
          exampleSwedish: 'Hen heter Alex.',
          exampleEnglish: 'Their name is Alex.',
        },
      ],
    },
    {
      day: 9,
      summary:
        'Your question-word notes and the golden verb-second rule fit here directly and make the lesson more useful.',
      sourceDates: ['Apr 17, 2026', 'Apr 22, 2026', 'Learn Swedish Lab, 2025'],
      grammarTopicIds: ['question-words', 'v2-word-order'],
      sections: [
        {
          heading: 'Expanded question words from class',
          table: [
            { Swedish: 'vad', English: 'what' },
            { Swedish: 'var', English: 'where' },
            { Swedish: 'hur', English: 'how' },
            { Swedish: 'varför', English: 'why' },
            { Swedish: 'när', English: 'when' },
          ],
        },
        {
          heading: 'Class reminder',
          content: [
            'Your notes repeat the most important Swedish sentence rule: the verb stays in second position. That rule should stay visible whenever you practice questions and reordered sentences.',
          ],
        },
        {
          heading: 'Question words in a shop dialogue',
          dialogue: [
            {
              speaker: 'Maria',
              swedish: 'Hej, ursäkta, var ligger mjölk utan fett?',
              english: 'Hi, excuse me, where is the fat-free milk?',
            },
            {
              speaker: 'Säljare',
              swedish: 'Den är slut. Men varför köper du vanlig mjölk?',
              english: 'It is out of stock. But why are you buying regular milk?',
            },
            {
              speaker: 'Maria',
              swedish: 'Hur smakar vegansk mjölk?',
              english: 'How does vegan milk taste?',
            },
            {
              speaker: 'Säljare',
              swedish: 'När kommer normal mjölk? Nästa vecka.',
              english: 'When is normal milk coming? Next week.',
            },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'varför',
          english: 'why',
          exampleSwedish: 'Varför dricker du mjölk?',
          exampleEnglish: 'Why do you drink milk?',
        },
        {
          swedish: 'när',
          english: 'when',
          exampleSwedish: 'När kommer Anna?',
          exampleEnglish: 'When is Anna coming?',
        },
        {
          swedish: 'slut',
          english: 'out of stock / finished',
          exampleSwedish: 'Mjölken är slut.',
          exampleEnglish: 'The milk is out of stock.',
        },
      ],
    },
    {
      day: 11,
      summary:
        'Your family notes go beyond mother/father vocabulary and include relationship terms that are common in everyday Swedish.',
      sourceDates: ['Apr 17, 2026'],
      grammarTopicIds: ['noun-gender-and-definite-form'],
      sections: [
        {
          heading: 'Relationship vocabulary from class',
          table: [
            { Swedish: 'vän', English: 'friend' },
            { Swedish: 'pojkvän / flickvän', English: 'boyfriend / girlfriend' },
            { Swedish: 'sambo', English: 'live-in partner' },
            { Swedish: 'särbo', English: 'partner living separately' },
            { Swedish: 'gift', English: 'married' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'sambo',
          english: 'live-in partner',
          exampleSwedish: 'Jag har en sambo.',
          exampleEnglish: 'I have a live-in partner.',
        },
        {
          swedish: 'särbo',
          english: 'partner living separately',
          exampleSwedish: 'Jag har en särbo.',
          exampleEnglish: 'I have a partner who lives separately.',
        },
        {
          swedish: 'skild',
          english: 'divorced',
          exampleSwedish: 'Jag är skild.',
          exampleEnglish: 'I am divorced.',
        },
      ],
    },
    {
      day: 13,
      summary:
        'Your Apr 24 notes add a stronger jobs module, including Swedish workplace prepositions and work-location phrases.',
      sourceDates: ['Apr 24, 2026', 'Learn Swedish Lab, 2025', 'Swedish A1-A2 tutorial'],
      grammarTopicIds: ['job-phrases-and-prepositions'],
      sections: [
        {
          heading: 'Job phrases from class',
          content: [
            'Your notes highlight an important correction: Swedish normally drops the article after job titles. Say “Jag jobbar som lärare”, not the English-style “Jag jobbar som en lärare.”',
          ],
        },
        {
          heading: 'Workplace patterns',
          table: [
            {
              Swedish: 'Jag jobbar som lärare.',
              English: 'I work as a teacher.',
            },
            {
              Swedish: 'Jag jobbar på ett företag.',
              English: 'I work at a company.',
            },
            {
              Swedish: 'Jag jobbar på distans.',
              English: 'I work remotely.',
            },
            {
              Swedish: 'Jag jobbar hemifrån.',
              English: 'I work from home.',
            },
          ],
        },
        {
          heading: 'Job interview excerpt',
          dialogue: [
            {
              speaker: 'Intervjuare',
              swedish: 'Varför vill du jobba här?',
              english: 'Why do you want to work here?',
            },
            {
              speaker: 'Maria',
              swedish: 'Jag är ingenjör. Jag vill lära mig mer och jobba i ett team.',
              english: 'I am an engineer. I want to learn more and work in a team.',
            },
            {
              speaker: 'Intervjuare',
              swedish: 'Hur skulle du beskriva dig själv?',
              english: 'How would you describe yourself?',
            },
            {
              speaker: 'Maria',
              swedish: 'Jag är en motiverad och arbetsam person.',
              english: 'I am a motivated and hard-working person.',
            },
          ],
        },
        {
          heading: 'Tutorial speaking models',
          content: [
            'A1 model: “Jag arbetar som programmerare. Jag arbetar på ett företag. Jag använder engelska på jobbet, men jag vill lära mig mer svenska.”',
            'A2 model: “Jag arbetar som mjukvaruutvecklare. På jobbet använder jag oftast engelska, men ibland behöver jag svenska i vardagliga situationer.”',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'utvecklare',
          english: 'developer',
          exampleSwedish: 'Han jobbar som utvecklare.',
          exampleEnglish: 'He works as a developer.',
        },
        {
          swedish: 'chef',
          english: 'manager / boss',
          exampleSwedish: 'Hon är chef på företaget.',
          exampleEnglish: 'She is a manager at the company.',
        },
        {
          swedish: 'ingenjör',
          english: 'engineer',
          exampleSwedish: 'Jag är ingenjör.',
          exampleEnglish: 'I am an engineer.',
        },
      ],
    },
    {
      day: 16,
      summary:
        'Your food and grocery notes expand the course food lesson into real shopping and meal language.',
      sourceDates: ['May 8, 2026', 'Apr 18, 2026'],
      grammarTopicIds: ['negation-and-adverbs'],
      sections: [
        {
          heading: 'Food groups from class',
          table: [
            { Swedish: 'grönsaker', English: 'vegetables' },
            { Swedish: 'frukt', English: 'fruit' },
            { Swedish: 'kött / fisk / ost', English: 'meat / fish / cheese' },
            { Swedish: 'mjölk / smör / bröd', English: 'milk / butter / bread' },
          ],
        },
        {
          heading: 'Shopping-list pattern',
          content: [
            'Your notes add a practical frame for food planning: “Jag skriver en inköpslista när jag går till affären.” This belongs here because it turns vocabulary into actual use.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'inköpslista',
          english: 'shopping list',
          exampleSwedish: 'Jag skriver en inköpslista.',
          exampleEnglish: 'I write a shopping list.',
        },
        {
          swedish: 'grönsaker',
          english: 'vegetables',
          exampleSwedish: 'Vi köper grönsaker idag.',
          exampleEnglish: 'We are buying vegetables today.',
        },
        {
          swedish: 'jordgubbar',
          english: 'strawberries',
          exampleSwedish: 'Jag gillar jordgubbar.',
          exampleEnglish: 'I like strawberries.',
        },
      ],
    },
    {
      day: 23,
      summary:
        'Your number, date, and clock notes are more detailed than the original lesson, especially around halv and ordinal dates.',
      sourceDates: ['May 6, 2026', 'May 8, 2026', 'Learn Swedish Lab, 2025'],
      grammarTopicIds: ['numbers-dates-and-time'],
      sections: [
        {
          heading: 'Class note time patterns',
          list: [
            '5:30 = halv sex',
            '8:30 = halv nio',
            '12:30 = halv ett / halv tretton',
            'prick = on the dot',
          ],
        },
        {
          heading: 'Dates from class',
          table: [
            {
              Swedish: 'Vad är det för datum idag?',
              English: 'What is the date today?',
            },
            {
              Swedish: 'Idag är den 8:e maj.',
              English: 'Today is the 8th of May.',
            },
            {
              Swedish: 'Testet är den 30:e augusti.',
              English: 'The test is on the 30th of August.',
            },
          ],
        },
        {
          heading: 'Clock phrases from the ebook',
          list: [
            'fem prick = 17:00',
            'tio över fem = 17:10',
            'kvart över fem = 17:15',
            'halv sex = 17:30',
            'kvart i sex = 17:45',
            'fem i sex = 17:55',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'datum',
          english: 'date',
          exampleSwedish: 'Vad är det för datum idag?',
          exampleEnglish: 'What is the date today?',
        },
        {
          swedish: 'prick',
          english: 'on the dot',
          exampleSwedish: 'Mötet börjar klockan fem prick.',
          exampleEnglish: 'The meeting starts at five on the dot.',
        },
        {
          swedish: 'kvart',
          english: 'quarter',
          exampleSwedish: 'Klockan är kvart över fem.',
          exampleEnglish: 'It is quarter past five.',
        },
      ],
    },
    {
      day: 25,
      summary:
        'Your clothing and shopping notes strengthen this lesson by making it more realistic for stores and descriptions.',
      sourceDates: ['May 6, 2026'],
      grammarTopicIds: ['adjective-agreement', 'plurals'],
      sections: [
        {
          heading: 'Clothes and shopping language from class',
          table: [
            { Swedish: 'klänning / skjorta / tröja', English: 'dress / shirt / sweater' },
            { Swedish: 'byxor / skor / stövlar', English: 'trousers / shoes / boots' },
            { Swedish: 'på rea / rabatt', English: 'on sale / discount' },
            { Swedish: 'Jag har ... på mig.', English: 'I am wearing ...' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'bekväm',
          english: 'comfortable',
          exampleSwedish: 'Jag köpte en bekväm skjorta.',
          exampleEnglish: 'I bought a comfortable shirt.',
        },
        {
          swedish: 'rabatt',
          english: 'discount',
          exampleSwedish: 'Den här jackan har rabatt.',
          exampleEnglish: 'This jacket has a discount.',
        },
      ],
    },
    {
      day: 34,
      summary:
        'Your class notes give stronger placement rules for inte, också, heller, and frequency adverbs.',
      sourceDates: ['Apr 18, 2026', 'May 2, 2026', 'May 9, 2026'],
      grammarTopicIds: ['negation-and-adverbs'],
      sections: [
        {
          heading: 'Adverb slot from class',
          content: [
            'Your notes repeat the same high-value rule: inte, också, alltid, ofta, sällan, and aldrig sit in the same adverbial slot. That is why “Jag vill inte läsa”, “Jag vill också läsa”, and “Jag läser ofta hemma” follow parallel patterns.',
          ],
        },
        {
          heading: 'Model patterns',
          table: [
            {
              Swedish: 'Jag vill inte läsa en bok.',
              English: 'I do not want to read a book.',
            },
            {
              Swedish: 'Jag vill också köpa en banan.',
              English: 'I also want to buy a banana.',
            },
            {
              Swedish: 'Jag går alltid på gymmet efter jobbet.',
              English: 'I always go to the gym after work.',
            },
            {
              Swedish: 'Jag bakar kakor ibland.',
              English: 'I bake cakes sometimes.',
            },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'heller',
          english: 'either / neither',
          exampleSwedish: 'Jag gillar inte heller Anna.',
          exampleEnglish: 'I do not like Anna either.',
        },
        {
          swedish: 'aldrig',
          english: 'never',
          exampleSwedish: 'Jag ljuger aldrig.',
          exampleEnglish: 'I never lie.',
        },
      ],
    },
    {
      day: 35,
      summary:
        'Your adjective notes go farther than the base lesson because they cover en, ett, plural, and definite adjective forms.',
      sourceDates: ['Apr 25, 2026', 'May 6, 2026', 'Learn Swedish Lab, 2025'],
      grammarTopicIds: ['adjective-agreement', 'noun-gender-and-definite-form'],
      sections: [
        {
          heading: 'Adjective agreement from class',
          table: [
            { Form: 'en noun', Example: 'en rolig dag' },
            { Form: 'ett noun', Example: 'ett roligt jobb' },
            { Form: 'plural', Example: 'roliga filmer' },
            { Form: 'definite / possessive', Example: 'den nya bilen / min nya bil' },
          ],
        },
        {
          heading: 'Story-based adjective contrasts',
          table: [
            { Form: 'en noun', Example: 'en rolig film' },
            { Form: 'ett noun', Example: 'ett roligt jobb' },
            { Form: 'ett noun', Example: 'ett nytt hem' },
            { Form: 'en noun', Example: 'en liten stad' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'viktig',
          english: 'important',
          exampleSwedish: 'Det är ett viktigt projekt.',
          exampleEnglish: 'It is an important project.',
        },
        {
          swedish: 'tråkig',
          english: 'boring',
          exampleSwedish: 'Mötet är tråkigt.',
          exampleEnglish: 'The meeting is boring.',
        },
        {
          swedish: 'charmig',
          english: 'charming',
          exampleSwedish: 'Jag tycker att ett charmigt hus på landet är bättre.',
          exampleEnglish: 'I think a charming house in the countryside is better.',
        },
      ],
    },
    {
      day: 43,
      summary:
        'Your health notes add much more usable doctor language than the original lesson, especially body-part pain and appointment phrases.',
      sourceDates: [
        'May 2, 2026',
        'Apr 18, 2026',
        'Learn Swedish Lab, 2025',
        'Swedish A1-A2 tutorial',
      ],
      grammarTopicIds: ['health-phrases'],
      sections: [
        {
          heading: 'Health phrases from class',
          table: [
            {
              Swedish: 'Jag har ont i huvudet.',
              English: 'I have a headache.',
            },
            {
              Swedish: 'Jag är förkyld.',
              English: 'I have a cold.',
            },
            {
              Swedish: 'Jag hostar.',
              English: 'I have a cough.',
            },
            {
              Swedish: 'Jag har tid hos läkaren.',
              English: 'I have an appointment with the doctor.',
            },
          ],
        },
        {
          heading: 'Doctor visit extract',
          dialogue: [
            {
              speaker: 'Peter',
              swedish: 'Jag har ont i huvudet varje dag.',
              english: 'I have a headache every day.',
            },
            {
              speaker: 'Läkaren',
              swedish: 'Dricker du tillräckligt vatten?',
              english: 'Do you drink enough water?',
            },
            {
              speaker: 'Peter',
              swedish: 'Ja, två liter varje dag.',
              english: 'Yes, two liters every day.',
            },
            {
              speaker: 'Läkaren',
              swedish: 'Jag tycker att din huvudvärk beror på stress.',
              english: 'I think your headache is caused by stress.',
            },
          ],
        },
        {
          heading: 'Emergency call model',
          dialogue: [
            {
              speaker: 'Operatör',
              swedish: '112, hur kan jag hjälpa dig?',
              english: '112, how can I help you?',
            },
            {
              speaker: 'Du',
              swedish: 'Hej, jag ser en person som ligger på gatan.',
              english: 'Hi, I see a person lying in the street.',
            },
            {
              speaker: 'Operatör',
              swedish: 'Andas personen?',
              english: 'Is the person breathing?',
            },
            {
              speaker: 'Du',
              swedish: 'Ja, men personen svarar inte.',
              english: 'Yes, but the person is not responding.',
            },
          ],
        },
        {
          heading: 'Wellbeing speaking support',
          content: [
            'A1 model: “När jag är sjuk vilar jag hemma. Jag dricker vatten och sover mycket. Om jag har feber ringer jag läkaren.”',
            'A2 model: “Jag försöker ta hand om min hälsa. Jag promenerar ofta, äter ganska hälsosam mat och försöker sova tillräckligt.”',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'läkartid',
          english: 'doctor appointment',
          exampleSwedish: 'Jag kan inte träffas idag, jag har läkartid.',
          exampleEnglish: 'I cannot meet today, I have a doctor appointment.',
        },
        {
          swedish: 'värktabletter',
          english: 'painkillers',
          exampleSwedish: 'Jag behöver värktabletter.',
          exampleEnglish: 'I need painkillers.',
        },
      ],
    },
    {
      day: 44,
      summary:
        'Your weather notes give a much better everyday set for Helsinki-style small talk and temperature descriptions.',
      sourceDates: ['May 9, 2026', 'Learn Swedish Lab, 2025', 'Swedish A1-A2 tutorial'],
      grammarTopicIds: ['weather-patterns'],
      sections: [
        {
          heading: 'Weather set from class',
          table: [
            { Swedish: 'Det regnar.', English: 'It is raining.' },
            { Swedish: 'Det snöar.', English: 'It is snowing.' },
            { Swedish: 'Det blåser.', English: 'It is windy.' },
            { Swedish: 'Det är mulet.', English: 'It is cloudy.' },
          ],
        },
        {
          heading: 'Expanded weather set from the ebook',
          table: [
            { Swedish: 'solen skiner', English: 'the sun is shining' },
            { Swedish: 'det är molnigt', English: 'it is cloudy' },
            { Swedish: 'det är dimmigt', English: 'it is foggy' },
            { Swedish: 'vinden blåser', English: 'the wind is blowing' },
            { Swedish: 'det finns en regnbåge', English: 'there is a rainbow' },
          ],
        },
        {
          heading: 'Environment phrases from the tutorial',
          content: [
            'The tutorial ties weather and nature to opinions: “Jag tycker om naturen”, “Vi måste skydda miljön”, and “Jag sorterar plast, papper och glas.”',
            'It also gives a stronger A2 speaking frame: explain why clean air, clean water, recycling, and using less plastic matter to you.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'mulet',
          english: 'cloudy',
          exampleSwedish: 'Det är mulet idag.',
          exampleEnglish: 'It is cloudy today.',
        },
        {
          swedish: 'åskar',
          english: 'there is a storm / thunder',
          exampleSwedish: 'Det åskar ikväll.',
          exampleEnglish: 'It is stormy tonight.',
        },
        {
          swedish: 'dimma',
          english: 'fog',
          exampleSwedish: 'Det är dimmigt på morgonen.',
          exampleEnglish: 'There is fog in the morning.',
        },
      ],
    },
    {
      day: 45,
      summary:
        'Your free-time notes add brukar, gärna, and a broader hobbies set that makes this lesson much more personal.',
      sourceDates: ['Apr 24, 2026', 'Learn Swedish Lab, 2025'],
      grammarTopicIds: ['modal-and-helper-verbs', 'negation-and-adverbs'],
      sections: [
        {
          heading: 'Habit language from class',
          content: [
            'Your notes introduce brukar as a strong everyday helper verb for habits. This belongs here because hobbies and routines are exactly where Swedish learners use it most.',
          ],
        },
        {
          heading: 'Model patterns',
          table: [
            {
              Swedish: 'Jag brukar träna på gymmet på morgonen.',
              English: 'I usually work out at the gym in the morning.',
            },
            {
              Swedish: 'Jag spelar gärna datorspel.',
              English: 'I gladly / like to play video games.',
            },
            {
              Swedish: 'På fritiden brukar jag läsa en bok.',
              English: 'In my free time I usually read a book.',
            },
          ],
        },
        {
          heading: 'Free-time profiles from the ebook',
          content: [
            'The ebook adds stronger lifestyle examples for this page: going to the sea every year, playing video games at the weekend, staying home with a book, taking a cooking course, and training at the gym in the morning.',
            'It also adds dream language: “Jag vill bli fotograf”, “Jag ser upp till honom”, and “Nu vill jag prova att vara journalist.” Those patterns connect hobbies to future identity.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'brukar',
          english: 'usually / tend to',
          exampleSwedish: 'Jag brukar fika på helgen.',
          exampleEnglish: 'I usually have fika at the weekend.',
        },
        {
          swedish: 'gärna',
          english: 'gladly / like to',
          exampleSwedish: 'Han lyssnar gärna på musik.',
          exampleEnglish: 'He likes listening to music.',
        },
        {
          swedish: 'semester',
          english: 'holiday / vacation',
          exampleSwedish: 'Just nu är jag på semester med min mamma.',
          exampleEnglish: 'Right now I am on holiday with my mother.',
        },
      ],
    },
    {
      day: 51,
      summary:
        'Your Apr 29 notes give a more structured past-tense system, plus diary practice instructions that belong with the past-tense unit.',
      sourceDates: ['Apr 29, 2026', 'Learn Swedish Lab, 2025', 'Swedish A1-A2 tutorial'],
      grammarTopicIds: ['preteritum', 'som-relative-pronoun', 'hem-vs-hemma'],
      sections: [
        {
          heading: 'Past-time markers from class',
          list: [
            'igår = yesterday',
            'förra veckan = last week',
            'förra året = last year',
            'för en månad sedan = a month ago',
          ],
        },
        {
          heading: 'Diary task idea from class',
          content: [
            'Your notes suggest short weekly diary entries in the past tense. That is a good A1 bridge from isolated verb forms to connected narrative: “Idag vaknade jag sent. På eftermiddagen spelade jag spel.”',
          ],
        },
        {
          heading: 'Strong past verbs from the ebook',
          table: [
            { Present: 'är', Past: 'var' },
            { Present: 'kommer', Past: 'kom' },
            { Present: 'går', Past: 'gick' },
            { Present: 'skriver', Past: 'skrev' },
            { Present: 'äter', Past: 'åt' },
            { Present: 'dricker', Past: 'drack' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'förra veckan',
          english: 'last week',
          exampleSwedish: 'Förra veckan jobbade jag mycket.',
          exampleEnglish: 'Last week I worked a lot.',
        },
        {
          swedish: 'för ett år sedan',
          english: 'a year ago',
          exampleSwedish: 'Jag bodde i Spanien för ett år sedan.',
          exampleEnglish: 'I lived in Spain a year ago.',
        },
      ],
    },
    {
      day: 12,
      summary:
        'The Learn Swedish Lab ebook adds stronger possessive patterns through family, relationship, and ownership examples.',
      sourceDates: ['Learn Swedish Lab, 2025', 'Swedish A1-A2 tutorial'],
      sections: [
        {
          heading: 'Possessive patterns from the ebook',
          table: [
            { Swedish: 'min kropp', English: 'my body' },
            { Swedish: 'mitt humör', English: 'my mood' },
            { Swedish: 'dina barn', English: 'your children' },
            { Swedish: 'deras familj', English: 'their family' },
            { Swedish: 'sitt eget skrivbord', English: 'his or her own desk' },
          ],
        },
        {
          heading: 'Useful reminder',
          content: [
            'The ebook keeps possessives practical by putting them inside real relationships: my health, your children, their marriage, and one\'s own things. That makes this page more useful than isolated word pairs.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'äktenskap',
          english: 'marriage',
          exampleSwedish: 'Hennes ord kan förstöra mitt äktenskap.',
          exampleEnglish: 'Her words can ruin my marriage.',
        },
        {
          swedish: 'eget',
          english: 'own',
          exampleSwedish: 'Efter detta städar Nils bara sitt eget skrivbord.',
          exampleEnglish: 'After that, Nils only cleans his own desk.',
        },
      ],
    },
    {
      day: 14,
      summary:
        'The ebook adds a clearer contrast between infinitive and imperative through short commands and helper-verb sentences.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Infinitive and imperative pairs',
          table: [
            { Infinitive: 'sitta', Imperative: 'sitt' },
            { Infinitive: 'komma', Imperative: 'kom' },
            { Infinitive: 'grilla', Imperative: 'grilla' },
            { Infinitive: 'lyssna', Imperative: 'lyssna' },
          ],
        },
        {
          heading: 'Short command scene',
          dialogue: [
            {
              speaker: 'Maria',
              swedish: 'När kommer du hem, Peter? Kom snabbt!',
              english: 'When are you coming home, Peter? Come quickly!',
            },
            {
              speaker: 'Peter',
              swedish: 'Sitt!',
              english: 'Sit!',
            },
            {
              speaker: 'Peter',
              swedish: 'Kan du sitta, snälla?',
              english: 'Can you sit, please?',
            },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'snälla',
          english: 'please',
          exampleSwedish: 'Kan du sitta, snälla?',
          exampleEnglish: 'Can you sit, please?',
        },
        {
          swedish: 'snabbt',
          english: 'quickly',
          exampleSwedish: 'Kom snabbt!',
          exampleEnglish: 'Come quickly!',
        },
      ],
    },
    {
      day: 18,
      summary:
        'The ebook gives this noun-gender lesson a much larger bank of useful ett words from work, home, and everyday life.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Useful ett nouns from work and study',
          table: [
            { Swedish: 'ett jobb', English: 'a job' },
            { Swedish: 'ett mejl', English: 'an email' },
            { Swedish: 'ett möte', English: 'a meeting' },
            { Swedish: 'ett företag', English: 'a company' },
            { Swedish: 'ett projekt', English: 'a project' },
            { Swedish: 'ett schema', English: 'a schedule' },
          ],
        },
        {
          heading: 'Useful ett nouns from home and daily life',
          table: [
            { Swedish: 'ett hus', English: 'a house' },
            { Swedish: 'ett rum', English: 'a room' },
            { Swedish: 'ett kök', English: 'a kitchen' },
            { Swedish: 'ett kylskåp', English: 'a fridge' },
            { Swedish: 'ett barn', English: 'a child' },
            { Swedish: 'ett språk', English: 'a language' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'ett schema',
          english: 'a schedule',
          exampleSwedish: 'Jag skriver allt i ett schema.',
          exampleEnglish: 'I write everything in a schedule.',
        },
        {
          swedish: 'ett språk',
          english: 'a language',
          exampleSwedish: 'Svenska är ett språk.',
          exampleEnglish: 'Swedish is a language.',
        },
      ],
    },
    {
      day: 19,
      summary:
        'The ebook expands plurals with concrete group patterns, toy examples, and family vocabulary.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Plural pattern examples from the ebook',
          table: [
            { Singular: 'en bil', Plural: 'två bilar' },
            { Singular: 'en pojke', Plural: 'två pojkar' },
            { Singular: 'ett äpple', Plural: 'tre äpplen' },
            { Singular: 'ett problem', Plural: 'många problem' },
            { Singular: 'en klänning', Plural: 'många klänningar' },
          ],
        },
        {
          heading: 'Why this helps',
          content: [
            'The ebook does a good job of showing plurals inside stories: boys with toy cars, fruit salads, museum tickets, pets, dresses, and shoes on sale. That makes the patterns easier to remember than bare tables alone.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'biljetter',
          english: 'tickets',
          exampleSwedish: 'Andreas köper biljetter på nätet just nu.',
          exampleEnglish: 'Andreas is buying tickets online right now.',
        },
        {
          swedish: 'fruktsallader',
          english: 'fruit salads',
          exampleSwedish: 'Lena gör två fruktsallader till sina söner.',
          exampleEnglish: 'Lena is making two fruit salads for her sons.',
        },
      ],
    },
    {
      day: 21,
      summary:
        'The ebook anchors weekdays in a real weekly story and mixes past and future plans in a useful way.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Weekday timeline from the ebook',
          table: [
            { Day: 'måndag', Example: 'På måndag har jag ett viktigt möte med chefen.' },
            { Day: 'tisdag', Example: 'I tisdags glömde jag min kamera.' },
            { Day: 'onsdag', Example: 'På onsdagar tränar jag alltid på gymmet.' },
            { Day: 'torsdag', Example: 'I torsdags var det Marias födelsedagsfest.' },
            { Day: 'lördag', Example: 'På lördag har jag en dejt.' },
            { Day: 'söndag', Example: 'Jag kom tillbaka i söndags.' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'i måndags',
          english: 'last Monday',
          exampleSwedish: 'Jag hade så mycket att göra i måndags.',
          exampleEnglish: 'I had so much to do last Monday.',
        },
        {
          swedish: 'på onsdagar',
          english: 'on Wednesdays',
          exampleSwedish: 'På onsdagar tränar jag alltid på gymmet.',
          exampleEnglish: 'On Wednesdays I always work out at the gym.',
        },
      ],
    },
    {
      day: 28,
      summary:
        'The ebook adds a full directions scene with turns, landmarks, bus changes, and walking distance.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Direction patterns from the ebook',
          table: [
            { Swedish: 'sväng till vänster', English: 'turn left' },
            { Swedish: 'gå rakt fram', English: 'go straight ahead' },
            { Swedish: 'ta den andra gatan till höger', English: 'take the second street on the right' },
            { Swedish: 'gå förbi en sjö', English: 'walk past a lake' },
            { Swedish: 'gå av efter två stationer', English: 'get off after two stops' },
          ],
        },
        {
          heading: 'Travel option reminder',
          content: [
            'The ebook also adds practical transport language to this page: byta till buss nummer 7, hållplats, stationer, and meter. Those chunks fit naturally with this town-navigation lesson.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'hållplats',
          english: 'stop / bus stop',
          exampleSwedish: 'Bussen går från hållplatsen Glass.',
          exampleEnglish: 'The bus leaves from the stop called Glass.',
        },
        {
          swedish: 'korsning',
          english: 'intersection',
          exampleSwedish: 'Efter två korsningar ser du restaurangen.',
          exampleEnglish: 'After two intersections you see the restaurant.',
        },
      ],
    },
    {
      day: 41,
      summary:
        'The ebook makes the supermarket lesson richer with quantity words, grocery-list items, and milk-shopping questions.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Shopping list language from the ebook',
          table: [
            { Swedish: 'en burk tomatsås', English: 'a can of tomato sauce' },
            { Swedish: 'två kilo mjöl', English: 'two kilos of flour' },
            { Swedish: 'tre paket mjölk', English: 'three cartons of milk' },
            { Swedish: 'fyra hekto svamp', English: 'four hectograms of mushrooms' },
            { Swedish: 'nio korvar', English: 'nine sausages' },
            { Swedish: 'tolv påsar godis', English: 'twelve bags of candy' },
          ],
        },
        {
          heading: 'Useful supermarket questions',
          list: [
            'Var ligger mjölk utan fett?',
            'Den är slut.',
            'När kommer vanlig mjölk?',
            'Nästa vecka.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'hekto',
          english: 'hectogram',
          exampleSwedish: 'Fyra hekto svamp, tack.',
          exampleEnglish: 'Four hectograms of mushrooms, please.',
        },
        {
          swedish: 'burk',
          english: 'can / jar',
          exampleSwedish: 'Jag behöver en burk tomatsås.',
          exampleEnglish: 'I need a can of tomato sauce.',
        },
      ],
    },
    {
      day: 42,
      summary:
        'The ebook contributes a clean restaurant dialogue that covers ordering, dietary questions, changing tables, and paying.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Restaurant dialogue excerpt',
          dialogue: [
            {
              speaker: 'Servitör',
              swedish: 'Vad vill ni dricka?',
              english: 'What would you like to drink?',
            },
            {
              speaker: 'Nora',
              swedish: 'Jag tar ett glas vin.',
              english: 'I will have a glass of wine.',
            },
            {
              speaker: 'Gäst',
              swedish: 'Jag tål inte gluten, vad kan du rekommendera då?',
              english: 'I cannot tolerate gluten, what can you recommend then?',
            },
            {
              speaker: 'Nora',
              swedish: 'Har ni några veganska alternativ?',
              english: 'Do you have any vegan options?',
            },
            {
              speaker: 'Servitör',
              swedish: 'Kan vi få notan?',
              english: 'Can we get the bill?',
            },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'notan',
          english: 'the bill',
          exampleSwedish: 'Kan vi få notan?',
          exampleEnglish: 'Can we get the bill?',
        },
        {
          swedish: 'dricksa',
          english: 'tip',
          exampleSwedish: 'Hur mycket ska vi dricksa?',
          exampleEnglish: 'How much should we tip?',
        },
      ],
    },
    {
      day: 48,
      summary:
        'The ebook strengthens the home lesson with realistic housing preferences for renting, buying, and living near services.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Housing preferences from the ebook',
          table: [
            { Swedish: 'två rum och kök', English: 'two rooms and a kitchen' },
            { Swedish: 'stora fönster och mycket ljus', English: 'large windows and lots of light' },
            { Swedish: 'gångavstånd till en skola', English: 'walking distance to a school' },
            { Swedish: 'en balkong med utsikt över en park', English: 'a balcony with a view over a park' },
            { Swedish: 'ett hus på landet på 80 kvm', English: 'a house in the countryside of 80 square meters' },
            { Swedish: 'ett renoveringsobjekt', English: 'a renovation project property' },
          ],
        },
        {
          heading: 'Quiet-area pattern',
          content: [
            'One of the stronger housing descriptions in the ebook is the home-office version: a renovated studio apartment, a quiet area, and nature nearby so you can exercise and manage stress.',
          ],
        },
        {
          heading: 'Tutorial speaking models',
          content: [
            'A1 model: “Jag bor i en lägenhet. Den är ganska liten, men den är fin. Jag har ett sovrum, ett kök och ett badrum.”',
            'A2 model: “Jag bor i en tvåa nära centrum. Det bästa är att det finns en busshållplats nära huset, men hyran är ganska hög.”',
          ],
        },
        {
          heading: 'Friend visits your home',
          dialogue: [
            {
              speaker: 'Vän',
              swedish: 'Hej! Förlåt att jag är sen.',
              english: 'Hi! Sorry that I am late.',
            },
            {
              speaker: 'Du',
              swedish: 'Ingen fara. Välkommen! Vad roligt att du kunde komma.',
              english: 'No problem. Welcome! How nice that you could come.',
            },
            {
              speaker: 'Vän',
              swedish: 'Du har ett fint hem.',
              english: 'You have a nice home.',
            },
            {
              speaker: 'Du',
              swedish: 'Tack! Det är inte så stort, men jag trivs här.',
              english: 'Thanks! It is not so big, but I like living here.',
            },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'gångavstånd',
          english: 'walking distance',
          exampleSwedish: 'Lägenheten är på gångavstånd till affärer.',
          exampleEnglish: 'The apartment is within walking distance of shops.',
        },
        {
          swedish: 'balkong',
          english: 'balcony',
          exampleSwedish: 'En balkong blir också bra.',
          exampleEnglish: 'A balcony would also be good.',
        },
      ],
    },
    {
      day: 52,
      summary:
        'The ebook gives this past-tense lesson stronger narrative practice through parties, dates, diaries, and warning letters.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Past-tense story cues',
          list: [
            'Sara kom till Sofias hus igår.',
            'Sofia blev mycket glad när hon såg boken.',
            'På festen spelade de musik och dansade.',
            'Efter festen läste Sofia boken.',
          ],
        },
        {
          heading: 'Diary and letter angle',
          content: [
            'The ebook also gives you two useful past-tense text types: a diary entry about a secret relationship and a warning email to a friend. Both are good models for connected A1 storytelling.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'bokade',
          english: 'booked',
          exampleSwedish: 'Jag bokade bord på en fin restaurang.',
          exampleEnglish: 'I booked a table at a nice restaurant.',
        },
        {
          swedish: 'väntade',
          english: 'waited',
          exampleSwedish: 'Jag väntade på Nora.',
          exampleEnglish: 'I waited for Nora.',
        },
      ],
    },
    {
      day: 53,
      summary:
        'The ebook gives this future lesson a wider set of forms: ska, kommer att, tänker, and present tense for future plans.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Future patterns from the ebook',
          table: [
            { Pattern: 'ska', Example: 'Först ska jag plugga svenska.' },
            { Pattern: 'kommer att', Example: 'Det kommer att bli roligt.' },
            { Pattern: 'tänker', Example: 'Nästa år tänker jag inte sitta hemma.' },
            { Pattern: 'presens for plan', Example: 'Nästa år fyller jag 30.' },
          ],
        },
        {
          heading: 'Planning language',
          content: [
            'The ebook keeps future Swedish personal: celebrate results, travel on holiday, change jobs, find new friends, and maybe start a new hobby. That makes the grammar easier to reuse in speaking.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'skaffa',
          english: 'get / obtain',
          exampleSwedish: 'Kanske kommer jag att skaffa nya vänner.',
          exampleEnglish: 'Maybe I will get new friends.',
        },
        {
          swedish: 'hoppas',
          english: 'hope',
          exampleSwedish: 'Det kommer att bli roligt, hoppas jag.',
          exampleEnglish: 'It will be fun, I hope.',
        },
      ],
    },
    {
      day: 54,
      summary:
        'The ebook gives the writing lesson a practical complaint email with warranty and refund language.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Complaint email language',
          table: [
            { Swedish: 'Jag skriver eftersom ...', English: 'I am writing because ...' },
            { Swedish: 'Jag är mycket besviken på produkten.', English: 'I am very disappointed with the product.' },
            { Swedish: 'Kan ni laga datorn eller ge pengarna tillbaka?', English: 'Can you repair the computer or give the money back?' },
            { Swedish: 'Garantin gäller fortfarande.', English: 'The warranty still applies.' },
            { Swedish: 'Kvittot är bifogat.', English: 'The receipt is attached.' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'kvitto',
          english: 'receipt',
          exampleSwedish: 'Kvittot är bifogat.',
          exampleEnglish: 'The receipt is attached.',
        },
        {
          swedish: 'garanti',
          english: 'warranty',
          exampleSwedish: 'Garantin gäller fortfarande.',
          exampleEnglish: 'The warranty still applies.',
        },
      ],
    },
    {
      day: 58,
      summary:
        'The final grammar material in the ebook adds a solid A1 introduction to present perfect through life experience, work, and travel.',
      sourceDates: ['Learn Swedish Lab, 2025'],
      sections: [
        {
          heading: 'Presens perfekt pattern',
          table: [
            { Pattern: 'har + supinum', Example: 'Jag har bott i Sverige i fem år.' },
            { Pattern: 'life experience', Example: 'Har du varit i Sverige någon gång?' },
            { Pattern: 'recent result', Example: 'Vi har just renoverat vår sommarstuga.' },
            { Pattern: 'not yet', Example: 'Vi har ännu inte badat i sjön.' },
          ],
        },
        {
          heading: 'Useful supine forms from the ebook',
          table: [
            { Infinitive: 'vara', Supine: 'varit' },
            { Infinitive: 'komma', Supine: 'kommit' },
            { Infinitive: 'gå', Supine: 'gått' },
            { Infinitive: 'skriva', Supine: 'skrivit' },
            { Infinitive: 'äta', Supine: 'ätit' },
            { Infinitive: 'dricka', Supine: 'druckit' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'ännu inte',
          english: 'not yet',
          exampleSwedish: 'Vi har ännu inte badat i sjön.',
          exampleEnglish: 'We have not yet swum in the lake.',
        },
        {
          swedish: 'någon gång',
          english: 'ever / at some point',
          exampleSwedish: 'Har du varit i Sverige någon gång?',
          exampleEnglish: 'Have you ever been to Sweden?',
        },
      ],
    },
    {
      day: 24,
      summary:
        'The tutorial adds ready-made daily-life speaking models so this lesson can move from isolated routine words to connected speech.',
      sourceDates: ['Swedish A1-A2 tutorial'],
      sections: [
        {
          heading: 'Daily-life speaking models',
          content: [
            'A1 model: “Jag vaknar klockan sju. Jag äter frukost och går till jobbet. Efter jobbet handlar jag mat.”',
            'A2 model: “På vardagar vaknar jag ungefär klockan sju. Först dricker jag kaffe och äter frukost. Sedan går jag till jobbet eller arbetar hemma.”',
          ],
        },
        {
          heading: 'Routine-building sentence frames',
          table: [
            { Swedish: 'Jag vaknar klockan ...', English: 'I wake up at ...' },
            { Swedish: 'Efter jobbet handlar jag mat.', English: 'After work I buy groceries.' },
            { Swedish: 'På kvällen lagar jag middag.', English: 'In the evening I cook dinner.' },
            { Swedish: 'Jag tycker om rutiner eftersom ...', English: 'I like routines because ...' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'vardag',
          english: 'weekday / everyday life',
          exampleSwedish: 'Rutiner gör vardagen enklare.',
          exampleEnglish: 'Routines make everyday life easier.',
        },
        {
          swedish: 'vaknar',
          english: 'wake up',
          exampleSwedish: 'Jag vaknar klockan sju.',
          exampleEnglish: 'I wake up at seven.',
        },
      ],
    },
    {
      day: 27,
      summary:
        'The tutorial expands this help lesson with fast reaction phrases that work in shops, phone calls, and everyday problem situations.',
      sourceDates: ['Swedish A1-A2 tutorial'],
      sections: [
        {
          heading: 'Core help phrases from the tutorial',
          table: [
            { Swedish: 'Kan du hjälpa mig?', English: 'Can you help me?' },
            { Swedish: 'Jag har ett problem.', English: 'I have a problem.' },
            { Swedish: 'Jag skulle vilja fråga en sak.', English: 'I would like to ask something.' },
            { Swedish: 'Vad ska jag göra?', English: 'What should I do?' },
            { Swedish: 'Kan du säga det igen?', English: 'Can you say that again?' },
          ],
        },
        {
          heading: 'Reaction pattern',
          content: [
            'The tutorial suggests a reliable reaction structure: react emotionally, ask one question, then offer help or advice. Example: “Vad tråkigt att höra. Hur mår du nu? Kan jag hjälpa dig med något?”',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'problem',
          english: 'problem',
          exampleSwedish: 'Jag har ett problem.',
          exampleEnglish: 'I have a problem.',
        },
        {
          swedish: 'ingen fara',
          english: 'no problem',
          exampleSwedish: 'Ingen fara, jag kan hjälpa dig.',
          exampleEnglish: 'No problem, I can help you.',
        },
      ],
    },
    {
      day: 40,
      summary:
        'The tutorial gives this writing-practice day reusable A1-A2 message structures for information requests, complaints, and invitations.',
      sourceDates: ['Swedish A1-A2 tutorial'],
      sections: [
        {
          heading: 'Short message template',
          list: [
            'Hej [name]!',
            'Jag hörde att [situation].',
            '[Reaction: Grattis / Vad tråkigt / Vad roligt].',
            'Vi kan [suggestion].',
            'Hälsningar, [name]',
          ],
        },
        {
          heading: 'Email and complaint templates',
          table: [
            {
              Type: 'information request',
              Swedish: 'Jag skriver eftersom jag vill fråga om ...',
            },
            {
              Type: 'complaint',
              Swedish: 'Jag skriver eftersom jag vill klaga på ...',
            },
            {
              Type: 'solution request',
              Swedish: 'Jag hoppas att ni kan lösa problemet snart.',
            },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'hälsningar',
          english: 'greetings / regards',
          exampleSwedish: 'Vänliga hälsningar, Anna',
          exampleEnglish: 'Kind regards, Anna',
        },
        {
          swedish: 'klaga',
          english: 'complain',
          exampleSwedish: 'Jag vill klaga på produkten.',
          exampleEnglish: 'I want to complain about the product.',
        },
      ],
    },
    {
      day: 46,
      summary:
        'The tutorial adds a compact invitation template that fits naturally with this lesson and makes it easier to write short social messages.',
      sourceDates: ['Swedish A1-A2 tutorial'],
      sections: [
        {
          heading: 'Invitation template',
          list: [
            'Hej!',
            'Jag vill bjuda dig till [event].',
            'Festen är på [day] klockan [time].',
            'Den är hemma hos mig / i [place].',
            'Hoppas att du kan komma!',
          ],
        },
        {
          heading: 'Model idea',
          content: [
            'The tutorial also includes an invitation to clean a playground together. That is a good reminder that invitations can be social, practical, or community-based, not only parties.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'bjuda',
          english: 'invite',
          exampleSwedish: 'Jag vill bjuda dig till min fest.',
          exampleEnglish: 'I want to invite you to my party.',
        },
        {
          swedish: 'välkommen',
          english: 'welcome',
          exampleSwedish: 'Alla är välkomna!',
          exampleEnglish: 'Everyone is welcome!',
        },
      ],
    },
    {
      day: 47,
      summary:
        'The tutorial adds stronger social reactions for accepting, declining, congratulating, and showing sympathy.',
      sourceDates: ['Swedish A1-A2 tutorial'],
      sections: [
        {
          heading: 'Useful social reactions',
          table: [
            { Swedish: 'Vad roligt!', English: 'How nice!' },
            { Swedish: 'Grattis!', English: 'Congratulations!' },
            { Swedish: 'Vad tråkigt att höra.', English: 'Sorry to hear that.' },
            { Swedish: 'Det låter bra.', English: 'That sounds good.' },
            { Swedish: 'Jag förstår.', English: 'I understand.' },
            { Swedish: 'Ta hand om dig.', English: 'Take care.' },
          ],
        },
        {
          heading: 'Polite apology model',
          content: [
            'One of the fast reaction lines from the tutorial fits this page well: “Förlåt, det var inte meningen. Jag ska vara tystare nästa gång.” It is short, polite, and realistic.',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'grattis',
          english: 'congratulations',
          exampleSwedish: 'Grattis till ditt nya jobb!',
          exampleEnglish: 'Congratulations on your new job!',
        },
        {
          swedish: 'det låter bra',
          english: 'that sounds good',
          exampleSwedish: 'Det låter bra, vi ses då.',
          exampleEnglish: 'That sounds good, see you then.',
        },
      ],
    },
    {
      day: 57,
      summary:
        'The tutorial gives this speaking-test lesson a clearer exam strategy for description, reaction, and opinion tasks.',
      sourceDates: ['Swedish A1-A2 tutorial'],
      sections: [
        {
          heading: 'Description strategy',
          list: [
            'Say what the topic is.',
            'Give 2-3 facts.',
            'Say your opinion.',
            'Give one reason.',
          ],
        },
        {
          heading: 'Opinion strategy',
          content: [
            'Use this frame: “Jag tycker att ... eftersom ... Till exempel ...” The tutorial recommends this because it turns short opinions into a complete A2-style answer.',
          ],
        },
        {
          heading: 'Reaction strategy',
          content: [
            'For reaction tasks, follow: emotional reaction, one question, then help or advice. Example: “Vad tråkigt att höra. Hur mår du nu? Kan jag hjälpa dig med något?”',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'enligt mig',
          english: 'in my opinion',
          exampleSwedish: 'Enligt mig är återvinning viktigt.',
          exampleEnglish: 'In my opinion recycling is important.',
        },
        {
          swedish: 'jag håller med',
          english: 'I agree',
          exampleSwedish: 'Jag håller med dig.',
          exampleEnglish: 'I agree with you.',
        },
      ],
    },
    {
      day: 59,
      summary:
        'The tutorial gives this revision day a compact 7-day speaking and writing plan plus high-frequency revision phrases.',
      sourceDates: ['Swedish A1-A2 tutorial'],
      sections: [
        {
          heading: 'Mini revision plan',
          list: [
            'People and home: speak for one minute about your home.',
            'Daily life: role-play shopping and directions.',
            'Nature: talk about Finnish nature and recycling.',
            'Health: practise calling your boss or emergency services.',
            'Work: talk about your job or studies.',
            'Opinions: practise “Jag tycker att ... eftersom ...”.',
            'Mock exam: do one speaking task, one reaction task, and one email.',
          ],
        },
        {
          heading: 'Mini revision phrases',
          table: [
            { Swedish: 'Jag behöver hjälp.', English: 'I need help.' },
            { Swedish: 'Vad kostar det?', English: 'How much does it cost?' },
            { Swedish: 'Jag håller inte med.', English: 'I disagree.' },
            { Swedish: 'Det fungerar inte.', English: 'It does not work.' },
            { Swedish: 'Vi ses!', English: 'See you!' },
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'repetition',
          english: 'revision / repetition',
          exampleSwedish: 'Repetition hjälper mig att minnas bättre.',
          exampleEnglish: 'Revision helps me remember better.',
        },
      ],
    },
    {
      day: 60,
      summary:
        'The tutorial gives the final course day ready-made practice prompts and a target answer shape for stronger A2 responses.',
      sourceDates: ['Swedish A1-A2 tutorial'],
      sections: [
        {
          heading: 'Final practice prompts',
          list: [
            'Berätta om ditt hem.',
            'Vad gör du en vanlig dag?',
            'Vad gör du om du är sjuk?',
            'Hur kan man skydda miljön?',
            'Vilket jobb har du eller vill du ha?',
            'Vad tycker du om kollektivtrafik?',
            'Hur ber du om hjälp i en butik?',
            'Hur säger du nej på ett artigt sätt?',
          ],
        },
        {
          heading: 'Target answer shape',
          content: [
            'The tutorial suggests a reliable A2 pattern for many final answers: “Jag tycker att ... eftersom ... Till exempel ... Därför ...”',
          ],
        },
      ],
      vocabulary: [
        {
          swedish: 'kollektivtrafik',
          english: 'public transport',
          exampleSwedish: 'Jag tycker att kollektivtrafik är praktiskt.',
          exampleEnglish: 'I think public transport is practical.',
        },
      ],
    },
    createTeachingAddition({
      day: 3,
      summary:
        'This lesson now teaches classroom phrases as survival language, not isolated formulas, so the learner can keep a conversation going even when they miss something.',
      content: [
        'Treat these phrases as control tools. A beginner does not need to understand everything immediately; they need to know how to slow the conversation down, ask for repetition, and signal confusion politely.',
        'Practice each phrase with a clear purpose: asking someone to repeat, asking what a word means, asking for help, and thanking the other person after they help you.',
      ],
      errors: [
        'Do not memorize only the English meaning. Pair each phrase with a real situation, such as class, a shop, or a phone call.',
        'Say the whole chunk, not just one word. Kan du hjälpa mig? is much stronger than only saying Hjälp.',
        'Repeat the phrases aloud until they feel automatic, because these are emergency expressions you need quickly.',
      ],
      tasks: [
        'Say three repair phrases in a row: Kan du säga det igen? Jag förstår inte. Kan du hjälpa mig?',
        'Roleplay a mini-dialogue where you do not hear a word and ask for clarification politely.',
        'Write two short classroom questions and answer them aloud.',
      ],
      vocabulary: [
        {
          swedish: 'Jag förstår inte riktigt.',
          english: 'I do not really understand.',
          exampleSwedish: 'Ursäkta, jag förstår inte riktigt.',
          exampleEnglish: 'Excuse me, I do not really understand.',
        },
        {
          swedish: 'Vad betyder det?',
          english: 'What does that mean?',
          exampleSwedish: 'Vad betyder det på engelska?',
          exampleEnglish: 'What does that mean in English?',
        },
      ],
    }),
    createTeachingAddition({
      day: 4,
      summary:
        'This lesson has been expanded so numbers become usable in real life: age, phone numbers, prices, room numbers, and slow careful dictation.',
      content: [
        'Numbers are not only vocabulary; they are listening training. Learners often know the numbers on paper but freeze when they hear them quickly. Move between reading, hearing, and saying them.',
        'Work especially with age and phone numbers, because those force you to pronounce digits clearly one by one and notice Swedish rhythm.',
      ],
      errors: [
        'Do not rush teen numbers. Check carefully that you hear and say them distinctly.',
        'When giving a phone number, say the digits clearly in groups instead of one long stream.',
        'Mix recognition and production: first listen and identify, then say your own examples.',
      ],
      tasks: [
        'Say your age, a fake phone number, and three random numbers between 0 and 20.',
        'Dictate five numbers to yourself slowly, then repeat them at natural speed.',
        'Ask and answer Hur gammal är du? with three different ages.',
      ],
      vocabulary: [
        {
          swedish: 'noll',
          english: 'zero',
          exampleSwedish: 'Telefonnumret börjar med noll.',
          exampleEnglish: 'The phone number starts with zero.',
        },
        {
          swedish: 'siffra',
          english: 'digit / number symbol',
          exampleSwedish: 'Kan du säga sista siffran igen?',
          exampleEnglish: 'Can you say the last digit again?',
        },
      ],
    }),
    createTeachingAddition({
      day: 5,
      summary:
        'This lesson now pushes the learner to build full identity sentences with country, language, and nationality information instead of naming isolated words.',
      content: [
        'At this stage, the important skill is combining facts: where you come from, where you live, what language you speak, and what language you are learning. That creates a useful self-introduction block.',
        'Teach country names and language names together, because learners often remember one without the other. Recycle them in the same sentence pattern several times.',
      ],
      errors: [
        'Do not stop at one-word answers like Sverige or engelska. Always grow them into full sentences.',
        'Notice the difference between a country and a language word. They are related, but not the same form.',
        'Repeat the sentence frame with several countries so the pattern becomes flexible.',
      ],
      tasks: [
        'Introduce yourself with country, home city, and languages you speak.',
        'Make three new sentences by changing only the country and language words.',
        'Ask another person Varifrån kommer du? and Vilka språk talar du?',
      ],
      vocabulary: [
        {
          swedish: 'nationalitet',
          english: 'nationality',
          exampleSwedish: 'Vad har du för nationalitet?',
          exampleEnglish: 'What nationality do you have?',
        },
        {
          swedish: 'språk',
          english: 'language',
          exampleSwedish: 'Svenska är ett språk som jag lär mig.',
          exampleEnglish: 'Swedish is a language that I am learning.',
        },
      ],
    }),
    createTeachingAddition({
      day: 7,
      summary:
        'This lesson now treats är as a sentence backbone: identity, description, and simple yes-no questions built from the same small structure.',
      content: [
        'A beginner should overlearn är because it appears everywhere: names, nationality, feelings, descriptions, and simple classification. The goal is fast accurate use, not grammar theory alone.',
        'Practice both statements and questions side by side. When the learner can switch between Du är trött. and Är du trött? the structure starts to become active.',
      ],
      errors: [
        'Do not confuse Jag är bra with Jag mår bra. Use är for identity or description, and mår for how you feel.',
        'Keep the word order stable when forming questions with är.',
        'Avoid overtranslating from English. Use short natural Swedish sentences first.',
      ],
      tasks: [
        'Make five sentences with är about yourself, your city, and your family.',
        'Turn each sentence into a yes-no question.',
        'Answer the questions with both yes and no responses.',
      ],
      vocabulary: [
        {
          swedish: 'viktig',
          english: 'important',
          exampleSwedish: 'Svenska är viktig för mig.',
          exampleEnglish: 'Swedish is important for me.',
        },
        {
          swedish: 'redo',
          english: 'ready',
          exampleSwedish: 'Jag är redo nu.',
          exampleEnglish: 'I am ready now.',
        },
      ],
    }),
    createTeachingAddition({
      day: 8,
      summary:
        'This lesson has been strengthened into a sentence-building workshop so the learner understands that Swedish meaning depends heavily on keeping the parts in the right order.',
      content: [
        'For early Swedish, sentence control matters more than long vocabulary lists. The learner should feel that a simple sentence has a dependable skeleton: subject first, verb second, then the rest.',
        'Use familiar vocabulary while training order. That way the learner focuses on structure instead of fighting new words at the same time.',
      ],
      errors: [
        'Do not drop the verb. Even a very short Swedish sentence normally needs a clear finite verb.',
        'Do not pile up words without structure. Build from small complete sentences first.',
        'Read your sentences aloud, because spoken rhythm often shows whether the order feels natural.',
      ],
      tasks: [
        'Build five short sentences from old vocabulary: person + verb + place or time.',
        'Replace one part in each sentence while keeping the order stable.',
        'Read the final five sentences aloud twice.',
      ],
      vocabulary: [
        {
          swedish: 'sen',
          english: 'later / late',
          exampleSwedish: 'Jag studerar senare ikväll.',
          exampleEnglish: 'I study later tonight.',
        },
        {
          swedish: 'hemma',
          english: 'at home',
          exampleSwedish: 'Jag är hemma nu.',
          exampleEnglish: 'I am at home now.',
        },
      ],
    }),
    createTeachingAddition({
      day: 10,
      summary:
        'This review day now works as a structured checkpoint so the learner actively combines the first nine lessons instead of only rereading them.',
      content: [
        'Review lessons should expose weak links. If a learner can greet people but cannot answer a basic question smoothly, that is the skill to repair before moving on.',
        'Move in three rounds: quick recall of vocabulary, short spoken answers, then one longer beginner conversation that mixes several earlier topics.',
      ],
      errors: [
        'Do not spend the whole review day reading notes silently. Production is the real test.',
        'When you get stuck, return to shorter sentences instead of freezing completely.',
        'Notice which old words you keep forgetting and recycle them deliberately.',
      ],
      tasks: [
        'Introduce yourself in four sentences without looking at old notes.',
        'Answer five old questions aloud with full sentences.',
        'Run a one-minute self-talk using greetings, name, country, age, and one simple question.',
      ],
      vocabulary: [
        {
          swedish: 'sammanfatta',
          english: 'summarize',
          exampleSwedish: 'Kan du sammanfatta dialogen?',
          exampleEnglish: 'Can you summarize the dialogue?',
        },
        {
          swedish: 'utan att titta',
          english: 'without looking',
          exampleSwedish: 'Försök svara utan att titta i boken.',
          exampleEnglish: 'Try to answer without looking in the book.',
        },
      ],
    }),
    createTeachingAddition({
      day: 15,
      summary:
        'This lesson now develops opinions more carefully so the learner can say not only what they like, but also give a small reason and contrast.',
      content: [
        'Likes and dislikes are high-value speaking material because they connect easily to food, hobbies, studies, places, and people. The learner should practice full opinion sentences, not just gillar or gillar inte.',
        'A strong beginner pattern is opinion plus reason: Jag gillar kaffe eftersom det är gott. That turns a basic A1 answer into a more useful A2-style response.',
      ],
      errors: [
        'Do not answer only with Ja or Nej when the topic is personal preference.',
        'Remember that gillar often needs an object: Jag gillar musik, not only Jag gillar.',
        'Use one reason word such as eftersom to make the answer more informative.',
      ],
      tasks: [
        'Give three likes and three dislikes with short reasons.',
        'Compare two things: Jag gillar te men jag gillar inte kaffe.',
        'Ask another person what they like and answer in a full sentence.',
      ],
      vocabulary: [
        {
          swedish: 'favorit',
          english: 'favorite',
          exampleSwedish: 'Min favoritmat är pasta.',
          exampleEnglish: 'My favorite food is pasta.',
        },
        {
          swedish: 'eftersom',
          english: 'because',
          exampleSwedish: 'Jag gillar svenska eftersom språket är fint.',
          exampleEnglish: 'I like Swedish because the language is beautiful.',
        },
      ],
    }),
    createTeachingAddition({
      day: 17,
      summary:
        'This café lesson now emphasizes rhythm and politeness so ordering feels natural and not like a word-by-word translation exercise.',
      content: [
        'The target is smooth service interaction: greeting, ordering, adding one detail, and finishing politely. Learners should hear the café as a predictable script they can control.',
        'Train set phrases in full chunks, especially Jag skulle vilja ha ... and Kan jag få ... because those patterns transfer to many public situations.',
      ],
      errors: [
        'Do not point and say only one noun. Practice full order sentences.',
        'Remember the social frame: greeting first, thanks at the end.',
        'Be ready for a follow-up question such as something to drink or eat.',
      ],
      tasks: [
        'Roleplay one complete café order from greeting to payment.',
        'Order the same thing in two different ways.',
        'Add one polite follow-up question such as Kan jag få kvittot?',
      ],
      vocabulary: [
        {
          swedish: 'meny',
          english: 'menu',
          exampleSwedish: 'Kan jag få menyn, tack?',
          exampleEnglish: 'Can I get the menu, please?',
        },
        {
          swedish: 'kvitto',
          english: 'receipt',
          exampleSwedish: 'Jag vill gärna ha kvittot.',
          exampleEnglish: 'I would like the receipt.',
        },
      ],
    }),
    createTeachingAddition({
      day: 20,
      summary:
        'This review day now consolidates family, food, café language, and noun basics through short roleplays that force the learner to switch topics quickly.',
      content: [
        'Mid-course reviews should increase flexibility. The learner already knows enough vocabulary to move from people to food to objects in the same conversation.',
        'Use roleplay because it reveals whether the learner can retrieve language under light pressure, which is closer to real communication than silent review.',
      ],
      errors: [
        'Do not review topics in isolation only. Mix them inside one conversation.',
        'If noun gender is still weak, slow down and say en or ett aloud together with the noun.',
        'Reuse old verbs actively so the review does not become a vocabulary list only.',
      ],
      tasks: [
        'Describe your family, then order food, then talk about one object around you.',
        'Do one two-minute roleplay that changes topic at least twice.',
        'Review ten nouns by saying article, singular, and meaning aloud.',
      ],
      vocabulary: [
        {
          swedish: 'rollspel',
          english: 'roleplay',
          exampleSwedish: 'Vi gör ett kort rollspel idag.',
          exampleEnglish: 'We are doing a short roleplay today.',
        },
        {
          swedish: 'blanda',
          english: 'mix',
          exampleSwedish: 'Försök att blanda gamla och nya ord.',
          exampleEnglish: 'Try to mix old and new words.',
        },
      ],
    }),
    createTeachingAddition({
      day: 22,
      summary:
        'This lesson now teaches dates as practical calendar language for birthdays, meetings, and appointments, not only as a memorization list of months.',
      content: [
        'Months become easier when tied to real personal information. Ask about birthdays, holidays, and important dates so the learner hears the month words in meaningful sentences.',
        'Pair spoken dates with written dates. Many beginners can recognize a date on paper but hesitate when saying it aloud.',
      ],
      errors: [
        'Do not learn month names in isolation only. Use them inside complete date phrases.',
        'Practice both asking and answering date questions.',
        'Revisit ordinal-style dates regularly so they become automatic.',
      ],
      tasks: [
        "Say today's date and your birthday in Swedish.",
        'Ask when three imaginary events happen.',
        'Make a mini-calendar with three dates and read it aloud.',
      ],
      vocabulary: [
        {
          swedish: 'födelsedag',
          english: 'birthday',
          exampleSwedish: 'Min födelsedag är i augusti.',
          exampleEnglish: 'My birthday is in August.',
        },
        {
          swedish: 'datum',
          english: 'date',
          exampleSwedish: 'Vilket datum är det idag?',
          exampleEnglish: 'What is the date today?',
        },
      ],
    }),
    createTeachingAddition({
      day: 26,
      summary:
        'This money lesson now trains the full exchange around prices: asking the cost, reacting, paying, and checking whether the learner understood the amount correctly.',
      content: [
        'Money language is partly vocabulary and partly listening accuracy. The learner must hear amounts clearly and confirm them when necessary.',
        'Practice price questions together with number review, because the real challenge is often catching the amount fast enough in speech.',
      ],
      errors: [
        'Do not assume you understood the number. Repeat the amount back if needed.',
        'Use full price questions politely instead of only saying Pris?',
        'Connect money language with buying actions such as card, cash, and receipt.',
      ],
      tasks: [
        'Ask the price of four objects and answer with invented amounts.',
        'Roleplay paying by card and by cash.',
        'Repeat five prices aloud until they sound natural.',
      ],
      vocabulary: [
        {
          swedish: 'kontant',
          english: 'cash',
          exampleSwedish: 'Betalar du kontant eller med kort?',
          exampleEnglish: 'Are you paying cash or by card?',
        },
        {
          swedish: 'det kostar',
          english: 'it costs',
          exampleSwedish: 'Det kostar hundra kronor.',
          exampleEnglish: 'It costs one hundred kronor.',
        },
      ],
    }),
    createTeachingAddition({
      day: 29,
      summary:
        'This transport lesson now focuses on movement through the city: asking where to go, what time something leaves, and which ticket or platform is needed.',
      content: [
        'Transport Swedish becomes much easier when learners imagine a journey step by step: choose the transport, ask about departure, ask about destination, and handle the ticket.',
        'Use timetable-style questions repeatedly, because those phrases are among the most practical in real life.',
      ],
      errors: [
        'Do not memorize bus, train, and ticket as isolated nouns. Put them into travel questions.',
        'Pay attention to departure and arrival language so you do not confuse where you start and where you are going.',
        'Reuse time expressions from earlier lessons inside transport sentences.',
      ],
      tasks: [
        'Ask when a bus leaves and where it goes.',
        'Describe one simple trip from home to another place.',
        'Roleplay buying a ticket and asking which platform you need.',
      ],
      vocabulary: [
        {
          swedish: 'hållplats',
          english: 'stop',
          exampleSwedish: 'Var ligger nästa hållplats?',
          exampleEnglish: 'Where is the next stop?',
        },
        {
          swedish: 'avgår',
          english: 'departs',
          exampleSwedish: 'När avgår tåget?',
          exampleEnglish: 'When does the train depart?',
        },
      ],
    }),
    createTeachingAddition({
      day: 30,
      summary:
        'This review day now acts as a practical checkpoint across time, shopping, directions, and transport so the learner proves they can survive common daily tasks in Swedish.',
      content: [
        'A review after Day 30 should feel like real-life rehearsal. The learner is no longer at the first-contact stage; they should start moving between different practical situations with less hesitation.',
        'Keep the review active: short oral answers, quick recall, and one small integrated scenario rather than passive rereading.',
      ],
      errors: [
        'Do not spend review time on topics you already know well while ignoring weak areas.',
        'Mix speaking and reading; one skill alone can hide gaps in the other.',
        'If a structure breaks down, rebuild with simple sentences and then expand again.',
      ],
      tasks: [
        'Tell the time, ask for a price, and ask for directions in one practice round.',
        'Run a mini-dialogue at a station or in a shop.',
        'Answer ten quick questions from Days 21-29 without opening earlier lessons.',
      ],
      vocabulary: [
        {
          swedish: 'kontrollera',
          english: 'check / verify',
          exampleSwedish: 'Kontrollera att du förstår frågan.',
          exampleEnglish: 'Check that you understand the question.',
        },
        {
          swedish: 'snabbt',
          english: 'quickly',
          exampleSwedish: 'Försök att svara snabbt men tydligt.',
          exampleEnglish: 'Try to answer quickly but clearly.',
        },
      ],
    }),
    createTeachingAddition({
      day: 31,
      summary:
        'This lesson now pushes present-tense control beyond recognition and into repeated personal use, because verbs are the engine of every later speaking task.',
      content: [
        'The learner should not only identify present-tense verb forms but also retrieve them quickly with common subjects and time expressions. Frequent verbs deserve heavy repetition.',
        'Teach verbs in sentence frames, not in isolation. A verb becomes usable when the learner can attach a subject and a real context immediately.',
      ],
      errors: [
        'Do not practice verbs as bare dictionary items only. Always say a full sentence.',
        'Return often to the most common verbs instead of chasing too many new ones at once.',
        'Watch subject-verb combinations so the sentence still sounds complete and natural.',
      ],
      tasks: [
        'Choose five present-tense verbs and use each in two personal sentences.',
        'Say what you usually do in the morning, afternoon, and evening.',
        'Turn three statements into questions and answer them.',
      ],
      vocabulary: [
        {
          swedish: 'nästan',
          english: 'almost',
          exampleSwedish: 'Jag arbetar nästan varje dag.',
          exampleEnglish: 'I work almost every day.',
        },
        {
          swedish: 'brukar',
          english: 'usually',
          exampleSwedish: 'Jag brukar läsa på kvällen.',
          exampleEnglish: 'I usually read in the evening.',
        },
      ],
    }),
    createTeachingAddition({
      day: 32,
      summary:
        'This lesson now makes statement word order more explicit so the learner can build longer sentences without losing the Swedish verb-second pattern.',
      content: [
        'Swedish sentences stay understandable when the learner knows where the finite verb belongs. This day should feel like architecture practice: move one part, then keep the verb stable.',
        'Train contrasts such as Jag arbetar hemma idag and Idag arbetar jag hemma. These small transformations build real grammatical control.',
      ],
      errors: [
        'Do not copy English order when a time word starts the sentence.',
        'After moving a time or place phrase to the front, make sure the verb still comes second.',
        'Keep sentences short enough that you can still hear the pattern clearly.',
      ],
      tasks: [
        'Write three normal-order sentences and rewrite them with a fronted time word.',
        'Read both versions aloud and notice the verb position.',
        'Make one sentence each with idag, hemma, and på jobbet at the front.',
      ],
      vocabulary: [
        {
          swedish: 'först',
          english: 'first',
          exampleSwedish: 'Först äter jag frukost.',
          exampleEnglish: 'First I eat breakfast.',
        },
        {
          swedish: 'sedan',
          english: 'then',
          exampleSwedish: 'Sedan arbetar jag hemma.',
          exampleEnglish: 'Then I work at home.',
        },
      ],
    }),
    createTeachingAddition({
      day: 33,
      summary:
        'This lesson now sharpens question building so the learner can ask for information confidently and not rely only on memorized fixed expressions.',
      content: [
        'Question control is a major turning point. Once learners can produce both yes-no questions and question-word questions, conversations stop feeling one-sided.',
        'Use old vocabulary when drilling questions. The challenge here is structure and response speed, not new topic vocabulary.',
      ],
      errors: [
        'Do not leave the verb in statement position when forming a yes-no question.',
        'Choose the correct question word before building the rest of the sentence.',
        'Always answer your own question in a full sentence for double practice.',
      ],
      tasks: [
        'Write five yes-no questions and five information questions.',
        'Ask about time, place, work, family, and plans.',
        'Practice fast question-answer pairs aloud.',
      ],
      vocabulary: [
        {
          swedish: 'vilken',
          english: 'which / what',
          exampleSwedish: 'Vilken buss tar du?',
          exampleEnglish: 'Which bus do you take?',
        },
        {
          swedish: 'vem',
          english: 'who',
          exampleSwedish: 'Vem arbetar här?',
          exampleEnglish: 'Who works here?',
        },
      ],
    }),
    createTeachingAddition({
      day: 36,
      summary:
        'This lesson now develops description as a layered skill: appearance, personality, and object description with simple but informative adjective combinations.',
      content: [
        'Describing people and things is more useful when learners move beyond one adjective. Encourage pairs such as liten men mysig or snäll och hjälpsam.',
        'Keep descriptions realistic and personal. The learner remembers adjectives better when describing familiar people, rooms, or daily objects.',
      ],
      errors: [
        'Do not use adjectives without a clear noun or context.',
        'Avoid repeating only bra and fin. Expand into a wider descriptive range.',
        'Check adjective form carefully if the lesson has already introduced agreement patterns.',
      ],
      tasks: [
        'Describe one person, one room, and one object in two sentences each.',
        'Use at least one contrast word such as men in every description.',
        'Compare two objects using simple adjectives.',
      ],
      vocabulary: [
        {
          swedish: 'hjälpsam',
          english: 'helpful',
          exampleSwedish: 'Min vän är väldigt hjälpsam.',
          exampleEnglish: 'My friend is very helpful.',
        },
        {
          swedish: 'stökig',
          english: 'messy',
          exampleSwedish: 'Rummet är lite stökigt idag.',
          exampleEnglish: 'The room is a little messy today.',
        },
      ],
    }),
    createTeachingAddition({
      day: 37,
      summary:
        'This lesson now treats prepositions as location maps so the learner can picture where things are instead of translating each preposition word by word.',
      content: [
        'Prepositions are easier when attached to a visual scene. Learners should imagine a room, a bag, or a table and place objects physically while speaking.',
        'Short location sentences are ideal repetition material because the grammar is small but the communication value is high.',
      ],
      errors: [
        'Do not study prepositions as a naked list only. Use an object and a place every time.',
        'Watch the difference between similar ideas such as on, in, under, and next to.',
        'Repeat the same scene with different objects so the structure becomes automatic.',
      ],
      tasks: [
        'Describe where five objects are in your room.',
        'Move one object in your imagination and say the new sentence.',
        'Ask and answer Var är ...? five times.',
      ],
      vocabulary: [
        {
          swedish: 'bredvid',
          english: 'next to',
          exampleSwedish: 'Lampan står bredvid sängen.',
          exampleEnglish: 'The lamp is next to the bed.',
        },
        {
          swedish: 'mellan',
          english: 'between',
          exampleSwedish: 'Butiken ligger mellan banken och kaféet.',
          exampleEnglish: 'The shop is between the bank and the cafe.',
        },
      ],
    }),
    createTeachingAddition({
      day: 38,
      summary:
        'This lesson now strengthens modal verbs as conversation tools for ability, necessity, permission, and desire rather than as isolated grammar labels.',
      content: [
        'Modal verbs unlock practical communication quickly. With kan, vill, måste, and får, learners can handle many real needs even with limited vocabulary.',
        'The key teaching point is chunking: modal plus infinitive. Repeat the pattern often until it feels automatic.',
      ],
      errors: [
        'Do not forget the second verb after the modal when the meaning needs one.',
        'Separate the meanings clearly: can, want, must, and may are not interchangeable.',
        'Use personal examples so the verbs feel useful, not abstract.',
      ],
      tasks: [
        'Say three things you can do, three things you want to do, and two things you must do.',
        'Ask another person what they can or want to do.',
        'Make one polite permission question with får.',
      ],
      vocabulary: [
        {
          swedish: 'orka',
          english: 'have the energy to',
          exampleSwedish: 'Jag orkar inte laga mat idag.',
          exampleEnglish: 'I do not have the energy to cook today.',
        },
        {
          swedish: 'hinna',
          english: 'have time to',
          exampleSwedish: 'Jag hinner inte komma nu.',
          exampleEnglish: 'I do not have time to come now.',
        },
      ],
    }),
    createTeachingAddition({
      day: 39,
      summary:
        'This lesson now makes future talk more practical by linking plans to time words, places, and reasons so the learner can produce fuller personal answers.',
      content: [
        'Future language becomes useful when it answers three questions at once: what, when, and why. Even a simple ska sentence becomes stronger with one time phrase and one detail.',
        'Practice near-future plans first, because they are easier to imagine and speak about naturally.',
      ],
      errors: [
        'Do not stop at Jag ska ... with no completion. Finish the action clearly.',
        'Add a time phrase such as ikväll, imorgon, or nästa vecka whenever possible.',
        'Keep word order stable even when the time phrase comes first.',
      ],
      tasks: [
        'Say one plan for tonight, tomorrow, and next weekend.',
        'Give one reason for each plan.',
        'Turn two future statements into questions and answer them.',
      ],
      vocabulary: [
        {
          swedish: 'nästa vecka',
          english: 'next week',
          exampleSwedish: 'Nästa vecka ska jag resa.',
          exampleEnglish: 'Next week I am going to travel.',
        },
        {
          swedish: 'planera',
          english: 'plan',
          exampleSwedish: 'Jag vill planera helgen idag.',
          exampleEnglish: 'I want to plan the weekend today.',
        },
      ],
    }),
    createTeachingAddition({
      day: 49,
      summary:
        'This travel lesson now focuses on survival hotel Swedish: check-in, basic room problems, and short practical requests that travelers need immediately.',
      content: [
        'For beginners, hotel language should be script-based. Learners should know how to arrive, confirm a booking, ask a simple question, and report one problem politely.',
        'A useful teaching rhythm is arrival, room, problem, solution. That sequence gives the learner a realistic travel scenario.',
      ],
      errors: [
        'Do not learn room words separately from service requests.',
        'Be ready to give your name and ask one follow-up question at check-in.',
        'Use polite request forms when reporting a problem.',
      ],
      tasks: [
        'Roleplay checking into a hotel and giving your name.',
        'Ask where breakfast is and what time it starts.',
        'Report one simple room problem and ask for help.',
      ],
      vocabulary: [
        {
          swedish: 'bokning',
          english: 'booking / reservation',
          exampleSwedish: 'Jag har en bokning i namnet Sharma.',
          exampleEnglish: 'I have a booking in the name Sharma.',
        },
        {
          swedish: 'nyckel',
          english: 'key',
          exampleSwedish: 'Kan jag få nyckeln till rummet?',
          exampleEnglish: 'Can I get the key to the room?',
        },
      ],
    }),
    createTeachingAddition({
      day: 50,
      summary:
        'This review day now connects social and travel Swedish into longer conversations so the learner starts managing whole situations instead of isolated exchanges.',
      content: [
        'By Day 50, review should test fluency of combination. The learner should move from weather to hobby to invitation to travel without restarting from zero each time.',
        'Use longer roleplays with a beginning, middle, and end. That is the best way to see whether the language is becoming usable.',
      ],
      errors: [
        'Do not review only with flashcards. Situation-building matters more at this stage.',
        'Notice weak transitions between topics and practice linking sentences with simple connectors.',
        'If a long answer fails, split it into two shorter correct sentences.',
      ],
      tasks: [
        'Have one practice conversation that includes weather, hobby, and a future plan.',
        'Roleplay inviting someone while also discussing transport or place.',
        'Give yourself a two-minute speaking challenge using as much Swedish as possible.',
      ],
      vocabulary: [
        {
          swedish: 'samtal',
          english: 'conversation',
          exampleSwedish: 'Vi övar ett längre samtal idag.',
          exampleEnglish: 'We are practicing a longer conversation today.',
        },
        {
          swedish: 'fortsätta',
          english: 'continue',
          exampleSwedish: 'Fortsätt att tala även om det blir enkel svenska.',
          exampleEnglish: 'Continue speaking even if the Swedish stays simple.',
        },
      ],
    }),
    createTeachingAddition({
      day: 55,
      summary:
        'This reading lesson now teaches strategy: find the main idea, catch familiar anchors, and tolerate unknown words without stopping every line.',
      content: [
        'A strong beginner reader does not translate everything. They identify topic, people, place, time, and repeated key words, then build the general meaning from those anchors.',
        'Short texts become valuable when learners reread them with different purposes: first overall meaning, then details, then useful sentence patterns to reuse in their own writing.',
      ],
      errors: [
        'Do not stop for every unknown word. First ask whether the whole sentence is still understandable.',
        'Avoid translating word by word when the text is clearly about a familiar topic.',
        'After reading, always summarize in simple Swedish or English to prove comprehension.',
      ],
      tasks: [
        'Read a short text once for the general topic and once for details.',
        'Underline the words that tell you who, where, and when.',
        'Retell the text in three simple Swedish sentences.',
      ],
      vocabulary: [
        {
          swedish: 'huvudidé',
          english: 'main idea',
          exampleSwedish: 'Vad är textens huvudidé?',
          exampleEnglish: 'What is the main idea of the text?',
        },
        {
          swedish: 'sammanhang',
          english: 'context',
          exampleSwedish: 'Försök förstå ordet genom sammanhanget.',
          exampleEnglish: 'Try to understand the word through the context.',
        },
      ],
    }),
    createTeachingAddition({
      day: 56,
      summary:
        'This listening lesson now trains selective listening so the learner stops trying to hear every word and instead listens for the information that matters most.',
      content: [
        'Beginner listening improves when learners predict the topic before listening and then hunt for key information such as names, times, places, numbers, and feelings.',
        'A useful sequence is listen once for the big picture, listen again for details, and only then check exact wording if necessary.',
      ],
      errors: [
        'Do not panic when you miss one word. Keep listening for the next clear clue.',
        'Avoid turning listening into reading in your head. Train your ear to catch sound chunks.',
        'Use very short repeats rather than replaying the whole audio without purpose.',
      ],
      tasks: [
        'Listen for key words only: person, place, time, and action.',
        'After listening, say what you understood before checking answers.',
        'Replay one short section and repeat it aloud to copy rhythm and pronunciation.',
      ],
      vocabulary: [
        {
          swedish: 'lyssna efter',
          english: 'listen for',
          exampleSwedish: 'Lyssna efter tid och plats.',
          exampleEnglish: 'Listen for time and place.',
        },
        {
          swedish: 'ledtråd',
          english: 'clue',
          exampleSwedish: 'Vilken ledtråd hörde du först?',
          exampleEnglish: 'Which clue did you hear first?',
        },
      ],
    }),
  ],
  grammarTopics: [
    {
      id: 'vowels-and-pronunciation',
      title: 'Vowels and pronunciation',
      category: 'Pronunciation',
      summary:
        'Your notes show that vowel quality is a core A1 skill. Mouth shape and vowel length change meaning quickly in Swedish.',
      rules: [
        'A, O, U, Y, I, E, Ö, Ä, Å each need a distinct mouth position.',
        'Long vowel + short consonant often contrasts with short vowel + long consonant.',
        'Minimal pairs such as tack / tak and ful / full are worth repeating aloud.',
      ],
      examples: [
        { swedish: 'tack / tak', english: 'thanks / roof' },
        { swedish: 'kaffe / kafé', english: 'coffee / café' },
        { swedish: 'ful / full', english: 'ugly / drunk' },
      ],
      relatedDays: [1, 2, 4],
      sourceDates: ['Apr 15, 2026'],
    },
    {
      id: 'sound-changes',
      title: 'Sound changes before front vowels',
      category: 'Pronunciation',
      summary:
        'Several Swedish consonants soften or shift before front vowels like y, i, e, ö, and ä.',
      rules: [
        'G before y/i/e/ö/ä often sounds like a soft j.',
        'K before y/i/e/ö/ä often sounds like tj.',
        'sk before y/i/e/ö/ä often sounds like sh.',
        'hj, dj, and lj often lose the first letter at the beginning of a word.',
      ],
      examples: [
        { swedish: 'ger / gör / Sverige', english: 'give / do / Sweden' },
        { swedish: 'Kina / köper / kylskåp', english: 'China / buy / fridge' },
        { swedish: 'hjälp / djur / ljus', english: 'help / animal / light' },
      ],
      relatedDays: [1, 3],
      sourceDates: ['Apr 15, 2026'],
    },
    {
      id: 'personal-pronouns',
      title: 'Personal pronouns',
      category: 'Core grammar',
      summary:
        'The notes reinforce the full beginner pronoun set and the spoken form dom for de.',
      rules: [
        'Use jag, du, han, hon, vi, ni, de in writing.',
        'In speech, de is very often pronounced dom.',
      ],
      examples: [
        { swedish: 'Jag bor i Finland.', english: 'I live in Finland.' },
        { swedish: 'De talar svenska.', english: 'They speak Swedish.' },
      ],
      relatedDays: [6, 7, 9],
      sourceDates: ['Apr 17, 2026'],
    },
    {
      id: 'question-words',
      title: 'Question words',
      category: 'Core grammar',
      summary:
        'Your notes provide the high-frequency question words needed for A1 conversation.',
      rules: [
        'Use vad for what, var for where, hur for how, varför for why, and när for when.',
        'In direct questions, the verb usually stays before the subject unless a question word already starts the sentence.',
      ],
      examples: [
        { swedish: 'Vad heter du?', english: 'What is your name?' },
        { swedish: 'När kommer Anna?', english: 'When is Anna coming?' },
      ],
      relatedDays: [9, 33],
      sourceDates: ['Apr 17, 2026'],
    },
    {
      id: 'v2-word-order',
      title: 'Verb-second word order',
      category: 'Sentence structure',
      summary:
        'The most repeated rule in your notes is the golden V2 rule: the finite verb stays in second position.',
      rules: [
        'The first position can be a person, time, or place chunk.',
        'The finite verb still stays second even when a time or place moves to the front.',
        'The subject stays next to the finite verb, either before or after it.',
      ],
      examples: [
        { swedish: 'Jag ska baka en kaka ikväll.', english: 'I am going to bake a cake tonight.' },
        { swedish: 'Ikväll ska jag baka en kaka.', english: 'Tonight I am going to bake a cake.' },
        { swedish: 'I Finland dricker vi kaffe.', english: 'In Finland we drink coffee.' },
      ],
      relatedDays: [8, 9, 32, 33],
      sourceDates: ['Apr 17, 2026', 'Apr 22, 2026'],
    },
    {
      id: 'modal-and-helper-verbs',
      title: 'Modal and helper verbs',
      category: 'Verbs',
      summary:
        'Your notes give a practical helper-verb system: kan, måste, vill, ska, brukar, hinner, and orkar.',
      rules: [
        'After a helper verb, the next verb normally stays in the infinitive.',
        'Brukar expresses habit, while ska expresses plans.',
        'Hinner is about available time; orkar is about energy or strength.',
      ],
      examples: [
        { swedish: 'Han kan simma.', english: 'He can swim.' },
        { swedish: 'Jag vill ha en bil.', english: 'I want a car.' },
        { swedish: 'Jag orkar inte plugga mer.', english: 'I do not have the energy to study more.' },
      ],
      relatedDays: [38, 39, 45],
      sourceDates: ['Apr 18, 2026', 'Apr 22, 2026', 'Apr 24, 2026'],
    },
    {
      id: 'negation-and-adverbs',
      title: 'Negation and adverb placement',
      category: 'Sentence structure',
      summary:
        'Inte, också, alltid, ofta, sällan, and aldrig behave like adverbials and often share the same slot in the sentence.',
      rules: [
        'In simple main clauses, inte usually comes after the finite verb and subject.',
        'Också and many frequency adverbs often use the same position as inte.',
        'Ibland can stand first in the sentence or later in the sentence, but not directly before the object in the wrong place.',
      ],
      examples: [
        { swedish: 'Jag vill inte äta pizza.', english: 'I do not want to eat pizza.' },
        { swedish: 'Jag vill också köpa en banan.', english: 'I also want to buy a banana.' },
        { swedish: 'Jag går alltid på gymmet efter jobbet.', english: 'I always go to the gym after work.' },
      ],
      relatedDays: [15, 34, 45],
      sourceDates: ['Apr 18, 2026', 'May 2, 2026', 'May 9, 2026'],
    },
    {
      id: 'noun-gender-and-definite-form',
      title: 'Noun gender and definite form',
      category: 'Nouns',
      summary:
        'Your notes combine en/ett basics with definite noun endings and when to use the definite form.',
      rules: [
        'Most Swedish nouns are common gender en nouns; a smaller group are ett nouns.',
        'The definite form usually adds the ending to the noun: boken, jobbet, mötet.',
        'Use the definite form when both people know which thing you mean, much like English the.',
      ],
      examples: [
        { swedish: 'en bok / boken', english: 'a book / the book' },
        { swedish: 'ett jobb / jobbet', english: 'a job / the job' },
        { swedish: 'Jag hade en tuff dag på jobbet.', english: 'I had a tough day at work.' },
      ],
      relatedDays: [18, 35, 48],
      sourceDates: ['Apr 22, 2026', 'Apr 25, 2026'],
    },
    {
      id: 'adjective-agreement',
      title: 'Adjective agreement',
      category: 'Adjectives',
      summary:
        'Your notes give the full A1 adjective pattern: base form for en nouns, -t for ett nouns, and -a for plural and definite forms.',
      rules: [
        'Use the base adjective with en nouns: en rolig dag.',
        'Add -t with ett nouns when needed: ett roligt jobb.',
        'Use the plural-like -a form in plural and definite contexts: roliga filmer, den nya bilen, min nya bil.',
      ],
      examples: [
        { swedish: 'en ny vän', english: 'a new friend' },
        { swedish: 'ett nytt jobb', english: 'a new job' },
        { swedish: 'mina nya bilar', english: 'my new cars' },
      ],
      relatedDays: [35, 36, 25],
      sourceDates: ['Apr 25, 2026', 'May 6, 2026'],
    },
    {
      id: 'plurals',
      title: 'Plural patterns',
      category: 'Nouns',
      summary:
        'The notes add useful A1 plural patterns and reminder examples for both indefinite and definite plural forms.',
      rules: [
        'Plural endings vary by noun group, so learn common words with their plural forms.',
        'The definite plural works like English the + plural, for example bilarna and filmerna.',
        'Some common words have irregular plurals, such as vän / vänner.',
      ],
      examples: [
        { swedish: 'en vän / vänner', english: 'a friend / friends' },
        { swedish: 'en klänning / klänningar', english: 'a dress / dresses' },
        { swedish: 'Filmerna var romantiska.', english: 'The films were romantic.' },
      ],
      relatedDays: [19, 25, 35],
      sourceDates: ['May 1, 2026', 'May 9, 2026'],
    },
    {
      id: 'numbers-dates-and-time',
      title: 'Numbers, dates, and time',
      category: 'Practical Swedish',
      summary:
        'Your notes add number pronunciation, ordinal dates, and Swedish-style half-hour expressions.',
      rules: [
        'Dates are often spoken with an ordinal value: den 10:e maj.',
        'Swedish halv points to the next hour, so halv sex means 5:30.',
        'Use klockan for clock time and datum for calendar date.',
      ],
      examples: [
        { swedish: 'Idag är den 8:e maj.', english: 'Today is the 8th of May.' },
        { swedish: 'Klockan är halv nio.', english: 'It is 8:30.' },
        { swedish: 'Mötet börjar klockan fem prick.', english: 'The meeting starts at five on the dot.' },
      ],
      relatedDays: [4, 22, 23],
      sourceDates: ['May 6, 2026', 'May 8, 2026'],
    },
    {
      id: 'job-phrases-and-prepositions',
      title: 'Job phrases and workplace prepositions',
      category: 'Practical Swedish',
      summary:
        'The notes clarify how professions and workplaces are expressed in natural beginner Swedish.',
      rules: [
        'Do not add an article after job titles in simple statements: jag jobbar som lärare.',
        'Use på with many workplaces and institutions: på en bank, på ett universitet, på Nokia.',
        'Use hemifrån for working from home and på distans for remote work.',
      ],
      examples: [
        { swedish: 'Jag jobbar som programmerare.', english: 'I work as a programmer.' },
        { swedish: 'Jag jobbar på ett kontor.', english: 'I work at an office.' },
        { swedish: 'Jag jobbar hemifrån ibland.', english: 'I work from home sometimes.' },
      ],
      relatedDays: [13, 24, 45],
      sourceDates: ['Apr 24, 2026'],
    },
    {
      id: 'preteritum',
      title: 'Preteritum (past tense)',
      category: 'Verbs',
      summary:
        'Your notes introduce the past tense through groups, irregular forms, and diary-style practice.',
      rules: [
        'Many verbs build the past from the base form plus -de or -te, but common verbs can be irregular.',
        'Start with high-frequency irregulars such as var, gick, gjorde, såg, hade, and kom.',
        'Past-time markers like igår and förra veckan make the tense easier to recognize and produce.',
      ],
      examples: [
        { swedish: 'Jag pratade med chefen igår.', english: 'I talked with the boss yesterday.' },
        { swedish: 'Vi åkte till Italien förra året.', english: 'We went to Italy last year.' },
        { swedish: 'Jag vaknade sent och åt pizza.', english: 'I woke up late and ate pizza.' },
      ],
      relatedDays: [51, 52, 59],
      sourceDates: ['Apr 29, 2026'],
    },
    {
      id: 'som-relative-pronoun',
      title: 'Som as a relative pronoun',
      category: 'Sentence structure',
      summary:
        'The notes introduce som for joining two sentences into one smoother noun description.',
      rules: [
        'Use som to refer back to the noun before it, much like who, which, or that in English.',
        'Som can also mean like / such as, but that is a different pattern from the relative use.',
      ],
      examples: [
        { swedish: 'Jag har en syster som är veterinär.', english: 'I have a sister who is a veterinarian.' },
        { swedish: 'Han spelar ett datorspel som han fick i present.', english: 'He is playing a video game that he got as a present.' },
      ],
      relatedDays: [51, 55],
      sourceDates: ['Apr 29, 2026'],
    },
    {
      id: 'hem-vs-hemma',
      title: 'Hem, hemma, and hemifrån',
      category: 'Practical Swedish',
      summary:
        'Your notes distinguish location, movement toward home, and movement from home very clearly.',
      rules: [
        'Use hemma for location without movement.',
        'Use hem for movement toward home.',
        'Use hemifrån for movement from home or working from home.',
      ],
      examples: [
        { swedish: 'Jag är hemma hela dagen.', english: 'I am at home all day.' },
        { swedish: 'Jag måste gå hem nu.', english: 'I have to go home now.' },
        { swedish: 'Jag jobbar hemifrån.', english: 'I work from home.' },
      ],
      relatedDays: [48, 49, 51],
      sourceDates: ['Apr 29, 2026'],
    },
    {
      id: 'health-phrases',
      title: 'Health phrases',
      category: 'Practical Swedish',
      summary:
        'The health notes are built around reliable chunks that work immediately in everyday situations.',
      rules: [
        'Use Jag har ont i + definite body part to describe pain.',
        'For appointments, use Jag har tid hos ... or Jag har läkartid.',
        'Words like förkyld, feber, and hostar are good A1 survival vocabulary.',
      ],
      examples: [
        { swedish: 'Jag har ont i magen.', english: 'I have a stomachache.' },
        { swedish: 'Jag har tid hos läkaren.', english: 'I have an appointment with the doctor.' },
        { swedish: 'Jag är förkyld och har feber.', english: 'I have a cold and a fever.' },
      ],
      relatedDays: [43, 17],
      sourceDates: ['Apr 18, 2026', 'May 2, 2026'],
    },
    {
      id: 'weather-patterns',
      title: 'Weather patterns',
      category: 'Practical Swedish',
      summary:
        'The notes give the standard weather sentence frames used in everyday Swedish.',
      rules: [
        'Use Det är + adjective for conditions like varmt, kallt, and mulet.',
        'Use Det regnar, Det snöar, and Det blåser for common weather events.',
        'Add temperature with Det är ... grader.',
      ],
      examples: [
        { swedish: 'Det är varmt idag.', english: 'It is warm today.' },
        { swedish: 'Det snöar i Helsingfors.', english: 'It is snowing in Helsinki.' },
        { swedish: 'Solen skiner.', english: 'The sun is shining.' },
      ],
      relatedDays: [44, 21],
      sourceDates: ['May 9, 2026'],
    },
  ],
};

export default courseEnhancements;
