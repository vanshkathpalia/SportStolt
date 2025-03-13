import { Home, Search, PlusSquare, Trophy, User, Bell, Activity } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "../lib/utils";

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/post" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Trophy, label: "Competitions", href: "/events" },
    { icon: Activity, label: "Training", href: "/training" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <>
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 bg-background border-b border-border z-10 px-4 h-14 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-500">SportsFeed</h1>
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="focus:outline-none">
            <Bell className="h-6 w-6" />
          </Link>
          <button className="focus:outline-none">
            <PlusSquare className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-10">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                location.pathname === item.href ? "text-green-500" : "text-muted-foreground"
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