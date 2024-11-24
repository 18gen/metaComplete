"use client";
import Sidebar from "../app/components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex-none w-60 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <MainContent />
      </div>

      {/* Right Side Section */}
      <div className="flex-none w-80 p-4 bg-white shadow-md">
        <RightSide />
      </div>
    </div>
  );
}

// MainContent Component
const MainContent = () => {
  return (
    <div className="p-4">
      {/* Stories Section */}
      <div className="flex overflow-x-scroll items-center space-x-4 mb-6 scrollbar-hide">
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-pink-500 overflow-hidden">
                <img
                  src="https://placehold.co/150"
                  alt="Story"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs mt-2 text-gray-600">User {index + 1}</p>
            </div>
          ))}
      </div>

      {/* Feed Section */}
      <div className="space-y-8">
        {/* Single Post */}
        <Post
          username="mit"
          avatar="https://via.placeholder.com/150"
          image="https://via.placeholder.com/200x400"
          caption="MIT to Offer Free Tuition To Families Earning Less Than $200,000"
        />
        {/* Add more posts */}
        <Post
          username="johndoe"
          avatar="https://via.placeholder.com/150"
          image="https://via.placeholder.com/600x400"
          caption="A beautiful sunset 🌅"
        />
      </div>
    </div>
  );
};

// RightSide Component
const RightSide = () => {
  return (
    <div>
      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <img
          src="https://via.placeholder.com/150"
          alt="User Profile"
          className="w-16 h-16 rounded-full"
        />
        <div className="ml-4">
          <p className="font-medium text-gray-800">dan1_the2_man3</p>
          <p className="text-sm text-gray-500">Danny</p>
        </div>
        <button className="ml-auto text-blue-500 font-medium">Switch</button>
      </div>

      {/* Suggestions Section */}
      <div className="mb-6">
        <p className="font-medium text-gray-500 mb-4">Suggested for you</p>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex items-center mb-4">
              <img
                src="https://via.placeholder.com/150"
                alt="Suggested Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">user_{index}</p>
                <p className="text-xs text-gray-500">Followed by other_user</p>
              </div>
              <button className="ml-auto text-blue-500 font-medium text-sm">
                Follow
              </button>
            </div>
          ))}
      </div>

      {/* Footer Section */}
      <div className="text-xs text-gray-400">
        <p>About · Help · Press · API · Jobs · Privacy · Terms · Locations</p>
        <p>Language · Meta Verified</p>
        <p className="mt-2">© 2024 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};

// Post Component with Fixed Dimensions
const Post = ({ username, avatar, image, caption }) => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden w-[500px] mx-auto">
      {/* Header */}
      <div className="flex items-center p-4">
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className="w-10 h-10 rounded-full"
        />
        <p className="ml-4 font-medium text-gray-800">{username}</p>
      </div>

      {/* Image with Fixed Dimensions */}
      <div className="w-full h-[600px] overflow-hidden">
        <img
          src={image}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Caption */}
      <div className="p-4">
        <p className="text-gray-800">
          <span className="font-medium">{username}</span> {caption}
        </p>
      </div>
    </div>
  );
};
