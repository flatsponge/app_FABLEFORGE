import React, { useState } from 'react';
import { 
  Heart, Sparkles, Shield, Brain, TrendingUp, 
  ChevronLeft, Calendar as CalendarIcon,
  Flame,
  Target,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Gift,
  Scale,
  Users,
  Sun,
  ClipboardList,
  Puzzle,
  Hourglass,
  Search
} from 'lucide-react';

// --- Types ---

interface SubSkill {
  name: string;
  value: number; // 0-100
  icon?: React.ElementType;
}

interface StoryImpact {
  id: number;
  title: string;
  coverGradient: string;
  date: string;
  impact: string; // "Leo learned..."
  liked: boolean;
}

interface Skill {
  id: string;
  name: string;
  progress: number; // 0-100 Mastery
  color: string;      // Main color for bars/charts
  bgTw: string;       // Tailwind bg class for weak accents
  textTw: string;     // Tailwind text class
  icon: React.ElementType;
  description: string;
  subSkills: SubSkill[];
  weeklyData: number[];
  contributingStories: StoryImpact[];
}

// --- Mock Data ---

const SKILLS_DATA: Skill[] = [
  { 
    id: 'empathy', 
    name: 'Compassion & Empathy', 
    progress: 85, 
    color: '#F43F5E', // Rose 500
    bgTw: 'bg-rose-50',
    textTw: 'text-rose-600',
    icon: Heart,
    description: 'Understanding feelings and caring for others.',
    subSkills: [
        { name: 'Perspective', value: 90 },
        { name: 'Compassion', value: 75 },
        { name: 'Kindness', value: 85 }
    ],
    weeklyData: [40, 55, 45, 70, 65, 80, 85],
    contributingStories: [
        {
            id: 101,
            title: "The Lonely Robot",
            coverGradient: "from-blue-200 to-cyan-300",
            date: "Yesterday",
            impact: "Leo learned how to identify when someone feels left out and why inviting them to play helps everyone feel included.",
            liked: true
        },
        {
            id: 102,
            title: "Sally's Broken Toy",
            coverGradient: "from-rose-200 to-pink-300",
            date: "3 days ago",
            impact: "Leo understood that apologizing is a brave way to show you care about a friend's feelings.",
            liked: true
        }
    ]
  },
  { 
    id: 'bravery', 
    name: 'Bravery & Resilience', 
    progress: 60, 
    color: '#F59E0B', // Amber 500
    bgTw: 'bg-amber-50',
    textTw: 'text-amber-600',
    icon: Shield,
    description: 'Understanding conflict and resolution.',
    subSkills: [
        { name: 'Confidence', value: 70 },
        { name: 'Grit', value: 50 },
        { name: 'Risk Taking', value: 60 }
    ],
    weeklyData: [30, 35, 50, 45, 60, 55, 60],
    contributingStories: [
        {
            id: 201,
            title: "The Dark Cave",
            coverGradient: "from-slate-300 to-slate-400",
            date: "1 week ago",
            impact: "Leo learned that facing your fears is much easier when you have a friend by your side.",
            liked: true
        }
    ]
  },
  { 
    id: 'honesty', 
    name: 'Honesty', 
    progress: 45, 
    color: '#3B82F6', // Blue 500
    bgTw: 'bg-blue-50',
    textTw: 'text-blue-600',
    icon: Scale,
    description: 'Valuing truth and integrity.',
    subSkills: [
        { name: 'Truthfulness', value: 50 },
        { name: 'Trust', value: 40 },
        { name: 'Integrity', value: 45 }
    ],
    weeklyData: [20, 25, 30, 35, 40, 40, 45],
    contributingStories: []
  },
  { 
    id: 'teamwork', 
    name: 'Teamwork', 
    progress: 72, 
    color: '#6366F1', // Indigo 500
    bgTw: 'bg-indigo-50',
    textTw: 'text-indigo-600',
    icon: Users,
    description: 'Working together to solve problems.',
    subSkills: [
        { name: 'Cooperation', value: 80 },
        { name: 'Listening', value: 65 },
        { name: 'Support', value: 70 }
    ],
    weeklyData: [60, 65, 60, 70, 75, 70, 72],
    contributingStories: [
        {
            id: 501,
            title: "Building the Fort",
            coverGradient: "from-indigo-200 to-purple-300",
            date: "2 days ago",
            impact: "Leo realized that building the fort was faster and more fun when everyone carried logs together.",
            liked: true
        }
    ]
  },
  { 
    id: 'creativity', 
    name: 'Creativity & Imagination', 
    progress: 40, 
    color: '#8B5CF6', // Violet 500
    bgTw: 'bg-violet-50',
    textTw: 'text-violet-600',
    icon: Sparkles,
    description: 'World building and creative thinking.',
    subSkills: [
        { name: 'Visualization', value: 95 },
        { name: 'Storytelling', value: 80 },
        { name: 'Wonder', value: 70 }
    ],
    weeklyData: [70, 75, 80, 60, 85, 90, 80],
    contributingStories: [
        {
            id: 301,
            title: "Cloud Castle",
            coverGradient: "from-sky-200 to-blue-300",
            date: "Yesterday",
            impact: "Leo used his imagination to picture a world where clouds are made of cotton candy.",
            liked: true
        }
    ]
  },
  { 
    id: 'gratitude', 
    name: 'Gratitude', 
    progress: 30, 
    color: '#EAB308', // Yellow 500
    bgTw: 'bg-yellow-50',
    textTw: 'text-yellow-600',
    icon: Sun,
    description: 'Appreciating the good things.',
    subSkills: [
        { name: 'Thankfulness', value: 40 },
        { name: 'Positivity', value: 30 },
        { name: 'Appreciation', value: 20 }
    ],
    weeklyData: [10, 15, 20, 25, 25, 30, 30],
    contributingStories: []
  },
  { 
    id: 'problem_solving', 
    name: 'Problem Solving', 
    progress: 55, 
    color: '#14B8A6', // Teal 500
    bgTw: 'bg-teal-50',
    textTw: 'text-teal-600',
    icon: Puzzle,
    description: 'Finding solutions to challenges.',
    subSkills: [
        { name: 'Logic', value: 60 },
        { name: 'Strategy', value: 50 },
        { name: 'Analysis', value: 55 }
    ],
    weeklyData: [40, 45, 50, 50, 55, 50, 55],
    contributingStories: [
         {
            id: 401,
            title: "Detective Duck",
            coverGradient: "from-yellow-200 to-orange-300",
            date: "Today",
            impact: "Leo successfully solved the mystery by connecting the clues about the missing breadcrumbs.",
            liked: true
        }
    ]
  },
  { 
    id: 'responsibility', 
    name: 'Responsibility', 
    progress: 20, 
    color: '#64748B', // Slate 500
    bgTw: 'bg-slate-50',
    textTw: 'text-slate-600',
    icon: ClipboardList,
    description: 'Taking ownership of actions.',
    subSkills: [
        { name: 'Duty', value: 20 },
        { name: 'Reliability', value: 30 },
        { name: 'Ownership', value: 10 }
    ],
    weeklyData: [10, 10, 15, 15, 20, 20, 20],
    contributingStories: []
  },
  { 
    id: 'patience', 
    name: 'Patience', 
    progress: 35, 
    color: '#10B981', // Emerald 500
    bgTw: 'bg-emerald-50',
    textTw: 'text-emerald-600',
    icon: Hourglass,
    description: 'Waiting calmly and self-control.',
    subSkills: [
        { name: 'Waiting', value: 40 },
        { name: 'Calmness', value: 35 },
        { name: 'Self-Control', value: 30 }
    ],
    weeklyData: [20, 25, 30, 30, 35, 35, 35],
    contributingStories: []
  },
  { 
    id: 'curiosity', 
    name: 'Curiosity', 
    progress: 88, 
    color: '#06B6D4', // Cyan 500
    bgTw: 'bg-cyan-50',
    textTw: 'text-cyan-600',
    icon: Search,
    description: 'Eagerness to learn and explore.',
    subSkills: [
        { name: 'Inquiry', value: 90 },
        { name: 'Exploration', value: 85 },
        { name: 'Discovery', value: 90 }
    ],
    weeklyData: [70, 75, 80, 85, 85, 90, 88],
    contributingStories: []
  },
];

// --- Sub-Components ---

// SVG Helper Functions
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
}

const MiniProgressRing = ({ progress, color, size = 52, stroke = 4 }: { progress: number, color: string, size?: number, stroke?: number }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth={stroke}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
        </div>
    );
};

// Merged Breakdown and Hero Card
const MasteryOverviewCard = ({ skill }: { skill: Skill }) => {
    const size = 200;
    const center = size / 2;
    const radius = 80;
    const strokeWidth = 14;
    const totalSegments = skill.subSkills.length;
    const gapAngle = 6; 
    const totalGap = gapAngle * totalSegments;
    const availableAngle = 360 - totalGap;
    const segmentAngle = availableAngle / totalSegments;

    return (
        <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col items-center">
             {/* Background Decoration */}
             <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${skill.color} to-transparent opacity-30`}></div>
             <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full ${skill.bgTw} opacity-40 blur-3xl pointer-events-none`}></div>

             <div className="relative z-10 flex flex-col items-center w-full mt-2">
                 
                 {/* Chart Area */}
                 <div className="relative mb-8" style={{ width: size, height: size }}>
                     <svg width={size} height={size}>
                         {skill.subSkills.map((sub, i) => {
                             const startAngle = i * (segmentAngle + gapAngle);
                             const endAngle = startAngle + segmentAngle;
                             const bgPath = describeArc(center, center, radius, startAngle, endAngle);
                             const filledAngle = startAngle + (segmentAngle * (sub.value / 100));
                             const progressPath = describeArc(center, center, radius, startAngle, filledAngle);

                             return (
                                 <g key={i}>
                                     <path d={bgPath} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} strokeLinecap="round" />
                                     <path d={progressPath} fill="none" stroke={skill.color} strokeWidth={strokeWidth} strokeLinecap="round" />
                                 </g>
                             )
                         })}
                     </svg>
                     
                     {/* Center Content: Mastery Total */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <skill.icon className={`w-5 h-5 mb-1.5 ${skill.textTw}`} />
                        <span className="text-4xl font-black text-slate-800 tracking-tight leading-none">{skill.progress}%</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mastery</span>
                     </div>
                 </div>

                 {/* Integrated Legend List */}
                 <div className="w-full grid gap-3">
                     {skill.subSkills.map((sub, i) => (
                         <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 transition-colors hover:bg-white hover:shadow-sm">
                             <div className="flex items-center gap-3">
                                 <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm text-[10px] font-bold text-slate-400 border border-slate-100">
                                    {i + 1}
                                 </div>
                                 <span className="text-sm font-bold text-slate-700">{sub.name}</span>
                             </div>
                             <div className="flex items-center gap-2.5">
                                <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${sub.value}%`, backgroundColor: skill.color }}></div>
                                </div>
                                <span className="text-xs font-bold text-slate-600 w-8 text-right">{sub.value}%</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    )
}

const ReadingStreakWidget = () => {
    const currentWeek = [
        { day: 'M', status: 'done', date: 14 },
        { day: 'T', status: 'done', date: 15 },
        { day: 'W', status: 'done', date: 16 },
        { day: 'T', status: 'missed', date: 17 },
        { day: 'F', status: 'today', date: 18 },
        { day: 'S', status: 'future', date: 19 },
        { day: 'S', status: 'future', date: 20 },
    ];

    return (
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-slate-400" />
                    <h3 className="font-bold text-slate-700 text-sm">Reading Consistency</h3>
                </div>
                <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100/50">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wide">3 Day Streak</span>
                </div>
            </div>
            
            <div className="flex justify-between items-center px-1">
                {currentWeek.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                         <span className="text-[10px] font-bold text-slate-300">{d.day}</span>
                         <div className={`
                            w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all
                            ${d.status === 'done' ? 'bg-slate-800 text-white' : ''}
                            ${d.status === 'today' ? 'bg-white ring-4 ring-indigo-50 text-indigo-700 shadow-sm scale-100' : ''}
                            ${d.status === 'missed' ? 'bg-slate-50 text-slate-300' : ''}
                            ${d.status === 'future' ? 'text-slate-200' : ''}
                        `}>
                            {d.date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const SkillRow: React.FC<{ skill: Skill; onClick: () => void }> = ({ skill, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="w-full group bg-white hover:bg-[#FAFAF9] rounded-[24px] p-5 mb-4 transition-all duration-300 ease-out shadow-[0_4px_20px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] flex items-center justify-between gap-5 border border-transparent hover:border-slate-100"
        >
            <div className="flex items-center gap-5 text-left flex-1 min-w-0">
                <div className={`w-12 h-12 shrink-0 rounded-2xl ${skill.bgTw} flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105`}>
                    <skill.icon className={`w-6 h-6 ${skill.textTw}`} strokeWidth={2} />
                </div>
                
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h4 className="text-base font-bold text-slate-800 leading-tight truncate">{skill.name}</h4>
                    <p className="text-xs font-medium text-slate-400 truncate">{skill.description}</p>
                </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                    <MiniProgressRing progress={skill.progress} color={skill.color} />
                    <span className="absolute text-[11px] font-bold text-slate-700">{skill.progress}%</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
            </div>
        </button>
    );
}

const DetailView = ({ skill, onBack }: { skill: Skill, onBack: () => void }) => {
    // Generate smooth curve for chart
    const maxVal = Math.max(...skill.weeklyData, 100);
    const width = 100;
    const height = 100;
    const padding = 5;
    
    // Create bezier path
    const points = skill.weeklyData.map((val, i) => {
        const x = (i / (skill.weeklyData.length - 1)) * (width);
        const y = height - (val / maxVal) * (height - padding * 2) - padding; 
        return {x, y};
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cp1x = prev.x + (curr.x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = prev.x + (curr.x - prev.x) / 2;
        const cp2y = curr.y;
        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return (
        <div className="bg-[#FAFAF9] min-h-screen pb-10 custom-animate-slide-in">
             {/* Sticky Header */}
             <div className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#FAFAF9]/95 backdrop-blur-md z-30 border-b border-slate-200/50">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-bold text-slate-800 text-lg">{skill.name}</span>
                <div className={`w-10 h-10 rounded-full ${skill.bgTw} flex items-center justify-center shadow-inner`}>
                    <skill.icon className={`w-5 h-5 ${skill.textTw}`} />
                </div>
            </div>

            <div className="px-6 pt-6 space-y-6">
                
                {/* MERGED MASTERY CARD */}
                <MasteryOverviewCard skill={skill} />

                {/* TREND CHART */}
                <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                             <h3 className="font-bold text-slate-800 text-sm">30 Day Trend</h3>
                             <p className="text-[10px] text-slate-400 font-medium">Consistent growth observed</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            <TrendingUp className="w-3 h-3" />
                            <span>+12%</span>
                        </div>
                    </div>
                    
                    <div className="h-32 w-full relative">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id={`gradient-${skill.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={skill.color} stopOpacity="0.2" />
                                    <stop offset="100%" stopColor={skill.color} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Horizontal Guides */}
                            <line x1="0" y1="25" x2="100" y2="25" stroke="#f8fafc" strokeWidth="1" />
                            <line x1="0" y1="50" x2="100" y2="50" stroke="#f8fafc" strokeWidth="1" />
                            <line x1="0" y1="75" x2="100" y2="75" stroke="#f8fafc" strokeWidth="1" />
                            
                            {/* Area Fill */}
                            <path d={`${pathD} L 100 100 L 0 100 Z`} fill={`url(#gradient-${skill.id})`} />
                            {/* Smooth Line */}
                            <path 
                                d={pathD} 
                                fill="none" 
                                stroke={skill.color} 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className="flex justify-between mt-4 px-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <span key={i} className="text-[10px] text-slate-300 font-bold">{d}</span>
                        ))}
                    </div>
                </div>

                {/* CONTRIBUTING STORIES (Contextual Data) */}
                <div className="pb-8">
                     <h3 className="font-bold text-slate-800 text-sm mb-4 px-1 uppercase tracking-wider opacity-60">Contributing Stories</h3>
                     <div className="space-y-4">
                        {skill.contributingStories.map((story) => (
                            <div key={story.id} className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_-12px_rgba(0,0,0,0.08)] border border-slate-50 flex gap-4">
                                <div className={`w-16 h-20 shrink-0 rounded-2xl bg-gradient-to-br ${story.coverGradient} flex items-center justify-center shadow-inner relative overflow-hidden`}>
                                     <div className="absolute inset-0 bg-black/5"></div>
                                     <BookOpen className="w-6 h-6 text-white drop-shadow-md" />
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm leading-tight mb-0.5">{story.title}</h4>
                                            <p className="text-[10px] text-slate-400 font-medium">{story.date}</p>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${story.liked ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'}`}>
                                            {story.liked ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3">
                                         <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                            {story.impact}
                                         </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {skill.contributingStories.length === 0 && (
                            <div className="text-center p-8 text-slate-400 text-sm">
                                No stories contributing to this skill yet.
                            </div>
                        )}
                     </div>
                </div>

            </div>
        </div>
    );
};

// --- Main Component ---

export const StatsView: React.FC = () => {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const selectedSkill = SKILLS_DATA.find(s => s.id === selectedSkillId);

  // Styles for animations and utilities
  const style = `
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideInRight {
        from { transform: translateX(20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes zoomIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    .custom-animate-fade-in {
        animation: fadeIn 0.5s ease-out;
    }
    .custom-animate-slide-in {
        animation: slideInRight 0.3s ease-out;
    }
    .custom-animate-zoom-in {
        animation: zoomIn 0.5s ease-out;
    }
  `;

  return (
    <>
    <style>{style}</style>
    {selectedSkill ? (
        <DetailView skill={selectedSkill} onBack={() => setSelectedSkillId(null)} />
    ) : (
    <div className="bg-[#FAFAF9] min-h-screen pb-10 font-sans custom-animate-fade-in text-slate-800">
        {/* Header */}
        <div className="px-6 pt-12 pb-8 bg-[#FAFAF9] sticky top-0 z-20 flex justify-between items-center bg-opacity-95 backdrop-blur-sm">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">Leo's Growth</h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Impact from 12 books read</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm">
                <span className="font-black text-xs text-slate-700 tracking-wider">LEO</span>
            </div>
        </div>

        <div className="px-6">
            
            {/* Widget */}
            <ReadingStreakWidget />

            {/* Metrics Grid */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-5 px-1">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Core Values & Skills</h3>
                </div>
                
                <div className="flex flex-col">
                    {SKILLS_DATA.map((skill) => (
                        <SkillRow 
                            key={skill.id} 
                            skill={skill} 
                            onClick={() => setSelectedSkillId(skill.id)} 
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
    )}
    </>
  );
}