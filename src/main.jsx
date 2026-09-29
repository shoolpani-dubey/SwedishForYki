import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle2, Clock3, Search, Target } from 'lucide-react';
import courseUrl from './data/swedishYkiCourse.json?url';
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
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'grammar', label: 'Grammar' },
];

const THEMES = [
  { value: '', label: 'Auto' },
  { value: 'paper', label: 'Paper' },
  { value: 'night', label: 'Night' },
];

// Routes live in the hash (#/lessons/12, #/grammar?q=V2) so Back works and
// the page survives a refresh on any static host.
function parseHash(hash) {
  const [path, search = ''] = hash.replace(/^#\/?/, '').split('?');
  const [page, arg] = path.split('/');
  return {
    page: PAGES.some((entry) => entry.id === page) ? page : 'lessons',
    day: Number(arg) || null,
    query: new URLSearchParams(search).get('q'),
  };
}

function hrefFor(page, { day, query } = {}) {
  if (day) return `#/${page}/${day}`;
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

  return [hash, useMemo(() => parseHash(hash), [hash])];
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

function App() {
  const [courseData, setCourseData] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [lastDay, setLastDay] = useState(1);
  const [vocabularyQuery, setVocabularyQuery] = useState('');
  const [grammarQuery, setGrammarQuery] = useState('');
  const [hash, route] = useHashRoute();
  const deferredVocabularyQuery = useDeferredValue(vocabularyQuery);
  const deferredGrammarQuery = useDeferredValue(grammarQuery);
  const lessons = courseData?.days ?? [];
  const levels = courseData?.levels ?? [];
  const grammarTopics = courseData?.grammarTopics ?? [];
  const page = route.page;
  const selectedDay = route.day ?? lastDay;

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
    if (route.day) {
      setLastDay(route.day);
    }
  }, [route.day]);

  useEffect(() => {
    if (route.query !== null) {
      setGrammarQuery(route.query);
    }
  }, [route.query]);

  // On every in-app navigation, start at the top and move focus to the new
  // page title so keyboard and screen reader users land on the new content.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById('page-title')?.focus({ preventScroll: true });
  }, [hash]);

  const course = courseData;
  const selectedLesson = lessons.find((lesson) => lesson.day === selectedDay) ?? lessons[0] ?? null;
  const selectedLevel = levels.find(
    (level) =>
      selectedLesson &&
      selectedLesson.day >= level.startDay &&
      selectedLesson.day <= level.endDay,
  );

  const vocabulary = useMemo(() => {
    const wordMap = new Map();

    lessons.forEach((lesson) => {
      lesson.vocabulary.forEach((item) => {
        const key = `${item.swedish.trim().toLowerCase()}::${item.english
          .trim()
          .toLowerCase()}`;
        const existing = wordMap.get(key);
        const example = {
          day: lesson.day,
          title: lesson.title,
          exampleSwedish: item.exampleSwedish,
          exampleEnglish: item.exampleEnglish,
        };

        if (existing) {
          if (!existing.days.includes(lesson.day)) {
            existing.days.push(lesson.day);
          }
          const duplicateExample = existing.examples.some(
            (entry) =>
              entry.exampleSwedish === example.exampleSwedish &&
              entry.exampleEnglish === example.exampleEnglish,
          );
          if (!duplicateExample) {
            existing.examples.push(example);
          }
          return;
        }

        wordMap.set(key, {
          swedish: item.swedish,
          english: item.english,
          days: [lesson.day],
          level: lesson.level,
          examples: [example],
        });
      });
    });

    return [...wordMap.values()].sort((a, b) => a.swedish.localeCompare(b.swedish, 'sv'));
  }, [lessons]);

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
        ...item.examples.flatMap((example) => [
          example.title,
          example.exampleSwedish,
          example.exampleEnglish,
        ]),
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

  if (!courseData) {
    return (
      <Shell page={page}>
        {loadError ? (
          <div className="tp-alert tp-alert--danger" role="alert">
            <AlertTriangle {...iconProps} className="tp-alert__icon" />
            <div className="tp-alert__content">
              <p className="tp-alert__title">Couldn’t load the course</p>
              <p className="tp-alert__body">
                Check your internet connection, then try again.
              </p>
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
            <p className="lead">
              The A1 to B1 curriculum loads as a separate file so the app stays light.
            </p>
          </header>
        )}
      </Shell>
    );
  }

  return (
    <Shell page={page} courseTitle={course.courseTitle}>
      {page === 'lessons' && selectedLesson ? (
        <div className="lessons-layout">
          <DayIndex levels={levels} selectedDay={selectedLesson.day} />
          <LessonView
            lesson={selectedLesson}
            level={selectedLevel}
            levels={levels}
            lessons={lessons}
            relatedGrammarTopics={relatedGrammarTopics}
          />
        </div>
      ) : null}

      {page === 'roadmap' ? (
        <RoadmapPage
          course={course}
          levels={levels}
          stats={{
            lessons: lessons.length,
            words: vocabulary.length,
            grammarTopics: grammarTopics.length,
          }}
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
                  href={hrefFor('lessons', { day: lesson.day })}
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
          <details className="disclosure">
            <summary>About {level.id}</summary>
            <p>{level.description}</p>
            <ul className="rule-list">
              {level.objectives.map((objective, index) => (
                <li key={`${level.id}-objective-${index}`}>{objective}</li>
              ))}
            </ul>
          </details>
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
          <a className="tp-button" href={hrefFor('lessons', { day: previous.day })}>
            <span aria-hidden="true">←</span> Day {previous.day}
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a className="tp-button tp-button--primary" href={hrefFor('lessons', { day: next.day })}>
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
        <a className="tp-button" href={hrefFor('lessons', { day: previous.day })}>
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
            window.location.hash = hrefFor('lessons', { day: event.target.value });
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
        <a className="tp-button" href={hrefFor('lessons', { day: next.day })}>
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

function LessonView({ lesson, level, levels, lessons, relatedGrammarTopics }) {
  return (
    <article className="lesson" aria-labelledby="page-title">
      <header className="page-header">
        <p className="tp-eyebrow">
          {level?.id} · {lesson.phase} · Day {lesson.day} of {lessons.length}
        </p>
        <h1 className="page-title" id="page-title" tabIndex={-1}>
          {lesson.title}
        </h1>
        <p className="lead">{lesson.goal}</p>
        <div className="meta-row">
          <span className="tp-pill">
            <Clock3 {...iconProps} />
            {lesson.durationMinutes} minutes
          </span>
          <span className="meta-label" id="skills-label">
            YKI skills
          </span>
          <ul className="pill-row" aria-labelledby="skills-label">
            {lesson.ykiSkills.map((skill) => (
              <li key={skill}>
                <span className="tp-pill">{capitalize(skill)}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <LessonPager lesson={lesson} lessons={lessons} levels={levels} position="start" />

      <div className="lesson-body">
        {lesson.sections.map((section, index) => (
          <LessonSection
            key={`${section.heading}-${index}`}
            id={`section-${index}`}
            title={section.heading}
          >
            <SectionContent section={section} />
          </LessonSection>
        ))}

        <div className="tp-alert exam-task">
          <Target {...iconProps} className="tp-alert__icon" />
          <div className="tp-alert__content">
            <h2 className="tp-alert__title">Exam-style task</h2>
            <p className="tp-alert__body">{lesson.examTask}</p>
          </div>
        </div>

        {lesson.legacyCompanion ? (
          <section className="tp-card note" aria-labelledby="legacy-companion">
            <p className="tp-eyebrow">
              Legacy 60-day companion · {lesson.legacyCompanion.phase}
            </p>
            <h2 className="tp-card__title" id="legacy-companion">
              {lesson.legacyCompanion.title}
            </h2>
            <p className="tp-card__body">{lesson.legacyCompanion.goal}</p>
            <p className="note-meta">Source: {lesson.legacyCompanion.sourceLabel}</p>
            {lesson.legacyCompanion.sections.map((section, index) => (
              <div
                className="note__section"
                key={`legacy-companion-${lesson.day}-${section.heading}-${index}`}
              >
                <h3>{section.heading}</h3>
                <SectionContent section={section} />
              </div>
            ))}
            {lesson.legacyCompanion.exercises?.length ? (
              <div className="note__section">
                <h3>Legacy exercises</h3>
                <ExerciseList exercises={lesson.legacyCompanion.exercises} />
              </div>
            ) : null}
          </section>
        ) : null}

        {lesson.legacyResources.map((resource, resourceIndex) => (
          <section
            className="tp-card note"
            key={`legacy-resource-${lesson.day}-${resource.resourceType}-${resourceIndex}`}
            aria-labelledby={`resource-${resourceIndex}`}
          >
            <p className="tp-eyebrow">
              {resource.sourceLabel}
              {resource.pageNumber ? ` · page ${resource.pageNumber}` : ''}
              {resource.sourceDates?.length ? ` · ${resource.sourceDates.join(', ')}` : ''}
            </p>
            <h2 className="tp-card__title" id={`resource-${resourceIndex}`}>
              {resource.resourceType}
            </h2>
            <p className="tp-card__body">{resource.summary}</p>
            {resource.sections.map((section, index) => (
              <div
                className="note__section"
                key={`legacy-resource-section-${lesson.day}-${resourceIndex}-${index}`}
              >
                <h3>{section.heading}</h3>
                <SectionContent section={section} />
              </div>
            ))}
          </section>
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

        <LessonSection id="lesson-vocabulary" title="Vocabulary for this lesson">
          <DataTable
            label="Vocabulary for this lesson"
            rows={lesson.vocabulary.map((item) => ({
              Swedish: item.swedish,
              English: item.english,
              'Example Swedish': item.exampleSwedish,
              'Example English': item.exampleEnglish,
            }))}
          />
        </LessonSection>

        <LessonSection id="practice" title="Practice">
          <ExerciseList exercises={lesson.exercises} />
        </LessonSection>
      </div>

      <LessonPager lesson={lesson} lessons={lessons} levels={levels} position="end" />
    </article>
  );
}

function LessonSection({ id, title, children }) {
  return (
    <section className="lesson-section" aria-labelledby={id}>
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ExerciseList({ exercises }) {
  return (
    <div className="exercise-list">
      {exercises.map((exercise, index) => (
        <details className="disclosure disclosure--boxed" key={index}>
          <summary>{exercise.prompt}</summary>
          <ol className="rule-list">
            {exercise.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ol>
          <details className="disclosure disclosure--answers">
            <summary>Show answers</summary>
            <ol className="rule-list">
              {exercise.answers.map((answer, answerIndex) => (
                <li key={answerIndex}>{answer}</li>
              ))}
            </ol>
          </details>
        </details>
      ))}
    </div>
  );
}

function RoadmapPage({ course, levels, stats }) {
  return (
    <>
      <header className="page-header">
        <p className="tp-eyebrow">Study plan · May 25 – August 30, 2026</p>
        <h1 className="page-title" id="page-title" tabIndex={-1}>
          Roadmap to late August
        </h1>
        <p className="lead">
          Six study days per week, with one lighter review or rest day each week.
          Retrieval on D+1, D+3 and D+7, and speaking and writing output every week.
        </p>
        <p>{course.examGoal}</p>
      </header>

      <dl className="tp-stats">
        <div className="tp-stat tp-stat--highlight">
          <dt className="tp-stat__key">Lessons</dt>
          <dd className="tp-stat__value">{stats.lessons}</dd>
          <dd className="tp-stat__note">One per study day</dd>
        </div>
        <div className="tp-stat">
          <dt className="tp-stat__key">Study time</dt>
          <dd className="tp-stat__value">
            {course.estimatedHours}
            <span className="tp-stat__unit">h</span>
          </dd>
          <dd className="tp-stat__note">Estimated in total</dd>
        </div>
        <div className="tp-stat">
          <dt className="tp-stat__key">Words</dt>
          <dd className="tp-stat__value">{stats.words}</dd>
          <dd className="tp-stat__note">Unique vocabulary items</dd>
        </div>
        <div className="tp-stat">
          <dt className="tp-stat__key">Grammar hubs</dt>
          <dd className="tp-stat__value">{stats.grammarTopics}</dd>
          <dd className="tp-stat__note">Across {levels.length} CEFR levels</dd>
        </div>
      </dl>

      <section className="page-section" aria-labelledby="architecture">
        <h2 className="section-title" id="architecture">
          Course architecture
        </h2>
        <ul className="card-grid">
          {levels.map((level) => (
            <li className="tp-card" key={level.id}>
              <p className="tp-eyebrow">
                {level.id} · Days {level.startDay}–{level.endDay}
              </p>
              <h3 className="tp-card__title">
                <a className="tp-card__link" href={hrefFor('lessons', { day: level.startDay })}>
                  {level.title}
                </a>
              </h3>
              <p className="tp-card__body">{level.description}</p>
              <div className="tp-card__footer">
                <span className="tp-pill">{level.lessonCount} lessons</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="page-section two-col">
        <section aria-labelledby="routine">
          <h2 className="section-title" id="routine">
            Spaced repetition routine
          </h2>
          <ul className="rule-list">
            {course.studyMethod.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="final-week">
          <h2 className="section-title" id="final-week">
            Final week
          </h2>
          <ul className="rule-list">
            {course.testWeekAdvice.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="page-section" aria-labelledby="weeks">
        <h2 className="section-title" id="weeks">
          Week by week
        </h2>
        <p className="note-meta">{course.targetWindow}</p>
        <ol className="card-grid">
          {course.studyPlan.map((week) => (
            <li className="tp-card" key={week.week}>
              <p className="tp-eyebrow">
                Week {week.week} · {week.startDate} – {week.endDate}
              </p>
              <h3 className="tp-card__title">{week.lessonRange}</h3>
              <p className="tp-card__body">{week.focus}</p>
              <div className="tp-card__footer">
                <span className="tp-pill">{week.level}</span>
              </div>
              <p className="checkpoint">
                <CheckCircle2 {...iconProps} />
                <span>{week.checkpoint}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
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
          Course vocabulary
        </h1>
        <p className="lead">
          Every word from the A1, A2 and B1 lessons in one list, so you can revise
          by keyword, level or lesson.
        </p>
      </header>

      <SearchField
        id="vocabulary-search"
        label="Search vocabulary"
        hint="A Swedish or English word, a level (A1, A2, B1), a day number, or part of an example."
        query={query}
        setQuery={setQuery}
      />
      <p className="result-count" role="status">
        Showing {words.length} of {total} words
      </p>

      {words.length ? (
        <div className="tp-table-wrap" role="region" aria-label="Course vocabulary" tabIndex={0}>
          <table className="tp-table">
            <thead>
              <tr>
                <th scope="col">Swedish</th>
                <th scope="col">English</th>
                <th scope="col">Level</th>
                <th scope="col">Days</th>
                <th scope="col">Example</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word, index) => {
                const primaryExample = word.examples[0];
                return (
                  <tr key={`${word.swedish}-${word.english}-${index}`}>
                    <th scope="row" lang="sv">
                      {word.swedish}
                    </th>
                    <td>{word.english}</td>
                    <td className="tp-table__mono">{word.level}</td>
                    <td>
                      <ul className="day-links">
                        {word.days.map((day) => (
                          <li key={day}>
                            <a href={hrefFor('lessons', { day })} aria-label={`Day ${day}`}>
                              {day}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <span className="example__sv" lang="sv">
                        {primaryExample.exampleSwedish}
                      </span>
                      <span className="example__en">{primaryExample.exampleEnglish}</span>
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
          Grammar and exam patterns
        </h1>
        <p className="lead">
          Pronunciation, sentence structure, time expressions, formal writing and
          YKI task strategy, each linked to the lessons where it matters most.
        </p>
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
                {topic.sourceLabel || topic.sourceDates?.length ? (
                  <p className="note-meta">
                    Source: {topic.sourceLabel ?? 'YKI curriculum'}
                    {topic.sourceDates?.length ? ` · ${topic.sourceDates.join(', ')}` : ''}
                  </p>
                ) : null}
                <div className="note__section">
                  <h3>Key rules</h3>
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
                  <h3>Linked lessons</h3>
                  <ul className="link-list">
                    {topic.relatedDays.map((day) => (
                      <li key={`${topic.id}-${day}`}>
                        <a className="tp-button" href={hrefFor('lessons', { day })}>
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

function SectionContent({ section }) {
  return (
    <div className="stack">
      {section.content?.map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex}>{paragraph}</p>
      ))}
      {section.table && <DataTable rows={section.table} label={section.heading} />}
      {section.dialogue && <Dialogue dialogue={section.dialogue} />}
      {section.list && (
        <ul className="rule-list">
          {section.list.map((item, listIndex) => (
            <li key={listIndex}>{item}</li>
          ))}
        </ul>
      )}
    </div>
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

function Dialogue({ dialogue }) {
  return (
    <ol className="dialogue">
      {dialogue.map((line, index) => (
        <li key={index}>
          <span className="dialogue__speaker" lang="sv">
            {line.speaker}
          </span>
          <div>
            <p className="dialogue__sv" lang="sv">
              {line.swedish}
            </p>
            <p className="dialogue__en">{line.english}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

createRoot(document.getElementById('root')).render(<App />);
