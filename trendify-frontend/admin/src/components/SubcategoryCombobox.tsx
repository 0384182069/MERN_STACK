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

const subcategories = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
  { id: "unisex", name: "Unisex" },
]

interface SubCategoryProps {
  onSelectSubCategory: (categoryId: string) => void;
}

export function SubcategoryCombobox({ onSelectSubCategory }: SubCategoryProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

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
            ? subcategories.find((subcategory) => subcategory.id === value)?.name
            : "Select subcategory..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No subcategory found.</CommandEmpty>
            <CommandGroup>
              {subcategories.map((subcategory) => (
                <CommandItem
                  key={subcategory.id}
                  value={subcategory.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onSelectSubCategory(currentValue)
                  }}
                >
                  {subcategory.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === subcategory.id ? "opacity-100" : "opacity-0"
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
