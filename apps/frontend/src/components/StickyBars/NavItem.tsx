import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const NavItem = ({ icon: Icon, label, href }: NavItemProps) => {
  return (
      <Link
        to={href}
        className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Icon className="h-6 w-6" />
        <span className="hidden xl:block ml-4">{label}</span>
      </Link>
  );
};

export default NavItem;