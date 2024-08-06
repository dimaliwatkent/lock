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
import { deleteRoom } from "../api";
import { useState } from "react";

const RemoveRoom = ({ roomId, fetchRooms }) => {
  const [open, setOpen] = useState(false);

  const handleDeleteRoom = async () => {
    try {
      const response = await deleteRoom(roomId);
      fetchRooms();
      setOpen(false);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Remove</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will PERMANENTLY delete the room.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button type="button" onClick={handleDeleteRoom}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveRoom;
