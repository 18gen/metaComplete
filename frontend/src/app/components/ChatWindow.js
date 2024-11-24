'use client';
import React from 'react';
import ChatMessage from './ChatMessage';
import InputBar from './InputBar';
import { useAppContext } from '../../context/AppContext';

const ChatWindow = ({ selectedContactId, onSendMessage }) => {
  const { chatData } = useAppContext();
    console.log(chatData)
  // Ensure messages fallback to an empty array if selectedContactId is invalid
  const messages = selectedContactId !== null && chatData[selectedContactId] ? chatData[selectedContactId] : [];
  console.log(selectedContactId)  
  console.log(messages)

  return (
    <div className="w-2/3 flex flex-col h-full">
      {/* Messages Section */}
      <div className="flex-grow overflow-y-auto p-4 bg-white">
        {messages.map(([text, sender], index) => (
          <ChatMessage key={index} sender={sender} text={text} />
        ))}
      </div>

      {/* Input Section */}
      <InputBar onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
