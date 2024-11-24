"use client";
import Image from "next/image";
import userLogo from "../../../public/instagramPage/userLogo.jpg";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../../context/AppContext"; 

const ProfilePage = () => {
  const { userData, setUserData } = useAppContext(); // Access userData and setUserData
  
  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState("");
  const [tempLink, setTempLink] = useState("");

  // Handler for general input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value, // Update the corresponding field in userData
    }));
  };

  // Handler for personality-related input changes
  const handlePersonalityChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      personality: {
        ...prevData.personality,
        [name]: value, // Update the corresponding personality field
      },
    }));
  };

  // Modal control functions
  const openModal = (platform) => {
    setCurrentPlatform(platform);
    setTempLink(userData[platform] || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPlatform("");
    setTempLink("");
  };

  const saveLink = () => {
    setUserData((prevData) => ({
      ...prevData,
      [currentPlatform]: tempLink,
    }));
    closeModal();
  };

  const socialPlatforms = ["twitter", "instagram", "linkedin", "facebook"];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="flex-none w-60">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-grow p-20">
        {/* User Info Section */}
        <div className="flex items-center mb-8">
          <Image
            src={userLogo}
            alt="User Logo"
            width={150}
            height={150}
            className="rounded-full border border-gray-300 mx-10"
          />
          <div>
            {/* Name Input */}
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="border-gray-300 text-2xl font-bold rounded-md pl-2 p-1 mb-4 focus:outline-black"
            />

            {/* Social Platforms */}
            <div className="flex space-x-4">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => openModal(platform)}
                  className={`flex flex-col items-center p-4 border rounded-md 
                    ${userData[platform] ? "bg-green-100 border-green-500" : "bg-gray-100 border-gray-300"}
                    hover:bg-gray-200 transition`}
                >
                  <img
                    src={`/instagramPage/${platform}.svg`}
                    alt={`${platform} icon`}
                    className="w-6 h-6 mb-2"
                  />
                  <span className="capitalize text-sm">
                    {platform}
                    {userData[platform] && (
                      <span className="text-green-500 mt-1"> &#10003;</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Personality Section */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold mt-1 mb-4">Personality</h2>
          {Object.keys(userData.personality).map((key) => (
            <div key={key} className="mb-4">
              <label
                htmlFor={key}
                className="block pl-1 text-gray-700 font-medium mb-1 capitalize"
              >
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={userData.personality[key]}
                onChange={handlePersonalityChange}
                placeholder={`Enter your ${key}`}
                className="w-full border-gray-300 border rounded-md p-2 focus:outline-black"
              />
            </div>
          ))}

          {/* Additional Information Section */}
          <h2 className="text-xl font-bold mt-6 mb-4">Additional Information</h2>
          {["hobbies", "job", "interests"].map((field) => (
            <div key={field} className="mb-4">
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-2 capitalize"
              >
                {field}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={userData[field]}
                onChange={handleInputChange}
                placeholder={`Enter your ${field}`}
                className="w-full border-gray-300 border rounded-md p-2 focus:outline-black"
              />
            </div>
          ))}
        </div>
      </main>

      {/* Modal for Social Links */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Enter your {currentPlatform.charAt(0).toUpperCase() + currentPlatform.slice(1)} Link
            </h3>
            <input
              type="text"
              value={tempLink}
              onChange={(e) => setTempLink(e.target.value)}
              placeholder={`https://www.${currentPlatform}.com/yourprofile`}
              className="w-full border-gray-300 border rounded-md p-2 mb-4 focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveLink}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
