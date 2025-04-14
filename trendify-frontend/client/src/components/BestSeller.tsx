import React, { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const BestSeller = () => {

  return (
    <div>
      <div className="text-3xl font-semibold uppercase flex items-center justify-center">
          <span className="flex-1 border-t border-gray-400"></span>
          <span className="mx-2">Best <span className="text-webprimary">Seller</span> </span>
          <span className="flex-1 border-t border-gray-400"></span>
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default BestSeller;
