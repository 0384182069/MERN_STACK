import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { useEffect } from 'react';

const LatestCollection = () => {

  return (
    <>
      <div className="text-3xl font-semibold uppercase flex items-center justify-center">
          <span className="flex-1 border-t border-gray-400"></span>
          <span className="mx-2">Latest <span className="text-webprimary">Collection</span> </span>
          <span className="flex-1 border-t border-gray-400"></span>
      </div>
    </>
  )
}

export default LatestCollection;
