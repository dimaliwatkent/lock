import { useState, useEffect, useCallback } from "react";
import { getSchedules } from "../api";
import ScheduleTable from "./ScheduleTable";

const Schedules = ({ roomId }) => {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);

  const fetchSchedule = useCallback(async () => {
    try {
      const schedulesData = await getSchedules(roomId);
      setSchedules(schedulesData);
    } catch (error) {
      setError(error.response.data.message);
    }
  }, [roomId]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return (
    <div>
      <ScheduleTable
        schedules={schedules}
        roomId={roomId}
        fetchSchedule={fetchSchedule}
      />
    </div>
  );
};

export default Schedules;
