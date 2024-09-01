// components/Footer.tsx
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className=" py-6 md:mb-4 mb-20 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <Link href="/" className="mb-4 md:mb-0">
            <img className="hidden dark:block w-[200px]" src="/Azkar1.svg" alt="logo" />
            <img className="block dark:hidden w-[200px]" src="/Azkar.svg" alt="logo" />
          </Link>
          <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
            <span className="mx-4 hidden md:inline">|</span>
            <span className="flex items-center">
              حقوق النشر لدى<span className='mx-2'>Q4.prn</span>{new Date().getFullYear()}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;