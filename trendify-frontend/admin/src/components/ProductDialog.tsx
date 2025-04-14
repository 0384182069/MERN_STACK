import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryCombobox } from "./CategoryCombobox";
import { SubcategoryCombobox } from "./SubcategoryCombobox";
import ImageUploader from "./InputUploader";
import { toast } from "react-toastify";
import { Textarea } from "./ui/textarea";

interface ProductProp {
  refreshData: ()=>void
}

export const ProductDiablog:React.FC<ProductProp>=({refreshData}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubcategory] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory(null);
    setSubcategory(null);
    setSelectedSizes([]);
    setImages([]);
    setBestSeller(false);
  };
  // Danh sách size
  const sizes = ["50ml", "100ml", "200ml", "400ml", "Set"];

  // Xử lý chọn size
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Xử lý upload ảnh
  const handleImageUpload = (file: File) => {
    setImages((prev) => [...prev, file]);
  };

  // Xử lý submit
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category || "");
    formData.append("subCategory", subCategory || "");
    formData.append("sizes", JSON.stringify(selectedSizes));
    formData.append("bestSeller", bestSeller.toString());

    images.forEach((image, index) => {
      if (index < 4) { 
        formData.append(`image${index+1}`, image);
      }
    });
    try {
      const {data} =  await axios.post("http://localhost:4000/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if(data.success){
        toast.success(data.message)
        resetForm(); // Reset form
        refreshData(); // Gọi hàm cập nhật dữ liệu
        setIsDialogOpen(false); // Đóng dialog sau khi thành công
      }
      else(
        toast.error(data.message)
      )
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again!");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild >
        <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(true)}>
          New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-10">
        <DialogHeader className="flex justify-center">
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to the store.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-4 gap-6">
            {/* Cột trái */}
            <div className="col-span-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" type="text" className="rounded-xl" onChange={(e) => setName(e.target.value)} />

              <Label htmlFor="price">Price</Label>
              <Input id="price" type="text" className="rounded-xl" onChange={(e) => setPrice(e.target.value)} />

              <Label htmlFor="description">Description</Label>
              <Textarea id="description" className="rounded-xl" onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* Cột phải */}
            <div className="col-span-2">
              <div>
                <Label>Category</Label>
              </div>
              <CategoryCombobox onSelectCategory={setCategory} />

              <div>
               <Label>Subcategory</Label>
              </div>
              <SubcategoryCombobox onSelectSubCategory={setSubcategory} />

              <div>
               <Label>Size</Label>
              </div>
              <div className="flex flex-wrap gap-2 pb-2">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className={`px-3 py-2 text-sm cursor-pointer rounded-xl ${
                      selectedSizes.includes(size) ? "bg-blue-500 text-white" : "bg-slate-200"
                    }`}
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="bestSeller" checked={bestSeller} onChange={() => setBestSeller(!bestSeller)} />
                <Label htmlFor="bestSeller">Best Seller</Label>
              </div>
            </div>

            {/* Khu vực upload ảnh */}
            <div className="col-span-4 flex gap-2">
              {[...Array(4)].map((_, index) => (
                <ImageUploader key={index} onUpload={handleImageUpload} />
              ))}
            </div>
          </div>

          {/* Nút lưu */}
          <div className="flex justify-end">
            <Button type="submit" className="rounded-xl" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
