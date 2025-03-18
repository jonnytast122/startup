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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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
                <TableHead>First Name*</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Bank Transfer</TableHead>
                <TableHead>Cash</TableHead>
                <TableHead>Employment Start Date</TableHead>
                <TableHead>Birthday</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Input
                      value={user.firstname}
                      onChange={(e) =>
                        handleInputChange(user.id, "firstname", e.target.value)
                      }
                      placeholder="First Name"
                      className="font-custom border border-gray-300 focus:border-gray-500 text-black placeholder:text-gray-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={user.lastname}
                      onChange={(e) =>
                        handleInputChange(user.id, "lastname", e.target.value)
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
                      value={user.bankTransfer}
                      onChange={(e) =>
                        handleInputChange(
                          user.id,
                          "bankTransfer",
                          e.target.value
                        )
                      }
                      placeholder="Bank Transfer"
                      className="font-custom border border-gray-300 focus:border-gray-500 text-black placeholder:text-gray-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={user.cash}
                      onChange={(e) =>
                        handleInputChange(user.id, "cash", e.target.value)
                      }
                      placeholder="Cash"
                      className="font-custom border border-gray-300 focus:border-gray-500 text-black placeholder:text-gray-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-between font-custom h-9 text-black"
                        >
                          {user.employment_start_date ? (
                            format(new Date(user.employment_start_date), "PPP")
                          ) : (
                            <span className="text-gray-500">Pick a date</span>
                          )}
                          <ChevronDown className="w-6 h-6 text-light-gray" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="p-0 bg-white border shadow-md rounded-md"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            user.employment_start_date
                              ? new Date(user.employment_start_date)
                              : undefined
                          }
                          onSelect={(date) =>
                            handleInputChange(
                              user.id,
                              "employment_start_date",
                              date ? date.toISOString() : ""
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-between font-custom h-9 text-black"
                        >
                          {user.birthday ? (
                            format(new Date(user.birthday), "PPP")
                          ) : (
                            <span className="text-gray-500">Pick a date</span>
                          )}
                          <ChevronDown className="w-6 h-6 text-light-gray" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="p-0 bg-white border shadow-md rounded-md"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            user.birthday ? new Date(user.birthday) : undefined
                          }
                          onSelect={(date) =>
                            handleInputChange(
                              user.id,
                              "birthday",
                              date ? date.toISOString() : ""
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
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
