import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

function Footer2() {
  return (
    <footer className="bg-white text-black py-4">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} LearnPortal. All rights reserved.
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6">
      <div className="container mx-auto text-center">
        {/* Logo or website name */}
        <h2 className="text-xl font-semibold mb-4">GradeBoost</h2>

        {/* Social media links */}
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="https://x.com/_michael254"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400"
          >
            <FaTwitter size={24} />
          </a>

          <a
            href="https://github.com/mikelexx/learnPortal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400"
          >
            <FaGithub size={24} />
          </a>

          <a
            href="https://www.linkedin.com/in/murithimichael254/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-600"
          >
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Links */}
        <div className="text-sm space-y-2">
          <p>
            <a href="#about" className="hover:underline">
              About Us
            </a>
          </p>
          <p>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </p>
          <p>
            <a href="#privacy" className="hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Copyright */}
        <p className="text-xs mt-4">
          &copy; {new Date().getFullYear()} GradeBoost. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
