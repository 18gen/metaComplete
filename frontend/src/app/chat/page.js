'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext'; // Import the custom hook
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import { genFullConvo } from '../../utils/genConvos'; // Import the function

const Home = () => {
  const { bots, chatData, setChatData, userData, compatibilityScores, setCompatibilityScores, read, setRead  } = useAppContext(); // Access bots, chat data, and user data from context
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to generate conversations for all bots
  const handleConversation = async () => {
    setLoading(true);
    try {
      const promises = [];
      for (let id = 0; id < bots.length; id++) {
        console.log(`Starting conversation for botId: ${id}`);
        promises.push(
          genFullConvo(
            id,
            bots[id],
            chatData[id] || [], // Ensure chatData[id] is an array
            setChatData,
            userData,
            setCompatibilityScores, // Pass setCompatibilityScores
            compatibilityScores // Pass compatibilityScores
          )
        );
      }
      await Promise.all(promises); // Wait for all conversations to complete
      console.log('Completed conversations for all bots.');
    } catch (error) {
      console.error('Error generating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run the handleConversation function when the page loads
  useEffect(() => {
    handleConversation();
  }, []); // Empty dependency array ensures this runs only once on page load

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
          isLoading={loading}
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
