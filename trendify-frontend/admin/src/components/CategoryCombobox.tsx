"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"


interface Category {
  _id: string
  name: string
}
interface CategoryComboboxProps {
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryCombobox({ onSelectCategory }: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [categories, setCategories] = React.useState<Category[]>([])

  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get<Category[]>("http://localhost:4000/api/category")
        setCategories(response.data) 
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    getCategories()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between rounded-xl"
        >
          {value
            ? categories.find((category) => category._id === value)?.name
            : "Select category..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category._id}
                  value={category._id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onSelectCategory(currentValue);
                  }}
                >
                  {category.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === category._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
