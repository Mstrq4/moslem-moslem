// FloatingNav.tsx
import React, { ReactElement } from 'react';
import Link from 'next/link';

export type NavItem = {
  name: string;
  link: string;
  icon?: ReactElement;
};

interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
  children?: React.ReactNode;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ navItems, className, children }) => {
  return (
    <nav className={`floating-nav ${className}`}>
      {children}
      <ul>
        {navItems.map((item, index) => (
          <li key={index}>
            <Link href={item.link}>
              {item.icon ? item.icon : <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};