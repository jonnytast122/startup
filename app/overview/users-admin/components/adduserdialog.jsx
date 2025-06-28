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
import { UserPlus, ChevronDown, Plus } from "lucide-react";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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

export default function AddUserDialog({ open, onClose }) {
  const [users, setUsers] = useState([
    {
      id: 1,
      firstname: "",
      lastname: "",
      phonenumber: "",
      bankTransfer: "",
      cash: "",
      employment_start_date: "",
      birthday: "",
    },
  ]);

  const handleInputChange = (id, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, [field]: value } : user
      )
    );
  };

  const addNewRow = () => {
    setUsers((prevUsers) => [
      ...prevUsers,
      {
        id: prevUsers.length + 1,
        firstname: "",
        lastname: "",
        phonenumber: "",
        bankTransfer: "",
        cash: "",
        employment_start_date: "",
        birthday: "",
      },
    ]);
  };

  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    handleInputChange(users.id, "countryCode", country.code);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle className="sr-only">Add New User</DialogTitle>
          <div className="flex items-center justify-center space-x-3">
            <UserPlus className="w-6 h-6 text-light-blue mb-6" />
            <h1 className="text-2xl font-custom text-light-gray mb-6">
              Add New User
            </h1>
          </div>
          <p className="text-center text-md font-custom">
            Users login to the mobile and web app using their mobile phone
            number
          </p>
        </DialogHeader>

        <div className="overflow-x-auto">
          <Table className="w-full min-w-max rounded-lg overflow-hidden">
            <TableHeader className="bg-[#e4e4e4] rounded-lg">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Shift Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Input
                      value={user.name}
                      onChange={(e) =>
                        handleInputChange(user.id, "name", e.target.value)
                      }
                      placeholder="First Name"
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
                      value={user.phonenumber}
                      onChange={(e) =>
                        handleInputChange(
                          user.id,
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
                      value={user.branch}
                      onChange={(e) =>
                        handleInputChange(user.id, "branch", e.target.value)
                      }
                      placeholder="Branch Name"
                      className="font-custom border border-gray-300 focus:border-gray-500 text-black placeholder:text-gray-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.shifttype}
                      onValueChange={(value) =>
                        handleInputChange(user.id, "shifttype", value)
                      }
                    >
                      <SelectTrigger className="w-full font-custom h-9 text-black border-gray-300 placeholder:text-gray-400">
                        <SelectValue placeholder="Select Shift Type" />
                      </SelectTrigger>
                      <SelectContent className="font-custom">
                        <SelectItem value="schedule">Schedule</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="part-time">Part-Time</SelectItem>
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
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-blue-500 text-blue-500 hover:bg-blue-100"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
