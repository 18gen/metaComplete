"use client";
import Image from "next/image";
import { userLogo } from "../../../public/instagramPage";
import { useState } from "react";
import Sidebar from "../components/instagram/Sidebar";
import { useAppContext } from "../../context/AppContext"; 

const ProfilePage = () => {
    const { userData, setUserData } = useAppContext(); // Access userData and setUserData
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUserData((prevData) => ({
        ...prevData,
        [name]: value, // Update the corresponding field in userData
      }));
    };
  
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
  
    return (
      <div className="flex min-h-screen">
        <div className="flex-none w-60">
          <Sidebar />
        </div>
        <main className="flex-grow p-20">
          <div className="flex items-center mb-8">
            <Image
              src={userLogo}
              alt="User Logo"
              width={150}
              height={150}
              className="rounded-full border border-gray-300 mx-10"
            />
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="border-gray-300 text-2xl font-bold rounded-md p-2 mb-4 focus:outline-black"
            />
          </div>
  
          <div className="bg-white shadow-md rounded-md p-6">
            
  
            <h2 className="text-xl font-bold mt-6 mb-4">Personality</h2>
            {Object.keys(userData.personality).map((key) => (
              <div key={key} className="mb-4">
                <label
                  htmlFor={key}
                  className="block text-gray-700 font-medium mb-2 capitalize"
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
                  className="w-full border-gray-300 border rounded-md p-3 focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>
            ))}
  
            <h2 className="text-xl font-bold mt-6 mb-4">Social Links</h2>
            {["twitter", "instagram", "linkedin", "facebook"].map((platform) => (
              <div key={platform} className="mb-4">
                <label
                  htmlFor={platform}
                  className="block text-gray-700 font-medium mb-2 capitalize"
                >
                  {platform}
                </label>
                <input
                  type="text"
                  id={platform}
                  name={platform}
                  value={userData[platform]}
                  onChange={handleInputChange}
                  placeholder={`Enter your ${platform} link`}
                  className="w-full border-gray-300 border rounded-md p-3 focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>
            ))}
  
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
                  className="w-full border-gray-300 border rounded-md p-3 focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  };
  
  export default ProfilePage;