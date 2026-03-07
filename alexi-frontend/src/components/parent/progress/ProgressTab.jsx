// src/components/parent/progress/ProgressTab.jsx
import React from 'react';
import { Card } from '../../../components/shared';
import { CheckCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStars } from '../../../context/StarContext';

const STUDENT_ID = 'student-1';

const LEVELS = [
  { name: 'Little Star',  min: 0,   max: 49,   emoji: '⭐' },
  { name: 'Bright Star',  min: 50,  max: 99,   emoji: '🌟' },
  { name: 'Super Star',   min: 100, max: 199,  emoji: '💫' },
  { name: 'Rising Star',  min: 200, max: 349,  emoji: '🚀' },
  { name: 'Champion',     min: 350, max: 499,  emoji: '🏆' },
  { name: 'Legend',       min: 500, max: Infinity, emoji: '👑' },
];

function getLevel(stars)     { return LEVELS.find(l => stars >= l.min && stars <= l.max) || LEVELS[0]; }
function getNextLevel(stars) { const i = LEVELS.findIndex(l => stars >= l.min && stars <= l.max); return LEVELS[i + 1] || null; }

const SKILLS = [
  { name: 'Alphabets',     unlocksAt: 0,   color: 'green'  },
  { name: 'Common Fruits', unlocksAt: 0,   color: 'green'  },
  { name: 'Colors',        unlocksAt: 10,  color: 'blue'   },
  { name: 'Animals',       unlocksAt: 30,  color: 'purple' },
  { name: 'Numbers',       unlocksAt: 50,  color: 'orange' },
  { name: 'Phonics',       unlocksAt: 100, color: 'pink'   },
];

const ProgressTab = () => {
  const { getTotalStars, getStudentResults } = useStars();

  const totalStars = getTotalStars(STUDENT_ID);
  const results    = getStudentResults(STUDENT_ID);
  const level      = getLevel(totalStars);
  const nextLevel  = getNextLevel(totalStars);
  const progress   = nextLevel
    ? Math.round(((totalStars - level.min) / (nextLevel.min - level.min)) * 100)
    : 100;

  // Last 7 days activity count
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const count = results.filter(r => new Date(r.timestamp).toDateString() === d.toDateString()).length;
    return { day: i === 6 ? 'Today' : days[d.getDay()], activities: count };
  });
  const maxAct = Math.max(...weeklyData.map(d => d.activities), 1);

  const skills = SKILLS.map(s => ({
    ...s,
    unlocked: totalStars >= s.unlocksAt,
    progress: totalStars >= s.unlocksAt
      ? 100
      : Math.min(99, Math.round((totalStars / (s.unlocksAt || 1)) * 100)),
  }));

  const barColor = { green:'bg-green-500', blue:'bg-blue-500', purple:'bg-purple-500', orange:'bg-orange-500', pink:'bg-pink-500' };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-4xl font-bold text-text mb-2">Learning Progress 📈</h1>
        <p className="text-text/60">Track skills and milestones</p>
      </div>

      {/* Level Journey */}
      <Card className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Current Level</p>
            <h2 className="text-3xl font-bold">{level.emoji} {level.name}</h2>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm mb-1">Next Level</p>
            <h3 className="text-xl font-semibold">
              {nextLevel ? `${nextLevel.emoji} ${nextLevel.name}` : '👑 Max Level!'}
            </h3>
          </div>
        </div>
        <div className="flex justify-between text-sm text-white/80 mb-1">
          <span>{totalStars} ⭐</span>
          <span>{nextLevel ? `${nextLevel.min - totalStars} more to unlock` : 'Legend!'}</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
        <p className="text-right text-white/80 text-sm mt-1">{progress}%</p>
      </Card>

      {/* Total Stars big counter */}
      <Card className="text-center py-6">
        <motion.div key={totalStars} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="text-6xl mb-2">⭐</div>
          <p className="text-6xl font-bold text-yellow-500">{totalStars}</p>
          <p className="text-text/60 text-lg mt-1">Total Stars Earned</p>
          <p className="text-text/40 text-sm">{results.length} activities completed</p>
        </motion.div>
      </Card>

      {/* Skills Progress */}
      <Card>
        <h2 className="text-2xl font-bold text-text mb-4">Skills Progress</h2>
        <div className="space-y-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`p-4 rounded-2xl border-2 ${skill.unlocked ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {skill.unlocked
                    ? <CheckCircle size={20} className="text-green-500" />
                    : <Lock size={20} className="text-gray-400" />}
                  <div>
                    <h3 className="font-semibold text-text">{skill.name}</h3>
                    <p className="text-xs text-text/50">
                      {skill.unlocked ? 'Unlocked ✅' : `Needs ${skill.unlocksAt} ⭐ (${Math.max(0, skill.unlocksAt - totalStars)} more)`}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold">{skill.unlocked ? '100%' : `${skill.progress}%`}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  className={`h-full rounded-full ${skill.unlocked ? barColor[skill.color] : 'bg-gray-400'}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Weekly Chart */}
      <Card>
        <h2 className="text-2xl font-bold text-text mb-4">This Week's Activity</h2>
        <div className="flex items-end justify-between gap-4 h-48">
          {weeklyData.map((day, i) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.activities / maxAct) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="w-full bg-gradient-to-t from-primary-400 to-secondary-400 rounded-t-xl min-h-[8px] relative"
              >
                {day.activities > 0 && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-text">
                    {day.activities}
                  </span>
                )}
              </motion.div>
              <span className="text-xs font-semibold text-text">{day.day}</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};

export default ProgressTab;