// Parses the bilingual YKI topic files in src/data/topics into learning data:
// words grouped by theme, dialogues, model answers and key sentences, each as
// Swedish/English pairs.
//
// The files put a Swedish line (or several wrapped lines) above its English
// translation, or write "svenska — English" on one line. A small word-list
// language score plus a dynamic-programming pass decides where each Swedish
// run ends and its English run begins.

import fs from 'node:fs';
import path from 'node:path';

const SV_WORDS = new Set(
  `och att det är jag du vi de den som på med för har inte en ett av till om men så var
  hon han kan ska vill måste skulle kunde finns får mycket eller när här där vad hur
  varför vem vilken vilket vilka också bara efter från mitt min mina din dina ditt hans
  hennes vår våra er ni dem oss mig dig sig sin sitt sina mer än nu då sedan igen alltid
  aldrig ofta ganska väldigt verkligen tack ja nej hej gärna jobbet jobba arbetar bor
  hade blev bli gör göra tycker tror behöver kommer går gick ser sa säger känns känner
  någon något några inga ingen inget alla allt bra dåligt lite stor stort små också
  eftersom fast därför dessutom utan mellan under över hos vid genom mot sina hemma
  idag igår imorgon kväll morgon dag år jobb skola barn vän fru man`
    .split(/\s+/)
    .filter(Boolean),
);

// "man" means "one/you" in Swedish and "man" in English, so it counts for neither.
SV_WORDS.delete('man');

const EN_WORDS = new Set(
  `the and is are was were be been to of you it that this these those with for have has
  had not but so what when where why who which how can could would should will must my
  your his her our their they them we he she me us him do does did don't i'm it's i've
  i'd you're we're there here very also just always never often because then now again
  some any all one about from into at on by an or if than more much many really thanks
  yes no hello please would like want need think know get got go going went see said say
  feel work home today yesterday tomorrow evening morning day year school child friend
  wife husband my`
    .split(/\s+/)
    .filter(Boolean),
);

function languageScore(text) {
  // Positive means Swedish, negative means English.
  let score = 0;
  const lower = text.toLowerCase();
  score += (lower.match(/[åäö]/g) ?? []).length * 1.5;
  for (const token of lower.match(/[a-zåäö']+/g) ?? []) {
    if (SV_WORDS.has(token)) score += 1;
    if (EN_WORDS.has(token)) score -= 1;
  }
  // A capital "I" on its own is English ("I live"); lowercase "i" is Swedish ("i Finland").
  score -= (text.match(/(^|[^A-Za-z])I(?=[ '])/g) ?? []).length * 1.5;
  score += (text.match(/(^|\s)i\s/g) ?? []).length;
  return score;
}

const DASH_PAIR = /^(.*?\S)\s+—\s+(\S.*)$/;

// Labels each line SV, EN or PAIR ("sv — en" on one line) so that the block
// reads as a sequence of units: (SV+ EN+) or (PAIR EN*), maximising agreement
// with the language score.
function segmentPairs(lines, { pairBonus = 1, wordList = false } = {}) {
  const n = lines.length;
  if (!n) return [];
  const scores = lines.map(languageScore);
  const pairScores = lines.map((line) => {
    const match = line.match(DASH_PAIR);
    if (!match) return null;
    const left = languageScore(match[1]);
    const right = languageScore(match[2]);
    // In word lists a short "ord — word" line is always a word, even when both
    // sides look alike ("under — under").
    if (wordList && match[1].split(/\s+/).length <= 6) return Math.abs(left) + Math.abs(right) + pairBonus;
    if (right > 0.5 || left < -0.5) return null;
    return left - right + pairBonus;
  });

  const states = ['SV', 'EN', 'PAIR'];
  const canFollow = {
    START: ['SV', 'PAIR'],
    SV: ['SV', 'EN'],
    EN: ['SV', 'EN', 'PAIR'],
    PAIR: ['SV', 'EN', 'PAIR'],
  };
  const best = Array.from({ length: n }, () => ({}));

  for (let i = 0; i < n; i += 1) {
    for (const state of states) {
      const own =
        state === 'SV' ? scores[i] : state === 'EN' ? -scores[i] : pairScores[i];
      if (own === null) continue;
      const previousStates = i === 0 ? ['START'] : states;
      for (const previous of previousStates) {
        if (!canFollow[previous].includes(state)) continue;
        const base = i === 0 ? 0 : best[i - 1][previous]?.score;
        if (base === undefined) continue;
        // A small cost per switch keeps wrapped lines in one run.
        const switchCost = previous !== state && previous !== 'START' ? 0.25 : 0;
        // Ties go to continuing the current run: a neutral wrapped line belongs
        // to the sentence above it.
        const total = base + own - switchCost + (previous === state ? 0.01 : 0);
        if (best[i][state] === undefined || total > best[i][state].score) {
          best[i][state] = { score: total, previous };
        }
      }
    }
  }

  const finals = ['EN', 'PAIR'].filter((state) => best[n - 1][state] !== undefined);
  if (!finals.length) return null;
  let state = finals.reduce((a, b) => (best[n - 1][a].score >= best[n - 1][b].score ? a : b));
  const labels = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    labels[i] = state;
    state = best[i][state].previous;
  }

  const pairs = [];
  let current = null;
  labels.forEach((label, i) => {
    const line = lines[i];
    if (label === 'PAIR') {
      const [, sv, en] = line.match(DASH_PAIR);
      current = { sv, en, inline: true };
      pairs.push(current);
    } else if (label === 'SV') {
      if (!current || current.en !== '' || current.inline) {
        current = { sv: line, en: '' };
        pairs.push(current);
      } else {
        current.sv += ` ${line}`;
      }
    } else {
      current.en = current.en ? `${current.en} ${line}` : line;
    }
  });
  return pairs.map(({ sv, en, inline }) => ({ sv: tidy(sv), en: tidy(en), inline: Boolean(inline) }));
}

function tidy(text) {
  return text.replace(/\s+/g, ' ').trim();
}

const NUMBERED = /^\d+\.\s+/;
const SPEAKER = /^([A-ZÅÄÖ][A-ZÅÄÖ-]+(?: [A-ZÅÄÖ][A-ZÅÄÖ-]+)?)(?:\s*\(([^)]*)\))?:\s*(.*)$/;
const MARKER = /^(MODELLSVAR|MODELLTEXT|ÖVERSÄTTNING|Boken frågar|Nyttiga uttryck)\b/;

const PROPER_NOUNS = {
  sv: ['Finland', 'Finlands', 'Sverige', 'Norden', 'Indien', 'Helsingfors', 'AI', 'FPA', 'Migri', 'YKI'],
  en: ['Finland', 'Sweden', 'India', 'Helsinki', 'AI', 'YKI', 'Finnish', 'Finns', 'Swedish', 'Nordic', 'Nordics', 'English', 'I', "I'm"],
};

// Headings are in capitals ("ATT HANDLA", "MEDDELANDE (gratulera en vän)"):
// lowercase the all-capital words before any parenthesis, then capitalise the
// first letter and proper nouns.
function sentenceCase(text, lang = 'sv') {
  if (!/\p{Lu}{3,}/u.test(text)) return text;
  const split = text.indexOf('(');
  const head = split < 0 ? text : text.slice(0, split);
  const tail = split < 0 ? '' : text.slice(split);
  const lowered = head
    .split(/(\s+)/)
    .map((token) => (/\p{Ll}/u.test(token) ? token : token.toLowerCase()))
    .join('');
  const first = lowered.search(/\p{L}/u);
  let result =
    (first < 0 ? lowered : lowered.slice(0, first) + lowered.charAt(first).toUpperCase() + lowered.slice(first + 1)) +
    tail;
  result = result.replace(/(^|[\s:])(["“])(\p{Ll})/gu, (_, before, quote, letter) => before + quote + letter.toUpperCase());
  for (const noun of PROPER_NOUNS[lang]) {
    result = result.replace(new RegExp(`(^|[^\\p{L}'])${noun.toLowerCase()}(?![\\p{L}'])`, 'gu'), `$1${noun}`);
  }
  return result;
}

// Header lines look like "A1. ATT HANDLA / SHOPPING", or a Swedish line above
// an English one ("DIALOG 2 — …" / "DIALOGUE 2 — …").
function parseHeading(lines) {
  const clean = lines.map((line) => line.trim()).filter(Boolean);
  let sv;
  let en;
  if (clean.length === 1 && clean[0].includes(' / ')) {
    const index = clean[0].lastIndexOf(' / ');
    sv = clean[0].slice(0, index);
    en = clean[0].slice(index + 3);
  } else {
    const englishStart = clean.findIndex((line, index) => index > 0 && /^(EXERCISE|DIALOGUE) \d+/.test(line));
    if (englishStart > 0) {
      sv = clean.slice(0, englishStart).join(' ');
      en = clean.slice(englishStart).join(' ');
    } else {
      const pairs = segmentPairs(clean) ?? [{ sv: clean.join(' '), en: '' }];
      sv = pairs.map((pair) => pair.sv).join(' ');
      en = pairs.map((pair) => pair.en).join(' ');
    }
  }
  const strip = (text, lang) =>
    sentenceCase(
      text
        .replace(/^(?:[A-Z]\d?\.|DIALOG(?:UE)? \d+ —|ÖVNING \d+ —|EXERCISE \d+ —)\s*/i, '')
        .replace(/^"(.*)"$/, '$1')
        .trim(),
      lang,
    );
  return { title: strip(sv, 'sv'), titleEn: strip(en, 'en') };
}

function splitParts(lines) {
  const parts = [];
  let current = null;
  lines.forEach((line, index) => {
    const match = line.match(/^DEL ([A-H]) — (.*)$/);
    if (match && /^=+$/.test(lines[index - 1] ?? '')) {
      const english = lines[index + 1] ?? '';
      current = {
        key: match[1],
        title: sentenceCase(match[2].replace(/\s*\(.*\)$/, '')),
        titleEn: sentenceCase(english.replace(/^PART [A-H] — /, '').replace(/\s*\(.*\)$/, ''), 'en'),
        lines: [],
        skip: 3,
      };
      parts.push(current);
      return;
    }
    if (!current) return;
    if (current.skip > 0) {
      current.skip -= 1;
      return;
    }
    if (/^=+$/.test(line) || /^SLUT PÅ ÄMNE/.test(line) || /^END OF TOPIC/.test(line)) return;
    current.lines.push(line);
  });
  return parts;
}

// Splits a part into subsections at dash-delimited headings.
function splitSubsections(lines) {
  const subsections = [{ heading: null, lines: [] }];
  for (let i = 0; i < lines.length; i += 1) {
    if (/^-{10,}$/.test(lines[i])) {
      const close = lines.slice(i + 1, i + 6).findIndex((line) => /^-{10,}$/.test(line));
      if (close > 0) {
        subsections.push({ heading: parseHeading(lines.slice(i + 1, i + 1 + close)), lines: [] });
        i += close + 1;
        continue;
      }
      continue;
    }
    subsections.at(-1).lines.push(lines[i]);
  }
  return subsections.filter((sub) => sub.heading || sub.lines.some((line) => line.trim()));
}

function splitBlocks(lines) {
  const blocks = [];
  let current = [];
  for (const line of lines) {
    if (line.trim()) {
      current.push(line);
    } else if (current.length) {
      blocks.push(current);
      current = [];
    }
  }
  if (current.length) blocks.push(current);
  return blocks;
}

// A block that starts with [NOTIS] is a tip: keep only the English half.
function readNote(block) {
  const start = block.findIndex((line) => line.trim().startsWith('[NOTE]'));
  if (start < 0) return null;
  return tidy(block.slice(start).join(' ').replace('[NOTE]', ''));
}

function readDialogueBlock(block) {
  const segments = [];
  block.forEach((raw) => {
    const line = raw.trim();
    const match = line.match(SPEAKER);
    if (match) {
      segments.push({ speaker: match[1], hint: match[2] ?? null, text: match[3] });
    } else if (segments.length) {
      segments.at(-1).text += ` ${line}`;
    }
  });
  const lines = [];
  for (let i = 0; i + 1 < segments.length; i += 2) {
    const [sv, en] = [segments[i], segments[i + 1]];
    lines.push({
      speaker: sentenceCase(sv.speaker),
      speakerEn: sentenceCase(en.speaker),
      you: sv.speaker === 'DU',
      hint: en.hint ? tidy(en.hint) : null,
      sv: tidy(sv.text),
      en: tidy(en.text),
    });
  }
  return lines;
}

// Turns a subsection into items: an optional prompt followed by answer lines.
// Items start at numbered lines and at quoted prompts ('"Hur mår du?" — …').
// A paragraph written fully in Swedish, followed by its English paragraph
// after a blank line, is one pair.
function isPure(block, sign) {
  const scores = block.map((line) => languageScore(line) * sign);
  return scores.every((score) => score >= 0) && scores.reduce((a, b) => a + b, 0) >= 3;
}

function mergeParagraphPairs(blocks) {
  const merged = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const next = blocks[i + 1];
    const plain = (b) => b && !SPEAKER.test(b[0].trim()) && !/^\[NOT/.test(b[0].trim()) && !MARKER.test(b[0].trim());
    if (plain(block) && plain(next) && !NUMBERED.test(next[0].trim()) && isPure(block, 1) && isPure(next, -1)) {
      merged.push({ paragraph: { sv: tidy(block.join(' ')), en: tidy(next.join(' ')) }, first: block[0] });
      i += 1;
    } else {
      merged.push(block);
    }
  }
  return merged;
}

const LABEL = /^(.+?) \/ (.+):$/;

function readItems(lines, { pairBonus } = {}) {
  const items = [];
  const notes = [];
  let item = null;
  let writing = null;

  const newItem = (prompt = null) => {
    item = { prompt, lines: [] };
    items.push(item);
    return item;
  };

  for (const entry of mergeParagraphPairs(splitBlocks(lines))) {
    if (entry.paragraph) {
      if (writing) {
        writing.sv.push(entry.paragraph.sv);
        writing.en.push(entry.paragraph.en);
      } else {
        (item ?? newItem()).lines.push(entry.paragraph);
      }
      continue;
    }
    const block = entry;
    const first = block[0].trim();
    if (first.startsWith('[NOTIS]') || first.startsWith('[NOTE]')) {
      const note = readNote(block);
      if (note) notes.push(note);
      continue;
    }
    if (block.length === 1 && LABEL.test(first) && !MARKER.test(first)) {
      const [, sv, en] = first.match(LABEL);
      newItem({ sv, en });
      continue;
    }
    if (MARKER.test(first)) {
      if (/^MODELLTEXT/.test(first)) writing = { sv: [], en: [], side: 'sv' };
      if (/^ÖVERSÄTTNING/.test(first) && writing) writing.side = 'en';
      if (block.length === 1) continue;
      block.shift();
    }
    if (writing) {
      // Keep the line breaks of bullet lists inside a letter ("- Hur gammal …").
      const paragraph = block
        .map((line) => line.trim())
        .reduce((text, line) => (!text ? line : /^[-•]\s/.test(line) ? `${text}\n${line}` : `${text} ${line}`), '');
      writing[writing.side].push(paragraph);
      continue;
    }
    if (SPEAKER.test(first) && !/^(Uppgift|Task)\b/.test(first)) {
      (item ?? newItem()).lines.push(...readDialogueBlock(block));
      continue;
    }

    const numbered = NUMBERED.test(first);
    // Numbers can start any line when a list has no blank lines ("1. … 2. …").
    const text = block.map((line) => line.trim().replace(NUMBERED, ''));
    const pairs = segmentPairs(text, { pairBonus });
    if (!pairs) continue;

    if (numbered) {
      // The first unit of a numbered block is the prompt; the rest are answers.
      const [prompt, ...rest] = pairs;
      newItem(prompt).lines.push(...rest);
      continue;
    }
    pairs.forEach((pair, index) => {
      const quotedPrompt = index === 0 && pair.inline && /^["“]/.test(pair.sv);
      if (quotedPrompt) {
        newItem(pair);
      } else {
        (item ?? newItem()).lines.push(pair);
      }
    });
  }

  if (writing) {
    const count = Math.max(writing.sv.length, writing.en.length);
    const paragraphs = Array.from({ length: count }, (_, i) => ({
      sv: writing.sv[i] ?? '',
      en: writing.en[i] ?? '',
    }));
    return { items, notes, paragraphs };
  }
  return { items, notes, paragraphs: null };
}

// Part A: "ord — word" lines start a word; the sentence pairs under a word are
// its examples. Sentence blocks before any word are introductions and dropped.
function readWords(lines) {
  const words = [];
  const notes = [];
  for (const block of splitBlocks(lines)) {
    const first = block[0].trim();
    if (first.startsWith('[NOTIS]') || first.startsWith('[NOTE]')) {
      const note = readNote(block);
      if (note) notes.push(note);
      continue;
    }
    const text = block.map((line) => line.trim().replace(NUMBERED, ''));
    const pairs = segmentPairs(text, { pairBonus: 4, wordList: true }) ?? [];
    let last = null;
    for (const pair of pairs) {
      if (pair.inline) {
        last = { swedish: pair.sv, english: pair.en, examples: [] };
        words.push(last);
      } else if (last) {
        last.examples.push({ sv: pair.sv, en: pair.en });
      }
    }
  }
  return { words, notes };
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function parseTopicFile(text, number) {
  const lines = text.replace(/\r/g, '').split('\n').map((line) => line.replace(/\s+$/, ''));
  const titleLine = lines.find((line) => /^YKI — ÄMNE \d+:/.test(line)) ?? '';
  const titleEnLine = lines.find((line) => /^YKI — TOPIC \d+:/.test(line)) ?? '';
  const title = sentenceCase(titleLine.replace(/^YKI — ÄMNE \d+:\s*/, ''));
  const titleEn = sentenceCase(titleEnLine.replace(/^YKI — TOPIC \d+:\s*/, ''), 'en');

  const topic = {
    id: slugify(title),
    number,
    title,
    titleEn,
    wordGroups: [],
    sections: [],
    keySentences: [],
  };

  for (const part of splitParts(lines)) {
    const subsections = splitSubsections(part.lines);

    if (part.key === 'A') {
      for (const sub of subsections) {
        const { words, notes } = readWords(sub.lines);
        if (!words.length) continue;
        topic.wordGroups.push({
          id: `${topic.id}-${slugify(sub.heading?.title ?? 'ord')}`,
          title: sub.heading?.title ?? 'Ord',
          titleEn: sub.heading?.titleEn ?? 'Words',
          words,
          tips: notes,
        });
      }
      continue;
    }

    if (part.key === 'H') {
      const { items } = readItems(subsections.flatMap((sub) => sub.lines));
      // Drop the introduction ("De 15 meningar du måste kunna utantill …:").
      topic.keySentences = items
        .flatMap((item) => (item.prompt ? [item.prompt] : []).concat(item.lines))
        .filter((pair) => !pair.sv.endsWith(':'));
      continue;
    }

    const section = {
      id: `${topic.id}-${part.key.toLowerCase()}`,
      kind: { B: 'warmup', C: 'dialogues', D: 'react', E: 'talks', F: 'opinions', G: 'writing' }[part.key],
      title: part.title,
      titleEn: part.titleEn,
      sets: [],
    };

    for (const sub of subsections) {
      const { items, paragraphs } = readItems(sub.lines);
      // Phrase lists ("Jag tycker att... — I think that...") become words.
      if (!sub.heading) {
        const phrases = items.flatMap((item) => item.lines).filter((line) => line.inline);
        if (phrases.length >= 4) {
          topic.wordGroups.push({
            id: `${topic.id}-${part.key.toLowerCase()}-uttryck`,
            title: 'Nyttiga uttryck',
            titleEn: 'Useful expressions',
            words: phrases.map((phrase) => ({ swedish: phrase.sv, english: phrase.en, examples: [] })),
            tips: [],
          });
          continue;
        }
      }
      const content = items.filter((item) => item.prompt || item.lines.length);
      if (!content.length && !paragraphs?.length) continue;
      section.sets.push({
        title: sub.heading?.title ?? null,
        titleEn: sub.heading?.titleEn ?? null,
        items: content,
        paragraphs,
      });
    }
    if (section.sets.length) topic.sections.push(section);
  }

  // Drop the parser-only flag from the published data.
  const strip = (pair) => {
    if (pair && 'inline' in pair) delete pair.inline;
    return pair;
  };
  topic.keySentences.forEach(strip);
  topic.sections.forEach((section) =>
    section.sets.forEach((set) =>
      set.items.forEach((item) => {
        strip(item.prompt);
        item.lines.forEach(strip);
      }),
    ),
  );
  return topic;
}

export function parseTopics(directory) {
  return fs
    .readdirSync(directory)
    .filter((name) => /^\d+-.*\.txt$/.test(name) && !name.startsWith('00'))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .map((name) => parseTopicFile(fs.readFileSync(path.join(directory, name), 'utf8'), parseInt(name, 10)));
}

export { languageScore };
