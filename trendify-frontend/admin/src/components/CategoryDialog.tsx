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
import { toast } from "react-toastify";

interface CategoryProp {
  refreshData: ()=>void
}

export const CategoryDialog:React.FC<CategoryProp>=({refreshData}) => {
  const [name, setName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resetForm = () => {
    setName("");
  };

  // Xử lý submit
  const handleSubmit = async () => {
    try {
      const {data} = await axios.post("http://localhost:4000/api/category", { name });
      if(data.success){
        toast.success(data.message)
        resetForm(); // Reset form
        refreshData(); // Gọi hàm cập nhật dữ liệu
        setIsDialogOpen(false); // Đóng dialog sau khi thành công
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again!");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild >
        <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(true)}>
          New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-10">
        <DialogHeader className="flex justify-center">
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new category to the store.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                className="col-span-3 rounded-xl"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
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