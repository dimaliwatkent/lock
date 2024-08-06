import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import EditSchedule from "./EditSchedule";

const SchedulePopup = ({ children, schedule, roomId }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="">{children}</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{schedule.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <p>{schedule.title}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                User
              </Label>
              <p>{schedule.user}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <p>{schedule.room}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <p>{schedule.type}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <p>
                {schedule.date ? schedule.date.toLocaleDateString() : "Not set"}
              </p>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <ul>
                {schedule.time.map((time, index) => (
                  <li key={index}>
                    <p className="flex gap-1">
                      <span>{time.day}</span>
                      <span>{":"}</span>
                      <span>{time.timeIn}</span>
                      <span>{"-"}</span>
                      <span>{time.timeOut}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <EditSchedule roomId={roomId} schedule={schedule} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { SchedulePopup };
