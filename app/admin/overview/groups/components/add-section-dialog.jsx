"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// 🎨 Define your preset soft colors
const softColors = [
	"#FDE2E4", // soft pink
	"#FAD2E1", // light rose
	"#E2ECE9", // mint
	"#CDEAC0", // pastel green
	"#FFF1A6", // light yellow
	"#D1E3FF", // sky blue
	"#E8DFF5", // lavender
	"#FFE5B4", // peach
	"#F6E6CB", // beige
];

export default function AddSectionDialog({
	open,
	setOpen,
	newSection,
	setNewSection,
	newSectionColor,
	setNewSectionColor,
	onConfirm,
	isLoading,
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="font-custom">
				<DialogHeader>
					<DialogTitle>Section Setting</DialogTitle>
				</DialogHeader>

				<Separator orientation="horizontal" className="my-2 w-full mb-4 mt-2" />

				{/* Section Name */}
				<Input
					placeholder="Section name"
					value={newSection}
					onChange={(e) => setNewSection(e.target.value)}
					className="mb-4"
				/>

				{/* Soft Color Selection */}
				<div className="mb-4">
					<label className="text-sm font-medium block mb-2">
						Section Color:
					</label>
					<div className="flex flex-wrap gap-2">
						{softColors.map((color) => (
							<button
								key={color}
								onClick={() => setNewSectionColor(color)}
								className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
									newSectionColor === color
										? "border-blue-500 scale-110"
										: "border-gray-200 hover:scale-105"
								}`}
								style={{ backgroundColor: color }}
							/>
						))}
					</div>
				</div>

				<DialogFooter>
					<Button onClick={onConfirm}>
						{isLoading ? "Confirming..." : "Confirm"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
