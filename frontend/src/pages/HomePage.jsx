import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import { faqLd, organizationLd, websiteLd } from "../lib/structuredData.js";
import Hero from "../components/home/Hero.jsx";
import EventsReel from "../components/home/EventsReel.jsx";
import CaseFiles from "../components/home/CaseFiles.jsx";
import Moments from "../components/home/Moments.jsx";
import Faq from "../components/home/Faq.jsx";
import Join from "../components/home/Join.jsx";

const HomePage = () => (
  <>
    <SEO title="Gotham AI" />
    <StructuredData data={[organizationLd(), websiteLd(), faqLd()]} />
    <Hero />
    <EventsReel />
    <Moments />
    <CaseFiles />
    <Faq />
    <Join />
  </>
);

export default HomePage;
