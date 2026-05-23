import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Languages,
  ListChecks,
  Route,
  ScrollText,
  Search,
  Target,
} from 'lucide-react';
import courseUrl from './data/swedishYkiCourse.json?url';
import './styles.css';

function App() {
  const [courseData, setCourseData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [page, setPage] = useState('lessons');
  const [vocabularyQuery, setVocabularyQuery] = useState('');
  const [grammarQuery, setGrammarQuery] = useState('');
  const deferredVocabularyQuery = useDeferredValue(vocabularyQuery);
  const deferredGrammarQuery = useDeferredValue(grammarQuery);
  const lessons = courseData?.days ?? [];
  const levels = courseData?.levels ?? [];
  const grammarTopics = courseData?.grammarTopics ?? [];

  useEffect(() => {
    let active = true;

    fetch(courseUrl)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setCourseData(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load course data', error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (lessons.length && !lessons.some((lesson) => lesson.day === selectedDay)) {
      setSelectedDay(lessons[0].day);
    }
  }, [lessons, selectedDay]);

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

  const openGrammarTopic = (topicTitle) => {
    setGrammarQuery(topicTitle);
    setPage('grammar');
  };

  if (!courseData) {
    return (
      <div className="app-shell loading-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">
              <Languages size={28} />
            </div>
            <div>
              <h1>Swedish for YKI</h1>
              <p>Loading the A1 to B1 course...</p>
            </div>
          </div>
        </aside>
        <main className="content">
          <section className="content-hero">
            <span className="eyebrow">Loading</span>
            <h2>Preparing the course data</h2>
            <p>
              The expanded Swedish curriculum is loading as a separate data
              file so the app stays lighter.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Languages size={28} />
          </div>
          <div>
            <h1>Swedish for YKI</h1>
            <p>A1, A2, B1 toward late August 2026</p>
          </div>
        </div>

        <section className="course-summary">
          <div className="summary-label">Course plan</div>
          <h2>{course.courseTitle}</h2>
          <p>{course.description}</p>
          <div className="summary-stats">
            <div>
              <strong>{lessons.length}</strong>
              <span>lessons</span>
            </div>
            <div>
              <strong>{course.estimatedHours}</strong>
              <span>hours</span>
            </div>
            <div>
              <strong>{vocabulary.length}</strong>
              <span>unique words</span>
            </div>
          </div>
          <div className="summary-stats summary-stats-secondary">
            <div>
              <strong>{levels.length}</strong>
              <span>CEFR sections</span>
            </div>
            <div>
              <strong>{grammarTopics.length}</strong>
              <span>grammar hubs</span>
            </div>
          </div>
          <div className="summary-note">
            <Target size={15} />
            <span>{course.targetWindow}</span>
          </div>
        </section>

        <nav className="tabs">
          <button
            className={page === 'lessons' ? 'active' : ''}
            onClick={() => setPage('lessons')}
          >
            <BookOpen size={18} /> Lessons
          </button>
          <button
            className={page === 'roadmap' ? 'active' : ''}
            onClick={() => setPage('roadmap')}
          >
            <Route size={18} /> Roadmap
          </button>
          <button
            className={page === 'vocabulary' ? 'active' : ''}
            onClick={() => setPage('vocabulary')}
          >
            <ListChecks size={18} /> Vocabulary
          </button>
          <button
            className={page === 'grammar' ? 'active' : ''}
            onClick={() => setPage('grammar')}
          >
            <ScrollText size={18} /> Grammar
          </button>
        </nav>

        {page === 'lessons' ? (
          <div className="level-list">
            {levels.map((level) => (
              <section className="level-card" key={level.id}>
                <button
                  className={
                    selectedLevel?.id === level.id ? 'level-header active' : 'level-header'
                  }
                  onClick={() => setSelectedDay(level.startDay)}
                >
                  <div>
                    <span className="level-id">{level.id}</span>
                    <h3>{level.title}</h3>
                  </div>
                  <small>
                    Days {level.startDay}-{level.endDay}
                  </small>
                </button>
                <p>{level.description}</p>
                <div className="objective-list">
                  {level.objectives.map((objective, index) => (
                    <div className="objective-chip" key={`${level.id}-objective-${index}`}>
                      {objective}
                    </div>
                  ))}
                </div>
                <div className="day-grid">
                  {level.lessons.map((lesson) => (
                    <button
                      key={lesson.day}
                      className={selectedDay === lesson.day ? 'day active' : 'day'}
                      onClick={() => setSelectedDay(lesson.day)}
                      title={`Day ${lesson.day}: ${lesson.title}`}
                    >
                      {lesson.day}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {page === 'roadmap' ? (
          <div className="sidebar-note">
            <div className="side-heading">
              <CalendarDays size={16} /> Weekly method
            </div>
            <ul>
              {course.studyMethod.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      <main className="content">
        {page === 'lessons' && selectedLesson ? (
          <>
            <section className="content-hero">
              <span className="eyebrow">
                {selectedLevel?.id} • {selectedLevel?.title}
              </span>
              <h2>
                Day {selectedLesson.day}: {selectedLesson.title}
              </h2>
              <p>{selectedLesson.goal}</p>
              <div className="hero-meta">
                <span>{course.examGoal}</span>
                <span>{selectedLesson.durationMinutes} minutes</span>
              </div>
            </section>
            <LessonView
              lesson={selectedLesson}
              totalDays={lessons.length}
              relatedGrammarTopics={relatedGrammarTopics}
              onOpenGrammarTopic={openGrammarTopic}
              onSelectDay={setSelectedDay}
            />
          </>
        ) : null}

        {page === 'roadmap' ? (
          <>
            <section className="content-hero">
              <span className="eyebrow">Scientific study plan</span>
              <h2>Roadmap to late August</h2>
              <p>
                This plan assumes six study days per week from May 25, 2026 to
                August 30, 2026, with one lighter review or rest day each week.
              </p>
              <div className="hero-meta">
                <span>Retrieval on D+1, D+3, D+7</span>
                <span>Weekly speaking and writing output</span>
              </div>
            </section>
            <RoadmapPage course={course} levels={levels} />
          </>
        ) : null}

        {page === 'vocabulary' ? (
          <>
            <section className="content-hero">
              <span className="eyebrow">Vocabulary review</span>
              <h2>Searchable course vocabulary</h2>
              <p>
                This merges vocabulary across all A1, A2, and B1 lessons so you
                can revise by keyword, lesson range, or example.
              </p>
            </section>
            <VocabularyPage
              query={vocabularyQuery}
              setQuery={setVocabularyQuery}
              words={filteredVocabulary}
              total={vocabulary.length}
            />
          </>
        ) : null}

        {page === 'grammar' ? (
          <>
            <section className="content-hero">
              <span className="eyebrow">Grammar hub</span>
              <h2>Grammar and exam patterns</h2>
              <p>
                These hubs connect pronunciation, sentence structure, time
                expressions, formal writing, and YKI task strategy back to the
                course days where they matter most.
              </p>
            </section>
            <GrammarPage
              query={grammarQuery}
              setQuery={setGrammarQuery}
              topics={filteredGrammarTopics}
              total={grammarTopics.length}
              onOpenLesson={setSelectedDay}
              onShowLessons={() => setPage('lessons')}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}

function LessonView({
  lesson,
  totalDays,
  relatedGrammarTopics,
  onSelectDay,
  onOpenGrammarTopic,
}) {
  return (
    <article className="lesson-card">
      <div className="lesson-header">
        <div className="lesson-meta-row">
          <span className="badge">Day {lesson.day}</span>
          <span className="phase-pill">{lesson.level}</span>
          <span className="phase-pill phase-pill-soft">{lesson.phase}</span>
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.goal}</p>
        <div className="meta">
          <Clock3 size={16} /> Estimated time: {lesson.durationMinutes} minutes
        </div>
        <div className="skill-chip-list">
          {lesson.ykiSkills.map((skill) => (
            <span className="skill-chip" key={skill}>
              {skill}
            </span>
          ))}
        </div>
        <div className="lesson-nav">
          <button
            className="nav-button"
            disabled={lesson.day === 1}
            onClick={() => onSelectDay(lesson.day - 1)}
          >
            <ChevronLeft size={16} /> Previous day
          </button>
          <button
            className="nav-button"
            disabled={lesson.day === totalDays}
            onClick={() => onSelectDay(lesson.day + 1)}
          >
            Next day <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {lesson.sections.map((section, index) => (
        <section className="lesson-section" key={`${section.heading}-${index}`}>
          <h4>{section.heading}</h4>
          <SectionContent section={section} />
        </section>
      ))}

      {lesson.legacyCompanion ? (
        <section className="lesson-section note-panel">
          <span className="note-label">Legacy 60-day companion</span>
          <h4>{lesson.legacyCompanion.title}</h4>
          <p>{lesson.legacyCompanion.goal}</p>
          <div className="note-meta">
            Source: {lesson.legacyCompanion.sourceLabel} • Phase:{' '}
            {lesson.legacyCompanion.phase}
          </div>
          {lesson.legacyCompanion.sections.map((section, index) => (
            <div
              className="note-subsection"
              key={`legacy-companion-${lesson.day}-${section.heading}-${index}`}
            >
              <h4>{section.heading}</h4>
              <SectionContent section={section} />
            </div>
          ))}
          {lesson.legacyCompanion.exercises?.length ? (
            <div className="note-subsection">
              <h4>Legacy exercises</h4>
              {lesson.legacyCompanion.exercises.map((exercise, index) => (
                <details key={`legacy-exercise-${lesson.day}-${index}`}>
                  <summary>{exercise.prompt}</summary>
                  <ol>
                    {exercise.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ol>
                  <strong>Answers</strong>
                  <ol>
                    {exercise.answers.map((answer, answerIndex) => (
                      <li key={answerIndex}>{answer}</li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {lesson.legacyResources.map((resource, resourceIndex) => (
        <section
          className="lesson-section note-panel"
          key={`legacy-resource-${lesson.day}-${resource.resourceType}-${resourceIndex}`}
        >
          <span className="note-label">{resource.resourceType}</span>
          <p>{resource.summary}</p>
          <div className="note-meta">
            Source: {resource.sourceLabel}
            {resource.pageNumber ? ` • page ${resource.pageNumber}` : ''}
            {resource.sourceDates?.length ? ` • ${resource.sourceDates.join(', ')}` : ''}
          </div>
          {resource.sections.map((section, index) => (
            <div
              className="note-subsection"
              key={`legacy-resource-section-${lesson.day}-${resourceIndex}-${index}`}
            >
              <h4>{section.heading}</h4>
              <SectionContent section={section} />
            </div>
          ))}
        </section>
      ))}

      <section className="lesson-section note-panel">
        <span className="note-label">Exam-style task</span>
        <p>{lesson.examTask}</p>
      </section>

      {relatedGrammarTopics.length ? (
        <section className="lesson-section">
          <h4>Related grammar topics</h4>
          <div className="tag-list">
            {relatedGrammarTopics.map((topic) => (
              <button
                className="topic-button"
                key={topic.id}
                onClick={() => onOpenGrammarTopic(topic.title)}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="lesson-section">
        <h4>Vocabulary for this lesson</h4>
        <DataTable
          rows={lesson.vocabulary.map((item) => ({
            Swedish: item.swedish,
            English: item.english,
            Example: `${item.exampleSwedish} — ${item.exampleEnglish}`,
          }))}
        />
      </section>

      <section className="lesson-section exercise-box">
        <h4>Practice</h4>
        {lesson.exercises.map((exercise, index) => (
          <details key={index}>
            <summary>{exercise.prompt}</summary>
            <ol>
              {exercise.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ol>
            <strong>Answers</strong>
            <ol>
              {exercise.answers.map((answer, answerIndex) => (
                <li key={answerIndex}>{answer}</li>
              ))}
            </ol>
          </details>
        ))}
      </section>
    </article>
  );
}

function RoadmapPage({ course, levels }) {
  return (
    <div className="roadmap-layout">
      <article className="lesson-card roadmap-card">
        <div className="lesson-header">
          <span className="badge">Method</span>
          <h3>Study system for the next 14 weeks</h3>
          <p>
            The plan below turns the repository into a structured preparation
            cycle instead of a loose phrase list.
          </p>
        </div>

        <section className="roadmap-section">
          <h4>Course architecture</h4>
          <div className="level-overview-grid">
            {levels.map((level) => (
              <div className="overview-box" key={level.id}>
                <div className="overview-topline">
                  <span className="phase-pill">{level.id}</span>
                  <strong>
                    Days {level.startDay}-{level.endDay}
                  </strong>
                </div>
                <p>{level.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="roadmap-section">
          <h4>Spaced repetition routine</h4>
          <ul className="rule-list">
            {course.studyMethod.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="roadmap-section">
          <h4>Final-week behavior</h4>
          <ul className="rule-list">
            {course.testWeekAdvice.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </article>

      <div className="roadmap-grid">
        {course.studyPlan.map((week) => (
          <section className="grammar-card" key={week.week}>
            <div className="grammar-card-header">
              <span className="phase-pill">{week.level}</span>
              <h4>Week {week.week}</h4>
            </div>
            <div className="source-row">
              {week.startDate} to {week.endDate}
            </div>
            <div className="roadmap-week-range">{week.lessonRange}</div>
            <p>{week.focus}</p>
            <div className="roadmap-checkpoint">
              <CheckCircle2 size={16} />
              <span>{week.checkpoint}</span>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function VocabularyPage({ query, setQuery, words, total }) {
  return (
    <article className="lesson-card">
      <div className="lesson-header">
        <span className="badge">Vocabulary</span>
        <h3>Course word list</h3>
        <p>
          Search Swedish, English, CEFR section, lesson number, or example
          sentence.
        </p>
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Swedish, English, level, or lesson..."
          />
        </label>
        <div className="meta">
          Showing {words.length} of {total} unique words
        </div>
      </div>

      {words.length ? (
        <div className="vocab-list">
          {words.map((word, index) => {
            const primaryExample = word.examples[0];
            return (
              <div
                className="vocab-card"
                key={`${word.swedish}-${word.english}-${index}`}
              >
                <div>
                  <div className="lesson-meta-row">
                    <span className="phase-pill">{word.level}</span>
                  </div>
                  <h4>{word.swedish}</h4>
                  <p>{word.english}</p>
                </div>
                <div className="example">
                  <strong>Days {word.days.join(', ')}</strong>
                  <span>{primaryExample.exampleSwedish}</span>
                  <small>{primaryExample.exampleEnglish}</small>
                  <small>First seen in: {primaryExample.title}</small>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          No vocabulary matched “{query}”. Try a Swedish word, English gloss, or
          level label like A2 or B1.
        </div>
      )}
    </article>
  );
}

function GrammarPage({ query, setQuery, topics, total, onOpenLesson, onShowLessons }) {
  return (
    <article className="lesson-card">
      <div className="lesson-header">
        <span className="badge">Grammar</span>
        <h3>Grammar topics and strategy patterns</h3>
        <p>
          Search grammar rules, examples, and linked lessons across the full A1
          to B1 course.
        </p>
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search grammar topics, rules, or examples..."
          />
        </label>
        <div className="meta">
          Showing {topics.length} of {total} grammar topics
        </div>
      </div>

      {topics.length ? (
        <div className="grammar-list">
          {topics.map((topic) => (
            <section className="grammar-card" key={topic.id}>
              <div className="grammar-card-header">
                <span className="phase-pill">{topic.category}</span>
                <h4>{topic.title}</h4>
              </div>
              <p>{topic.summary}</p>
              {topic.sourceLabel || topic.sourceDates?.length ? (
                <div className="source-row">
                  Source: {topic.sourceLabel ?? 'YKI curriculum'}
                  {topic.sourceDates?.length ? ` • ${topic.sourceDates.join(', ')}` : ''}
                </div>
              ) : null}
              <div className="grammar-block">
                <strong>Key rules</strong>
                <ul className="rule-list">
                  {topic.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
              <div className="grammar-block">
                <strong>Examples</strong>
                <DataTable
                  rows={topic.examples.map((example) => ({
                    Swedish: example.swedish,
                    English: example.english,
                  }))}
                />
              </div>
              <div className="grammar-block">
                <strong>Linked lessons</strong>
                <div className="tag-list">
                  {topic.relatedDays.map((day) => (
                    <button
                      className="topic-button"
                      key={`${topic.id}-${day}`}
                      onClick={() => {
                        onOpenLesson(day);
                        onShowLessons();
                      }}
                    >
                      Day {day}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No grammar topic matched “{query}”. Try words like “perfect”, “V2”,
          “formal”, or “opinion”.
        </div>
      )}
    </article>
  );
}

function SectionContent({ section }) {
  return (
    <>
      {section.content?.map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex}>{paragraph}</p>
      ))}
      {section.table && <DataTable rows={section.table} />}
      {section.dialogue && <Dialogue dialogue={section.dialogue} />}
      {section.list && (
        <ul>
          {section.list.map((item, listIndex) => (
            <li key={listIndex}>{item}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function DataTable({ rows }) {
  if (!rows?.length) {
    return null;
  }

  const columns = Object.keys(rows[0]);

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={`${column}-${rowIndex}`}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dialogue({ dialogue }) {
  return (
    <div className="dialogue">
      {dialogue.map((line, index) => (
        <div key={index}>
          <strong>{line.speaker}:</strong>
          <span>{line.swedish}</span>
          <small>{line.english}</small>
        </div>
      ))}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
