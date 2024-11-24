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
        {messages.map(([text, sender], index) => {
          const prevSender = index > 0 ? messages[index - 1][1] : null;
          const nextSender = index < messages.length - 1 ? messages[index + 1][1] : null;

          // Determine the position of the message
          let position = 'single';
          if (prevSender !== sender && nextSender === sender) {
            position = 'first';
          } else if (prevSender === sender && nextSender === sender) {
            position = 'middle';
          } else if (prevSender === sender && nextSender !== sender) {
            position = 'last';
          }

          return (
            <ChatMessage
              key={index}
              sender={sender}
              text={text}
              position={position} // Pass the position to the ChatMessage component
            />
          );
        })}
      </div>

      {/* Input Section */}
      <InputBar onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
