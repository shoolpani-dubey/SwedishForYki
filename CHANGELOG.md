# Prompt And Action Log

## 2026-05-12 - Initial build request
**Prompt**

> I would like to learn Swedish A1. Can you create a plan for me and teach me that. You should give me both the swedish and english so that i understand. Create a plan and do it so that you present to me one Day at a time. So if i say Day 1: you give me the content of Day 1: geneerally 1 hr. , Then when i am done with Day 1, i will write Day 2 and you give me content of Day 2. also tell me how many days you extimate for the A1,,,,,,,,Day1,,,,,,,Alright , I am going to give you a coding task. I want you to build me a website in react. The purpose of the website is to teach me swedish a1 like you where helping me previously when i typed "Day 1", "Day 2" etc. It should have option for me to click on day number and then i should be able to read the content of that day and go though it like you did previously. I want the content of the days in a json so that they are loaded when i click on the day. Also i would like to have a vocabulary page , where when i click, should use the previous json to give me a list of words learned during the whole swedish a1 course, along with usage example. When the coding task is done, generate a zip folder which i can download,,,,,,Can you ensure its done correctly

**Action taken**

- Reviewed the generated React project and verified the build.
- Replaced placeholder course content with a structured 60-day Swedish A1 course in `src/data/swedishA1Course.json`.
- Added `scripts/generate-course-data.mjs` so the course JSON can be regenerated from a single source.
- Updated the React UI to support lesson browsing, previous/next navigation, and a vocabulary page derived from the course data.
- Built the project successfully and created `swedish-a1-react.zip`.

## 2026-05-12 - Notes merge and grammar section request
**Prompt**

> Alright, i also have some notes that I would like to be analysed and then merged with the A1 learning course in relevant page. Also, it would be good if there is a separate section that talks about grammer and has grammer related topics. Also, create a changelog file which maintains the propmpt i gave and the action you took.

**Action taken**

- Analyzed the class notes from Apr 15, 2026 through May 9, 2026 and grouped them by lesson relevance.
- Added `src/data/courseEnhancements.js` to store note-to-lesson merges and grammar topic summaries.
- Updated the lesson view so relevant class notes appear on matching course days.
- Expanded the vocabulary system so note-derived vocabulary is merged into the main course vocabulary list.
- Added a dedicated Grammar page with searchable grammar topics, rules, examples, source dates, and links back to the relevant lesson days.
- Added this `CHANGELOG.md` file so prompt history and implementation actions are tracked in the repo.
