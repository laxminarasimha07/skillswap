import React from 'react';

const SkillBadge = ({ skill }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F9F9F9] border border-[#E5E5E5] text-[#111111]">
    {skill}
  </span>
);

export default SkillBadge;
