"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SketchPicker } from "react-color";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: number;
  date: Date;
  title: string;
  time: string;
  color: string;
  assignedTo: string;
}

interface EventDialogProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  onSave: (events: Event[]) => void;
  event?: Event | null;
}

const EventDialog: React.FC<EventDialogProps> = ({
  date,
  isOpen,
  onClose,
  events,
  onSave,
  event,
}) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("#2563eb");
  const [assignedTo, setAssignedTo] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [colorOpen, setColorOpen] = useState(false);

  // Sync form with event being edited
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setTime(event.time);
      setColor(event.color);
      setAssignedTo(event.assignedTo);
    } else {
      setTitle("");
      setTime("");
      setColor("#2563eb");
      setAssignedTo("");
    }
  }, [event]);

  const dayEvents = useMemo(
    () => events.filter((e) => e.date.toDateString() === date.toDateString()),
    [events, date]
  );

  const handleSave = useCallback(() => {
    if (!title.trim()) return;

    if (event) {
      // Edit existing
      onSave(
        events.map((e) =>
          e.id === event.id ? { ...e, title, time, color, assignedTo } : e
        )
      );
    } else {
      // Add new
      onSave([
        ...events,
        {
          id: events.length ? Math.max(...events.map((e) => e.id)) + 1 : 1,
          date: event?.date ?? date,
          title,
          time,
          color,
          assignedTo,
        },
      ]);
    }
    onClose();
  }, [title, time, color, assignedTo, event, events, date, onSave, onClose]);

  const handleDelete = useCallback(
    (id: number) => {
      onSave(events.filter((e) => e.id !== id));
    },
    [events, onSave]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      modal
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto"
        // Prevent closing when clicking inside popovers
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest("[role=dialog]")) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {event ? "Edit Event" : "Add Event"} – {format(date, "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Form */}
          <div className="space-y-2">
            <Input
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            {/* Assign Dropdown */}
            <DropdownMenu
              open={menuOpen === 1 && !colorOpen}
              onOpenChange={(open) => setMenuOpen(open ? 1 : null)}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {assignedTo ? `Assigned to: ${assignedTo}` : "Assign to"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Alice", "Bob", "Charlie"].map((name) => (
                  <DropdownMenuItem
                    key={name}
                    onClick={() => {
                      setAssignedTo(name);
                      setMenuOpen(null);
                    }}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Color Picker */}
            <Popover open={colorOpen} onOpenChange={setColorOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: color }}
                  />
                  Pick Color
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-auto border-none shadow-none"
                side="bottom"
                align="start"
              >
                <SketchPicker
                  color={color}
                  onChangeComplete={(newColor) => setColor(newColor.hex)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Events Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="w-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayEvents.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.title}</TableCell>
                  <TableCell>{e.time}</TableCell>
                  <TableCell>{e.assignedTo}</TableCell>
                  <TableCell>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: e.color }}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu
                      open={menuOpen === e.id}
                      onOpenChange={(open) => setMenuOpen(open ? e.id : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => setMenuOpen(e.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setTitle(e.title);
                            setTime(e.time);
                            setColor(e.color);
                            setAssignedTo(e.assignedTo);
                            setMenuOpen(null);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleDelete(e.id);
                            setMenuOpen(null);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{event ? "Update" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
