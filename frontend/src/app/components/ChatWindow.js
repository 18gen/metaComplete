'use client';
import React from 'react';
import ChatMessage from './ChatMessage';
import InputBar from './InputBar';
import { useAppContext } from '../../context/AppContext';
import styles from './ChatWindow.module.css';

const ChatWindow = ({ selectedContactId, onSendMessage, isLoading }) => { // Accept isLoading as a prop
  const { bots, chatData } = useAppContext(); // Access bots and chat data from context

  // Retrieve messages for the selected bot
  const messages = selectedContactId !== null && chatData[selectedContactId] ? chatData[selectedContactId] : [];

  // Determine the turn based on the length of the messages array
  const isUserTurn = messages.length % 2 === 1;

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

        {/* Typing Bubble */}
        {isLoading && ( // Use the isLoading prop instead of local state
          <div
            className={`${styles.typingBubble} ${
              isUserTurn ? styles.typingBubbleRight : styles.typingBubbleLeft
            }`}
          >
            <div className={`${styles.bubble} ${isUserTurn ? styles.bubbleRight : styles.bubbleLeft}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <InputBar onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
