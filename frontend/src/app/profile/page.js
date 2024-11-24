// profile/page.js
'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../../context/AppContext"; 

const ProfilePage = () => {
  const { userData, setUserData } = useAppContext(); // Access userData and setUserData

  // Local state for the form
  const [formData, setFormData] = useState(userData);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState("");
  const [tempLink, setTempLink] = useState("");

  // State for Loading and Notification
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Update formData when userData changes (e.g., on initial load)
  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  // Determine if there are changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(userData);

  // Function to save all user data to localStorage and context
  const saveAllData = async () => {
    if (!hasChanges) return;

    setIsLoading(true);
    try {
      // Simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      localStorage.setItem('userData', JSON.stringify(formData));
      setUserData(formData);
      
      // Show notification
      setShowNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Modal control functions
  const openModal = (platform) => {
    setCurrentPlatform(platform);
    setTempLink(formData[platform] || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPlatform("");
    setTempLink("");
  };

  const saveLink = () => {
    setFormData((prevData) => ({
      ...prevData,
      [currentPlatform]: tempLink,
    }));
    closeModal();
  };

  const socialPlatforms = ["twitter", "instagram", "linkedin", "facebook"];
  const personalityOptions = {
    energyStyle: ["Introverted", "Extraverted"],
    cognitiveStyle: ["Intuitive", "Sensor"],
    valuesStyle: ["Thinker", "Feeler"],
    lifeStyle: ["Judger", "Perceiver"],
  };

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
            src={`/instagramPage/userLogo.jpg`}
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
              name="name" // Ensure name matches the state property
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    ${formData[platform] ? "bg-green-100 border-green-500" : "bg-gray-100 border-gray-300"}
                    hover:bg-gray-200 transition`}
                >
                  <img
                    src={`/instagramPage/${platform}.svg`}
                    alt={`${platform} icon`}
                    className="w-6 h-6 mb-2"
                  />
                  <span className="capitalize text-sm">
                    {platform}
                    {formData[platform] && (
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

          {/* Summary Input */}
          <div className="mb-6">
            <label
              htmlFor="summary"
              className="block text-gray-700 font-medium mb-2"
            >
              Summary
            </label>
            <input
              type="text"
              id="summary"
              name="summary" // Matches personality.summary
              value={formData.personality.summary}
              onChange={(e) => setFormData({
                ...formData,
                personality: {
                  ...formData.personality,
                  summary: e.target.value,
                },
              })}
              placeholder="Enter your summary"
              className="w-full border-gray-300 border rounded-md p-2 focus:outline-black"
            />
          </div>

          {/* Radio Button Groups */}
          {Object.keys(personalityOptions).map((key) => (
            <div key={key} className="flex items-center mb-4">
              {/* Style Label */}
              <div className="w-40">
                <label
                  htmlFor={key}
                  className="block text-gray-700 font-medium capitalize"
                >
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              </div>

              {/* Radio Buttons */}
              <div className="flex space-x-4">
                {personalityOptions[key].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name={key} // Matches personality.[key]
                      value={option}
                      checked={formData.personality[key] === option}
                      onChange={(e) => setFormData({
                        ...formData,
                        personality: {
                          ...formData.personality,
                          [key]: e.target.value,
                        },
                      })}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
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
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                placeholder={`Enter your ${field}`}
                className="w-full border-gray-300 border rounded-md p-2 focus:outline-black"
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="mt-6 flex font-bold justify-end">
            <button
              onClick={saveAllData}
              disabled={!hasChanges || isLoading}
              aria-label={isLoading ? "Saving profile" : "Submit profile"}
              className={`relative py-2.5 text-sm rounded-md flex items-center justify-center 
                w-48
                ${
                  hasChanges
                    ? "bg-[#0095f6] hover:bg-[#1a77f2] text-white"
                    : "bg-[#c0dffd] text-gray-100 cursor-not-allowed"
                } transition duration-200`}
            >
              {/* Submit Text */}
              <span
                className={`transition-opacity duration-200 ${isLoading ? 'opacity-0 absolute' : 'opacity-100'}`}
              >
                Submit
              </span>
              
              {/* Loading Spinner */}
              <svg
                className={`animate-spin h-5 w-5 text-white transition-opacity duration-200 ${isLoading ? 'opacity-100' : 'opacity-0 absolute'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </button>
          </div>
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

      {/* Notification Pop-Up */}
      {showNotification && (
        <div className="fixed w-full bottom-0 bg-gray-900 text-white px-4 py-4 rounded-t-md shadow-lg animate-slide-in">
          Profile saved successfully!
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
