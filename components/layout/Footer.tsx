import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-dark-gray ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm">SRSHB RDMC copyright &copy; 2025 </p>
            <div className="flex space-x-4 mt-2 justify-center md:justify-start">
              <Link href="#" className="text-sm ">
                Cookie settings
              </Link>
              <Link href="#" className="text-sm ">
                Accessibility settings
              </Link>
              <Link href="#" className="text-sm ">
                Privacy policy
              </Link>
              <Link href="#" className="text-sm ">
                End User Agreement
              </Link>
              <Link href="#" className="text-sm ">
                Send Feedback
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-white">
            {/* Placeholder for badges */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
