import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';

gsap.registerPlugin(ScrollTrigger);
const Home = () => {

  const sections = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    sections.current.forEach((section) => {
      if (section) {
        gsap.fromTo(section, 
          { opacity: -1, y:100,scale:0.5}, 
          { 
            opacity: 1, 
            y: 0,
            scale:1,
            scrollTrigger: {
              trigger: section,
              start: "-200% 80%",
              end:"-40% 50%",
              // markers: true,
              scrub:true,
            } 
          });
      }
    });
  }, []);

  return (
    <div>
      <Hero />
      <div ref={el => sections.current[0] = el} className="h-[80vh]">
        <LatestCollection />
      </div>
      <div ref={el => sections.current[1] = el} className="h-[80vh]">
        <BestSeller />
      </div>
      <div ref={el => sections.current[2] = el} className="h-[80vh]">
        <OurPolicy />
      </div>
    </div>
  );
}

export default Home;
