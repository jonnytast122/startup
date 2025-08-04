import { useState } from "react";
import {SlidersHorizontal} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function DropdownCheckbox({ options, selectedOptions, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <span
          className="cursor-pointer text-xl"
          onClick={() => setIsOpen(!isOpen)} // Toggle dropdown manually
        >
          <SlidersHorizontal className="w-6 h-5"/>
        </span>
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent
          align="end"
          className="w-56 shadow-lg bg-white border rounded-xl p-2"
          onPointerDown={(e) => e.stopPropagation()} // Prevent closing when clicking checkboxes
        >
          {options.map((option, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center gap-2 px-4 py-2"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on text
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => onChange(option)}
                className="form-checkbox h-5 w-5 text-blue-300 border"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking checkbox
              />
              <span className="font-custom text-light-gray" onClick={(e) => e.stopPropagation()}>{option}</span> {/* Prevent closing when clicking text */}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

export default DropdownCheckbox;
