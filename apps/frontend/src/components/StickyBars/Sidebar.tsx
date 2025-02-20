
import { Home, PlusSquare, Film, User, Calendar, Search } from 'lucide-react';
import NavItem from './NavItem';

export const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'Home', href: '/post'},
    { icon: Search, label: 'Search', href: '/search'},
    { icon: PlusSquare, label: 'New Post', href: '/addpost' },
    { icon: Film, label: 'New Story', href: '/addstory' },
    { icon: Calendar, label: 'Event', href: '/events' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex-col p-3">
        <div className="flex items-center justify-center md:justify-start py-6">

          <span className="hidden xl:block ml-3 text-xl font-bold">SportStolt</span>
        </div>
        
        <nav className="mt-8 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center">
          
          {navItems.map((item) => (
            <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href} 
            />
          ))}
        </div>
      </div>
    </>
  );
};

