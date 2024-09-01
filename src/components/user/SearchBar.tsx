// components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="بحث في التصنيفات..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="p-2 border rounded-md w-full sm:w-auto"
    />
  );
};

export default SearchBar;