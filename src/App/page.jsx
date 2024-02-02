import Hero from '../components/hero';
import ScrollUp from "../components/Common/ScrollUp.jsx";
import Features from "../components/Features/index.jsx";
import Video from "../components/Video/index.jsx";
import Brands from "../components/Brands/index.jsx";
import AboutSectionOne from "../components/About/AboutSectionOne.jsx";
import AboutSectionTwo from "../components/About/AboutSectionTwo.jsx";
import Testimonials from "../components/Testimonials/index.jsx";
import Pricing from "../components/Pricing/index.jsx";
import Blog from "../components/Blog/index.jsx";
import Contact from "../components/Contact/index.jsx";

export default function Home() {
  return (
    <>
        <ScrollUp />
        <Hero />
        <Features />
        <Video />
        <Brands />
        <AboutSectionOne />
        <AboutSectionTwo />
        <Testimonials />
        <Pricing />
        <Blog />
        <Contact />
    </>
  );
}
