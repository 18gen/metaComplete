import Image from "next/image";
import { instagram } from "../../../public/instagramPage";
const Sidebar = () => {
  const topLinks = [
    "Home", "Search", "Explore", "Reels", "Messages", "Notifications",
    "Create", "Profile"
  ];

  const bottomLinks = [
    "Threat", "More"
  ];

  return (
    <aside className="lg:flex flex-col fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 p-6">
        <Image src={instagram} alt="Logo" className="mb-5" width={100} height={40} />
        <nav className="flex flex-col mb-auto">
            {topLinks.map((link, index) => (
            <a
                key={index}
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
            >
                <span>{link}</span>
            </a>
            ))}
        </nav>

      <nav className="flex flex-col mt-auto">
        {bottomLinks.map((link, index) => (
          <a
            key={index}
            className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
          >
            <span>{link}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;