const OurPolicy = () => {
  return (
    <div>
      <div className="text-3xl font-semibold uppercase flex items-center justify-center mb-6">
        <span className="flex-1 border-t border-gray-400"></span>
        <span className="mx-2">Our <span className="text-webprimary">Policy</span> </span>
        <span className="flex-1 border-t border-gray-400"></span>
      </div>
      <div className='flex flex-wrap justify-between mx-4 md:mx-16 gap-4'>

        <div className='border border-black rounded-lg w-full md:w-[32%]'>
          <div className='flex flex-col p-6'>
            <span className='text-lg font-medium'>Shipping Policy</span>
            <hr />
            <span>Free shipping for orders over a $50.</span>
            <span>2-3 days for cities, 3-5 days for other areas.</span>
            <span>Customers can check the package before accepting it.</span>
          </div>
        </div>
        <div className='border border-black rounded-lg w-full md:w-[32%]'>
          <div className='flex flex-col p-6'>
            <span className='text-lg font-medium'>Return & Exchange Policy</span>
            <hr />
            <span>7-14 day return window for defective or damaged items.</span>
            <span>No returns if the perfume bottle has been opened. </span>
            <span>One-time exchange allowed if the customer has an allergic reaction to the fragrance.</span>
          </div>
        </div>
        <div className='border border-black rounded-lg w-full md:w-[32%]'>
          <div className='flex flex-col p-6'>
            <span className='text-lg font-medium'>Warranty Policy</span>
            <hr />
            <span>100% authenticity guarantee – full refund if counterfeit products are found.</span>
            <span>Warranty covers spray nozzle and cap defects for 30 days.</span>
            <span>Leakage protection – if the product leaks during delivery, a free replacement will be provided.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurPolicy
