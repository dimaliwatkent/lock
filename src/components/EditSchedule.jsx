import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { updateSchedule, deleteSchedule, checkAvailabililty } from "../api";

const EditSchedule = ({ roomId, schedule }) => {
  const [open, setOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    title: schedule.title,
    type: schedule.type,
    date: schedule.date,
    time: schedule.time,
  });
  const [error, setError] = useState(null);

  const [day, setDay] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const { toast } = useToast();

  const handleEditSchedule = async (e) => {
    e.preventDefault();
    try {
      const newSchedule = await updateSchedule(
        roomId,
        schedule._id,
        scheduleForm,
      );
      setScheduleForm({
        title: "",
        type: "regular",
        date: null,
        time: [],
      });
      toast({
        description: `"${newSchedule.title}" schedule updated`,
      });
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleAddTime = async () => {
    if (day && timeIn && timeOut) {
      const response = await checkAvailabililty(roomId, {
        day,
        timeIn,
        timeOut,
      });
      if (response.message === "Time slot is available") {
        setScheduleForm({
          ...scheduleForm,
          time: [...scheduleForm.time, { day, timeIn, timeOut }],
        });
        setDay("");
        setTimeIn("");
        setTimeOut("");
      } else {
        setError(response.message);
      }
    } else {
      setError("Please fill in the Day, In, and Out");
    }
  };

  const handleDeleteTime = (index) => {
    setScheduleForm({
      ...scheduleForm,
      time: scheduleForm.time.filter((time, i) => i !== index),
    });
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
      setError(null);
    }
  }, [error, toast]);

  const handleDeleteSchedule = async () => {
    try {
      await deleteSchedule(roomId, schedule._id);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="name"
                value={scheduleForm.title}
                className="col-span-3"
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Select Type
              </Label>
              <Select
                value={scheduleForm.type}
                onValueChange={(value) =>
                  setScheduleForm({ ...scheduleForm, type: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="exception">
                      Exception (One time event)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {scheduleForm.type === "regular" ? (
              <div className="flex justify-center gap-4">
                <div>
                  <Select value={day} onValueChange={(value) => setDay(value)}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label>In</Label>
                  <Input
                    id="timein"
                    type="time"
                    value={timeIn}
                    className="col-span-3"
                    onChange={(e) => setTimeIn(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label>Out</Label>
                  <Input
                    id="timeout"
                    type="time"
                    value={timeOut}
                    className="col-span-3"
                    onChange={(e) => setTimeOut(e.target.value)}
                  />
                </div>
                <div>
                  <Button onClick={handleAddTime}>Add Time</Button>
                </div>
              </div>
            ) : (
              <div>date</div>
            )}

            <div>
              <p>Time</p>
              {scheduleForm.time.length === 0 ? (
                <p>No times added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {scheduleForm.time.map((time, index) => (
                    <div key={index}>
                      <div className="border p-2">
                        {time.day.charAt(0).toUpperCase() + time.day.slice(1)}{" "}
                        {time.timeIn} - {time.timeOut}
                        <Button onClick={() => handleDeleteTime(index)}>
                          x
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleDeleteSchedule}>
              Delete Schedule
            </Button>
            <Button type="button" onClick={handleEditSchedule}>
              Update Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditSchedule;
