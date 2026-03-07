// src/components/teacher/activities/ActivitiesTab.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Button, Card, Modal } from '../../../components/shared';
import { Play, Settings, Plus, Clock, Users, Star, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS } from '../../../config';
import { useStars } from '../../../context/StarContext';
import bgImage
from '../../../assets/images/mimi/bg.jpg';
import mimiIdleVideo
from '../../../assets/images/mimi/mimiidell_nobg.webm';
import mimiWaveVideo
from '../../../assets/images/mimi/mimiwavehand_nobg.webm';
import mimiHappyVideo
from '../../../assets/images/mimi/A Fantastic Day of Fun and Laughter.mp4';
import mimiNeutralVideo from '../../../assets/images/mimi/mimiidell_nobg.webm';
// ■■ Emoji map ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const WORD_EMOJIS = {
// Alphabet / Phonics
Apple:'■', Ball:'■', Cat:'■', Dog:'■', Elephant:'■', Fish:'■',
Goat:'■', Hat:'■', Kite:'■', Lion:'■', Mango:'■', Orange:'■',
Rabbit:'■', Sun:'■■', Tiger:'■', Zebra:'■', Bat:'■', Can:'■',
Fan:'■', Hen:'■', Pen:'✏■', Rat:'■', Igloo:'■■', Nest:'■',
Owl:'■', Umbrella:'■■', Violin:'■', Walrus:'■', Xylophone:'■',
Yacht:'■', Queen:'■', Jungle:'■', Frog:'■', Clap:'■', Drum:'■',
Flat:'■', Grin:'■', Slim:'■', Plum:'■', Bright:'■', Crane:'■■',
Dwarf:'■', Flask:'■■', Grind:'■■', Shrub:'■', Thrill:'■', Whale:'■',
// Fruits
Banana:'■', Grape:'■', Strawberry:'■', Watermelon:'■', Pineapple:'■',
Grapes:'■', Lemon:'■', Peach:'■', Papaya:'■', Guava:'■', Lychee:'■',
Cherry:'■', Kiwi:'■', Blueberry:'■', Raspberry:'■', Apricot:'■',
Pomegranate:'■', Custard:'■',
// Animals
Cow:'■', Horse:'■', Sheep:'■', Duck:'■', Bear:'■', Fox:'■',
Deer:'■', Giraffe:'■', Dolphin:'■', Penguin:'■', Crocodile:'■', Cheetah:'■',
// Colors
Red:'■', Blue:'■', Green:'■', Yellow:'■', Purple:'■',
Pink:'■', Brown:'■', Black:'■', White:'■', Grey:'■', Violet:'■',
Maroon:'❤■', Crimson:'■', Turquoise:'■', Indigo:'■', Magenta:'■',
Coral:'■', Amber:'■', Scarlet:'■', Olive:'■',
// Numbers
One:'1■■', Two:'2■■', Three:'3■■', Four:'4■■', Five:'5■■',
Six:'6■■', Seven:'7■■', Eight:'8■■', Nine:'9■■', Ten:'■',
Eleven:'1■■1■■', Twelve:'1■■2■■', Thirteen:'1■■3■■', Fourteen:'1■■4■■',
Fifteen:'1■■5■■', Sixteen:'1■■6■■', Seventeen:'1■■7■■', Eighteen:'1■■8■■',
Nineteen:'1■■9■■', Twenty:'2■■0■■', Thirty:'3■■0■■',
// Body Parts
Head:'■', Eye:'■■', Ear:'■', Nose:'■', Mouth:'■', Hand:'■',
Leg:'■', Foot:'■', Hair:'■', Teeth:'■', Tongue:'■', Shoulder:'■',
Arm:'■', Finger:'■■', Knee:'■', Ankle:'■', Chin:'■', Elbow:'■',
Wrist:'■', Thumb:'■', Heel:'■', Toe:'■', Neck:'■',
// Shapes
Circle:'■', Square:'■', Triangle:'■', Rectangle:'■', Star:'■',
Oval:'■', Heart:'❤■', Diamond:'■', Pentagon:'■', Hexagon:'■',
Octagon:'■', Cylinder:'■', Cone:'■',
// Vehicles
Car:'■', Bus:'■', Train:'■', Bicycle:'■', Airplane:'✈■', Truck:'■',
};
// ■■ Activity word sets (difficulty-aware) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const ACTIVITY_WORDS = {
// ■■ Original 1-6 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
1: {
easy:
['Apple','Ball','Cat','Dog','Hat','Rat'],
medium: ['Elephant','Fish','Goat','Igloo','Kite','Nest','Owl'],
hard:
['Umbrella','Violin','Walrus','Xylophone','Yacht','Zebra','Queen','Jungle'],
},
2: {
easy:
['Bat','Can','Fan','Hen','Pen','Sun'],
medium: ['Frog','Clap','Drum','Flat','Grin','Slim','Plum'],
hard:
['Bright','Crane','Dwarf','Flask','Grind','Shrub','Thrill','Whale'],
},
3: {
easy:
['Apple','Mango','Banana','Grapes','Lemon','Peach'],
medium: ['Orange','Papaya','Guava','Lychee','Cherry','Kiwi','Plum'],

hard:
['Strawberry','Watermelon','Pineapple','Blueberry','Raspberry','Apricot','Pomegranate','C
},
4: {
easy:
['Cat','Dog','Cow','Duck','Hen','Rat'],
medium: ['Horse','Sheep','Rabbit','Goat','Bear','Fox','Deer'],
hard:
['Elephant','Tiger','Lion','Giraffe','Dolphin','Penguin','Crocodile','Cheetah'],
},
5: {
easy:
['Red','Blue','Green','Yellow','Pink','White'],
medium: ['Orange','Purple','Brown','Black','Grey','Violet','Maroon'],
hard:
['Crimson','Turquoise','Indigo','Magenta','Coral','Amber','Scarlet','Olive'],
},
6: {
easy:
['One','Two','Three','Four','Five','Six'],
medium: ['Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen'],
hard:
['Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty','Thirty'],
},
// ■■ New 7-12 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
7: {
easy:
['Head','Eye','Ear','Nose','Mouth','Hand','Leg','Foot'],
medium: ['Hair','Teeth','Tongue','Shoulder','Arm','Finger','Knee','Ankle'],
hard:
['Chin','Elbow','Wrist','Thumb','Heel','Toe','Neck'],
},
8: {
easy:
['Circle','Square','Triangle','Rectangle'],
medium: ['Star','Oval','Heart','Diamond'],
hard:
['Pentagon','Hexagon','Octagon','Cylinder','Cone'],
},
// Activities 9-12 handled specially (see MimiActivityOverlay)
// Activities 9, 10, 11 use LLM-generated questions — these are FALLBACK only
9: {
easy:
['Dog','Cat','Cow','Lion','Tiger','Rabbit','Duck','Bear'],
medium: ['Apple','Banana','Mango','Orange','Grapes','Strawberry','Pineapple','Watermelon'],
hard:
['Car','Bus','Train','Bicycle','Airplane','Truck','Helicopter','Rocket'],
},
10: {
easy:
[
{ display:'■■',
answer:'2', count:2 },
{ display:'■■■',
answer:'3', count:3 },
{ display:'■■■■',
answer:'4', count:4 },
{ display:'■■■■■',
answer:'5', count:5 },
{ display:'■■■',
answer:'3', count:3 },
{ display:'■■■■',
answer:'4', count:4 },
],
medium: [
{ display:'■■■■■■',
answer:'6', count:6 },
{ display:'■■■■■■■',
answer:'7', count:7 },
{ display:'■■■■■■■■',
answer:'8', count:8 },
{ display:'■■■■■■■■■',
answer:'9', count:9 },
{ display:'■■■■■■■■■■',
answer:'10', count:10 },
{ display:'■■■■■■■',
answer:'7', count:7 },
],
hard:
[
{ display:'■■■ + ■■',
answer:'5', addend1:3, addend2:2 },
{ display:'■■■■ + ■■',
answer:'6', addend1:4, addend2:2 },
{ display:'■■■■ + ■■■',
answer:'7', addend1:4, addend2:3 },
{ display:'■■■ + ■■■■',
answer:'7', addend1:3, addend2:4 },
{ display:'■■ + ■■■■',
answer:'6', addend1:2, addend2:4 },
{ display:'■■■ + ■■■■■', answer:'8', addend1:3, addend2:5 },
],
},
11: {
easy:
[
{ pattern:'■ → ■ → ?', answer:'Red',
hint:'Red' },
{ pattern:'■ → ■ → ?', answer:'Blue',
hint:'Blue' },
{ pattern:'■ → ■ → ?', answer:'Green', hint:'Green' },
{ pattern:'■ → ■ → ?', answer:'Circle', hint:'Circle' },
{ pattern:'■ → ■ → ?', answer:'Star',
hint:'Star' },
{ pattern:'■ → ■ → ?', answer:'Square', hint:'Square' },
],
medium: [
{ pattern:'■ → ■ → ■ → ?', answer:'Red',
hint:'Red' },
{ pattern:'■ → ■ → ■ → ?', answer:'Circle', hint:'Circle' },
{ pattern:'1 → 2 → 3 → ?',
answer:'Four',
hint:'Four' },
{ pattern:'2 → 4 → 6 → ?',
answer:'Eight', hint:'Eight' },
{ pattern:'■ → ■ → ■ → ?', answer:'Yellow', hint:'Yellow' },
{ pattern:'5 → 4 → 3 → ?',
answer:'Two',
hint:'Two' },

],
hard:
[
{ pattern:'1 → 3 → 5 → 7 → ?',
answer:'Nine',
hint:'Nine' },
{ pattern:'2 → 5 → 8 → 11 → ?',
answer:'Fourteen', hint:'Fourteen' },
{ pattern:'10 → 8 → 6 → 4 → ?',
answer:'Two',
hint:'Two' },
{ pattern:'■■ → ■■ → ■■ → ?', answer:'Red',
hint:'Red Circle' },
{ pattern:'3 → 6 → 9 → 12 → ?',
answer:'Fifteen', hint:'Fifteen' },
{ pattern:'100 → 90 → 80 → 70 → ?', answer:'Sixty',
hint:'Sixty' },
],
},
12: {
easy: [
'Dog','Cat','Cow','Apple','Banana','Mango',
'Red','Blue','Green','Circle','Square','Triangle',
'Head','Eye','Nose',
],
medium: [
'Lion','Tiger','Horse','Orange','Grapes','Papaya',
'Purple','Yellow','Pink','Star','Heart','Oval',
'Shoulder','Knee','Elbow',
],
hard: [
'Elephant','Penguin','Dolphin','Strawberry','Pineapple','Pomegranate',
'Crimson','Turquoise','Indigo','Pentagon','Hexagon','Octagon',
'Wrist','Thumb','Chin',
],
},
};
// Difficulty label shown per activity
const DIFFICULTY_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
function speak(text, rate = 0.85) {
if (!window.speechSynthesis) return;
window.speechSynthesis.cancel();
const u = new SpeechSynthesisUtterance(text);
u.rate = rate; u.pitch = 1.15;
window.speechSynthesis.speak(u);
}

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// LLM Question Generator — generates fresh questions for activities 9, 10, 11
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
async function generateLLMQuestions(activityId, difficulty, count = 6) {
const prompts = {
9: `Generate ${count} picture guess questions for kindergarten kids at ${difficulty} difficulty.
Each question is a single common word that has a well-known emoji (animal, fruit, vehicle, object).
Return ONLY a JSON array of strings, no explanation, no markdown. Example: ["Dog","Cat","Apple"]
Make every run different — randomize the list. Difficulty guide: easy=animals/fruits, medium=vehicles
10: `Generate ${count} counting questions for kindergarten kids at ${difficulty} difficulty.
Return ONLY a JSON array of objects, no explanation, no markdown.
For easy/medium: {"display":"■■■","answer":"3","count":3}
For hard (addition): {"display":"■■ + ■■■","answer":"5","addend1":2,"addend2":3}
Use different emojis each time. Randomize. Easy: count 2-5, Medium: count 6-10, Hard: addition up to

11: `Generate ${count} pattern completion questions for kindergarten kids at ${difficulty} diffic
Return ONLY a JSON array of objects, no explanation, no markdown.
Format: {"pattern":"■ → ■ → ■ → ?","answer":"Blue","hint":"Blue"}
Easy: simple AB emoji patterns. Medium: ABC patterns or number sequences (1,2,3,?). Hard: skip counti
Make every run completely different patterns.`,
};
try {
const res = await fetch('https://api.anthropic.com/v1/messages', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
model: 'claude-sonnet-4-20250514',
max_tokens: 1000,
messages: [{ role: 'user', content: prompts[activityId] }],
}),
});
const data = await res.json();
const text = data?.content?.[0]?.text || '';
const clean = text.replace(/```json|```/g, '').trim();
const parsed = JSON.parse(clean);

if (Array.isArray(parsed) && parsed.length > 0) return parsed;
} catch (e) {
console.warn('LLM question gen failed, using fallback:', e);
}
return null; // fallback to static list
}

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// Special renderers for new activity types
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// ═══════════════════════════════════════════════════════════════════
// Special renderers for new activity types
// ═══════════════════════════════════════════════════════════════════

// Activity 9 — Picture Guess
function PictureGuessCard({ word, mimiSaying, phase, listening, transcript }) {
const emoji = WORD_EMOJIS[word] || '🖼️';
return (
<div className="flex flex-col items-center gap-5 max-w-md w-full">
  <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:2, repeat:Infinity }}
    className="w-52 h-52 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl flex items-center justify-center text-8xl border-2 border-white">
    {emoji}
  </motion.div>
  <div className="bg-white/90 backdrop-blur-xl rounded-3xl px-10 py-5 shadow-xl border border-white/80 text-center w-full">
    <p className="text-2xl font-black text-purple-700 mb-2">👀 What do you see?</p>
    <p className="text-lg text-purple-500 mb-3">{mimiSaying}</p>
    {phase === 'listening' && (
      <motion.div animate={{ scale:[1,1.06,1] }} transition={{ duration:0.6, repeat:Infinity }}
        className="flex items-center gap-2 justify-center mt-2 bg-rose-50 rounded-full px-5 py-2 border border-rose-100">
        {listening ? <Mic size={18} className="text-rose-500" /> : <MicOff size={18} className="text-gray-400" />}
        <span className="font-bold text-rose-600 text-sm">{listening ? 'Say it now! 🎤' : 'Listening…'}</span>
      </motion.div>
    )}
    {transcript && <p className="text-xs text-gray-400 mt-2">You said: "{transcript}"</p>}
  </div>
</div>
);
}

// Activity 10 — Counting Game
function CountingCard({ item, mimiSaying, phase, listening, transcript }) {
const isAddition = item?.addend1 !== undefined;
return (
<div className="flex flex-col items-center gap-5 max-w-md w-full">
  <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/80 text-center w-full">
    {isAddition ? (
      <>
        <p className="text-3xl font-black text-purple-700 mb-3">How many in total?</p>
        <div className="text-5xl mb-3 leading-relaxed">{item.display}</div>
        <div className="bg-purple-50 rounded-2xl px-6 py-3 inline-block border border-purple-100">
          <p className="text-2xl font-black text-purple-800">{item.addend1} + {item.addend2} = ?</p>
        </div>
      </>
    ) : (
      <>
        <p className="text-3xl font-black text-purple-700 mb-3">How many? 🧮</p>
        <div className="text-5xl leading-loose mb-2">{item?.display}</div>
      </>
    )}
  </div>
  <div className="bg-white/90 backdrop-blur-xl rounded-3xl px-10 py-4 shadow-xl border border-white/80 text-center w-full">
    <p className="text-lg text-purple-500 mb-3">{mimiSaying}</p>
    {phase === 'listening' && (
      <motion.div animate={{ scale:[1,1.06,1] }} transition={{ duration:0.6, repeat:Infinity }}
        className="flex items-center gap-2 justify-center bg-rose-50 rounded-full px-5 py-2 border border-rose-100">
        {listening ? <Mic size={18} className="text-rose-500" /> : <MicOff size={18} className="text-gray-400" />}
        <span className="font-bold text-rose-600 text-sm">{listening ? 'Say the number! 🎤' : 'Listening…'}</span>
      </motion.div>
    )}
    {transcript && <p className="text-xs text-gray-400 mt-2">You said: "{transcript}"</p>}
  </div>
</div>
);
}

// Activity 11 — Pattern Fun
function PatternCard({ item, mimiSaying, phase, listening, transcript }) {
return (
<div className="flex flex-col items-center gap-5 max-w-md w-full">
  <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/80 text-center w-full">
    <p className="text-2xl font-black text-purple-700 mb-4">🧩 Complete the pattern!</p>
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl px-6 py-4 mb-3 border border-purple-100">
      <p className="text-4xl font-black text-gray-800">{item?.pattern}</p>
    </div>
    <p className="text-lg text-gray-400">What comes next?</p>
  </div>
  <div className="bg-white/90 backdrop-blur-xl rounded-3xl px-10 py-4 shadow-xl border border-white/80 text-center w-full">
    <p className="text-lg text-purple-500 mb-3">{mimiSaying}</p>
    {phase === 'listening' && (
      <motion.div animate={{ scale:[1,1.06,1] }} transition={{ duration:0.6, repeat:Infinity }}
        className="flex items-center gap-2 justify-center bg-rose-50 rounded-full px-5 py-2 border border-rose-100">
        {listening ? <Mic size={18} className="text-rose-500" /> : <MicOff size={18} className="text-gray-400" />}
        <span className="font-bold text-rose-600 text-sm">{listening ? 'Say your answer! 🎤' : 'Listening…'}</span>
      </motion.div>
    )}
    {transcript && <p className="text-xs text-gray-400 mt-2">You said: "{transcript}"</p>}
  </div>
</div>
);
}

function MimiActivityOverlay({ activity, difficulty, onStudentDone, onClose }) {
const wordSet = ACTIVITY_WORDS[activity.id]?.[difficulty] || ACTIVITY_WORDS[activity.id]?.easy || [
const [words, setWords]
= useState(wordSet);
const [questionsReady, setQuestionsReady] = useState(![9,10,11].includes(activity.id));
const total = words.length;
const [phase,
setPhase]
= useState('waiting');
const [studentName, setStudentName] = useState('');
const [mimiVideo,
setMimiVideo]
= useState(mimiIdleVideo);
const [current,
setCurrent]
= useState(0);
const [correct,
setCorrect]
= useState(0);
const [transcript, setTranscript] = useState('');
const [listening,
setListening]
= useState(false);
const [mimiSaying, setMimiSaying] = useState('');
const [isCorrect,
setIsCorrect]
= useState(null);
const [starsEarned, setStarsEarned] = useState(0);
const [llmFeedback, setLlmFeedback] = useState('');
const [showWarning, setShowWarning] = useState(false);
const [warningMsg, setWarningMsg] = useState('');
const [countdown,
setCountdown]
= useState(5);
const [sessionResults, setSessionResults] = useState([]);
const [isPaused,
setIsPaused]
= useState(false);
const [showEndConfirm, setShowEndConfirm] = useState(false);
const [sessionEnded,
setSessionEnded]
= useState(false);
const recogRef
= useRef(null);
const correctRef = useRef(0);
const pollRef
= useRef(null);
const phaseRef
= useRef('waiting');
const seenRef
= useRef(new Set());
const pausedPhaseRef = useRef(null);
const resultTimerRef = useRef(null);
const sessionEndedRef = useRef(false);
const isPausedRef
= useRef(false);
useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
useEffect(() => { correctRef.current = correct; }, [correct]);
useEffect(() => { phaseRef.current = phase; }, [phase]);
// ■■ Fetch LLM questions for activities 9, 10, 11 on mount ■■■■■■■■■■■■■■■■■
useEffect(() => {
if (![9, 10, 11].includes(activity.id)) return;
setQuestionsReady(false);
generateLLMQuestions(activity.id, difficulty, 6).then(generated => {
if (generated && generated.length > 0) setWords(generated);
setQuestionsReady(true);
});
}, [activity.id, difficulty]); // eslint-disable-line
// Helper: get word/item label for display
function getWordLabel(item) {
if (typeof item === 'string') return item;
if (item?.answer) return item.answer;
if (item?.hint) return item.hint;
return '';
}

// Helper: get correct answer for LLM/check
function getAnswer(item) {
if (typeof item === 'string') return item;
if (item?.answer) return item.answer;
return '';
}
const startCameraPoll = useCallback(() => {
clearInterval(pollRef.current);
axios.get(API_ENDPOINTS.START_CLASSROOM).catch(() => {});
pollRef.current = setInterval(async () => {
if (phaseRef.current !== 'waiting') return;
try {
const res = await axios.get(API_ENDPOINTS.GET_STATUS);
const data = res.data;
if (data.warning === 'too_close') {
setWarningMsg('■■ Too close! Please step back.');
setShowWarning(true);
setTimeout(() => setShowWarning(false), 2500);
return;
}
if (data.person) {
const name = data.person;
if (seenRef.current.has(name.toLowerCase())) return;
clearInterval(pollRef.current);
setStudentName(name);
setMimiVideo(mimiWaveVideo);
setPhase('intro');
}
} catch {}
}, 300);
}, []);
const demoNames = ['Aarav Sharma', 'Priya Patel', 'Rohan Kumar', 'Sara Ali', 'Ananya Singh'];
useEffect(() => {
startCameraPoll();
const fb = setTimeout(() => {
if (phaseRef.current === 'waiting') {
const next = demoNames.find(n => !seenRef.current.has(n.toLowerCase())) || 'Aarav Sharma';
setStudentName(next);
setMimiVideo(mimiWaveVideo);
setPhase('intro');
}
}, 3500);
return () => { clearInterval(pollRef.current); clearTimeout(fb); };
}, []); // eslint-disable-line
const resetForNextStudent = useCallback(() => {
setCurrent(0);
setCorrect(0);
correctRef.current = 0;
setTranscript('');
setLlmFeedback('');
setIsCorrect(null);
setStarsEarned(0);
setStudentName('');
setMimiVideo(mimiIdleVideo);
setPhase('waiting');
startCameraPoll();
setTimeout(() => {
if (phaseRef.current === 'waiting') {
const next = demoNames.find(n => !seenRef.current.has(n.toLowerCase()));
if (next) {
setStudentName(next);
setMimiVideo(mimiWaveVideo);
setPhase('intro');
}
}
}, 3500);
}, [startCameraPoll]); // eslint-disable-line
useEffect(() => {
if (phase !== 'between_students') return;
setCountdown(5);
const tick = setInterval(() => {
setCountdown(c => {

if (c <= 1) { clearInterval(tick); resetForNextStudent(); return 0; }
return c - 1;
});
}, 1000);
return () => clearInterval(tick);
}, [phase]); // eslint-disable-line

useEffect(() => {
if (phase === 'waiting' || phase === 'between_students') { setMimiVideo(mimiIdleVideo); return; }
if (phase === 'done') {
setMimiVideo(starsEarned >= 4 ? mimiHappyVideo : mimiNeutralVideo);
return;
}
setMimiVideo(mimiWaveVideo);
}, [phase, starsEarned]);
useEffect(() => {
if (phase !== 'intro') return;
const msg = `Hi ${studentName}! Let's start ${activity.name}!`;
setMimiSaying(msg); speak(msg);
const t = setTimeout(() => setPhase('asking'), 3000);
return () => clearTimeout(t);
}, [phase]); // eslint-disable-line
useEffect(() => {
if (phase !== 'asking') return;
if (isPausedRef.current) return;
const item = words[current];
let msg = '';
if (activity.id === 9) {
// Picture Guess — no text hint
msg = `Look carefully… what do you see?`;
} else if (activity.id === 10) {
// Counting
if (item?.addend1 !== undefined) {
msg = `Count them all and tell me the total!`;
} else {
msg = `Count the items and tell me how many!`;
}
} else if (activity.id === 11) {
// Pattern
msg = `What comes next in the pattern?`;
} else {
const label = getWordLabel(item);
msg = `Can you say… ${label}?`;
}
setMimiSaying(msg); speak(msg, 0.8);
const t = setTimeout(() => setPhase('listening'), 2200);
return () => clearTimeout(t);
}, [phase, current]); // eslint-disable-line
useEffect(() => {
if (phase !== 'listening') return;
if (isPausedRef.current) return;
setMimiSaying('I am listening… ■');
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const item
= words[current];
const answer = getAnswer(item);

if (!SR) { setTimeout(() => sendToLLM(answer, answer), 1000); return; }
const rec = new SR();
rec.lang = 'en-IN'; rec.continuous = false; rec.interimResults = false;
rec.onstart = () => setListening(true);
rec.onend
= () => setListening(false);
rec.onresult = (e) => { const s = e.results[0][0].transcript.trim(); setTranscript(s); sendToLLM(
rec.onerror = () => sendToLLM(answer, '');
rec.start(); recogRef.current = rec;
const t = setTimeout(() => { try { rec.stop(); } catch {} sendToLLM(answer, ''); }, 7000);
return () => { clearTimeout(t); try { rec.stop(); } catch {} };
}, [phase, current]); // eslint-disable-line
async function sendToLLM(word, childSaid) {
setPhase('checking');
setMimiSaying('Mimi is thinking… ■');
try {

const res = await axios.post(API_ENDPOINTS.ACTIVITY_CHECK, {
word, child_said: childSaid, activity_name: activity.name, student_name: studentName,
});
const r
= res.data?.result;
const ok = r?.correct ?? childSaid.toLowerCase().includes(word.toLowerCase());
const msg = r?.feedback ?? (ok ? `Wonderful! ${word} is correct! ■` : `Never mind! The answer
setLlmFeedback(msg); handleResult(ok, msg);
} catch {
const ok = childSaid.toLowerCase().includes(word.toLowerCase());
const msg = ok ? `Wonderful! ${word} is correct! ■` : `Never mind! The answer was ${word}`;
setLlmFeedback(msg); handleResult(ok, msg);
}
}

function handleResult(ok, feedback) {
const nc = correctRef.current + (ok ? 1 : 0);
if (ok) { setCorrect(nc); correctRef.current = nc; }
setIsCorrect(ok); setMimiSaying(feedback); speak(feedback); setPhase('result');
clearTimeout(resultTimerRef.current);
resultTimerRef.current = setTimeout(() => {
if (sessionEndedRef.current) return; // session ended — don't advance
if (current + 1 < total) {
setCurrent(c => c + 1); setIsCorrect(null); setTranscript(''); setLlmFeedback(''); setPhase('
} else { finishStudent(nc); }
}, 3500);
}

function finishStudent(fc, isEarly = false, skipTransition = false) {
const attempted = isEarly ? Math.max(current, 1) : total;
const score
= Math.round((fc / attempted) * 100);
// Stars: divide questions into 5 equal groups, each group = 1 star
// Group size = ceil(total / 5)
// 15q: groups of 3 → 1-3=1■, 4-6=2■, 7-9=3■, 10-12=4■, 13-15=5■
// 6q: groups of 2 → but last group gets 5■ if all correct
// Special: if fc === total → always 5 stars (full marks = full stars)
const groupSize = Math.ceil(total / 5);
const earned = fc === 0 ? 0 : fc === total ? 5 : Math.min(5, Math.ceil(fc / groupSize));
setStarsEarned(earned);
setPhase('done');
const msg = earned === 0
? `Good try ${studentName}! Keep practicing! ■`
: `Well done ${studentName}! You earned ${earned} star${earned !== 1 ? 's' : ''}! ■`;
setMimiSaying(msg);
if (!skipTransition) speak(msg); // don't speak — end session already said "Well done [name]!"
seenRef.current.add(studentName.toLowerCase());
onStudentDone({ stars: earned, score, correct: fc, total: isEarly ? current : total, studentName
setSessionResults(prev => [...prev, { name: studentName, stars: earned, score, correct: fc, total
if (!isEarly && !skipTransition) setTimeout(() => setPhase('between_students'), 4500);
}
// ■■ Pause / Resume ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
function handlePause() {
if (isPausedRef.current) return;
try { recogRef.current?.stop(); } catch {}
window.speechSynthesis?.cancel();
clearTimeout(resultTimerRef.current);
pausedPhaseRef.current = phase; // remember exact phase
isPausedRef.current = true;
setIsPaused(true);
setListening(false);
setMimiSaying('■■ Activity paused');
setMimiVideo(mimiIdleVideo);
}
function handleResume() {
isPausedRef.current = false;
setIsPaused(false);
setMimiVideo(mimiWaveVideo);
// Always resume from 'asking' so the question is re-spoken clearly
setPhase('idle_resume'); // briefly toggle to force useEffect re-run
setTimeout(() => setPhase('asking'), 50);
}
// ■■ End button clicked — immediately stop activity, show confirm popup ■■■■
function handleEndClick() {
// Immediately freeze everything (same as pause)
try { recogRef.current?.stop(); } catch {}

window.speechSynthesis?.cancel();
clearTimeout(resultTimerRef.current);
clearInterval(pollRef.current);
isPausedRef.current = true;
setIsPaused(true);
setListening(false);
setMimiVideo(mimiIdleVideo);
setMimiSaying('■■ Activity paused');
// Show confirm popup
setShowEndConfirm(true);
}
// ■■ End session confirmed — save results and show results screen ■■■■■■■■■■
function handleEndSession() {
setShowEndConfirm(false);
sessionEndedRef.current = true;
isPausedRef.current = false;
clearInterval(pollRef.current);
clearTimeout(resultTimerRef.current);
// say ONLY "Well done [name]!" — nothing else
if (studentName) {
const msg = `Well done ${studentName}!`;
speak(msg);
}
// use phaseRef.current — not stale `phase` closure
if (studentName && !['waiting','between_students','done'].includes(phaseRef.current)) {
finishStudent(correctRef.current, true, true);
}
setSessionEnded(true);
}
// ■■ Cancel end — resume the activity ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
function handleCancelEnd() {
setShowEndConfirm(false);
handleResume();
}
const currentItem = words[Math.min(current, total - 1)];
const word
= getWordLabel(currentItem);
const emoji
= WORD_EMOJIS[word] || '■';
const progress
= (phase === 'waiting' || phase === 'between_students') ? 0
: ((current + (phase === 'done' ? 1 : 0)) / total) * 100;

// Determine which card to render for asking/listening
function renderWordCard() {
if (activity.id === 9) {
return <PictureGuessCard word={word} mimiSaying={mimiSaying} phase={phase} listening={listening
}
if (activity.id === 10) {
return <CountingCard item={currentItem} mimiSaying={mimiSaying} phase={phase} listening={listen
}
if (activity.id === 11) {
return <PatternCard item={currentItem} mimiSaying={mimiSaying} phase={phase} listening={listeni
}
// Default — standard word card
return (
<motion.div key={`word-${current}`} initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opac
<motion.div animate={{ y:[0,-10,0] }} transition={{ duration:2, repeat:Infinity }}
className="w-44 h-44 bg-white/95 rounded-3xl shadow-2xl flex items-center justify-center te
{emoji}
</motion.div>
<div className="bg-white/90 backdrop-blur rounded-3xl px-10 py-5 shadow-xl border-4 border-pu
<h2 className="text-5xl font-black text-purple-700 mb-2">{word}</h2>
<p className="text-lg text-purple-500 mb-2">{mimiSaying}</p>
{phase === 'listening' && (
<motion.div animate={{ scale:[1,1.06,1] }} transition={{ duration:0.6, repeat:Infinity }}
className="flex items-center gap-2 justify-center mt-2 bg-red-50 rounded-full px-5 py-2
{listening ? <Mic size={18} className="text-red-500" /> : <MicOff size={18} className="
<span className="font-bold text-red-600 text-sm">{listening ? 'Say it now! ■' : 'Liste
</motion.div>
)}
{transcript && <p className="text-xs text-gray-400 mt-2">You said: "{transcript}"</p>}
</div>
<div className="text-white/80 font-semibold text-sm">{current + 1} / {total}</div>
</motion.div>
);
}

// ■■ Spacebar → toggle pause/resume ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
useEffect(() => {
function onKey(e) {
if (e.code !== 'Space') return;
if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
e.preventDefault();
if (sessionEnded || ['waiting','between_students','done'].includes(phase)) return;
if (isPaused) handleResume(); else handlePause();
}
window.addEventListener('keydown', onKey);
return () => window.removeEventListener('keydown', onKey);
}, [isPaused, phase, sessionEnded]); // eslint-disable-line
return (
<div className="fixed inset-0 z-50 overflow-hidden" style={{ backgroundImage: `url(${bgImage})`, backgroundSize:'cover', backgroundPosition:'center' }}>
  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

  {!questionsReady && (
    <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
      <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl px-14 py-12 shadow-2xl border border-white/20 text-center">
        <motion.div animate={{ rotate:360 }} transition={{ duration:1.2, repeat:Infinity, ease:'linear' }}
          className="text-6xl mb-4 inline-block">✨</motion.div>
        <h2 className="text-2xl font-black text-white mb-2">Mimi is preparing</h2>
        <p className="text-white/70 text-sm">Generating fresh questions just for you…</p>
      </motion.div>
    </div>
  )}

  <div className="absolute top-6 right-6 z-50">
    <span className={`px-5 py-2 rounded-full text-sm font-black backdrop-blur-md border-2 shadow-lg ${
      difficulty === 'easy' ? 'bg-emerald-500/80 text-white border-emerald-400' :
      difficulty === 'medium' ? 'bg-amber-500/80 text-white border-amber-400' :
      'bg-rose-500/80 text-white border-rose-400'
    }`}>{DIFFICULTY_LABELS[difficulty]}</span>
  </div>

  <AnimatePresence>
    {showEndConfirm && (
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <motion.div initial={{ scale:0.8, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.8 }}
          className="bg-white rounded-3xl px-10 py-8 shadow-2xl border-2 border-rose-200 text-center max-w-sm w-full mx-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">⚠️</span></div>
          <h2 className="text-2xl font-black text-rose-600 mb-2">End Activity?</h2>
          <p className="text-gray-500 mb-6 text-sm">Current progress will be saved and stars awarded.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleEndSession} className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl transition-colors shadow-md">Yes, End</button>
            <button onClick={handleCancelEnd} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-2xl transition-colors">Cancel</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  <AnimatePresence>
    {sessionEnded && (
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div initial={{ scale:0.8, y:40 }} animate={{ scale:1, y:0 }} exit={{ scale:0.8 }}
          className="bg-white rounded-3xl px-8 py-8 shadow-2xl border-2 border-purple-200 max-w-lg w-full max-h-[85vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"><span className="text-4xl">🏆</span></div>
            <h2 className="text-3xl font-black text-purple-700">Activity Complete!</h2>
            <p className="text-gray-400 text-sm mt-1">{activity.name} · {DIFFICULTY_LABELS[difficulty]}</p>
          </div>
          {sessionResults.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No students completed any questions.</p>
          ) : (
            <div className="space-y-3 mb-6">
              {sessionResults.map((r, i) => (
                <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.08 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-black text-sm">#{i+1}</div>
                    <div>
                      <p className="font-bold text-gray-800">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.correct}/{r.total} correct · {r.score}%</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">{[...Array(5)].map((_,j) => <Star key={j} size={20} className={j < r.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />)}</div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4 border border-blue-100 text-center">
            <p className="text-blue-700 text-sm font-semibold">⭐ Stars saved to Students tab automatically</p>
          </div>
          <button onClick={() => { clearInterval(pollRef.current); onClose(); }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-2xl shadow-lg transition-all">
            Close
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  {phase !== 'waiting' && phase !== 'between_students' && (
    <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 z-40">
      <motion.div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration:0.4 }} />
    </div>
  )}

  <AnimatePresence>
    {showWarning && (
      <motion.div initial={{ opacity:0, scale:0.8, y:-50 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, y:-50 }}
        className="absolute top-24 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-rose-500 text-white px-8 py-4 rounded-3xl border-2 border-rose-300 shadow-2xl">
          <p className="text-xl font-black text-center">{warningMsg}</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  <AnimatePresence>
    {studentName && phase !== 'waiting' && phase !== 'between_students' && (
      <motion.div initial={{ opacity:0, y:-30, scale:0.8 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-30 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/95 backdrop-blur-xl px-8 py-3 rounded-full border-2 border-purple-300 shadow-xl">
          <h2 className="text-2xl font-black text-purple-700 text-center">👋 Hi {studentName}!</h2>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  {sessionResults.length > 0 && phase !== 'between_students' && (
    <div className="absolute top-6 left-6 z-40 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-purple-100 min-w-[180px]">
      <p className="text-sm font-black text-purple-700 mb-2">📊 Scoreboard</p>
      {sessionResults.map((r, i) => (
        <div key={i} className="flex items-center justify-between gap-3 py-1.5 border-b border-purple-50 last:border-0">
          <span className="text-sm font-semibold text-gray-700 truncate max-w-[110px]">{r.name}</span>
          <div className="flex items-center gap-1 shrink-0">
            {[...Array(5)].map((_,j) => <Star key={j} size={12} className={j < r.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />)}
            <span className="text-xs text-gray-500 ml-1">{r.score}%</span>
          </div>
        </div>
      ))}
    </div>
  )}

  <div className="absolute inset-0 flex flex-col justify-center z-20 pl-12 pr-[480px]">
    <AnimatePresence mode="wait">

      {phase === 'waiting' && (
        <motion.div key="waiting" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl px-12 py-10 shadow-2xl border border-white/60 text-center">
            <motion.div animate={{ scale:[1,1.08,1] }} transition={{ duration:1.5, repeat:Infinity }}>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"><span className="text-4xl">👀</span></div>
            </motion.div>
            <h2 className="text-3xl font-black text-purple-700 mb-2">{sessionResults.length === 0 ? 'Who is first?' : 'Next student, please step up!'}</h2>
            <p className="text-lg text-purple-500">Camera is scanning — stand in front of the screen!</p>
            <p className="text-sm text-gray-400 mt-2">Activity: {activity.name} · {DIFFICULTY_LABELS[difficulty]}</p>
            {sessionResults.length > 0 && <p className="text-sm text-emerald-600 font-semibold mt-2">✅ {sessionResults.length} student(s) done</p>}
          </div>
        </motion.div>
      )}

      {phase === 'between_students' && (
        <motion.div key="between" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl px-10 py-8 shadow-2xl border border-white/60">
          <h2 className="text-3xl font-black text-purple-700 text-center mb-5">🏆 Activity Results</h2>
          <div className="space-y-2 mb-6">
            {sessionResults.map((r, i) => (
              <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.08 }}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-purple-600">#{i+1}</span>
                  <span className="font-bold text-gray-800">{r.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">{[...Array(5)].map((_,j) => <Star key={j} size={16} className={j < r.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />)}</div>
                  <span className="text-sm font-bold text-gray-600">{r.correct}/{r.total}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-purple-600 font-semibold mb-1">Next student in…</p>
            <motion.div key={countdown} initial={{ scale:1.5 }} animate={{ scale:1 }} className="text-5xl font-black text-purple-700">{countdown}</motion.div>
          </div>
        </motion.div>
      )}

      {phase === 'intro' && (
        <motion.div key="intro" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl px-12 py-10 shadow-2xl border border-white/60 text-center">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-4xl font-black text-purple-700 mb-2">{activity.name}</h2>
          <p className="text-xl text-purple-500">{mimiSaying}</p>
        </motion.div>
      )}

      {(phase === 'asking' || phase === 'listening') && (
        <motion.div key={`word-${current}`} initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.5, opacity:0 }}>
          {renderWordCard()}
        </motion.div>
      )}

      {phase === 'checking' && (
        <motion.div key="checking" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl px-12 py-10 shadow-2xl border border-white/60 text-center">
          <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }} className="text-6xl mb-4 inline-block">🤔</motion.div>
          <h2 className="text-3xl font-black text-purple-700">Mimi AI is thinking…</h2>
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div key="result" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl px-10 py-8 shadow-2xl border border-white/60 text-center">
          <div className="text-6xl mb-3">{isCorrect ? '🎉' : '💪'}</div>
          <h2 className={`text-4xl font-black mb-3 ${isCorrect ? 'text-emerald-600' : 'text-orange-500'}`}>{isCorrect ? 'That is Correct!' : 'Keep Trying!'}</h2>
          <div className="bg-purple-50 rounded-2xl p-4 mb-3 border border-purple-100"><p className="text-purple-700 text-lg font-medium">{llmFeedback}</p></div>
          {transcript && <p className="text-xs text-gray-400">Said: "{transcript}" · Correct: "{word}"</p>}
        </motion.div>
      )}

      {phase === 'done' && (
        <motion.div key="done" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl px-12 py-10 shadow-2xl border border-white/60 text-center">
          <div className="text-6xl mb-3">🏆</div>
          <h2 className="text-4xl font-black text-yellow-600 mb-3">{correct}/{total} Correct!</h2>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} initial={{ scale:0, rotate:-180 }} animate={{ scale:1, rotate:0 }} transition={{ delay: i*0.1 }}>
                <Star size={40} className={i < starsEarned ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
              </motion.div>
            ))}
          </div>
          <p className="text-xl font-bold text-purple-700 mb-1">{starsEarned} Stars for {studentName}!</p>
          <p className="text-purple-500 text-sm">Next student coming up…</p>
        </motion.div>
      )}

    </AnimatePresence>
  </div>

  {!sessionEnded && (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4">
      {studentName && !['waiting','between_students','done'].includes(phase) && (
        isPaused ? (
          <motion.button onClick={handleResume} whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl transition-colors">
            ▶️ Resume <span className="text-xs font-medium opacity-70 ml-1">[Space]</span>
          </motion.button>
        ) : (
          <motion.button onClick={handlePause} whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }}
            className="flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white font-black rounded-2xl shadow-xl transition-colors">
            ⏸️ Pause <span className="text-xs font-medium opacity-70 ml-1">[Space]</span>
          </motion.button>
        )
      )}
      <motion.button onClick={handleEndClick} whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }}
        className="flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-xl transition-colors">
        🛑 End Session
      </motion.button>
    </div>
  )}

  <div className="absolute bottom-0 right-0 z-30 pointer-events-none">
    <motion.div key={mimiVideo} initial={{ scale:0.8, opacity:0, y:50 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.5, opacity:0 }} className="w-[460px] h-[460px]">
      <video key={mimiVideo} src={mimiVideo} autoPlay loop muted playsInline className="w-full h-full object-contain" />
    </motion.div>
  </div>
</div>
);
}

const ActivitiesTab = () => {
const { addActivityResult } = useStars();
const [showConfigModal,
setShowConfigModal]
= useState(false);
const [selectedActivity,
setSelectedActivity]
= useState(null);
const [runningActivity,
setRunningActivity]
= useState(null);
const [runningDifficulty, setRunningDifficulty] = useState('easy');
const [lastResult,
setLastResult]
= useState(null);
const [showBanner,
setShowBanner]
= useState(false);
// Per-activity saved difficulty (set via Config modal, default 'easy')
const [activityDifficulty, setActivityDifficulty] = useState({});

const activities = [
{ id:1, name:'Alphabet Practice', icon:'🔤', category:'Alphabets', avgTime:'15 min', difficulty:['easy','medium','hard'], studentsCompleted:24, avgScore:87, description:'Practice alphabet letters with Mimi voice recognition.' },
{ id:2, name:'Phonics Basics', icon:'🗣️', category:'Phonics', avgTime:'12 min', difficulty:['easy','medium','hard'], studentsCompleted:18, avgScore:82, description:'Learn phonics sounds and letter combinations.' },
{ id:3, name:'Fruits Recognition', icon:'🍎', category:'Objects', avgTime:'10 min', difficulty:['easy','medium','hard'], studentsCompleted:31, avgScore:91, description:'Identify and name different fruits.' },
{ id:4, name:'Animal Sounds', icon:'🐾', category:'Objects', avgTime:'8 min', difficulty:['easy','medium','hard'], studentsCompleted:27, avgScore:88, description:'Recognize animals and their sounds.' },
{ id:5, name:'Colors Matching', icon:'🎨', category:'Colors', avgTime:'10 min', difficulty:['easy','medium','hard'], studentsCompleted:22, avgScore:94, description:'Match and identify colors.' },
{ id:6, name:'Number Counting', icon:'🔢', category:'Numbers', avgTime:'12 min', difficulty:['easy','medium','hard'], studentsCompleted:19, avgScore:79, description:'Count numbers with fun activities.' },
{ id:7, name:'Body Parts', icon:'🫀', category:'Body', avgTime:'10 min', difficulty:['easy','medium','hard'], studentsCompleted:15, avgScore:85, description:'Learn the names of body parts.' },
{ id:8, name:'Shapes', icon:'🔷', category:'Shapes', avgTime:'8 min', difficulty:['easy','medium','hard'], studentsCompleted:20, avgScore:90, description:'Identify and name different shapes.' },
{ id:9, name:'Picture Guess', icon:'👀', category:'Guess', avgTime:'10 min', difficulty:['easy','medium','hard'], studentsCompleted:12, avgScore:76, description:'AI-generated picture guessing game.' },
{ id:10, name:'Counting Game', icon:'🧮', category:'Numbers', avgTime:'10 min', difficulty:['easy','medium','hard'], studentsCompleted:9, avgScore:81, description:'AI-powered counting and addition game.' },
{ id:11, name:'Pattern Fun', icon:'🧩', category:'Patterns', avgTime:'12 min', difficulty:['easy','medium','hard'], studentsCompleted:8, avgScore:77, description:'Complete patterns with AI questions.' },
{ id:12, name:'Quiz Mode', icon:'🏆', category:'Mixed', avgTime:'15 min', difficulty:['easy','medium','hard'], studentsCompleted:14, avgScore:83, description:'Mixed quiz covering all topics.' },
]
];
// "Start" clicked → launch overlay with this activity's saved difficulty
const handleStartActivity = (activity) => {
const diff = activityDifficulty[activity.id] || 'easy';
setRunningDifficulty(diff);
setRunningActivity(activity);
};
// Difficulty chosen → launch overlay
const handleDifficultySelect = (diff) => {
setRunningDifficulty(diff);
setRunningActivity(selectedActivity);
setShowDiffModal(false);
};

const handleConfigureActivity = (activity) => { setSelectedActivity(activity); setShowConfigModal(t
const NAME_TO_ID = {
'aarav sharma':'student-1', 'priya patel':'student-2', 'rohan kumar':'student-3',
'sara ali':'student-4', 'ananya singh':'student-5', 'student':'student-1', '':'student-1',
};
const handleStudentDone = useCallback(({ stars, score, studentName }) => {
const act = runningActivity;
const key = (studentName ?? '').toLowerCase().trim();
const studentId = NAME_TO_ID[key] ?? 'student-1';
addActivityResult({
studentId, studentName: studentName ?? 'Aarav Sharma',
activityId: act?.id ?? 0, activityName: act?.name ?? 'Activity',
stars, score,
});
setLastResult({ stars, score, studentName, activityName: act?.name });
setShowBanner(true);
setTimeout(() => setShowBanner(false), 5000);
}, [addActivityResult, runningActivity]); // eslint-disable-line
const handleClose = useCallback(() => setRunningActivity(null), []);
const getDifficultyColor = () => 'bg-purple-100 text-purple-700';

return (
<>
{/* Activity overlay */}
{runningActivity && (
<MimiActivityOverlay activity={runningActivity} difficulty={runningDifficulty} onStudentDone=
)}
<div className="space-y-6">
{/* Header */}

<div className="flex items-center justify-between">
<div>
<h1 className="text-4xl font-bold text-text mb-2">Learning Activities</h1>
<p className="text-text/60">Manage and launch classroom activities</p>
</div>
<Button variant="primary" icon={Plus}>Create Custom Activity</Button>
</div>

{/* Result banner */}
<AnimatePresence>
{showBanner && lastResult && (
<motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0
className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 flex items-ce
<div className="text-4xl">■</div>
<div>
<p className="font-bold text-lg">{lastResult.activityName} complete!</p>
<p className="text-white/90">
{lastResult.studentName} earned {[...Array(5)].map((_,i) => <span key={i}>{i < last
</p>
</div>
</motion.div>
)}
</AnimatePresence>

{/* Quick Stats */}
<div className="grid grid-cols-4 gap-4">
<Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
<p className="text-sm text-blue-700 mb-1">Total Activities</p>
<p className="text-4xl font-bold text-blue-900">{activities.length}</p>
</Card>
<Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
<p className="text-sm text-green-700 mb-1">Completions</p>
<p className="text-4xl font-bold text-green-900">{activities.reduce((s,a) => s + a.studen
</Card>
<Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
<p className="text-sm text-purple-700 mb-1">Avg Score</p>
<p className="text-4xl font-bold text-purple-900">
{(activities.filter(a => a.avgScore > 0).reduce((s,a) => s + a.avgScore, 0) / activitie
</p>
</Card>
<Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
<p className="text-sm text-yellow-700 mb-1">Avg Duration</p>
<p className="text-4xl font-bold text-yellow-900">11m</p>
</Card>
</div>

{/* Activities Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{activities.map((activity, index) => (
<motion.div key={activity.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
<Card hover className="h-full">
<div className="flex items-start justify-between mb-4">
<div className="flex items-center gap-3">
<div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rou
<div>
<h3 className="font-bold text-text text-lg">{activity.name}</h3>
<p className="text-sm text-text/60">{activity.category}</p>
</div>
</div>
{activity.id > 6 && (
<span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-black round
)}
</div>
<p className="text-sm text-text/70 mb-4">{activity.description}</p>
<div className="space-y-2 mb-4">
<div className="flex items-center justify-between text-sm">
<span className="text-text/60">Difficulty:</span>
{(() => {
const d = activityDifficulty[activity.id] || 'easy';
const cfg = { easy:['bg-green-100 text-green-700','Easy'], medium:['bg-yellow-1
return <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${cfg[0]}`}
})()}
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-text/60">Avg Time:</span>
<span className="font-semibold text-text flex items-center gap-1"><Clock size={14
</div>

</div>
<div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
<Users size={16} className="text-text/60" />
<span className="text-sm text-text/70">
{activity.studentsCompleted > 0 ? <><strong>{activity.studentsCompleted}</strong>
</span>
{activity.avgScore > 0 && <span className="ml-auto text-sm font-semibold text-text"
</div>
<div className="flex gap-2">
<Button variant="primary" icon={Play} className="flex-1" onClick={() => handleStart
<Button variant="outline" icon={Settings} onClick={() => handleConfigureActivity(ac
</div>
</Card>
</motion.div>
))}
</div>

{/* Configure Modal */}
{selectedActivity && (
<Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} title={`Configure
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold text-text mb-2">Difficulty Level</label
<select
value={activityDifficulty[selectedActivity.id] || 'easy'}
onChange={e => setActivityDifficulty(prev => ({ ...prev, [selectedActivity.id]: e.t
className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primar
>
<option value="easy">Easy</option>
<option value="medium">Medium</option>
<option value="hard">Hard</option>
</select>
</div>
<div>
<label className="block text-sm font-semibold text-text mb-2">Time Limit (minutes)</l
<input type="number" defaultValue={15} className="w-full px-4 py-2 rounded-xl border</div>
<div>
<label className="block text-sm font-semibold text-text mb-2">Number of Questions</la
<input type="number" defaultValue={10} className="w-full px-4 py-2 rounded-xl border</div>
<div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
<p className="text-sm text-blue-800">■■ These settings will apply the next time this
</div>
<div className="flex gap-3">
<Button variant="primary" className="flex-1" onClick={() => setShowConfigModal(false)
<Button variant="outline" className="flex-1" onClick={() => setShowConfigModal(false)
</div>
</div>
</Modal>
)}
</div>
</>
);
};
export default ActivitiesTab;
return (
<>
{runningActivity && (
  <MimiActivityOverlay activity={runningActivity} difficulty={runningDifficulty} onStudentDone={handleStudentDone} onClose={handleClose} />
)}

<div className="space-y-8 p-1">

  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-4xl font-bold text-text mb-1">Learning Activities</h1>
      <p className="text-text/50 text-base">Manage and launch classroom activities</p>
    </div>
    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <Plus size={18} />
      Create Custom Activity
    </motion.button>
  </div>

  {/* Result banner */}
  <AnimatePresence>
    {showBanner && lastResult && (
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
        className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-5 flex items-center gap-4 shadow-xl">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">🌟</div>
        <div>
          <p className="font-black text-white text-lg">{lastResult.activityName} complete!</p>
          <p className="text-white/90 text-sm">
            {lastResult.studentName} earned {[...Array(5)].map((_,i) => <span key={i}>{i < lastResult.stars ? '⭐' : '☆'}</span>)} · {lastResult.score}%
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Quick Stats */}
  <div className="grid grid-cols-4 gap-4">
    {[
      { label:'Total Activities', value: activities.length, icon:'📚', from:'from-blue-500', to:'to-cyan-500' },
      { label:'Completions', value: activities.reduce((s,a) => s + (a.studentsCompleted||0), 0), icon:'✅', from:'from-emerald-500', to:'to-teal-500' },
      { label:'Avg Score', value: (activities.filter(a=>a.avgScore>0).reduce((s,a)=>s+a.avgScore,0)/Math.max(activities.filter(a=>a.avgScore>0).length,1)).toFixed(0)+'%', icon:'📊', from:'from-purple-500', to:'to-pink-500' },
      { label:'Avg Duration', value:'11m', icon:'⏱️', from:'from-amber-500', to:'to-orange-500' },
    ].map((stat, i) => (
      <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
        className="relative overflow-hidden bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.from} ${stat.to} opacity-10 rounded-full translate-x-6 -translate-y-6`} />
        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-black text-gray-800">{stat.value}</p>
          <span className="text-2xl mb-0.5">{stat.icon}</span>
        </div>
      </motion.div>
    ))}
  </div>

  {/* Activities Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {activities.map((activity, index) => {
      const diff = activityDifficulty[activity.id] || 'easy';
      const diffCfg = { easy:['bg-emerald-100 text-emerald-700','Easy'], medium:['bg-amber-100 text-amber-700','Medium'], hard:['bg-rose-100 text-rose-700','Hard'] };
      const categoryColors = {
        Alphabets:'from-blue-500 to-cyan-500', Phonics:'from-violet-500 to-purple-500',
        Objects:'from-emerald-500 to-teal-500', Colors:'from-pink-500 to-rose-500',
        Numbers:'from-amber-500 to-orange-500', Body:'from-red-500 to-pink-500',
        Shapes:'from-indigo-500 to-blue-500', Guess:'from-fuchsia-500 to-pink-500',
        Patterns:'from-cyan-500 to-blue-500', Mixed:'from-yellow-500 to-amber-500',
      };
      const gradClass = categoryColors[activity.category] || 'from-purple-500 to-pink-500';
      return (
        <motion.div key={activity.id}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: index*0.04 }}
          whileHover={{ y:-3 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all overflow-hidden">
          <div className={`h-1.5 bg-gradient-to-r ${gradClass}`} />
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 bg-gradient-to-br ${gradClass} rounded-2xl flex items-center justify-center text-2xl shadow-md`}>
                  {activity.icon}
                </div>
                <div>
                  <h3 className="font-black text-gray-800 text-base leading-tight">{activity.name}</h3>
                  <span className="text-xs text-gray-400 font-medium">{activity.category}</span>
                </div>
              </div>
              {activity.id > 6 && (
                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-black rounded-full border border-purple-200">AI ✨</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{activity.description}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400 mb-0.5">Difficulty</p>
                <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${diffCfg[diff][0]}`}>{diffCfg[diff][1]}</span>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400 mb-0.5">Avg Time</p>
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1"><Clock size={11} />{activity.avgTime}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl mb-4 border border-gray-100">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Users size={14} />
                {activity.studentsCompleted > 0
                  ? <span><strong className="text-gray-700">{activity.studentsCompleted}</strong> students done</span>
                  : <span>Not started yet</span>}
              </div>
              {activity.avgScore > 0 && <span className="text-sm font-black text-purple-600">{activity.avgScore}%</span>}
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                onClick={() => handleStartActivity(activity)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r ${gradClass} text-white font-black rounded-2xl shadow-md hover:shadow-lg transition-shadow text-sm`}>
                <Play size={15} /> Start
              </motion.button>
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                onClick={() => handleConfigureActivity(activity)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl transition-colors">
                <Settings size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    })}
  </div>

  {/* Configure Modal */}
  {selectedActivity && (
    <Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} title={`Configure — ${selectedActivity.name}`}>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty Level</label>
          <select
            value={activityDifficulty[selectedActivity.id] || 'easy'}
            onChange={e => setActivityDifficulty(prev => ({ ...prev, [selectedActivity.id]: e.target.value }))}
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors bg-gray-50 font-medium">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Time Limit (minutes)</label>
          <input type="number" defaultValue={15} className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors bg-gray-50 font-medium" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Number of Questions</label>
          <input type="number" defaultValue={10} className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors bg-gray-50 font-medium" />
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm text-blue-700 font-medium">💡 These settings will apply the next time this activity is started.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" className="flex-1" onClick={() => setShowConfigModal(false)}>Save</Button>
          <Button variant="outline" className="flex-1" onClick={() => setShowConfigModal(false)}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )}
</div>
</>
);
};
export default ActivitiesTab;