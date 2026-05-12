import React, { useDeferredValue, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Languages,
  ListChecks,
  ScrollText,
  Search,
} from 'lucide-react';
import course from './data/swedishA1Course.json';
import courseEnhancements from './data/courseEnhancements';
import './styles.css';

function App() {
  const [selectedDay, setSelectedDay] = useState(course.days[0]?.day ?? 1);
  const [page, setPage] = useState('lessons');
  const [vocabularyQuery, setVocabularyQuery] = useState('');
  const [grammarQuery, setGrammarQuery] = useState('');
  const deferredVocabularyQuery = useDeferredValue(vocabularyQuery);
  const deferredGrammarQuery = useDeferredValue(grammarQuery);

  const lessonAdditionsByDay = useMemo(
    () =>
      new Map(
        courseEnhancements.lessonAdditions.map((addition) => [addition.day, addition]),
      ),
    [],
  );

  const grammarTopics = courseEnhancements.grammarTopics;

  const lessons = useMemo(
    () =>
      course.days.map((day) => {
        const addition = lessonAdditionsByDay.get(day.day);

        return {
          ...day,
          noteMerge: addition ?? null,
          vocabulary: mergeVocabulary(day.vocabulary, addition?.vocabulary ?? []),
          relatedGrammarTopics: grammarTopics.filter((topic) =>
            topic.relatedDays.includes(day.day),
          ),
        };
      }),
    [grammarTopics, lessonAdditionsByDay],
  );

  const lesson = lessons.find((day) => day.day === selectedDay);

  const { totalDays, totalHours, notesCoverage, vocabulary } = useMemo(() => {
    const totalLessonDays = course.estimatedDays ?? lessons.length;
    const totalLessonHours =
      course.estimatedHours ??
      lessons.reduce((sum, day) => sum + day.durationMinutes, 0) / 60;
    const enrichedWordMap = new Map();

    lessons.forEach((day) => {
      day.vocabulary.forEach((item) => {
        const key = `${item.swedish.trim().toLowerCase()}::${item.english
          .trim()
          .toLowerCase()}`;
        const currentExample = {
          day: day.day,
          title: day.title,
          exampleSwedish: item.exampleSwedish,
          exampleEnglish: item.exampleEnglish,
        };
        const existing = enrichedWordMap.get(key);

        if (existing) {
          if (!existing.days.includes(day.day)) {
            existing.days.push(day.day);
          }
          const hasExample = existing.examples.some(
            (example) =>
              example.exampleSwedish === currentExample.exampleSwedish &&
              example.exampleEnglish === currentExample.exampleEnglish,
          );
          if (!hasExample) {
            existing.examples.push(currentExample);
          }
          return;
        }

        enrichedWordMap.set(key, {
          swedish: item.swedish,
          english: item.english,
          days: [day.day],
          examples: [currentExample],
        });
      });
    });

    return {
      totalDays: totalLessonDays,
      totalHours: totalLessonHours,
      notesCoverage: courseEnhancements.lessonAdditions.length,
      vocabulary: [...enrichedWordMap.values()].sort((a, b) =>
        a.swedish.localeCompare(b.swedish, 'sv'),
      ),
    };
  }, [lessons]);

  const filteredVocabulary = useMemo(() => {
    const normalizedQuery = deferredVocabularyQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return vocabulary;
    }

    return vocabulary.filter((item) => {
      const text = [
        item.swedish,
        item.english,
        item.days.join(' '),
        ...item.examples.flatMap((example) => [
          example.title,
          example.exampleSwedish,
          example.exampleEnglish,
        ]),
      ]
        .join(' ')
        .toLowerCase();

      return text.includes(normalizedQuery);
    });
  }, [deferredVocabularyQuery, vocabulary]);

  const filteredGrammarTopics = useMemo(() => {
    const normalizedQuery = deferredGrammarQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return grammarTopics;
    }

    return grammarTopics.filter((topic) => {
      const text = [
        topic.title,
        topic.category,
        topic.summary,
        topic.rules.join(' '),
        topic.sourceDates.join(' '),
        topic.examples.map((example) => `${example.swedish} ${example.english}`).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return text.includes(normalizedQuery);
    });
  }, [deferredGrammarQuery, grammarTopics]);

  const openGrammarTopic = (topicTitle) => {
    setGrammarQuery(topicTitle);
    setPage('grammar');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Languages size={28} />
          </div>
          <div>
            <h1>Swedish A1</h1>
            <p>{totalDays}-day beginner course</p>
          </div>
        </div>

        <section className="course-summary">
          <div className="summary-label">Course plan</div>
          <h2>{course.courseTitle}</h2>
          <p>{course.description}</p>
          <div className="summary-stats">
            <div>
              <strong>{totalDays}</strong>
              <span>days</span>
            </div>
            <div>
              <strong>{totalHours}</strong>
              <span>hours</span>
            </div>
            <div>
              <strong>{vocabulary.length}</strong>
              <span>unique words</span>
            </div>
          </div>
          <div className="summary-stats summary-stats-secondary">
            <div>
              <strong>{notesCoverage}</strong>
              <span>note-linked lessons</span>
            </div>
            <div>
              <strong>{grammarTopics.length}</strong>
              <span>grammar topics</span>
            </div>
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

        {page === 'lessons' && (
          <div className="day-list">
            <div className="side-heading">
              <CalendarDays size={16} /> Choose a day
            </div>
            <div className="day-grid">
              {lessons.map((day) => (
                <button
                  key={day.day}
                  className={selectedDay === day.day ? 'day active' : 'day'}
                  onClick={() => setSelectedDay(day.day)}
                  title={`Day ${day.day}: ${day.title}`}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="content">
        {page === 'lessons' && lesson ? (
          <>
            <section className="content-hero">
              <span className="eyebrow">{lesson.phase}</span>
              <h2>
                Day {lesson.day}: {lesson.title}
              </h2>
              <p>{lesson.goal}</p>
            </section>
            <LessonView
              lesson={lesson}
              totalDays={totalDays}
              onOpenGrammarTopic={openGrammarTopic}
              onSelectDay={setSelectedDay}
            />
          </>
        ) : null}

        {page === 'vocabulary' ? (
          <>
            <section className="content-hero">
              <span className="eyebrow">Vocabulary review</span>
              <h2>Course vocabulary</h2>
              <p>
                This page merges the base lesson JSON with the analyzed class
                notes, so extra vocabulary from your own lessons appears in the
                same searchable course list.
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
              <h2>Grammar and structure</h2>
              <p>
                This section was built from your notes and linked back to the
                course days where each pattern matters most.
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

function LessonView({ lesson, totalDays, onSelectDay, onOpenGrammarTopic }) {
  return (
    <article className="lesson-card">
      <div className="lesson-header">
        <div className="lesson-meta-row">
          <span className="badge">Day {lesson.day}</span>
          <span className="phase-pill">{lesson.phase}</span>
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.goal}</p>
        <div className="meta">
          <Clock3 size={16} /> Estimated time: {lesson.durationMinutes} minutes
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
        </section>
      ))}

      {lesson.noteMerge ? (
        <section className="lesson-section note-panel">
          <span className="note-label">Merged class notes</span>
          <p>{lesson.noteMerge.summary}</p>
          <div className="note-meta">
            Source lessons: {lesson.noteMerge.sourceDates.join(', ')}
          </div>
          {lesson.noteMerge.sections.map((section, index) => (
            <div className="note-subsection" key={`${section.heading}-${index}`}>
              <h4>{section.heading}</h4>
              {section.content?.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
              {section.table && <DataTable rows={section.table} />}
              {section.list && (
                <ul>
                  {section.list.map((item, listIndex) => (
                    <li key={listIndex}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      ) : null}

      {lesson.relatedGrammarTopics.length ? (
        <section className="lesson-section">
          <h4>Related grammar topics</h4>
          <div className="tag-list">
            {lesson.relatedGrammarTopics.map((topic) => (
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
        <h4>Vocabulary for this day</h4>
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

function VocabularyPage({ query, setQuery, words, total }) {
  return (
    <article className="lesson-card">
      <div className="lesson-header">
        <span className="badge">Vocabulary</span>
        <h3>Course word list</h3>
        <p>
          Search Swedish, English, lesson titles, or example sentences. The
          list below merges repeated words across the course and the extra note
          analysis.
        </p>
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Swedish, English, or examples..."
          />
        </label>
        <div className="meta">Showing {words.length} of {total} unique words</div>
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
          No vocabulary matched “{query}”. Try a simpler Swedish or English
          word.
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
        <h3>Grammar topics from your notes</h3>
        <p>
          This grammar section groups together the recurring patterns from your
          class notes: pronunciation, verb-second word order, negation,
          adjective agreement, plurals, and more.
        </p>
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search grammar topics, examples, or rules..."
          />
        </label>
        <div className="meta">Showing {topics.length} of {total} grammar topics</div>
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
              <div className="source-row">
                Source lessons: {topic.sourceDates.join(', ')}
              </div>
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
          No grammar topic matched “{query}”. Try words like “plural”,
          “negation”, or “pronunciation”.
        </div>
      )}
    </article>
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

function mergeVocabulary(baseVocabulary, additionalVocabulary) {
  const merged = [];
  const seen = new Set();

  [...baseVocabulary, ...additionalVocabulary].forEach((item) => {
    const key = `${item.swedish.trim().toLowerCase()}::${item.english
      .trim()
      .toLowerCase()}`;

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    merged.push(item);
  });

  return merged;
}

createRoot(document.getElementById('root')).render(<App />);
