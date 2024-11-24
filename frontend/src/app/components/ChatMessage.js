import React from 'react';

const ChatMessage = ({ sender, text, position }) => {
  const isUser = sender === 'user';

  // Determine the border-radius based on position
  const borderRadiusClass = {
    single: 'rounded-3xl', // Fully rounded for a single message
    first: `${isUser ? 'rounded-t-3xl rounded-bl-3xl rounded-br-md' : 'rounded-t-3xl rounded-br-3xl rounded-bl-md'}`,
    middle: `${isUser ? 'rounded-l-3xl rounded-r-md' : 'rounded-r-3xl rounded-l-md'}`,
    last: `${isUser ? 'rounded-b-3xl rounded-tl-3xl rounded-tr-md' : 'rounded-b-3xl rounded-tr-3xl rounded-tl-md'}`,
  }[position];

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-0.5`}>
      <div
        className={`px-3 py-1.5 text-sm max-w-sm font-medium overflow-hidden break-words ${borderRadiusClass} ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-black'
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;
