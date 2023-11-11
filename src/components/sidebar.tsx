import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const items = [
    { label: 'Dashboard', path: '/' },
    { label: 'Equipments', path: '/equipments' },
    { label: 'Patients', path: '/patients' },
  ];

  return (
    <div className="w-1/5 bg-green-900 text-white p-4">
      <ul>
        {items.map((item) => (
          <li key={item.label} className="py-2">
            <NavLink
              to={item.path}
              className={({ isActive, isPending }) =>
                isActive ? 'font-bold' : isPending ? 'font-bold' : ''
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
