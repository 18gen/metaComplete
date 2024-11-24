import React from 'react';

const ChatMessage = ({ sender, text }) => {
  const isUser = sender === 'user'; // Determine if the message is from the user
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`p-3 rounded-lg max-w-xs ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;
