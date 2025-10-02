import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Contact from "./components/Contact";
import Events from "./components/Events";
import Footer from "./components/Footer";
import EventNotification from "./components/EventNotification";

function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <EventNotification />
      <Hero />
      <Events />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}

export default App;
