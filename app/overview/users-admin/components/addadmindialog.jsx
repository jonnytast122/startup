"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UserPlus, ChevronDown, Plus, Crown } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const countryCodes = [
  { code: "+855", flag: "https://flagcdn.com/w40/kh.png", name: "Cambodia" }, // Set Cambodia as default
  { code: "+81", flag: "https://flagcdn.com/w40/jp.png", name: "Japan" },
  { code: "+82", flag: "https://flagcdn.com/w40/kr.png", name: "South Korea" },
  { code: "+60", flag: "https://flagcdn.com/w40/my.png", name: "Malaysia" },
  { code: "+63", flag: "https://flagcdn.com/w40/ph.png", name: "Philippines" },
  { code: "+65", flag: "https://flagcdn.com/w40/sg.png", name: "Singapore" },
  { code: "+66", flag: "https://flagcdn.com/w40/th.png", name: "Thailand" },
  { code: "+84", flag: "https://flagcdn.com/w40/vn.png", name: "Vietnam" },
];

const assignedGroups = ["Admin", "Manager", "Editor", "Viewer"];
const assignedFeatures = [
  "Reports",
  "User Management",
  "Settings",
  "Dashboard",
];

export default function AddAdminDialog({ open, onClose }) {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      firstname: "",
      lastname: "",
      phonenumber: "",
      cash: "",
      assignedGroup: "",
      assignedFeature: "",
    },
  ]);

  const handleInputChange = (id, field, value) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === id ? { ...admin, [field]: value } : admin
      )
    );
  };

  const addNewRow = () => {
    setAdmins((prevAdmins) => [
      ...prevAdmins,
      {
        id: prevAdmins.length + 1,
        firstname: "",
        lastname: "",
        phonenumber: "",
        cash: "",
        assignedGroup: "",
        assignedFeature: "",
      },
    ]);
  };

  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    handleInputChange(admins.id, "countryCode", country.code);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle className="sr-only">Add More Admins</DialogTitle>
          <div className="flex items-center justify-center space-x-3">
            <Crown className="w-6 h-6 text-[#F7D000] mb-6" />
            <h1 className="text-2xl font-custom text-light-gray mb-6">
              Add More Admins
            </h1>
          </div>
          <p className="text-center text-md font-custom">
            Only admins can login to the Launch Pad using a desktop or a laptop
          </p>
        </DialogHeader>

        <div className="overflow-x-auto">
          <Table className="w-full min-w-max rounded-lg overflow-hidden">
            <TableHeader className="bg-[#e4e4e4] rounded-lg">
              <TableRow>
                <TableHead>First Name*</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Cash</TableHead>
                <TableHead>Assigned Group</TableHead>
                <TableHead>Assigned Feature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <Input
                      value={admin.firstname}
                      onChange={(e) =>
                        handleInputChange(admin.id, "firstname", e.target.value)
                      }
                      placeholder="First Name"
                      className="font-custom border border-gray-300 focus:border-gray-500 text-black placeholder:text-gray-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={admin.lastname}
                      onChange={(e) =>
                        handleInputChange(admin.id, "lastname", e.target.value)
                      }
                      placeholder="Last Name"
                      className="font-custom border border-gray-300 focus:border-gray-500 text-black placeholder:text-gray-400"
                    />
                  </TableCell>
                  <TableCell className="flex space-x-2 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center space-x-2 px-5 h-9"
                        >
                          <img
                            src={selectedCountry.flag}
                            alt={selectedCountry.name}
                            className="w-4 h-3"
                          />
                          <span className="font-custom">
                            {selectedCountry.code}
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2 bg-white border rounded-md shadow-md">
                        {countryCodes.map((country) => (
                          <div
                            key={country.code}
                            onClick={() => handleSelectCountry(country)}
                            className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                          >
                            <img
                              src={country.flag}
                              alt={country.name}
                              className="w-5 h-4"
                            />
                            <span className="font-custom text-sm">
                              {country.code}
                            </span>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="text"
                      value={admin.phonenumber}
                      onChange={(e) =>
                        handleInputChange(
                          admin.id,
                          "phonenumber",
                          e.target.value
                        )
                      }
                      placeholder="Phone Number"
                      className="font-custom border border-gray-300 focus:border-gray-500 text-black placeholder:text-gray-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={admin.cash}
                      onChange={(e) =>
                        handleInputChange(admin.id, "cash", e.target.value)
                      }
                      placeholder="Cash"
                      className="font-custom border border-gray-300 focus:border-gray-500 text-black placeholder:text-gray-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={admin.assignedGroup}
                      onValueChange={(value) =>
                        handleInputChange(admin.id, "assignedGroup", value)
                      }
                    >
                      <SelectTrigger className="w-full font-custom border-gray-300">
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignedGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={admin.assignedFeature}
                      onValueChange={(value) =>
                        handleInputChange(admin.id, "assignedFeature", value)
                      }
                    >
                      <SelectTrigger className="w-full font-custom border-gray-300">
                        <SelectValue placeholder="Select Feature" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignedFeatures.map((feature) => (
                          <SelectItem key={feature} value={feature}>
                            {feature}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center mt-4 mb-2">
          <Button
            onClick={addNewRow}
            className="bg-white border rounded-full border-blue-500 text-blue-500 hover:bg-blue-100 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Row</span>
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" /> Send an Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
