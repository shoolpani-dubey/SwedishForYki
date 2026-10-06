import React, { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, Lightbulb, Search } from 'lucide-react';
import courseUrl from './data/swedishYkiCourse.json?url';
import PracticePage from './PracticePage.jsx';
import './vendor/tokyo-paper/tokyo-paper.css';
import './styles.css';

// Tokyo Paper icons: 1.5px stroke, square caps, decorative unless labelled.
const iconProps = {
  size: 20,
  strokeWidth: 1.5,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  'aria-hidden': true,
};

const PAGES = [
  { id: 'lessons', label: 'Lessons' },
  { id: 'topics', label: 'Topics' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'practice', label: 'Speaking & writing' },
];

const THEMES = [
  { value: '', label: 'Auto' },
  { value: 'paper', label: 'Paper' },
  { value: 'night', label: 'Night' },
];

// Tabs on a topic page, and which parts of the topic file feed each one.
const TOPIC_TABS = [
  { id: 'words', label: 'Words' },
  { id: 'dialogues', label: 'Dialogues', kinds: ['dialogues'] },
  { id: 'phrases', label: 'Quick answers', kinds: ['warmup', 'react'] },
  { id: 'talks', label: 'Talks & opinions', kinds: ['talks', 'opinions'] },
  { id: 'writing', label: 'Writing', kinds: ['writing'] },
  { id: 'by-heart', label: 'By heart' },
];

// Routes live in the hash (#/lessons/12, #/topics/samhalle, #/grammar?q=V2)
// so Back works and the page survives a refresh on any static host.
function parseHash(hash) {
  const [path, search = ''] = hash.replace(/^#\/?/, '').split('?');
  const [page, arg] = path.split('/');
  return {
    page: PAGES.some((entry) => entry.id === page) ? page : 'lessons',
    arg: arg ? decodeURIComponent(arg) : null,
    query: new URLSearchParams(search).get('q'),
  };
}

function hrefFor(page, { arg, query } = {}) {
  if (arg) return `#/${page}/${encodeURIComponent(arg)}`;
  if (query) return `#/${page}?${new URLSearchParams({ q: query })}`;
  return `#/${page}`;
}

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return useMemo(() => parseHash(hash), [hash]);
}

// Browser storage can be blocked; every read and write falls back quietly.
function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The setting still applies for this visit.
  }
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => readStored(key, fallback));
  useEffect(() => writeStored(key, value), [key, value]);
  return [value, setValue];
}

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? '');

  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      root.dataset.theme = theme;
    } else {
      delete root.dataset.theme;
    }
    try {
      if (theme) {
        localStorage.setItem('theme', theme);
      } else {
        localStorage.removeItem('theme');
      }
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  }, [theme]);

  return [theme, setTheme];
}

function closeNavMenu() {
  const menu = document.getElementById('nav-menu');
  try {
    if (menu?.matches(':popover-open')) {
      menu.hidePopover();
    }
  } catch {
    // Browsers without the popover API show the menu inline.
  }
}

const cardKey = (card) => `${card.sv}::${card.en}`;

function App() {
  const [courseData, setCourseData] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [lastDay, setLastDay] = useState(1);
  const [vocabularyQuery, setVocabularyQuery] = useState('');
  const [grammarQuery, setGrammarQuery] = useState('');
  const [hideEnglish, setHideEnglish] = useStoredState('hide-english', false);
  const [known, setKnown] = useStoredState('known-cards', []);
  const route = useHashRoute();
  const deferredVocabularyQuery = useDeferredValue(vocabularyQuery);
  const deferredGrammarQuery = useDeferredValue(grammarQuery);
  const lessons = courseData?.days ?? [];
  const levels = courseData?.levels ?? [];
  const topics = courseData?.topics ?? [];
  const grammarTopics = courseData?.grammarTopics ?? [];
  const page = route.page;
  const routeDay = page === 'lessons' ? Number(route.arg) || null : null;
  const selectedDay = routeDay ?? lastDay;
  const knownSet = useMemo(() => new Set(known), [known]);

  const learning = {
    hideEnglish,
    knownSet,
    setKnown: (key, isKnown) =>
      setKnown((current) =>
        isKnown ? [...new Set([...current, key])] : current.filter((entry) => entry !== key),
      ),
  };

  const loadCourse = () => {
    let active = true;
    setLoadError(false);

    fetch(courseUrl)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setCourseData(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load course data', error);
        if (active) {
          setLoadError(true);
        }
      });

    return () => {
      active = false;
    };
  };

  useEffect(loadCourse, []);

  useEffect(() => {
    if (routeDay) {
      setLastDay(routeDay);
    }
  }, [routeDay]);

  useEffect(() => {
    if (page === 'grammar' && route.query !== null) {
      setGrammarQuery(route.query);
    }
  }, [page, route.query]);

  // On every in-app navigation, start at the top and move focus to the new
  // page title so keyboard and screen reader users land on the new content.
  const location = `${page}/${route.arg ?? ''}/${route.query ?? ''}`;
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById('page-title')?.focus({ preventScroll: true });
  }, [location]);

  const selectedLesson = lessons.find((lesson) => lesson.day === selectedDay) ?? lessons[0] ?? null;
  const selectedLevel = levels.find(
    (level) =>
      selectedLesson &&
      selectedLesson.day >= level.startDay &&
      selectedLesson.day <= level.endDay,
  );
  const selectedTopic = page === 'topics' ? topics.find((topic) => topic.id === route.arg) : null;

  // One searchable list: lesson words (A1–B1) and topic words (B1).
  const vocabulary = useMemo(() => {
    const wordMap = new Map();
    const entryFor = (swedish, english, level) => {
      const key = `${swedish.trim().toLowerCase()}::${english.trim().toLowerCase()}`;
      if (!wordMap.has(key)) {
        wordMap.set(key, { swedish, english, level, days: [], topics: [], examples: [] });
      }
      return wordMap.get(key);
    };
    const addExample = (entry, sv, en) => {
      if (sv && sv !== entry.swedish && !entry.examples.some((example) => example.sv === sv)) {
        entry.examples.push({ sv, en });
      }
    };

    lessons.forEach((lesson) => {
      const topicWords = (lesson.topicWords ?? []).flatMap((group) => group.words);
      [...lesson.vocabulary, ...topicWords].forEach((item) => {
        const entry = entryFor(item.swedish, item.english, lesson.level);
        if (!entry.days.includes(lesson.day)) entry.days.push(lesson.day);
        addExample(entry, item.exampleSwedish, item.exampleEnglish);
      });
    });

    topics.forEach((topic) => {
      topic.wordGroups.forEach((group) => {
        group.words.forEach((word) => {
          const entry = entryFor(word.swedish, word.english, 'B1');
          if (!entry.topics.some((entryTopic) => entryTopic.id === topic.id)) {
            entry.topics.push({ id: topic.id, number: topic.number, title: topic.title });
          }
          word.examples.forEach((example) => addExample(entry, example.sv, example.en));
        });
      });
    });

    return [...wordMap.values()].sort((a, b) => a.swedish.localeCompare(b.swedish, 'sv'));
  }, [lessons, topics]);

  const filteredVocabulary = useMemo(() => {
    const normalizedQuery = deferredVocabularyQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return vocabulary;
    }

    return vocabulary.filter((item) => {
      const haystack = [
        item.swedish,
        item.english,
        item.level,
        item.days.join(' '),
        ...item.topics.map((topic) => topic.title),
        ...item.examples.flatMap((example) => [example.sv, example.en]),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [deferredVocabularyQuery, vocabulary]);

  const filteredGrammarTopics = useMemo(() => {
    const normalizedQuery = deferredGrammarQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return grammarTopics;
    }

    return grammarTopics.filter((topic) => {
      const haystack = [
        topic.title,
        topic.category,
        topic.summary,
        topic.rules.join(' '),
        topic.examples.map((example) => `${example.swedish} ${example.english}`).join(' '),
        topic.relatedDays.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [deferredGrammarQuery, grammarTopics]);

  const relatedGrammarTopics = useMemo(
    () =>
      selectedLesson
        ? grammarTopics.filter((topic) => topic.relatedDays.includes(selectedLesson.day))
        : [],
    [grammarTopics, selectedLesson],
  );

  if (!courseData && page === 'practice') {
    return <Shell page={page}><PracticePage /></Shell>;
  }

  if (!courseData) {
    return (
      <Shell page={page}>
        {loadError ? (
          <div className="tp-alert tp-alert--danger" role="alert">
            <AlertTriangle {...iconProps} className="tp-alert__icon" />
            <div className="tp-alert__content">
              <p className="tp-alert__title">Couldn’t load the course</p>
              <p className="tp-alert__body">Check your internet connection, then try again.</p>
              <div className="tp-alert__actions">
                <button className="tp-button tp-button--primary" type="button" onClick={loadCourse}>
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <header className="page-header" role="status">
            <p className="tp-eyebrow">Loading</p>
            <h1 className="page-title" id="page-title" tabIndex={-1}>
              Preparing the course…
            </h1>
          </header>
        )}
      </Shell>
    );
  }

  const hideEnglishSwitch = <HideEnglishSwitch checked={hideEnglish} onChange={setHideEnglish} />;

  return (
    <Shell page={page} courseTitle={courseData.courseTitle}>
      {page === 'lessons' && selectedLesson ? (
        <div className="lessons-layout">
          <DayIndex levels={levels} selectedDay={selectedLesson.day} />
          <LessonView
            lesson={selectedLesson}
            level={selectedLevel}
            levels={levels}
            lessons={lessons}
            relatedGrammarTopics={relatedGrammarTopics}
            learning={learning}
            hideEnglishSwitch={hideEnglishSwitch}
          />
        </div>
      ) : null}

      {page === 'topics' && !selectedTopic ? <TopicList topics={topics} /> : null}

      {page === 'topics' && selectedTopic ? (
        <TopicView
          key={selectedTopic.id}
          topic={selectedTopic}
          topics={topics}
          learning={learning}
          hideEnglishSwitch={hideEnglishSwitch}
        />
      ) : null}

      {page === 'vocabulary' ? (
        <VocabularyPage
          query={vocabularyQuery}
          setQuery={setVocabularyQuery}
          words={filteredVocabulary}
          total={vocabulary.length}
        />
      ) : null}

      {page === 'grammar' ? (
        <GrammarPage
          query={grammarQuery}
          setQuery={setGrammarQuery}
          topics={filteredGrammarTopics}
          total={grammarTopics.length}
        />
      ) : null}

      {page === 'practice' ? <PracticePage /> : null}
    </Shell>
  );
}

function Shell({ page, courseTitle, children }) {
  const [theme, setTheme] = useTheme();
  const themeIndex = THEMES.findIndex((entry) => entry.value === theme);
  const currentTheme = THEMES[themeIndex] ?? THEMES[0];
  const nextTheme = THEMES[(themeIndex + 1) % THEMES.length];

  const skipToContent = (event) => {
    // The hash holds the route, so move focus without touching it.
    event.preventDefault();
    document.getElementById('main')?.focus();
  };

  return (
    <>
      <a className="tp-button tp-button--primary tp-skip-link" href="#main" onClick={skipToContent}>
        Skip to content
      </a>

      <header className="tp-nav">
        <div className="tp-nav__inner">
          <a className="tp-nav__brand" href={hrefFor('lessons')}>
            <span className="tp-nav__mark" aria-hidden="true"></span>
            Swedish for YKI
          </a>
          <nav className="tp-nav__menu" id="nav-menu" popover="auto" aria-label="Main">
            <ul className="tp-nav__list">
              {PAGES.map((entry) => (
                <li key={entry.id}>
                  <a
                    className="tp-nav__link"
                    href={hrefFor(entry.id)}
                    aria-current={page === entry.id ? 'page' : undefined}
                    onClick={closeNavMenu}
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="tp-nav__actions">
            <button
              className="tp-button tp-button--quiet"
              type="button"
              onClick={() => setTheme(nextTheme.value)}
              title={`Switch to ${nextTheme.label}`}
            >
              <span className="theme-prefix">Theme: </span>
              {currentTheme.label}
            </button>
          </div>
          <button className="tp-button tp-button--quiet tp-nav__toggle" type="button" popoverTarget="nav-menu">
            Menu
          </button>
        </div>
      </header>

      <main className="page" id="main" tabIndex={-1}>
        {children}
      </main>

      {courseTitle ? (
        <footer className="site-footer">
          <p>{courseTitle}</p>
        </footer>
      ) : null}
    </>
  );
}

function HideEnglishSwitch({ checked, onChange }) {
  return (
    <div className="tp-choice hide-english">
      <input
        className="tp-switch"
        type="checkbox"
        role="switch"
        id="hide-english"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-describedby="hide-english-hint"
      />
      <label className="tp-choice__label" htmlFor="hide-english">
        Hide English <span className="tp-switch__state" aria-hidden="true"></span>
      </label>
      <p className="tp-field__hint" id="hide-english-hint">
        Say the Swedish first, then tap to check.
      </p>
    </div>
  );
}

// English helper text. With "Hide English" on, it waits behind a button so you
// can test yourself; the reveal resets when the switch changes.
function English({ text, hidden, className = 'pair__en' }) {
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(false), [hidden]);

  if (hidden && !shown) {
    return (
      <button className="reveal" type="button" onClick={() => setShown(true)}>
        Show English
      </button>
    );
  }
  return <span className={className}>{text}</span>;
}

function Pair({ sv, en, hideEnglish, speaker, you, hint }) {
  return (
    <div className={you ? 'pair pair--you' : 'pair'}>
      {speaker ? (
        <span className="pair__speaker" lang="sv">
          {speaker}
        </span>
      ) : null}
      <div className="pair__text">
        {hint ? <span className="pair__hint">Task: {hint}</span> : null}
        <span className="pair__sv" lang="sv">
          {sv}
        </span>
        <English text={en} hidden={hideEnglish} />
      </div>
    </div>
  );
}

function PairList({ pairs, hideEnglish, ordered = false }) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <List className={ordered ? 'pair-list pair-list--numbered' : 'pair-list'}>
      {pairs.map((pair, index) => (
        <li key={index}>
          <Pair {...pair} hideEnglish={hideEnglish} />
        </li>
      ))}
    </List>
  );
}

function DayIndex({ levels, selectedDay }) {
  return (
    <aside className="day-index" aria-label="Course days">
      {levels.map((level) => (
        <section className="day-index__level" key={level.id} aria-labelledby={`level-${level.id}`}>
          <p className="tp-eyebrow">
            {level.id} · Days {level.startDay}–{level.endDay}
          </p>
          <h2 className="day-index__title" id={`level-${level.id}`}>
            {level.title}
          </h2>
          <ol className="day-grid">
            {level.lessons.map((lesson) => (
              <li key={lesson.day}>
                <a
                  className="day-grid__link"
                  href={hrefFor('lessons', { arg: lesson.day })}
                  aria-current={selectedDay === lesson.day ? 'page' : undefined}
                  title={lesson.title}
                >
                  <span className="tp-visually-hidden">Day </span>
                  {lesson.day}
                  <span className="tp-visually-hidden">: {lesson.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </aside>
  );
}

function LessonPager({ lesson, lessons, levels, position }) {
  const previous = lessons.find((entry) => entry.day === lesson.day - 1);
  const next = lessons.find((entry) => entry.day === lesson.day + 1);

  if (position === 'end') {
    return (
      <nav className="pager pager--end" aria-label="Next and previous lesson">
        {previous ? (
          <a className="tp-button" href={hrefFor('lessons', { arg: previous.day })}>
            <span aria-hidden="true">←</span> Day {previous.day}
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a className="tp-button tp-button--primary" href={hrefFor('lessons', { arg: next.day })}>
            Next: Day {next.day}, {next.title}
            <span className="tp-button__arrow" aria-hidden="true">→</span>
          </a>
        ) : null}
      </nav>
    );
  }

  return (
    <nav className="pager" aria-label="Lesson">
      {previous ? (
        <a className="tp-button" href={hrefFor('lessons', { arg: previous.day })}>
          <span aria-hidden="true">←</span> Day {previous.day}
        </a>
      ) : (
        <button className="tp-button" type="button" disabled>
          <span aria-hidden="true">←</span> Day {lesson.day - 1}
        </button>
      )}
      <div className="tp-field pager__select">
        <label className="tp-field__label" htmlFor="day-select">
          Go to day
        </label>
        <select
          className="tp-select"
          id="day-select"
          value={lesson.day}
          onChange={(event) => {
            window.location.hash = hrefFor('lessons', { arg: event.target.value });
          }}
        >
          {levels.map((level) => (
            <optgroup key={level.id} label={`${level.id} · ${level.title}`}>
              {level.lessons.map((entry) => (
                <option key={entry.day} value={entry.day}>
                  Day {entry.day}: {entry.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      {next ? (
        <a className="tp-button" href={hrefFor('lessons', { arg: next.day })}>
          Day {next.day} <span aria-hidden="true">→</span>
        </a>
      ) : (
        <button className="tp-button" type="button" disabled>
          Day {lesson.day + 1} <span aria-hidden="true">→</span>
        </button>
      )}
    </nav>
  );
}

function LessonView({
  lesson,
  level,
  levels,
  lessons,
  relatedGrammarTopics,
  learning,
  hideEnglishSwitch,
}) {
  const words = lesson.vocabulary.map((item) => ({
    sv: item.swedish,
    en: item.english,
    exampleSv: item.exampleSwedish,
    exampleEn: item.exampleEnglish,
  }));

  return (
    <article className="lesson" aria-labelledby="page-title">
      <header className="page-header">
        <p className="tp-eyebrow">
          {level?.id} · Day {lesson.day} of {lessons.length}
        </p>
        <h1 className="page-title" id="page-title" tabIndex={-1}>
          {lesson.title}
        </h1>
        <p className="lead">{lesson.goal}</p>
        {hideEnglishSwitch}
      </header>

      <LessonPager lesson={lesson} lessons={lessons} levels={levels} position="start" />

      <div className="lesson-body">
        <LessonSection id="words" title={`Words (${words.length})`}>
          <WordTable words={words} learning={learning} label="Words for this lesson" />
        </LessonSection>

        {(lesson.topicWords ?? []).map((group, index) => (
          <LessonSection
            key={`${group.topicId}-${group.title}`}
            id={`topic-words-${index}`}
            title={
              <>
                <span lang="sv">{group.title}</span> ({group.words.length})
                <span className="section-title__en">
                  {group.titleEn} · from{' '}
                  <a href={hrefFor('topics', { arg: group.topicId })}>
                    Topic {group.topicNumber}: <span lang="sv">{group.topicTitle}</span>
                  </a>
                </span>
              </>
            }
          >
            <WordTable
              words={group.words.map((item) => ({
                sv: item.swedish,
                en: item.english,
                exampleSv: item.exampleSwedish,
                exampleEn: item.exampleEnglish,
              }))}
              learning={learning}
              label={`${group.title}: words`}
            />
          </LessonSection>
        ))}

        {lesson.tips.length ? (
          <div className="tp-alert">
            <Lightbulb {...iconProps} className="tp-alert__icon" />
            <div className="tp-alert__content">
              <h2 className="tp-alert__title">Grammar tip</h2>
              {lesson.tips.map((tip, index) => (
                <p className="tp-alert__body" key={index}>
                  {tip}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        <LessonSection id="dialogues" title={lesson.dialogues.length > 1 ? 'Dialogues' : 'Dialogue'}>
          {lesson.dialogues.map((dialogue, index) => (
            <div className="stack" key={index}>
              {lesson.dialogues.length > 1 ? <h3 className="sub-title">{dialogue.title}</h3> : null}
              <PairList
                pairs={dialogue.lines.map((line) => ({
                  speaker: line.speaker,
                  sv: line.swedish,
                  en: line.english,
                }))}
                hideEnglish={learning.hideEnglish}
              />
            </div>
          ))}
        </LessonSection>

        {lesson.tables.map((table, index) => (
          <LessonSection key={table.heading} id={`table-${index}`} title={table.heading}>
            <DataTable rows={table.rows} label={table.heading} />
          </LessonSection>
        ))}

        {relatedGrammarTopics.length ? (
          <LessonSection id="related-grammar" title="Related grammar">
            <ul className="link-list">
              {relatedGrammarTopics.map((topic) => (
                <li key={topic.id}>
                  <a className="tp-button" href={hrefFor('grammar', { query: topic.title })}>
                    {topic.title}
                  </a>
                </li>
              ))}
            </ul>
          </LessonSection>
        ) : null}
      </div>

      <LessonPager lesson={lesson} lessons={lessons} levels={levels} position="end" />
    </article>
  );
}

function LessonSection({ id, title, children, level = 2 }) {
  const Heading = `h${level}`;
  return (
    <section className="lesson-section" aria-labelledby={id}>
      <Heading className="section-title" id={id}>
        {title}
      </Heading>
      {children}
    </section>
  );
}

// Words with their example, plus a flashcard drill over the same words.
function WordTable({ words, learning, label }) {
  const [practising, setPractising] = useState(false);
  const knownCount = words.filter((word) => learning.knownSet.has(cardKey(word))).length;

  return (
    <div className="stack">
      <div className="word-toolbar">
        <button
          className="tp-button"
          type="button"
          aria-expanded={practising}
          onClick={() => setPractising((value) => !value)}
        >
          {practising ? 'Close flashcards' : 'Practise with flashcards'}
        </button>
        <span className="meta-label">
          {knownCount} of {words.length} known
        </span>
      </div>
      {practising ? (
        <Flashcards cards={words} learning={learning} onClose={() => setPractising(false)} />
      ) : null}
      <div className="tp-table-wrap" role="region" aria-label={label} tabIndex={0}>
        <table className="tp-table word-table">
          <thead>
            <tr>
              <th scope="col">Swedish</th>
              <th scope="col">English</th>
              <th scope="col">Example</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, index) => (
              <tr key={`${cardKey(word)}-${index}`}>
                <th scope="row" lang="sv">
                  {learning.knownSet.has(cardKey(word)) ? (
                    <span className="known-mark" title="You know this word">
                      ✓<span className="tp-visually-hidden"> known: </span>
                    </span>
                  ) : null}
                  {word.sv}
                </th>
                <td>
                  <English text={word.en} hidden={learning.hideEnglish} className="" />
                </td>
                <td>
                  {word.exampleSv && word.exampleSv !== word.sv ? (
                    <>
                      <span className="example__sv" lang="sv">
                        {word.exampleSv}
                      </span>
                      <English text={word.exampleEn} hidden={learning.hideEnglish} className="example__en" />
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Flashcards: see one side, say the other, then mark it. "Again" puts the
// card back at the end of the round; known cards are remembered.
function Flashcards({ cards, learning, onClose, unit = 'words' }) {
  const [direction, setDirection] = useState('sv');
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const [round, setRound] = useState(() => shuffle(cards));
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ knew: 0, again: 0 });
  const answerRef = useRef(null);
  const id = useId();

  const restart = (unknownOnly = onlyUnknown) => {
    const pool = unknownOnly ? cards.filter((card) => !learning.knownSet.has(cardKey(card))) : cards;
    setRound(shuffle(pool));
    setRevealed(false);
    setStats({ knew: 0, again: 0 });
  };

  const card = round[0];
  const front = card ? (direction === 'sv' ? card.sv : card.en) : '';
  const back = card ? (direction === 'sv' ? card.en : card.sv) : '';

  const answer = (knewIt) => {
    learning.setKnown(cardKey(card), knewIt);
    setStats((current) => ({ ...current, [knewIt ? 'knew' : 'again']: current[knewIt ? 'knew' : 'again'] + 1 }));
    setRound((current) => (knewIt ? current.slice(1) : [...current.slice(1), current[0]]));
    setRevealed(false);
  };

  useEffect(() => {
    if (revealed) answerRef.current?.focus();
  }, [revealed]);

  return (
    <section className="flashcards" aria-label="Flashcards">
      <div className="flashcards__controls">
        <div className="tp-field">
          <label className="tp-field__label" htmlFor={`${id}-direction`}>
            Show first
          </label>
          <select
            className="tp-select"
            id={`${id}-direction`}
            value={direction}
            onChange={(event) => {
              setDirection(event.target.value);
              setRevealed(false);
            }}
          >
            <option value="sv">Swedish, then English</option>
            <option value="en">English, then Swedish</option>
          </select>
        </div>
        <div className="tp-choice">
          <input
            className="tp-checkbox"
            type="checkbox"
            id={`${id}-unknown`}
            checked={onlyUnknown}
            onChange={(event) => {
              setOnlyUnknown(event.target.checked);
              restart(event.target.checked);
            }}
          />
          <label className="tp-choice__label" htmlFor={`${id}-unknown`}>
            Only {unit} I don’t know yet
          </label>
        </div>
      </div>

      {card ? (
        <div className="flashcard">
          <p className="meta-label" role="status">
            {round.length} left · {stats.knew} known · {stats.again} again
          </p>
          <p className="flashcard__front" lang={direction === 'sv' ? 'sv' : undefined}>
            {front}
          </p>
          {revealed ? (
            <>
              <p
                className="flashcard__back"
                lang={direction === 'sv' ? undefined : 'sv'}
                tabIndex={-1}
                ref={answerRef}
              >
                {back}
              </p>
              {card.exampleSv && card.exampleSv !== card.sv ? (
                <p className="flashcard__example">
                  <span lang="sv">{card.exampleSv}</span>
                  <span className="example__en">{card.exampleEn}</span>
                </p>
              ) : null}
              <div className="flashcard__actions">
                <button className="tp-button" type="button" onClick={() => answer(false)}>
                  Again
                </button>
                <button className="tp-button tp-button--primary" type="button" onClick={() => answer(true)}>
                  I knew it
                </button>
              </div>
            </>
          ) : (
            <div className="flashcard__actions">
              <button className="tp-button tp-button--primary" type="button" onClick={() => setRevealed(true)}>
                Show answer
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flashcard flashcard--done" role="status">
          <p className="flashcard__front">
            {stats.knew + stats.again ? 'Round complete' : `You know all these ${unit}`}
          </p>
          {stats.knew + stats.again ? (
            <p>
              {stats.knew} known, {stats.again} needed another look.
            </p>
          ) : null}
          <div className="flashcard__actions">
            <button
              className="tp-button tp-button--primary"
              type="button"
              onClick={() => {
                setOnlyUnknown(false);
                restart(false);
              }}
            >
              Practise all again
            </button>
            {onClose ? (
              <button className="tp-button tp-button--quiet" type="button" onClick={onClose}>
                Close
              </button>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

function TopicList({ topics }) {
  return (
    <>
      <header className="page-header">
        <p className="tp-eyebrow">B1 exam topics</p>
        <h1 className="page-title" id="page-title" tabIndex={-1}>
          Topics
        </h1>
        <p className="lead">
          The seven YKI themes. Each has its words, dialogues, quick answers, talks,
          model texts and the sentences to know by heart.
        </p>
      </header>
      <ul className="card-grid">
        {topics.map((topic) => {
          const wordCount = topic.wordGroups.reduce((sum, group) => sum + group.words.length, 0);
          const dialogueCount =
            topic.sections.find((section) => section.kind === 'dialogues')?.sets.length ?? 0;
          return (
            <li className="tp-card" key={topic.id}>
              <p className="tp-eyebrow">Topic {topic.number}</p>
              <h2 className="tp-card__title">
                <a className="tp-card__link" href={hrefFor('topics', { arg: topic.id })} lang="sv">
                  {topic.title}
                </a>
              </h2>
              <p className="tp-card__body">{topic.titleEn}</p>
              <div className="tp-card__footer">
                <span className="tp-pill">{wordCount} words</span>
                <span className="tp-pill">{dialogueCount} dialogues</span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function TopicView({ topic, topics, learning, hideEnglishSwitch }) {
  const tabs = TOPIC_TABS.filter((tab) => {
    if (tab.id === 'words') return topic.wordGroups.length;
    if (tab.id === 'by-heart') return topic.keySentences.length;
    return topic.sections.some((section) => tab.kinds.includes(section.kind));
  });
  const [selected, setSelected] = useState(tabs[0]?.id);
  const tabRefs = useRef([]);
  const index = topics.findIndex((entry) => entry.id === topic.id);
  const next = topics[index + 1];

  const onKeyDown = (event) => {
    const current = tabs.findIndex((tab) => tab.id === selected);
    let target;
    if (event.key === 'ArrowRight') target = (current + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') target = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = tabs.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    setSelected(tabs[target].id);
    tabRefs.current[target]?.focus();
  };

  return (
    <article aria-labelledby="page-title">
      <header className="page-header">
        <p className="tp-eyebrow">
          <a href={hrefFor('topics')}>Topics</a> · Topic {topic.number} of {topics.length}
        </p>
        <h1 className="page-title" id="page-title" tabIndex={-1} lang="sv">
          {topic.title}
        </h1>
        <p className="lead">{topic.titleEn}</p>
        {hideEnglishSwitch}
      </header>

      <div className="tp-tabs">
        <div className="tp-tabs__list" role="tablist" aria-label="Topic sections" onKeyDown={onKeyDown}>
          {tabs.map((tab, tabIndex) => (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tabIndex] = node;
              }}
              className="tp-tab"
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected === tab.id ? 0 : -1}
              onClick={() => setSelected(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="tp-tabs__panel topic-panel"
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            hidden={selected !== tab.id}
          >
            {selected === tab.id ? <TopicPanel tab={tab} topic={topic} learning={learning} /> : null}
          </div>
        ))}
      </div>

      {next ? (
        <nav className="pager pager--end" aria-label="Next topic">
          <span />
          <a className="tp-button tp-button--primary" href={hrefFor('topics', { arg: next.id })}>
            Next topic: {next.title}
            <span className="tp-button__arrow" aria-hidden="true">→</span>
          </a>
        </nav>
      ) : null}
    </article>
  );
}

function TopicPanel({ tab, topic, learning }) {
  const { hideEnglish } = learning;

  if (tab.id === 'words') {
    return (
      <div className="topic-sections">
        {topic.wordGroups.map((group) => (
          <section className="lesson-section" key={group.id} aria-labelledby={group.id}>
            <h2 className="section-title" id={group.id}>
              <span lang="sv">{group.title}</span>{' '}
              <span className="section-title__en">{group.titleEn}</span>
            </h2>
            {group.tips.map((tip, index) => (
              <p className="tip" key={index}>
                <Lightbulb {...iconProps} />
                <span>{tip}</span>
              </p>
            ))}
            <WordTable
              words={group.words.map((word) => ({
                sv: word.swedish,
                en: word.english,
                exampleSv: word.examples[0]?.sv,
                exampleEn: word.examples[0]?.en,
              }))}
              learning={learning}
              label={`${group.title}: words`}
            />
          </section>
        ))}
      </div>
    );
  }

  if (tab.id === 'by-heart') {
    return (
      <ByHeart sentences={topic.keySentences} learning={learning} />
    );
  }

  const sections = topic.sections.filter((section) => tab.kinds.includes(section.kind));
  return (
    <div className="topic-sections">
      {sections.map((section) => (
        <div className="stack" key={section.id}>
          {sections.length > 1 ? (
            <p className="tp-eyebrow">
              {section.title} · {section.titleEn}
            </p>
          ) : null}
          {section.sets.map((set, setIndex) => (
            <TopicSet
              key={`${section.id}-${setIndex}`}
              id={`${section.id}-${setIndex}`}
              set={set}
              kind={section.kind}
              hideEnglish={hideEnglish}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ByHeart({ sentences, learning }) {
  const [practising, setPractising] = useState(false);
  return (
    <div className="stack">
      <p className="lead">The sentences to know by heart for this topic.</p>
      <div className="word-toolbar">
        <button
          className="tp-button"
          type="button"
          aria-expanded={practising}
          onClick={() => setPractising((value) => !value)}
        >
          {practising ? 'Close flashcards' : 'Practise with flashcards'}
        </button>
      </div>
      {practising ? (
        <Flashcards cards={sentences} learning={learning} unit="sentences" onClose={() => setPractising(false)} />
      ) : null}
      <PairList pairs={sentences} hideEnglish={learning.hideEnglish} ordered />
    </div>
  );
}

function TopicSet({ id, set, kind, hideEnglish }) {
  const titled = Boolean(set.title);
  return (
    <section className="lesson-section" aria-labelledby={titled ? id : undefined}>
      {titled ? (
        <h2 className="section-title" id={id}>
          <span lang="sv">{set.title}</span>{' '}
          <span className="section-title__en">{set.titleEn}</span>
        </h2>
      ) : null}
      <div className="stack">
        {set.items.map((item, index) => (
          <div className={item.prompt ? 'prompt-item' : 'stack'} key={index}>
            {item.prompt ? (
              <p className="prompt">
                <span className="prompt__sv" lang="sv">
                  {item.prompt.sv}
                </span>
                <span className="prompt__en">{item.prompt.en}</span>
              </p>
            ) : null}
            {item.lines.length ? (
              <PairList pairs={item.lines} hideEnglish={hideEnglish && kind !== 'writing'} />
            ) : null}
          </div>
        ))}
        {set.paragraphs?.length ? (
          <div className="model-text">
            <p className="tp-eyebrow">Model text</p>
            {set.paragraphs.map((paragraph, index) => (
              <div className="model-text__row" key={index}>
                <p lang="sv">{paragraph.sv}</p>
                <p className="pair__en">
                  <English text={paragraph.en} hidden={hideEnglish} className="" />
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SearchField({ id, label, hint, query, setQuery }) {
  return (
    <div className="search-bar" role="search">
      <div className="tp-field">
        <label className="tp-field__label" htmlFor={id}>
          {label}
        </label>
        <p className="tp-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
        <input
          className="tp-input"
          id={id}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-describedby={`${id}-hint`}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function NoResults({ query, suggestion, onClear }) {
  return (
    <div className="tp-empty tp-empty--compact">
      <span className="tp-empty__icon">
        <Search {...iconProps} />
      </span>
      <h2 className="tp-empty__title">No results for “{query}”</h2>
      <p className="tp-empty__body">{suggestion}</p>
      <div className="tp-empty__actions">
        <button className="tp-button" type="button" onClick={onClear}>
          Clear search
        </button>
      </div>
    </div>
  );
}

function VocabularyPage({ query, setQuery, words, total }) {
  return (
    <>
      <header className="page-header">
        <p className="tp-eyebrow">Vocabulary review</p>
        <h1 className="page-title" id="page-title" tabIndex={-1}>
          All words
        </h1>
        <p className="lead">Every word from the lessons and the topics in one list.</p>
      </header>

      <SearchField
        id="vocabulary-search"
        label="Search words"
        hint="A Swedish or English word, a level (A1, A2, B1), a day number or a topic."
        query={query}
        setQuery={setQuery}
      />
      <p className="result-count" role="status">
        Showing {words.length} of {total} words
      </p>

      {words.length ? (
        <div className="tp-table-wrap" role="region" aria-label="All words" tabIndex={0}>
          <table className="tp-table">
            <thead>
              <tr>
                <th scope="col">Swedish</th>
                <th scope="col">English</th>
                <th scope="col">Example</th>
                <th scope="col">Where</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word, index) => {
                const example = word.examples[0];
                return (
                  <tr key={`${word.swedish}-${word.english}-${index}`}>
                    <th scope="row" lang="sv">
                      {word.swedish}
                    </th>
                    <td>{word.english}</td>
                    <td>
                      {example ? (
                        <>
                          <span className="example__sv" lang="sv">
                            {example.sv}
                          </span>
                          <span className="example__en">{example.en}</span>
                        </>
                      ) : null}
                    </td>
                    <td>
                      <ul className="day-links">
                        {word.days.map((day) => (
                          <li key={day}>
                            <a href={hrefFor('lessons', { arg: day })} aria-label={`Day ${day}`}>
                              {day}
                            </a>
                          </li>
                        ))}
                        {word.topics.map((topic) => (
                          <li key={topic.id}>
                            <a href={hrefFor('topics', { arg: topic.id })} aria-label={`Topic: ${topic.title}`}>
                              T{topic.number}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <NoResults
          query={query}
          suggestion="Try a Swedish word, an English meaning, or a level such as A2 or B1."
          onClear={() => setQuery('')}
        />
      )}
    </>
  );
}

function GrammarPage({ query, setQuery, topics, total }) {
  return (
    <>
      <header className="page-header">
        <p className="tp-eyebrow">Grammar hub</p>
        <h1 className="page-title" id="page-title" tabIndex={-1}>
          Grammar
        </h1>
        <p className="lead">Short rules with examples, each linked to the lessons that use them.</p>
      </header>

      <SearchField
        id="grammar-search"
        label="Search grammar"
        hint="A topic, rule or example, for example “perfect”, “V2” or “formal”."
        query={query}
        setQuery={setQuery}
      />
      <p className="result-count" role="status">
        Showing {topics.length} of {total} topics
      </p>

      {topics.length ? (
        <ul className="topic-list">
          {topics.map((topic) => (
            <li key={topic.id}>
              <article className="tp-card note" aria-labelledby={`topic-${topic.id}`}>
                <p className="tp-eyebrow">{topic.category}</p>
                <h2 className="tp-card__title" id={`topic-${topic.id}`}>
                  {topic.title}
                </h2>
                <p className="tp-card__body">{topic.summary}</p>
                <div className="note__section">
                  <h3>Rules</h3>
                  <ul className="rule-list">
                    {topic.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
                <div className="note__section">
                  <h3>Examples</h3>
                  <DataTable
                    label={`Examples: ${topic.title}`}
                    rows={topic.examples.map((example) => ({
                      Swedish: example.swedish,
                      English: example.english,
                    }))}
                  />
                </div>
                <div className="note__section">
                  <h3>Lessons</h3>
                  <ul className="link-list">
                    {topic.relatedDays.map((day) => (
                      <li key={`${topic.id}-${day}`}>
                        <a className="tp-button" href={hrefFor('lessons', { arg: day })}>
                          Day {day}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <NoResults
          query={query}
          suggestion="Try words like “perfect”, “V2”, “formal” or “opinion”."
          onClear={() => setQuery('')}
        />
      )}
    </>
  );
}

// Columns named "Swedish" are marked lang="sv" so screen readers switch voice.
function DataTable({ rows, label }) {
  if (!rows?.length) {
    return null;
  }

  const columns = Object.keys(rows[0]);
  const langFor = (column) => (/swedish/i.test(column) ? 'sv' : undefined);

  return (
    <div className="tp-table-wrap" role="region" aria-label={label} tabIndex={0}>
      <table className="tp-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) =>
                columnIndex === 0 ? (
                  <th scope="row" lang={langFor(column)} key={`${column}-${rowIndex}`}>
                    {row[column]}
                  </th>
                ) : (
                  <td lang={langFor(column)} key={`${column}-${rowIndex}`}>
                    {row[column]}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
