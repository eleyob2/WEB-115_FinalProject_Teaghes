# Custom Tournament Bracket Builder
**WEB-115 Final Project Proposal**
Student: [Your Name] | Repo: `WEB-115_FinalProject_[LastName]`

---

## Overview

This is a web app that lets users build and run single-elimination tournament brackets for anything they want — favorite foods, video games, movies, songs, athletes, whatever. The user names the tournament, adds contestants (up to 16), and the app generates the full bracket automatically. Users click to advance winners round by round until a champion is crowned. Every tournament is saved to `localStorage` so users can close the tab and pick up where they left off.

The target user is anyone who wants a fast, fun way to settle a debate or rank a list. No spreadsheet or third-party bracket site required.

---

## Features

- Create a new named tournament and add up to 16 contestants.
- App auto-generates a balanced single-elimination bracket from the entry list.
- Click to select the winner of each match and advance them to the next round.
- Bracket updates in real time as winners are chosen — completed matches are visually locked and greyed out.
- A champion screen appears when the final match is decided.
- All tournament state is saved to `localStorage` — progress survives a page refresh.
- Users can reset a tournament to start over or delete it entirely.

---

## Core Requirements Coverage

| Requirement | Implementation |
|---|---|
| **If Statements & Loops** | Generating the bracket requires looping over contestants to pair them into first-round matches. If statements determine whether a round is complete (all winners chosen) before unlocking the next round, and check edge cases like odd contestant counts or a bye slot. |
| **Event Listeners** | Click listeners on each match card select the winner and trigger a re-render. A submit listener on the setup form kicks off bracket generation. A reset button clears state after a confirmation check. |
| **DOM Element Creation** | The entire bracket (every round column, match card, contestant name label, and winner indicator) is built dynamically with `createElement` and `appendChild`. Nothing is hardcoded in the HTML beyond the app shell. |
| **Classes & Subclasses** | A base `Tournament` class holds the contestant list, bracket state, and methods like `generateBracket()` and `recordWinner()`. `SingleEliminationTournament` extends `Tournament` and implements the specific bracket-advancement logic. A `Match` class represents each individual pairing with properties for both contestants and the winner. |

---

## DLC — Additional Topics

### JSON & Local Storage
The full tournament object — contestant names, match results, current round — is serialized with `JSON.stringify()` and saved to `localStorage` after every state change. On load, `JSON.parse()` restores the bracket exactly where the user left off. This means no data is lost between sessions without any backend.

### Fetch & Public APIs
When a user starts a tournament in "Music Mode," the app fetches the top tracks for a given artist from the MusicBrainz API and pre-fills the contestant list automatically, so users can immediately bracket an artist's discography without typing anything in.

### HTML Canvas
The bracket is rendered visually on an HTML `<canvas>` element. Contestants are drawn as labeled boxes, connecting lines show the bracket structure, and completed matches are styled differently from pending ones. Canvas re-renders after every winner selection to reflect the updated state.

---

## Tech Stack

- HTML, CSS, Vanilla JavaScript
- MusicBrainz API *(free, no API key required)*
- `localStorage` for tournament persistence
- HTML Canvas for bracket rendering
- VS Code + GitHub
