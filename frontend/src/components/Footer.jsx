import { Link, useLocation } from "react-router-dom";
import { FaDiscord, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const socialLinks = [
  { href: "https://discord.com", icon: <FaDiscord />, label: "Discord" },
  { href: "https://twitter.com", icon: <FaTwitter />, label: "Twitter" },
  { href: "https://linkedin.com", icon: <FaLinkedin />, label: "LinkedIn" },
  { href: "https://instagram.com", icon: <FaInstagram />, label: "Instagram" },
];

const quickLinks = [
  { label: "Events", type: "section", target: "events" },
  { label: "About", type: "section", target: "about" },
  { label: "Contact", type: "section", target: "contact" },
  { label: "Projects", type: "route", target: "/projects" },
  { label: "Resources", type: "route", target: "/resources" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  return (
    <footer className="w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/img/logo.png" alt="Gotham AI Logo" className="w-12 h-12" />
              <h3 className="text-2xl font-bold font-zentry">Gotham AI</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Where Minds Meet Machines. Join the AI revolution at Gotham AI - your gateway to 
              artificial intelligence, innovation, and the future of technology.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MdLocationOn className="w-4 h-4 text-blue-400" />
                <span>JSPM's RSCOE, Tathawade</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {link.type === 'route' ? (
                    <Link
                      to={link.target}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover-lift inline-block"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="text-left text-gray-300 hover:text-blue-400 transition-colors duration-300 hover-lift inline-block"
                      onClick={() => {
                        if (location.pathname !== '/') {
                          window.location.href = `/#${link.target}`;
                          return;
                        }
                        const element = document.getElementById(link.target);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
              <li>
                <a 
                  href="https://discord.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover-lift inline-block"
                >
                  Join Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-white">Connect With Us</h4>
            <div className="flex justify-center gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-600 transition-all duration-300 hover-lift group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {link.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} <span className="font-semibold text-white">Gotham AI</span>. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Empowering the next generation of AI innovators
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;