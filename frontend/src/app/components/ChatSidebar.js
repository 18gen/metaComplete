import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const ChatSidebar = ({ contacts, onContactSelect, selectedContactId }) => {
  const { bots, chatData, read, setRead, compatibilityScores } = useAppContext();
  const [sortedContacts, setSortedContacts] = useState(contacts);

  // Helper to extract the latest message summary
  const getLastMessageSummary = (botId) => {
    const messages = chatData[botId] || [];
    if (messages.length === 0) return ''; // No messages for this bot
    const [text, sender] = messages[messages.length - 1];
    const senderName = sender === 'user' ? 'You:' : ''; // Map sender role
    return `${senderName} ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`; // Truncate message
  };

  // Determine if a contact has unread messages
  const isUnread = (botId) => {
    const messages = chatData[botId] || [];
    if (botId === selectedContactId) {
      // If the contact is open, no unread status
      return false;
    }
    return read[botId] < messages.length; // Compare read count to total messages
  };

  const handleContactClick = (id) => {
    const messages = chatData[id] || [];
    // Mark all messages in this chat as read
    setRead((prev) => {
      const updated = [...prev];
      updated[id] = messages.length; // Set read count to total messages
      return updated;
    });

    // Trigger contact selection
    onContactSelect(id);
  };

  // Automatically sync the read count for the currently open contact
  useEffect(() => {
    if (selectedContactId !== null) {
      const messages = chatData[selectedContactId] || [];
      setRead((prev) => {
        const updated = [...prev];
        updated[selectedContactId] = messages.length; // Sync read count to message count
        return updated;
      });
    }
  }, [selectedContactId, chatData, setRead]);

  // Sort contacts dynamically whenever compatibilityScores change
  useEffect(() => {
    const sorted = [...contacts].sort((a, b) => {
      const scoreA = compatibilityScores[a.id] || 0;
      const scoreB = compatibilityScores[b.id] || 0;
      return scoreB - scoreA; // Descending order
    });
    setSortedContacts(sorted);
  }, [compatibilityScores, contacts]);

  // Identify the bottom 4 scores
  const bottomScores = [...compatibilityScores]
    .filter((score) => score !== null) // Remove null scores
    .sort((a, b) => a - b) // Ascending order
    .slice(0, 4); // Take the bottom 4 scores

  return (
    <div className="w-1/3 h-full overflow-hidden bg-gray-50 text-black">
      {/* Fixed Header */}
      <div className="text-xl font-bold p-4 border-b bg-gray-50 sticky top-0 z-10">
        Contacts
      </div>

      {/* Scrollable Contacts List */}
      <ul className="overflow-y-auto h-full">
        <AnimatePresence>
          {sortedContacts.map((contact) => {
            const botId = contact.id;
            const messages = chatData[botId] || [];
            const hasReachedMessageLimit = messages.length >= 10;
            const compatibilityScore = compatibilityScores[botId];
            const isBottomScore = bottomScores.includes(compatibilityScore);

            return (
              <motion.li
                key={botId}
                onClick={() => handleContactClick(botId)}
                className={`flex flex-col items-start p-4 cursor-pointer ${
                  selectedContactId === botId ? 'bg-blue-100' : ''
                } hover:bg-blue-50`}
                initial={{ opacity: 0, x: -50 }}
                animate={{
                  opacity: 1,
                  x: selectedContactId === botId ? 10 : 0,
                }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                layout // Automatically animates layout changes
              >
                <div className="flex items-center w-full">
                  <motion.img
                    src={`/pfp/${contact.profilePicture}`}
                    alt={`${contact.name} profile`}
                    className="w-14 h-14 rounded-full mr-4 object-cover"
                    animate={
                      selectedContactId === botId
                        ? { scale: 1.2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }
                        : { scale: 1, boxShadow: 'none' }
                    }
                    transition={{ type: 'spring', stiffness: 200 }}
                  />
                  <div className="flex-grow">
                    {/* Contact Name */}
                    <div
                      className={`${
                        isUnread(botId) ? 'font-bold' : ''
                      }`} // Bold if unread
                    >
                      {contact.name}
                    </div>

                    {/* Message Preview */}
                    <div
                      className={`text-sm ${
                        isUnread(botId) ? 'font-bold text-gray-900' : 'text-gray-600'
                      }`} // Bold if unread
                    >
                      {getLastMessageSummary(botId)}
                    </div>
                  </div>

                  {/* Status/Score Indicator */}
                  <motion.div
                    className={`ml-2 flex items-center justify-center ${
                      isBottomScore ? 'text-yellow-400' : 'text-green-500'
                    }`}
                    animate={{
                      scale: compatibilityScore !== 0 ? 1 : 0.8,
                      opacity: 1,
                    }}
                    transition={{
                      repeat: compatibilityScore === 0 && hasReachedMessageLimit ? Infinity : 0,
                      repeatType: 'mirror',
                      duration: 1,
                    }}
                  >
                    {compatibilityScore !== 0 ? (
                      <motion.div
                        className="text-lg font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        {compatibilityScore}
                      </motion.div>
                    ) : hasReachedMessageLimit ? (
                      <motion.div
                        className="w-4 h-4 bg-green-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      />
                    ) : (
                      <motion.div
                        className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      />
                    )}
                  </motion.div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default ChatSidebar;
