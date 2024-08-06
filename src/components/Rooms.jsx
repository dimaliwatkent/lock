// TODO: add a way to delete and edit rooms

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getRooms,
} from "../api";
import Schedules from "./Schedules";
import AddRoom from "./AddRoom";
import RemoveRoom from "./RemoveRoom";

const Rooms = () => {
  const [activeRoom, setActiveRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  const handleTabChange = (value) => {
    setActiveRoom(value);
  };

  const fetchRooms = async (roomId) => {
    try {
      const roomData = await getRooms();
      setRooms(roomData);
      if (roomId) {
        setActiveRoom(roomId);
      } else if (roomData.length > 0) {
        setActiveRoom(roomData[0]._id);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div>
      <p className="text-4xl font-bold pb-4">Schedules</p>
      <Tabs value={activeRoom} onValueChange={handleTabChange}>
        <div className="flex gap-3">
          <TabsList>
            {rooms.map((room) => (
              <TabsTrigger key={room._id} value={room._id}>
                {room.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <AddRoom fetchRooms={fetchRooms} />
          <RemoveRoom roomId={activeRoom} fetchRooms={fetchRooms} />
        </div>

        {rooms.map((room) => (
          <TabsContent key={room._id} value={room._id}>
            <Schedules roomId={activeRoom} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Rooms;
