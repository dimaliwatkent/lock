// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://schedulock.netlify.app/.netlify/functions/api",
});

const getSchedules = async (roomId) => {
  const response = await api.get(`/schedules/${roomId}`);
  return response.data;
};

const createSchedule = async (roomId, scheduleData) => {
  console.log(scheduleData);
  const response = await api.post(`/schedules/${roomId}`, scheduleData);
  return response.data;
};

const updateSchedule = async (roomId, scheduleId, scheduleData) => {
  const response = await api.patch(
    `/schedules/${roomId}/${scheduleId}`,
    scheduleData,
  );
  return response.data;
};

const deleteSchedule = async (roomId, scheduleId) => {
  const response = await api.delete(`/schedules/${roomId}/${scheduleId}`);
  return response.data;
};

const getRooms = async () => {
  const response = await api.get(`/rooms/`);
  return response.data;
};

const addRoom = async (roomForm) => {
  const response = await api.post(`/rooms/`, roomForm);
  return response.data;
};

const deleteRoom = async (roomId) => {
  const response = await api.delete(`/rooms/${roomId}`);
  return response.data;
};

const checkAvailabililty = async (roomId, dateTime) => {
  const response = await api.post(`/schedules/${roomId}/check-time`, dateTime);
  return response.data;
};

export {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getRooms,
  addRoom,
  deleteRoom,
  checkAvailabililty,
};
