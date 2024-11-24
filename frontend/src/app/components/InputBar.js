import React, { useState } from 'react';

const InputBar = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message); // Call the parent function to handle the message
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div className="p-4 border-t bg-gray-50 flex items-center">
      <input
        type="text"
        className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSend(); // Send message on pressing Enter
          }
        }}
      />
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export default InputBar;
