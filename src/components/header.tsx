import { FaBell } from 'react-icons/fa';
const Header = () => {
  return (
    <header className="bg-green-950 text-white p-4">
      <div className="flex items-center justify-between">
        {/* Title on the left */}
        <div>
          <h1 className="text-2xl font-semibold">My App</h1>
        </div>
        {/* Notification and Profile sections on the right */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <div className="relative">
            <FaBell />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
              3
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center">
            <img
              src="https://placekitten.com/32/32"
              alt="Profile"
              className="rounded-full h-8 w-8 object-cover"
            />
            <span className="ml-2">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
