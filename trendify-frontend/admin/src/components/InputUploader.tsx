import { useState } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      onUpload(file); 
    }
  };

  return (
    <label className="relative w-32 h-32 border-2 border-dashed flex items-center justify-center cursor-pointer">
      {image ? (
        <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
      ) : (
        <span className="text-3xl text-gray-400">+</span>
      )}
      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
    </label>
  );
};

export default ImageUploader;
