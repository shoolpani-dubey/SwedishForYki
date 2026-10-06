import React, { useEffect, useRef, useState } from 'react';
import { practiceTopics } from './data/practicePrompts.js';
import './practice.css';

const SPEAKING_TASKS = [
  { id: 'story', label: 'Berätta', english: 'Storytelling', phases: [['Prepare', 60], ['Speak', 60]], tip: 'Jag ska berätta om… → vad som hände → hur jag kände mig → varför jag minns det.' },
  { id: 'dialogue-0', label: 'Dialog 1', english: 'Dialogue', phases: [['Read', 20], ['Answer', 20]], tip: 'Svara direkt. Lägg till en detalj eller en fråga.' },
  { id: 'dialogue-1', label: 'Dialog 2', english: 'Dialogue', phases: [['Read', 20], ['Answer', 20]], tip: 'Svara direkt. Lägg till en detalj eller en fråga.' },
  ...Array.from({ length: 5 }, (_, index) => ({ id: `reaction-${index}`, label: `Reagera ${index + 1}`, english: 'Reaction', phases: [['Read', 20], ['Reply', 30]], tip: 'Säg 1–3 meningar: reaktion → handling eller fråga.' })),
  { id: 'opinion', label: 'Din åsikt', english: 'Opinion A or B', phases: [['Prepare', 60], ['Speak', 90]], tip: 'Jag tycker att… → för det första… → för det andra… → å andra sidan… → sammanfattningsvis…' },
];

const WRITING_TASKS = [
  { id: 'informal', label: 'Informellt mejl', english: 'Informal email', minutes: 10, min: 50, max: 80, tip: 'Hej… → varför du skriver → alla punkter → fråga eller förslag → Hälsningar…' },
  { id: 'formal', label: 'Formellt mejl', english: 'Formal email', minutes: 15, min: 60, max: 80, tip: 'Ämne → Hej… → ärende och detaljer → tydlig önskan → Med vänliga hälsningar…' },
  { id: 'opinion', label: 'Åsiktstext', english: 'Opinion piece', minutes: 30, min: 100, max: 150, tip: 'Åsikt → två skäl → exempel → ett annat perspektiv → slutsats. Sikta på cirka 120 ord.' },
];

function taskPrompt(topic, task, choice) {
  if (task.id === 'story') return topic.story;
  if (task.id.startsWith('dialogue-')) return topic.dialogues[Number(task.id.slice(-1))];
  if (task.id.startsWith('reaction-')) return topic.reactions[Number(task.id.slice(-1))];
  if (task.id === 'informal') return topic.writing[0];
  if (task.id === 'formal') return topic.writing[1];
  if (task.id === 'opinion' && task.minutes) return topic.writing[2];
  return topic.opinions[choice];
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function PracticeTimer({ phases }) {
  const [phase, setPhase] = useState(0);
  const [remaining, setRemaining] = useState(phases[0][1]);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);

  useEffect(() => {
    if (!running) return undefined;
    deadline.current = Date.now() + remaining * 1000;
    const interval = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) setRunning(false);
    }, 250);
    return () => window.clearInterval(interval);
  }, [running, phase]);

  const changePhase = (next) => {
    setRunning(false);
    setPhase(next);
    setRemaining(phases[next][1]);
  };

  return (
    <div className="practice-timer" aria-label="Practice timer">
      <div>
        <p className="meta-label">{phases[phase][0]} · {phase + 1} of {phases.length}</p>
        <strong className="practice-timer__time" role="timer" aria-live={remaining === 0 ? 'polite' : 'off'}>{formatTime(remaining)}</strong>
        {remaining === 0 ? <p className="practice-timer__done">Time is up. Move to the next step or review your answer.</p> : null}
      </div>
      <div className="practice-actions">
        <button className="tp-button tp-button--primary" type="button" onClick={() => setRunning(!running)} disabled={remaining === 0}>{running ? 'Pause' : 'Start'}</button>
        <button className="tp-button" type="button" onClick={() => { setRunning(false); setRemaining(phases[phase][1]); }}>Reset</button>
        {phase < phases.length - 1 ? <button className="tp-button" type="button" onClick={() => changePhase(phase + 1)}>Next: {phases[phase + 1][0]} →</button> : null}
      </div>
    </div>
  );
}

function VoiceRecorder() {
  const recorder = useRef(null);
  const stream = useRef(null);
  const chunks = useRef([]);
  const url = useRef(null);
  const [state, setState] = useState('idle');
  const [playback, setPlayback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
    stream.current?.getTracks().forEach((track) => track.stop());
    if (url.current) URL.revokeObjectURL(url.current);
  }, []);

  const start = async () => {
    setError('');
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      chunks.current = [];
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = null;
      setPlayback('');
      const instance = new MediaRecorder(media);
      recorder.current = instance;
      instance.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      instance.onstop = () => {
        const blob = new Blob(chunks.current, { type: instance.mimeType || 'audio/webm' });
        if (blob.size) {
          url.current = URL.createObjectURL(blob);
          setPlayback(url.current);
        }
        media.getTracks().forEach((track) => track.stop());
        setState('idle');
      };
      instance.start();
      setState('recording');
    } catch {
      setError('Microphone access was unavailable. You can still practise aloud with the timer.');
    }
  };

  const stop = () => recorder.current?.state === 'recording' && recorder.current.stop();
  const supported = typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
  return (
    <section className="practice-recorder" aria-label="Voice recording">
      <div className="practice-actions">
        <button className="tp-button" type="button" disabled={!supported} onClick={state === 'recording' ? stop : start}>{state === 'recording' ? 'Stop recording' : 'Record answer'}</button>
        <span className="note-meta">Optional · stays in this browser tab</span>
      </div>
      {!supported ? <p className="tp-field__hint">Recording is not supported in this browser.</p> : null}
      {error ? <p className="tp-field__error" role="alert">{error}</p> : null}
      {playback ? <audio controls src={playback} aria-label="Play your answer" /> : null}
    </section>
  );
}

function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}

function WritingEditor({ topicId, task }) {
  const storageKey = `yki-practice-draft:${topicId}:${task.id}`;
  const [draft, setDraft] = useState(() => {
    try { return localStorage.getItem(storageKey) || ''; } catch { return ''; }
  });
  useEffect(() => {
    try { localStorage.setItem(storageKey, draft); } catch { /* Private mode may block storage. */ }
  }, [storageKey, draft]);
  const count = wordCount(draft);
  const status = count < task.min ? `${task.min - count} words to minimum` : count > task.max ? `${count - task.max} words over maximum` : 'Within target';
  return (
    <div className="practice-editor tp-field">
      <label className="tp-field__label" htmlFor="practice-draft">Skriv på svenska · Write in Swedish</label>
      <textarea className="tp-input" id="practice-draft" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Börja skriva här…" spellCheck="true" />
      <div className="practice-editor__footer">
        <span className={count >= task.min && count <= task.max ? 'practice-count practice-count--good' : 'practice-count'} aria-live="polite">{count} words · {status}</span>
        <button className="tp-button tp-button--quiet" type="button" onClick={() => { if (window.confirm('Clear this saved draft?')) setDraft(''); }} disabled={!draft}>Clear draft</button>
      </div>
      <p className="tp-field__hint">Draft saves automatically on this device. Count includes greetings and sign-offs.</p>
    </div>
  );
}

export default function PracticePage() {
  const [mode, setMode] = useState('speaking');
  const [topicId, setTopicId] = useState(practiceTopics[0].id);
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [writingIndex, setWritingIndex] = useState(0);
  const [choice, setChoice] = useState(0);
  const [longOpinion, setLongOpinion] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const topic = practiceTopics.find((entry) => entry.id === topicId);
  const tasks = mode === 'speaking' ? SPEAKING_TASKS : WRITING_TASKS;
  const index = mode === 'speaking' ? speakingIndex : writingIndex;
  const task = tasks[index];
  const prompt = taskPrompt(topic, task, choice);
  const timerKey = `${mode}:${topicId}:${task.id}:${choice}:${longOpinion}`;
  const phases = mode === 'speaking'
    ? task.id === 'opinion' && longOpinion ? [['Prepare', 60], ['Speak', 120]] : task.phases
    : [['Write', task.minutes * 60]];
  const changeTopic = (id) => { setTopicId(id); setSpeakingIndex(0); setWritingIndex(0); setChoice(0); };

  return (
    <article className="practice-page">
      <header className="page-header">
        <p className="tp-eyebrow">YKI practice · Swedish with English support</p>
        <h1 className="page-title" id="page-title" tabIndex={-1}>Speaking & writing</h1>
        <p className="lead">Practise exam-style tasks from the seven topic notes. Read the Swedish prompt first, then reveal English if you need it.</p>
      </header>

      <div className="practice-modes" aria-label="Practice mode">
        <button className="tp-tab" type="button" aria-current={mode === 'speaking' ? 'true' : undefined} onClick={() => setMode('speaking')}>Speaking · 25 min</button>
        <button className="tp-tab" type="button" aria-current={mode === 'writing' ? 'true' : undefined} onClick={() => setMode('writing')}>Writing · 55 min</button>
      </div>

      <div className="practice-layout">
        <aside className="practice-sidebar" aria-label="Practice setup">
          <div className="tp-field">
            <label className="tp-field__label" htmlFor="practice-topic">Topic · Ämne</label>
            <select className="tp-select" id="practice-topic" value={topicId} onChange={(event) => changeTopic(event.target.value)}>
              {practiceTopics.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
            </select>
            <p className="tp-field__hint">{topic.english}</p>
          </div>
          <h2 className="practice-sidebar__title">{mode === 'speaking' ? '9 speaking tasks' : '3 writing texts'}</h2>
          <ol className="practice-task-list">
            {tasks.map((entry, taskIndex) => <li key={entry.id}>
              <button type="button" className="practice-task-button" aria-current={index === taskIndex ? 'step' : undefined} onClick={() => { mode === 'speaking' ? setSpeakingIndex(taskIndex) : setWritingIndex(taskIndex); setChoice(0); }}>
                <span>{String(taskIndex + 1).padStart(2, '0')} · {entry.label}</span>
                <small>{entry.english}</small>
              </button>
            </li>)}
          </ol>
          <p className="tp-field__hint">These are focused practice timings. Use the full {mode === 'speaking' ? '25-minute speaking' : '55-minute writing'} window for all tasks and review.</p>
        </aside>

        <div className="practice-main">
          <div className="practice-card">
            <p className="tp-eyebrow">{topic.name} · Task {index + 1} of {tasks.length}</p>
            <h2 className="section-title">{task.label} <span className="practice-subtitle">/ {task.english}</span></h2>
            <div className="practice-targets">
              {mode === 'speaking' ? phases.map(([label, seconds]) => <span className="tp-pill" key={label}>{label}: {seconds}s</span>) : <><span className="tp-pill">{task.minutes} min</span><span className="tp-pill">{task.min}–{task.max} words{task.id === 'opinion' ? ' · aim ~120' : ''}</span></>}
            </div>
            {mode === 'speaking' && task.id === 'opinion' ? <div className="practice-choice" aria-label="Choose an opinion topic">
              {[0, 1].map((option) => <button key={option} className="tp-button" type="button" aria-pressed={choice === option} onClick={() => setChoice(option)}>{option === 0 ? 'A' : 'B'}</button>)}
              <button className="tp-button" type="button" aria-pressed={longOpinion} onClick={() => setLongOpinion(!longOpinion)}>{longOpinion ? '2 min answer' : '1½ min answer'}</button>
            </div> : null}
            <div className="practice-prompt" lang="sv"><span className="meta-label">Uppgift · Prompt</span><p>{prompt[0]}</p></div>
            <button className="tp-button tp-button--quiet" type="button" aria-expanded={showEnglish} onClick={() => setShowEnglish(!showEnglish)}>{showEnglish ? 'Hide English help' : 'Show English help'}</button>
            {showEnglish ? <p className="practice-translation" lang="en">{prompt[1]}</p> : null}
            <div className="practice-tip"><span className="meta-label">Stöd · Useful structure</span><p lang="sv">{task.tip}</p></div>
          </div>

          <PracticeTimer key={`timer:${timerKey}`} phases={phases} />
          {mode === 'speaking' ? <VoiceRecorder key={`voice:${timerKey}`} /> : <WritingEditor key={`draft:${topicId}:${task.id}`} topicId={topicId} task={task} />}
          <div className="practice-actions practice-next">
            {index > 0 ? <button className="tp-button" type="button" onClick={() => mode === 'speaking' ? setSpeakingIndex(index - 1) : setWritingIndex(index - 1)}>← Previous</button> : null}
            {index < tasks.length - 1 ? <button className="tp-button tp-button--primary" type="button" onClick={() => mode === 'speaking' ? setSpeakingIndex(index + 1) : setWritingIndex(index + 1)}>Next task →</button> : null}
          </div>
        </div>
      </div>
    </article>
  );
}
