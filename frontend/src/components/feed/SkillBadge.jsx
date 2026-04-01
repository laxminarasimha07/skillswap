import React from 'react';

const SkillBadge = ({ skill, type = 'offer' }) => {
  const isOffer = type === 'offer';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide border ${
      isOffer
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
    }`}>
      {skill}
    </span>
  );
};

export default SkillBadge;
