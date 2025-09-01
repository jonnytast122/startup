"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyDepartments } from "@/lib/api/department";
import { fetchBranches } from "@/lib/api/branch";
import { fetchPositions } from "@/lib/api/position";
import { fetchCompany } from "@/lib/api/company";

export default function UserFilter({ isViewMode = false, onChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedFirstLevels, setSelectedFirstLevels] = useState([]); // empty initially
  const [selectedItems, setSelectedItems] = useState({}); // empty initially

  // Fetch company info first (needed for departments)
  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const { data: branchesData } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["departments", company?.id],
    queryFn: () => fetchCompanyDepartments(company?.id),
    enabled: !!company?.id,
  });

  const { data: positionsData } = useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
  });

  // Safely extract results arrays
  const branches = Array.isArray(branchesData?.results)
    ? branchesData.results
    : [];
  const departments = Array.isArray(departmentsData?.results)
    ? departmentsData.results
    : [];
  const positions = Array.isArray(positionsData?.results)
    ? positionsData.results
    : [];

  // First-level options
  const firstLevelOptions = [
    { key: "branch", label: "Branch" },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
  ];

  // Prepare second-level data
  const secondLevelData = {
    branch: Array.from(new Set(branches.map((b) => b.name).filter(Boolean))),
    department: Array.from(
      new Set(departments.map((d) => d.name).filter(Boolean))
    ),
    position: Array.from(
      new Set(positions.map((p) => p.title).filter(Boolean))
    ),
  };

  const handleToggleMenu = () => setMenuOpen(!menuOpen);

  const handleFirstLevelChange = (key) => {
    if (key === "all") {
      if (selectedFirstLevels.length === firstLevelOptions.length) {
        setSelectedFirstLevels([]);
        setSelectedItems({});
      } else {
        const allKeys = firstLevelOptions.map((o) => o.key);
        const allItems = {};
        // keep them empty so second-level isn't preselected
        allKeys.forEach((k) => (allItems[k] = []));
        setSelectedFirstLevels(allKeys);
        setSelectedItems(allItems);
      }
    } else {
      if (selectedFirstLevels.includes(key)) {
        const newSelected = selectedFirstLevels.filter((k) => k !== key);
        const newItems = { ...selectedItems };
        delete newItems[key];
        setSelectedFirstLevels(newSelected);
        setSelectedItems(newItems);
      } else {
        setSelectedFirstLevels([...selectedFirstLevels, key]);
        setSelectedItems({
          ...selectedItems,
          [key]: [], // empty initially
        });
      }
    }

    onChange &&
      onChange({
        firstLevels: selectedFirstLevels,
        secondLevels: selectedItems,
      });
  };

  const handleSecondLevelChange = (firstKey, value) => {
    const prev = selectedItems[firstKey] || [];
    const newValues = prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value];

    const newSelectedItems = { ...selectedItems, [firstKey]: newValues };
    setSelectedItems(newSelectedItems);

    onChange &&
      onChange({
        firstLevels: selectedFirstLevels,
        secondLevels: newSelectedItems,
      });
  };

  const totalSecondLevelSelected = Object.values(selectedItems).reduce(
    (acc, arr) => acc + arr.length,
    0
  );
  const isAllSelected = selectedFirstLevels.length === firstLevelOptions.length;

  const firstLevelLabel =
    selectedFirstLevels.length === 0
      ? "Select"
      : selectedFirstLevels.length === 1
      ? firstLevelOptions.find((o) => o.key === selectedFirstLevels[0])?.label
      : `${selectedFirstLevels.length} selected`;

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
      <div
        className={`w-full md:w-2/3 relative flex items-center ${
          isViewMode ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <button
          onClick={handleToggleMenu}
          className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-100 w-full md:w-64"
        >
          <span className="truncate">{firstLevelLabel}</span>
          <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
        </button>

        {totalSecondLevelSelected > 0 && (
          <span className="ml-4 text-sm text-gray-600 whitespace-nowrap">
            {totalSecondLevelSelected} selected
          </span>
        )}

        {!isViewMode && menuOpen && (
          <>
            {/* First Level Options */}
            <div className="absolute top-full left-0 mt-2 w-48 border border-gray-300 bg-white shadow-lg z-10">
              <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={() => handleFirstLevelChange("all")}
                  className="mr-2"
                />
                All
              </label>
              {firstLevelOptions.map((item) => (
                <label
                  key={item.key}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onMouseEnter={() => setHoveredItem(item.key)}
                >
                  <input
                    type="checkbox"
                    checked={selectedFirstLevels.includes(item.key)}
                    onChange={() => handleFirstLevelChange(item.key)}
                    className="mr-2"
                  />
                  {item.label}
                </label>
              ))}
            </div>

            {/* Second Level Options */}
            {hoveredItem && selectedFirstLevels.includes(hoveredItem) && (
              <div className="absolute top-full left-52 mt-2 w-48 border border-gray-300 bg-white shadow-lg z-20">
                <div className="px-3 py-2 font-semibold border-b border-gray-200">
                  {firstLevelOptions.find((o) => o.key === hoveredItem)?.label}{" "}
                  Options
                </div>
                {(secondLevelData[hoveredItem] || []).map((value) => (
                  <label
                    key={value}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedItems[hoveredItem]?.includes(value) || false
                      }
                      onChange={() =>
                        handleSecondLevelChange(hoveredItem, value)
                      }
                      className="mr-2"
                    />
                    {value}
                  </label>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
