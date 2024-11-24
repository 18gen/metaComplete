"use client";
import Sidebar from "./components/Sidebar";
import { useAppContext } from "../context/AppContext"; 

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
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

      {/* Custom CSS for scrollbar-hide */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}

const stories = [
  { user_name: "Ri", image: "/member/ri.jpeg" },
  { user_name: "Danny", image: "/member/danny.jpg" },
  { user_name: "Gen", image: "/member/gen.jpg" },
  { user_name: "James", image: "/member/james_2.jpeg" },
  { user_name: "Albert", image: "/pfp/albert_einstein.png" },
  { user_name: "Marie", image: "/pfp/marie_curie.png" },
  { user_name: "Oprah", image: "/pfp/oprah_winfrey.png" },
  { user_name: "Serena", image: "/pfp/serena_williams.png" },
];

const posts = [
  {
    user_name: "Gen",
    avatar: "/member/gen.jpg",
    image: "/post/allnighter.jpg",
    caption: "all nighters!! #MetaLlamaHacks #SheratonHotel",
  },
  {
    user_name: "Danny",
    avatar: "/member/danny.jpg",
    image: "/post/idea.jpg",
    caption: "We're brainstorming...🧠",
  },
];

const suggestions = [
  { user_name: "Ada", image: "/pfp/ada_lovelace.png" },
  { user_name: "Frida", image: "/pfp/frida_kahlo.png" },
  { user_name: "Leonardo", image: "/pfp/leonardo_da_vinci.png" },
  { user_name: "Stephen", image: "/pfp/stephen_hawking.png" }
]

// MainContent Component
const MainContent = () => {
  return (
    <div className="p-4 overflow-y-auto">
      {/* Stories Section */}
      <div className="relative">

        {/* Stories Section */}
        <div className="relative items-center">
          <div
            id="stories-container"
            className="px-10 flex flex-nowrap overflow-x-auto scroll-smooth scrollbar-hide items-center space-x-4 mb-6"
          >
            {stories.map((story, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-shrink-0"
              >
                <div className="relative w-16 h-16">
                  {/* Gradient Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                    {/* White Ring */}
                    <div className="bg-white rounded-full w-full h-full p-[2px]">
                      {/* Story Image */}
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={story.image}
                          alt={`${story.user_name}'s Story`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs mt-2 text-gray-600 truncate w-16 text-center">{story.user_name}</p>
              </div>
            ))}
          </div>
          </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-8">
        {posts.map((post, index) => (
          <Post
            key={index}
            username={post.user_name}
            avatar={post.avatar}
            image={post.image}
            caption={post.caption}
          />
        ))}
      </div>
    </div>
  );
};

// RightSide Component
const RightSide = () => {
  const { userData } = useAppContext();
  return (
    <div>
      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <img
          src="/instagramPage/userLogo.jpg"
          alt="User Profile"
          className="w-16 h-16 rounded-full"
        />
        <div className="ml-4">
          <p className="font-medium text-gray-800">meta_connect</p>
          <p className="text-sm text-gray-500">{userData.name}</p>
        </div>
        <button className="ml-auto text-blue-500 text-sm font-semibold">Switch</button>
      </div>

      {/* Suggestions Section */}
      <div className="mb-6">
        <p className="font-medium text-gray-500 mb-4">Suggested for you</p>
        {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center mb-4">
              <img
                src={suggestion.image}
                alt={suggestion.user_name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">user_{index}</p>
                <p className="text-xs text-gray-500">Followed by other_user</p>
              </div>
              <button className="ml-auto text-blue-500 text-sm font-semibold">
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
    <div className="bg-white shadow-md rounded-md overflow-hidden w-full max-w-[500px] mx-auto">
      {/* Header */}
      <div className="flex items-center p-2">
        {/* Avatar with Gradient Ring */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] rounded-full">
            <div className="bg-white rounded-full w-full h-full p-[2px]">
              <img
                src={avatar}
                alt={`${username}'s avatar`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        {/* Username */}
        <p className="ml-4 font-bold text-gray-800">{username}</p>
      </div>

      {/* Image with Fixed Dimensions */}
      <div className="w-full h-[600px] overflow-hidden">
        <img src={image} alt="Post" className="w-full h-full object-cover" />
      </div>

      {/* Caption */}
      <div className="p-4">
        <p className="text-gray-800">{caption}</p>
      </div>
    </div>
  );
};


const scrollStories = (direction) => {
  const container = document.getElementById("stories-container");
  const scrollAmount = 200; // Adjust scroll amount as needed

  if (direction === "left") {
    container.scrollLeft -= scrollAmount;
  } else if (direction === "right") {
    container.scrollLeft += scrollAmount;
  }
};
