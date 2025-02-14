"use client";
import { useState, useEffect } from "react";

interface ClockProps {
  onlyTime?: boolean;
  onlyDay?: boolean;
}

const Clock: React.FC<ClockProps> = ({ onlyTime, onlyDay }) => {
  const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hour12, setHour12] = useState(true);

  useEffect(() => {
    const updateTime = setInterval(() => {
      setCurrentTime(new Date());
    }, 10 * 1000);
    return () => clearInterval(updateTime);
  }, []);

  let day = dayList[currentTime.getDay()];
  let hour = currentTime.getHours();
  let minute = currentTime.getMinutes();
  let month = monthList[currentTime.getMonth()];
  let date = currentTime.getDate().toLocaleString();
  let meridiem = hour < 12 ? "AM" : "PM";

  if (minute.toLocaleString().length === 1) {
    minute = parseInt("0" + minute);
  }

  if (hour12 && hour > 12) hour -= 12;

  let displayTime;
  if (onlyTime) {
    displayTime = `${hour}:${minute.toString().padStart(2, "0")} ${meridiem}`;
  } else if (onlyDay) {
    displayTime = `${day} ${month} ${date}`;
  } else {
    displayTime = `${day} ${month} ${date} ${hour}:${minute.toString().padStart(2, "0")} ${meridiem}`;
  }

  return <span>{displayTime}</span>;
};

export default Clock;
