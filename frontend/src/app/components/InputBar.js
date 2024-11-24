import React, { useState, useRef, useEffect } from 'react';
import Picker from 'emoji-picker-react'; // Import the emoji picker library

const InputBar = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null); // Reference to the input field
  const emojiPickerRef = useRef(null); // Reference to the emoji picker
  const toggleButtonRef = useRef(null); // Reference to the emoji toggle button

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message); // Call the parent function to handle the message
      setMessage(''); // Clear the input field
      setShowEmojiPicker(false); // Optionally close the emoji picker after sending
    }
  };

  const handleEmojiClick = (emojiObject, event) => {
    const emoji = emojiObject.emoji;
    setMessage((prevMessage) => prevMessage + emoji); // Append emoji to message
    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="relative p-4 flex items-center">
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-16 left-4 z-10"
        >
          <Picker
            onEmojiClick={handleEmojiClick}
            pickerStyle={{ width: '300px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            disableAutoFocus={true}
            native={true}
          />
        </div>
      )}

      {/* Input Field Container */}
      <div className="flex-grow px-4 py-2 border rounded-3xl bg-white flex items-center">
        {/* Emoji Picker Toggle Button */}
        <button
          ref={toggleButtonRef}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="mr-2 flex items-center justify-center text-3xl focus:outline-none"
          aria-label="Choose an emoji"
        >
          <img
            src={`/smileIcon.png`}
            alt="smile"
            className="w-5 h-5 object-cover"
          />
        </button>
        <input
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend(); // Send message on pressing Enter
            }
          }}
          className="flex-grow bg-transparent focus:outline-none text-gray-700"
          ref={inputRef} // Attach the ref to the input
        />
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
};

export default InputBar;
