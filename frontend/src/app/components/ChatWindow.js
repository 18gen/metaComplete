'use client';
import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import InputBar from './InputBar';
import { useAppContext } from '../../context/AppContext';
import { genFullConvo } from '../../utils/genConvos';
import styles from './ChatWindow.module.css';
import { FaSyncAlt } from 'react-icons/fa'; // Import the refresh icon

const ChatWindow = ({ selectedContactId, onSendMessage }) => {
  const {
    bots,
    chatData,
    setChatData,
    userData,
    compatibilityScores,
    setCompatibilityScores,
    read,
    setRead,
  } = useAppContext(); // Access bots, chat data, and user data from context

  const [loading, setLoading] = useState(false); // Loading state
  const [suggestion, setSuggestion] = useState(null); // Single suggestion state
  const [refreshing, setRefreshing] = useState(false); // Refresh button loading state
  const [showSuggestions, setShowSuggestions] = useState(true); // Visibility state for suggestion section

  // Retrieve messages for the selected bot
  const messages =
    selectedContactId !== null && chatData[selectedContactId]
      ? chatData[selectedContactId]
      : [];

  // Determine the turn based on the length of the messages array
  const isUserTurn = messages.length % 2 === 1;

  const handleConversation = async () => {
    setLoading(true);
    try {
      await genFullConvo(
        selectedContactId,
        bots[selectedContactId],
        chatData[selectedContactId],
        setChatData,
        userData,
        setCompatibilityScores // Pass setCompatibilityScores
      );
    } catch (error) {
      console.error('Error generating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single suggestion
  const fetchSuggestion = async () => {
    if (!selectedContactId || messages.length === 0 || !showSuggestions) return;

    const personOne = userData; // Assuming `userData` holds personOne's details
    const personTwo = bots[selectedContactId]; // Bot as personTwo
    const messageHistory = messages.map(([text, sender]) => ({
      role: sender,
      content: text,
    }));

    try {
      setRefreshing(true); // Show refreshing state
      const response = await fetch('http://localhost:3001/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personOne, personTwo, messageHistory }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestion(data.suggestions[0]); // Set the first suggestion
      } else {
        console.error('Failed to fetch suggestions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setRefreshing(false); // Hide refreshing state
    }
  };

  // Initial fetch of suggestion when messages change
  useEffect(() => {
    fetchSuggestion();
  }, [messages, selectedContactId, userData, bots]);

  // Handle suggestion button click
  const handleSuggestionClick = (suggestionContent) => {
    if (onSendMessage) {
      onSendMessage(suggestionContent);
    }
    setShowSuggestions(false); // Hide the suggestion section permanently
  };

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
        {loading && (
          <div
            className={`${styles.typingBubble} ${
              isUserTurn ? styles.typingBubbleRight : styles.typingBubbleLeft
            }`}
          >
            <div
              className={`${styles.bubble} ${
                isUserTurn ? styles.bubbleRight : styles.bubbleLeft
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <InputBar onSendMessage={onSendMessage} />

      {/* Suggestions Section */}
      {showSuggestions && suggestion && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold flex items-center">
              Suggestions
              {/* Refresh Button Next to the Title */}
              <button
                onClick={fetchSuggestion}
                disabled={refreshing}
                className="ml-2 text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-100 ease-linear"
                aria-label="Refresh Suggestions"
                title="Refresh Suggestions" // Tooltip on hover
              >
                {refreshing ? (
                  <FaSyncAlt className="animate-spin" />
                ) : (
                  <FaSyncAlt />
                )}
              </button>
            </h3>
          </div>
          <button
            className="w-full text-left px-4 py-2 bg-white border rounded shadow hover:bg-blue-50 transition"
            onClick={() => handleSuggestionClick(suggestion.content)}
          >
            {suggestion.content}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
