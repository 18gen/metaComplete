'use client';

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext'; // Import the custom hook
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';

const Home = () => {
  const { bots, chatData, setChatData } = useAppContext(); // Access bots and chat data from context
  const [selectedContactId, setSelectedContactId] = useState(null);

  const handleContactSelect = (id) => {
    setSelectedContactId(id);
  };

  const handleSendMessage = (message) => {
    if (selectedContactId !== null) {
      setChatData((prevChatData) => {
        const updatedChatData = [...prevChatData];
        updatedChatData[selectedContactId] = [
          ...updatedChatData[selectedContactId],
          [message, 'user'], // Add the new message as a tuple
        ];
        return updatedChatData;
      });
    }
  };
  return (
    <div className="flex h-screen">
      <ChatSidebar
        contacts={bots.map((bot, index) => ({ id: index.toString(), ...bot }))}
        onContactSelect={handleContactSelect}
        selectedContactId={selectedContactId}
      />
      {selectedContactId !== null ? (
        <ChatWindow
          selectedContactId={selectedContactId} // Pass the selected contact ID
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="w-2/3 flex items-center justify-center bg-gray-100">
          <p className="text-lg">Select a contact to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default Home;
