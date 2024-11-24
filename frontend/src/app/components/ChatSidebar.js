import React, { useState } from 'react';
import { genFullConvo } from '../../utils/genConvos';
import { useAppContext } from '../../context/AppContext';

const ChatSidebar = ({ contacts, onContactSelect, selectedContactId }) => {
  const { bots, chatData, setChatData, userData } = useAppContext();
  const [loading, setLoading] = useState(false); // Loading state

  const handleConversation = async () => {
    setLoading(true);
    try {
      const promises = [];
      for (let id = 0; id < 8; id++) {
        console.log(`Starting conversation for botId: ${id}`);
        promises.push(
          genFullConvo(
            id,
            bots[id],
            chatData[id] || [], // Ensure chatData[id] is an array
            setChatData,
            userData
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

  // Helper to extract the latest message summary
  const getLastMessageSummary = (botId) => {
    const messages = chatData[botId] || [];
    if (messages.length === 0) return ''; // No messages for this bot
    const [text, sender] = messages[messages.length - 1];
    const senderName = sender === 'user' ? 'You' : bots[botId].name; // Map sender role
    return `${senderName}: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`; // Truncate message
  };

  return (
    <div className="w-1/3 border-r h-full overflow-y-auto bg-gray-50 text-black">
      <button
        onClick={handleConversation}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          position: 'absolute',
        }}
        disabled={loading}
      >
        Talk
      </button>

      <h2 className="text-xl font-bold p-4 border-b">Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li
            key={contact.id}
            onClick={() => onContactSelect(contact.id)}
            className={`flex flex-col items-start p-4 cursor-pointer ${
              selectedContactId === contact.id ? 'bg-blue-100 font-bold' : ''
            } hover:bg-blue-50`}
          >
            <div className="flex items-center w-full">
              <img
                src={`/pfp/${contact.profilePicture}`}
                alt={`${contact.name} profile`}
                className="w-14 h-14 rounded-full mr-4 object-cover"
              />
              <div className="flex-grow">
                <div>{contact.name}</div>
                <div className="text-sm text-gray-600">
                  {getLastMessageSummary(contact.id)}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
