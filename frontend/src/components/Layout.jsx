import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './Navbar';
import Footer from './Footer';
import EventNotification from './EventNotification';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      {/* Only show EventNotification on homepage */}
      {isHomePage && <EventNotification />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
