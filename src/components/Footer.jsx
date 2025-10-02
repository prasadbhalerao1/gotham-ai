import { FaDiscord, FaTwitter, FaYoutube, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const socialLinks = [
  { href: "https://discord.com", icon: <FaDiscord />, label: "Discord" },
  { href: "https://twitter.com", icon: <FaTwitter />, label: "Twitter" },
  { href: "https://youtube.com", icon: <FaYoutube />, label: "YouTube" },
  { href: "https://linkedin.com", icon: <FaLinkedin />, label: "LinkedIn" },
  { href: "https://instagram.com", icon: <FaInstagram />, label: "Instagram" },
  { href: "https://github.com", icon: <FaGithub />, label: "GitHub" },
];

const quickLinks = [
  { href: "#events", label: "Events" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
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
                <MdLocationOn className="w-4 h-4 text-purple-400" />
                <span>JSPM Campus, Pune, India</span>
              </div>
              <div className="flex items-center gap-2">
                <MdEmail className="w-4 h-4 text-purple-400" />
                <span>contact@gothamai.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MdPhone className="w-4 h-4 text-purple-400" />
                <span>+91 (XXX) XXX-XXXX</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover-lift inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(link.href.substring(1));
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover-lift inline-block">
                  Join Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover-lift inline-block">
                  Resources
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
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-purple-600 transition-all duration-300 hover-lift group"
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
