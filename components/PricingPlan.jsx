import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPlan() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dbe7fb] p-10">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 max-w-6xl w-full">
        {/* Left section */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-5xl font-bold text-[#1e3a8a] leading-tight">
            Pricing <br /> Plan
          </h1>
          <p className="text-gray-600 text-lg">Pricing for your next project</p>
        </div>

        {/* Middle section (Blue card with model) */}
        <div className="flex-1 bg-[#1e3a8a] text-white rounded-3xl p-10 relative h-[520px] flex flex-col justify-start items-start overflow-hidden">
          {/* Text content */}
          <div className="z-20 space-y-3">
            <h2 className="text-3xl font-semibold">Save More</h2>
            <p className="text-2xl font-bold">With Anan.</p>
            <p className="text-base opacity-80 max-w-xs">
              Choose a plan and get onboard in minutes.
            </p>
          </div>

          {/* Arrow (placed between text and model) */}
          <div className="z-20 text-6xl mt-6 ml-1 animate-pulse">→</div>

          {/* Model image */}
          <img
            src="/images/anan-model.png" // your image path
            alt="Anan model"
            className="absolute bottom-0 right-4 w-[340px] object-contain z-10"
          />
        </div>

        {/* Right section (Pricing card) */}
        <div className="flex-1 bg-white rounded-3xl p-10 shadow-sm space-y-6">
          <h3 className="text-2xl font-bold text-[#1e3a8a] flex items-center gap-2">
            🧪 Beta
          </h3>
          <p className="text-gray-400 text-sm">What You’ll Get</p>

          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle size={18} className="text-[#1e3a8a]" />
              Access to all Features
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={18} className="text-[#1e3a8a]" />
              Early Access (New feature)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={18} className="text-[#1e3a8a]" />
              Personal dedicated service
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={18} className="text-[#1e3a8a]" />
              Direct Communication with founder
            </li>
          </ul>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-3xl font-bold text-[#1e3a8a]">
              $Free{" "}
              <span className="text-base font-normal">/til Late 2026</span>
            </p>
          </div>

          <Button className="w-full bg-[#1e3a8a] hover:bg-[#172c75] text-white text-lg py-6 rounded-xl">
            Choose
          </Button>
        </div>
      </div>
    </div>
  );
}
