import React from 'react';
import { twMerge } from 'tailwind-merge';

const SkillBadge = ({ skill, type = 'offered', className }) => {
  const variants = {
    offered: 'bg-green-50 text-green-700 border-green-100',
    wanted: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };

  return (
    <span
      className={twMerge(
        'px-3 py-1 rounded-full text-sm font-medium border',
        variants[type],
        className
      )}
    >
      {skill}
    </span>
  );
};

export default SkillBadge;
