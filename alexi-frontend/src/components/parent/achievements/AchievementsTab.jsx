// src/components/parent/achievements/AchievementsTab.jsx
import React from 'react';
import { Card } from '../../../components/shared';
import { Star, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStars } from '../../../context/StarContext';

const STUDENT_ID   = 'student-1';
const STUDENT_NAME = 'Aarav Sharma';

const ALL_BADGES = [
  { id:1, icon:'🌟', name:'First Star',    description:'Earn your first star',     unlockAt:1,   rarity:'common'    },
  { id:2, icon:'📚', name:'Bookworm',      description:'Complete 3 activities',     unlockAt:5,   rarity:'common'    },
  { id:3, icon:'🏃', name:'Fast Learner',  description:'Earn 15 stars',            unlockAt:15,  rarity:'common'    },
  { id:4, icon:'🔥', name:'On Fire',       description:'Earn 30 stars',            unlockAt:30,  rarity:'uncommon'  },
  { id:5, icon:'🎨', name:'Color Master',  description:'Earn 50 stars',            unlockAt:50,  rarity:'rare'      },
  { id:6, icon:'💯', name:'Perfect Score', description:'Earn 75 stars',            unlockAt:75,  rarity:'rare'      },
  { id:7, icon:'🏆', name:'Champion',      description:'Earn 100 stars',           unlockAt:100, rarity:'epic'      },
  { id:8, icon:'👑', name:'Legend',        description:'Earn 200 stars',           unlockAt:200, rarity:'legendary' },
];

const RARITY_GRADIENT = {
  common:    'from-gray-400 to-gray-600',
  uncommon:  'from-green-400 to-green-600',
  rare:      'from-blue-400 to-blue-600',
  epic:      'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const AchievementsTab = () => {
  const { getTotalStars, getStudentResults } = useStars();

  const totalStars = getTotalStars(STUDENT_ID);

  const earned = ALL_BADGES.filter(b => totalStars >= b.unlockAt);
  const locked = ALL_BADGES.filter(b => totalStars < b.unlockAt);

  // Leaderboard — Aarav's stars are live, others are static classmates
  const leaderboard = [
    { name: STUDENT_NAME,   stars: totalStars, isCurrentUser: true  },
    { name: 'Priya Patel',  stars: 42,         isCurrentUser: false },
    { name: 'Rohan Kumar',  stars: 37,         isCurrentUser: false },
    { name: 'Sara Ali',     stars: 35,         isCurrentUser: false },
    { name: 'Ananya Singh', stars: 29,         isCurrentUser: false },
  ]
    .sort((a, b) => b.stars - a.stars)
    .map((s, i) => ({ ...s, rank: i + 1 }));

  const nextBadge = locked[0];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-4xl font-bold text-text mb-2">Achievements 🏆</h1>
        <p className="text-text/60">Badges earned and goals to unlock</p>
      </div>

      {/* Stars summary */}
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 border-0 text-white text-center py-6">
        <motion.div key={totalStars} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <Star size={56} className="mx-auto mb-2 fill-white text-white" />
          <p className="text-6xl font-bold">{totalStars}</p>
          <p className="text-white/90 text-xl mt-1">Total Stars</p>
          <p className="text-white/70 text-sm mt-1">
            {earned.length} / {ALL_BADGES.length} badges unlocked
          </p>
        </motion.div>
      </Card>

      {/* Earned Badges */}
      {earned.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-text mb-4">🎖️ Earned Badges ({earned.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earned.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07, type: 'spring' }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${RARITY_GRADIENT[badge.rarity]} flex items-center justify-center text-4xl mx-auto mb-3`}>
                    {badge.icon}
                  </div>
                  <h3 className="font-bold text-text text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs text-text/60 mb-2">{badge.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold bg-gradient-to-r ${RARITY_GRADIENT[badge.rarity]} text-white capitalize`}>
                    {badge.rarity}
                  </span>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-text mb-4">🔒 Locked Badges ({locked.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locked.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="text-center opacity-60">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center mx-auto mb-3 relative">
                    <span className="text-4xl blur-sm">{badge.icon}</span>
                    <Lock size={20} className="absolute text-gray-500" />
                  </div>
                  <h3 className="font-bold text-text text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs text-text/60 mb-2">{badge.description}</p>
                  <p className="text-xs font-semibold text-primary-600">
                    Need {badge.unlockAt} ⭐ ({Math.max(0, badge.unlockAt - totalStars)} more)
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <Card>
        <h2 className="text-2xl font-bold text-text mb-4">🏅 Class Leaderboard</h2>
        <div className="space-y-3">
          {leaderboard.map((student, i) => (
            <motion.div
              key={student.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 ${
                student.isCurrentUser ? 'border-primary-300 bg-primary-50' : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  student.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                  student.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                  student.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : student.rank}
                </div>
                <div>
                  <h3 className={`font-semibold ${student.isCurrentUser ? 'text-primary-700' : 'text-text'}`}>
                    {student.name}
                    {student.isCurrentUser && <span className="ml-2 text-sm text-primary-400">(You!)</span>}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-text/60">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span>{student.stars} stars</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Motivation */}
      <Card className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0">
        <div className="flex items-center gap-4">
          <div className="text-6xl">🚀</div>
          <div>
            <h3 className="text-2xl font-bold mb-1">Keep Going!</h3>
            <p className="text-white/90">
              {totalStars === 0
                ? 'Complete your first activity to earn stars and unlock badges!'
                : nextBadge
                  ? `Only ${nextBadge.unlockAt - totalStars} more stars to unlock the "${nextBadge.name}" badge! ${nextBadge.icon}`
                  : 'You have unlocked all badges! You are a Legend! 👑'}
            </p>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default AchievementsTab;