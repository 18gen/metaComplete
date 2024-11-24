import React from 'react';

const ChatSidebar = ({ contacts, onContactSelect, selectedContactId }) => {
    return (
      <div className="w-1/3 border-r h-full overflow-y-auto bg-gray-50 text-black">
        <h2 className="text-xl font-bold p-4 border-b">Contacts</h2>
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => onContactSelect(contact.id)}
              className={`flex items-center p-4 cursor-pointer ${
                selectedContactId === contact.id ? 'bg-blue-100 font-bold' : ''
              } hover:bg-blue-50`}
            >
              <img
                src={`/pfp/${contact.profilePicture}`}
                alt={`${contact.name} profile`}
                className="w-14 h-14 rounded-full mr-4 object-cover"
              />
              {contact.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ChatSidebar;
