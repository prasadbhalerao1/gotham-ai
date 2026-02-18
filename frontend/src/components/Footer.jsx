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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Brand Section */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/img/logo.jpg"
                alt="Gotham AI Logo"
                className="size-12"
              />
              <h3 className="font-zentry text-2xl font-bold">Gotham AI</h3>
            </div>
            <p className="mb-6 max-w-md leading-relaxed text-gray-300">
              Where Minds Meet Machines. Join the AI revolution at Gotham AI -
              your gateway to artificial intelligence, innovation, and the
              future of technology.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MdLocationOn className="size-4 text-blue-400" />
                <a
                  href="https://maps.app.goo.gl/QzkAcTycAdpqbPZ96"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer transition-colors hover:text-blue-400"
                >
                  JSPM's RSCOE, Tathawade
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {link.type === "route" ? (
                    <Link
                      to={link.target}
                      className="hover-lift inline-block text-gray-300 transition-colors duration-300 hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="hover-lift inline-block text-left text-gray-300 transition-colors duration-300 hover:text-blue-400"
                      onClick={() => {
                        if (location.pathname !== "/") {
                          window.location.href = `/#${link.target}`;
                          return;
                        }
                        const element = document.getElementById(link.target);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      aria-label={`Scroll to ${link.label}`}
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
                  className="hover-lift inline-block text-gray-300 transition-colors duration-300 hover:text-blue-400"
                >
                  Join Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="text-center">
            <h4 className="mb-4 text-lg font-semibold text-white">
              Connect With Us
            </h4>
            <div className="flex justify-center gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="hover-lift group flex size-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {link.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © {currentYear}{" "}
              <span className="font-semibold text-white">Gotham AI</span>. All
              rights reserved.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Empowering the next generation of AI innovators
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
