import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import { faqLd, organizationLd, websiteLd } from "../lib/structuredData.js";
import Hero from "../components/home/Hero.jsx";
import EventsReel from "../components/home/EventsReel.jsx";
import Moments from "../components/home/Moments.jsx";
import Faq from "../components/home/Faq.jsx";
import Join from "../components/home/Join.jsx";

const HomePage = () => (
  <>
    <SEO
      title="Gotham AI"
      description="Gotham AI is a student-led AI and technology community in Pune, at JSPM's RSCOE, Tathawade. Explore our events, hackathons, workshops, industry projects and team."
    />
    <StructuredData data={[organizationLd(), websiteLd(), faqLd()]} />
    <Hero />
    <EventsReel />
    <Moments />
    <Faq />
    <Join />
  </>
);

export default HomePage;
