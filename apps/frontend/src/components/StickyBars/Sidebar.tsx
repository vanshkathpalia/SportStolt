import { Home, Search, PlusSquare, Trophy, User, Bell, Activity, Menu, DollarSign, Settings, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, active, onClick }: SidebarItemProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-md transition-colors",
        "hover:bg-accent dark:hover:bg-gray-700",
        active && "font-semibold text-green-500"
      )}
    >
      <Icon className={cn("h-6 w-6", active ? "text-green-500" : "text-gray-600 dark:text-gray-300")} />
      <span className="hidden xl:block text-gray-800 dark:text-gray-200">{label}</span>
    </a>
  );
};

interface SidebarProps {
  openCreateModal: () => void;
}

export function Sidebar({ openCreateModal }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

    const handleLogout = () => {
    // Optional: Add back-button handling logic
    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      const leave = window.confirm("Do you want to close this page?");
      if (leave) {
        window.close(); // This might work only for JS-opened tabs
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", onPopState);

    // Remove after a short delay to avoid interfering with other routes
    setTimeout(() => {
      window.removeEventListener("popstate", onPopState);
    }, 1000);

    // Perform logout
    localStorage.removeItem("token");

    // Redirect to signin
    navigate("/signin");
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/post" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Trophy, label: "Competitions", href: "/events" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Activity, label: "Training", href: "/training" },
    { icon: PlusSquare, label: "Create", href: "#", onClick: openCreateModal },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="h-full flex flex-col py-4 bg-backgroundtransition-colors">
      {/* Logo */}
      <div className="px-2 mb-8">
        <div className="flex flex-col items-center gap-2">
          <Link to="/post" className="flex items-center px-6 cursor-pointer">
            <h1 className="text-xl font-bold hidden xl:block text-green-500">SportStolt</h1>
            <div className="hidden md:block xl:hidden">
              <Trophy className="h-7 w-8 text-green-500" />
            </div>
          </Link>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname === item.href}
            onClick={item.onClick}
          />
        ))}
      </nav>

      {/* More Dropdown */}
      <div className="mt-auto relative">
        <SidebarItem icon={Menu} label="More" href="#" onClick={() => setMoreOpen(!moreOpen)} />
        {moreOpen && (
          <div className="absolute bottom-12 left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-1 z-50">
            <SidebarItem icon={Settings} label="Settings" href="/settings" />
            <SidebarItem icon={DollarSign} label="Be an Earner" href="/earn" />
            <SidebarItem icon={LogOut} label="Logout" href="#" onClick={handleLogout} />
          </div>
        )}
      </div>
    </div>
  );
}



// import { Home, PlusSquare, Film, User, Calendar, Search } from 'lucide-react';
// import NavItem from './NavItem';

// export const Sidebar = () => {
//   const navItems = [
//     { icon: Home, label: 'Home', href: '/post'},
//     { icon: Search, label: 'Search', href: '/search'},
//     { icon: PlusSquare, label: 'New Post', href: '/addpost' },
//     { icon: Film, label: 'New Story', href: '/addstory' },
//     { icon: Calendar, label: 'Event', href: '/events' },
//     { icon: User, label: 'Profile', href: '/profile' },
//   ];

//   return (
//     <>
//       {/* Desktop & Tablet Sidebar */}
//       <div className="hidden md:flex fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex-col p-3">
//         <div className="flex items-center justify-center md:justify-start py-6">

//           <span className="hidden xl:block ml-3 text-xl font-bold">SportStolt</span>
//         </div>
        
//         <nav className="mt-8 flex-1">
//           <ul className="space-y-2">
//             {navItems.map((item) => (
//               <NavItem
//                 key={item.label}
//                 icon={item.icon}
//                 label={item.label}
//                 href={item.href}
//               />
//             ))}
//           </ul>
//         </nav>
//       </div>

//     </>
//   );
// };
