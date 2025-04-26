import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddShiftDialog = ({ open, onOpenChange, date }) => {
  const [selectedDate, setSelectedDate] = useState(date || new Date());
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [durationHours, setDurationHours] = useState(0);

  // Input states
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  const members = ["John Doe", "Jane Smith", "Alice Johnson"]; // Example members

  useEffect(() => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const startTotal = startHour + startMinute / 60;
    const endTotal = endHour + endMinute / 60;
    const diff = endTotal - startTotal;
    setDurationHours(diff > 0 ? diff.toFixed(1) : 0);
  }, [startTime, endTime]);

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="w-auto max-w-2xl font-custom">
        <DialogHeader className="text-center px-10 border-b py-1">
          <DialogTitle className="text-3xl font-normal font-custom">
            Shift Details: {selectedDate ? format(selectedDate, "eeee, MMMM d, yyyy") : "Select a date"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 font-custom px-10">
          {/* Date Picker + All Day Switch */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-full sm:w-auto">
              <label className="text-sm mb-1 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-48 justify-start h-9 px-3 text-sm"
                  >
                    <Calendar className="mr-2 w-4 h-4" />
                    {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComp
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2 pt-7 whitespace-nowrap">
              <Switch checked={allDay} onCheckedChange={setAllDay} />
              <span className="text-sm">All Day</span>
            </div>
          </div>

          {/* Start & End Time */}
          {!allDay && (
            <div className="flex items-center gap-4">
              <div className="w-full">
                <label className="text-sm mb-1 block">Start Time</label>
                <div className="relative">
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-5"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="text-sm mb-1 block">End Time</label>
                <div className="relative">
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-5"
                  />
                </div>
              </div>

              <div className="flex items-center text-sm pt-6 whitespace-nowrap">
                {durationHours} hours
              </div>
            </div>
          )}

          {/* Fields: Title, User, Location, Note */}
          <div className="space-y-4">
            <div>
              <label className="text-sm mb-1 block">Shift Title</label>
              <Input
                placeholder="Enter shift title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">User</label>
              <Select value={user} onValueChange={setUser}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm mb-1 block">Location</label>
              <Input
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Note</label>
              <Textarea
                placeholder="Write notes here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 border-t pt-2">
            <Button
              variant="outline"
              className="h-9 w-32 rounded-3xl border-blue-500 text-blue-500 hover:bg-blue-50 font-custom"
              onClick={() => onOpenChange(false)}
            >
              Save Draft
            </Button>
            <Button
              className="h-9 w-32 rounded-3xl hover:bg-blue-700 text-white font-custom"
            >
              Publish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddShiftDialog;
