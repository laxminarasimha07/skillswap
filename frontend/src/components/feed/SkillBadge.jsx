import React from 'react';

const SkillBadge = ({ skill, type = 'offered' }) => {
  const styles = {
    offered: 'bg-emerald-500/8 text-emerald-400 ring-1 ring-emerald-500/20',
    wanted:  'bg-violet-500/8 text-violet-400 ring-1 ring-violet-500/20',
    neutral: 'bg-slate-800 text-slate-400 ring-1 ring-slate-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[type] || styles.neutral}`}>
      {skill}
    </span>
  );
};

export default SkillBadge;
