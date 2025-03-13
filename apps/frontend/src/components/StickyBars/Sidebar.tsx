
import { Home, Search, Trophy, Activity, Bell, PlusSquare, User, Menu } from "lucide-react";
import { cn } from "../lib/utils";
// import NavItem from "./NavItem";
// Utility function to combine class names

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
  onClick?: () => void
}

const SidebarItem = ({ icon: Icon, label, href, active, onClick }: SidebarItemProps) => {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-md transition-colors hover:bg-accent",
        active && "font-semibold"
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-6 w-6", active && "text-green-500")} />
      <span className="hidden lg:block">{label}</span>
    </a>
  );
};

export function Sidebar() {
  const currentPath = window.location.pathname;

  const navItems = [
    { icon: Home, label: "Home", href: "/post" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Trophy, label: "Competitions", href: "/events" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Activity, label: "Training", href: "/training" },
    { icon: PlusSquare, label: "Create", href: "#" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="h-full border-r border-border flex flex-col py-4 bg-gradient-to-b from-background to-background">
      <div className="px-2 mb-8">
        <div className="flex items-center gap-2">
          {/* <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Trophy className="h-5 w-5 text-white" />
          </div> */}
          <h1 className="text-xl font-bold hidden lg:block px-6 text-black">SportStolt</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={currentPath === item.href}
          />
        ))}
      </nav>

      <div className="mt-auto">
        <SidebarItem icon={Menu} label="More" href="#" />
      </div>
        {/* Mobile Bottom Navigation
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
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
      </div> */}
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
