import { Home, Search, PlusSquare, Trophy, User, Bell, Activity, Menu, DollarSign, Settings, LogOut, Newspaper } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface MobileNavProps {
  openCreateModal: () => void;
}

export function MobileNav({ openCreateModal }: MobileNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [moreOpen, setMoreOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", href: "/post" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Trophy, label: "Events", href: "/events" },
    { icon: Activity, label: "Training", href: "/training" },
    { icon: Newspaper, label: "News", href: "/news" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/signin");
  // };
  const handleLogout = () => {
    localStorage.removeItem("token");
    // localStorage.setItem('user', JSON.stringify(user));
    // this is wiping all the  user info, we want just the token to wipe
    // localStorage.removeItem("user");
    // setUser(null);
    navigate("/signin");
  };

  return (
    <>
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 bg-muted z-50 px-4 h-14 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-500">SportStolt</h1>
        <div className="flex items-center gap-4 relative">
          <button
            className="focus:outline-none text-gray-700 dark:text-gray-300"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-6 w-6" />
          </button>
          <button
            className="focus:outline-none text-gray-700 dark:text-gray-300"
            onClick={openCreateModal}
          >
            <PlusSquare className="h-6 w-6" />
          </button>
          <button
            className="focus:outline-none text-gray-700 dark:text-gray-300"
            onClick={() => setMoreOpen(!moreOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* More Dropdown */}
          {moreOpen && (
            <div className="absolute right-0 top-8 mt-2 min-w-[12rem] bg-muted text-muted-foreground dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-2 z-50">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => {
                  setMoreOpen(false);
                  navigate("/settings");
                }}
              >
                <Settings className="h-5 w-5" />
                Settings
              </button>

              <button
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => {
                  setMoreOpen(false);
                  navigate("/earn");
                }}
              >
                <DollarSign className="h-5 w-5" />
                Be an Earner
              </button>

              <button
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                onClick={() => {
                  setMoreOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>

          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 z-10 backdrop-blur-md shadow-lg">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                pathname === item.href
                  ? "text-green-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="sr-only">{item.label}</span>
            </Link>

          ))}
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-14 md:hidden" />
    </>
  );
}



// import { Home, Search, PlusSquare, Trophy, User, Bell, Activity } from "lucide-react";
// import { useLocation, Link, useNavigate} from "react-router-dom";
// import { cn } from "../lib/utils";
// interface MobileNavProps {
//   openCreateModal: () => void
// }

// export function MobileNav({ openCreateModal }: MobileNavProps) {
//   const location = useLocation();
//   const navigate = useNavigate()
//   const pathname = location.pathname

//   const navItems = [
//     { icon: Home, label: "Home", href: "/post" },
//     { icon: Search, label: "Search", href: "/search" },
//     { icon: Trophy, label: "Competitions", href: "/events" },
//     { icon: Activity, label: "Training", href: "/training" },
//     { icon: User, label: "Profile", href: "/profile" },
//   ];

//   return (
//     <>
//       {/* Top Header */}
//       <div className="fixed top-0 left-0 right-0 bg-background border-b border-border z-10 px-4 h-14 flex items-center justify-between">
//         <h1 className="text-xl font-bold text-green-500">SportsFeed</h1>
//         <div className="flex items-center gap-4">
//         <button className="focus:outline-none" onClick={() => navigate("/notifications")}>
//             <Bell className="h-6 w-6" />
//           </button>
//           <button className="focus:outline-none" onClick={openCreateModal}>
//             <PlusSquare className="h-6 w-6" />
//           </button>
//         </div>
//       </div>

//       {/* Bottom Navigation */}
//       <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-10">
//         <div className="flex justify-around items-center h-14">
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               onClick={() => navigate(item.href)}
//               to={item.href}
//               className={cn(
//                 "flex flex-col items-center justify-center w-full h-full",
//                 pathname === item.href ? "text-green-500" : "text-muted-foreground"
//               )}
//             >
//               <item.icon className="h-6 w-6" />
//               <span className="sr-only">{item.label}</span>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Spacer for fixed header */}
//       <div className="h-14 md:hidden" />
//     </>
//   );
// }