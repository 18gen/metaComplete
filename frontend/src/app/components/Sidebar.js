import Image from 'next/image';
import { useRouter } from 'next/navigation';
import HomeIcon from './icons/HomeIcon';
import SearchIcon from './icons/SearchIcon';
import ExploreIcon from './icons/ExploreIcon';
import ReelsIcon from './icons/ReelsIcon';
import MessagesIcon from './icons/MessagesIcon';
import NotificationsIcon from './icons/NotificationsIcon';
import CreateIcon from './icons/CreateIcon';
import MoreIcon from './icons/MoreIcon';

const Sidebar = () => {
  const router = useRouter();

  const topLinks = [
    { label: 'Home', icon: HomeIcon, path: '/' },
    { label: 'Search', icon: SearchIcon, path: '/search' },
    { label: 'Explore', icon: ExploreIcon, path: '/explore' },
    { label: 'Reels', icon: ReelsIcon, path: '/reels' },
    { label: 'Messages', icon: MessagesIcon, path: '/chat' },
    { label: 'Notifications', icon: NotificationsIcon, path: '/notifications' },
    { label: 'Create', icon: CreateIcon, path: '/create' },
    { label: 'Profile', path: '/insta', isImage: true },
  ];

  const bottomLinks = [
    { label: 'More', icon: MoreIcon, path: '/more' },
  ];

  return (
    <aside className="lg:flex flex-col fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 p-6">
      <Image
        src={`/instagramPage/instagram.png`}
        alt="instaLogo"
        className="mb-5 cursor-pointer"
        width={100}
        height={40}
        onClick={() => {
          router.push('/');
        }}
      />
      <nav className="flex flex-col mb-auto">
        {topLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <a
              key={index}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              onClick={() => router.push(link.path)}
            >
              {link.isImage ? (
                <Image
                  src={`/instagramPage/userLogo.jpg`}
                  alt="Profile Picture"
                  className="w-6 h-6 rounded-full"
                  width={24}
                  height={24}
                />
              ) : (
                <IconComponent className="w-6 h-6" />
              )}
              <span>{link.label}</span>
            </a>
          );
        })}
      </nav>

      <nav className="flex flex-col mt-auto">
        {bottomLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <a
              key={index}
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              onClick={() => router.push(link.path)}
            >
              <IconComponent className="w-6 h-6" />
              <span>{link.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
