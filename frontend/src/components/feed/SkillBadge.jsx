import React from 'react';

const SkillBadge = ({ skill, type = 'offered' }) => {
  const styles = {
    offered: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    wanted: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {skill}
    </span>
  );
};

export default SkillBadge;
