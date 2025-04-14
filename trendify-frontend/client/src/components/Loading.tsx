const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white">
      <h2 className="text-4xl font-bold animate-pulse">Trendify</h2>
      <div className="mt-4 flex space-x-2">
        <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
        <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>
      <h4 className="mt-2 text-lg text-gray-300">Please wait while the 3D model loads...</h4>
    </div>
  );
};

export default Loading;
