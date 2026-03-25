import React from 'react';
import { Paperclip } from 'lucide-react';

const FileMessage = ({ fileUrl }) => {
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <Paperclip className="h-5 w-5 mr-2 text-gray-500" />
      <span className="text-sm font-medium text-gray-800">Attached File</span>
    </a>
  );
};

export default FileMessage;
