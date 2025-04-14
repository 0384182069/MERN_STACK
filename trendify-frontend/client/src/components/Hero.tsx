import { gsap } from 'gsap';
import Scene from './Scene';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';


const Hero = () => {
  const titleRef = useRef(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const buttonRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const animationDelay = setTimeout(() => {
      gsap.from(titleRef.current, { opacity: 0, x: -150, duration: 1, ease: "power2.out" });
      paragraphRefs.current.forEach((para, index) => {
        gsap.from(para, { opacity: 0, x: -150, duration: 0.7, delay: index * 0.2, ease: "power2.out" });
      });
      gsap.from(buttonRef.current, {opacity: 0, duration: 0.7, scale:0.2});
      gsap.from(sceneRef.current, { x: 150, opacity: 0, duration: 0.8, ease: "power1.out" }); 
    }, 700);

    return () => clearTimeout(animationDelay); 
  }, []); 


  const navigate = useNavigate();
  return (
    <div className='flex flex-col lg:flex-row h-auto min-h-[80vh] items-center justify-center py-2 md:py-10 px-4 md:px-6'>
      <div className='w-full lg:w-1/2 flex flex-col items-center justify-center text-center px-2 md:px-6 mb-8 lg:mb-0'>
        <h1 ref={titleRef} className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-webprimary'>
          Elevate Your Style with Exquisite Fragrances
        </h1>
        <p ref={el => paragraphRefs.current[0] = el} className='text-lg md:text-xl lg:text-2xl mb-2'>
          Authentic perfumes, crafted with sophistication.
        </p>
        <p ref={el => paragraphRefs.current[1] = el} className='text-lg md:text-xl lg:text-2xl mb-2'>
          A wide selection of top brands for every personality.
        </p>
        <p ref={el => paragraphRefs.current[2] = el} className='text-lg md:text-xl lg:text-2xl mb-6'>
          Find your signature scent and captivate every moment.
        </p>
        <Button 
          onClick={() => navigate('/collection')}
          ref={buttonRef} className='px-6 py-3 text-lg hover:bg-webprimary transition-all duration-300 ease-in-out transform hover:scale-105'>
          Visit Now
        </Button>
      </div>
      <div ref={sceneRef} className='w-full lg:w-1/2 h-[50vh] md:h-[60vh] lg:h-[70vh]'>
        <Scene />
      </div>
    </div>
  );
};

export default Hero;
