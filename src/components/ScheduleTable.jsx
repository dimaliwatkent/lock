import React, { useEffect } from "react";
import { SchedulePopup } from "./SchedulePopup";
import AddSchedule from "./AddSchedule";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const startTime = 7;
const endTime = 18;

// in pixels
const height = 24;
const width = 100;

const timeList = [];
for (let i = startTime; i <= endTime; i++) {
  timeList.push(`${i}:00`);
  timeList.push(" ");
}

const colors = [
  "#b4d8e8",
  "#abbcd6",
  "#f1b1c1",
  "#d486b8",
  "#a37ab4",
  "#7a9248",
  "#c5d6a9",
];

const ScheduleTable = ({ schedules, roomId, fetchSchedule }) => {
  const convertTimeToTimestamp = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Get the current date
  const currentDate = new Date();
  // Format the date
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  return (
    <div className="border p-6 my-6 h-fit w-fit rounded-xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl m-4">{formattedDate}</h1>
        <AddSchedule roomId={roomId} fetchSchedule={fetchSchedule} />
      </div>

      <div className="flex">
        <ul style={{ marginTop: `${height}px` }}>
          {timeList.map((time, index) => (
            <li key={index} className="flex">
              <div
                style={{ width: `${width / 2}px`, height: `${height}px` }}
                className="flex justify-end px-2"
              >
                {time}
              </div>
              <div
                style={{
                  width: `${width * daysOfWeek.length}px`,
                  height: `${height}px`,
                  marginLeft: `${width / 2}px`,
                }}
                className="absolute border"
              ></div>
            </li>
          ))}
        </ul>

        <ul className="flex">
          {daysOfWeek.map((day, index) => (
            <li key={index}>
              <div
                style={{ width: `${width}px`, height: `${height}px` }}
                className="border flex justify-center items-center"
              >
                {day}
              </div>
              <ul
                style={{ height: `${height * timeList.length}px` }}
                className="border"
              >
                {schedules.map((schedule, index) => {
                  const scheduleForDay = schedule.time.filter(
                    (time) => time.day === day.toLowerCase(),
                  );
                  if (scheduleForDay.length > 0) {
                    return scheduleForDay.map((time, timeIndex) => {
                      const timeInTimestamp = convertTimeToTimestamp(
                        time.timeIn,
                      );
                      const timeOutTimestamp = convertTimeToTimestamp(
                        time.timeOut,
                      );
                      const startTimeTimestamp = startTime * 60;

                      const colorIndex = index % colors.length;
                      const color = colors[colorIndex];

                      return (
                        <li key={`${index}-${timeIndex}`} className="relative">
                          <SchedulePopup
                            schedule={schedule}
                            roomId={roomId}
                            timeId={time._id}
                          >
                            <div
                              style={{
                                width: `${width}px`,
                                height: `${(timeOutTimestamp - startTimeTimestamp - (timeInTimestamp - startTimeTimestamp)) * (height / 30)}px`,
                                position: "absolute",
                                marginTop: `${(timeInTimestamp - startTimeTimestamp) * (height / 30)}px`,
                                zIndex: 1,
                                backgroundColor: color,
                              }}
                              className="border p-1"
                            >
                              {schedule.title}
                              {schedule.user}

                              <div className="grid grid-cols-4 items-center gap-4">
                                <ul>
                                  {schedule.time.map((itime, index) =>
                                    time.day === itime.day ? (
                                      <li key={index}>
                                        <p className="flex">
                                          {itime.timeIn}-{itime.timeOut}
                                        </p>
                                      </li>
                                    ) : (
                                      <div key={index}></div>
                                    ),
                                  )}
                                </ul>
                              </div>
                            </div>
                          </SchedulePopup>
                        </li>
                      );
                    });
                  }
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScheduleTable;
