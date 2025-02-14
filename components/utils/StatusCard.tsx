"use client";
import React, { useState, useEffect, useRef } from "react";
import SmallArrow from "./Arrow";

interface StatusCardProps {
  visible: boolean;
  toggleVisible: () => void;
  lockScreen: () => void;
  shutDown: () => void;
}

const Slider: React.FC<{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; className: string; name: string; value: number; }> = ({ onChange, className, name, value }) => (
  <input type="range" onChange={onChange} className={className} name={name} min="0" max="100" value={value} step="1" />
);

const StatusCard: React.FC<StatusCardProps> = ({ visible, toggleVisible, lockScreen, shutDown }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [soundLevel, setSoundLevel] = useState<number>(75);
  const [brightnessLevel, setBrightnessLevel] = useState<number>(100);

  useEffect(() => {
    const savedSound = Number(localStorage.getItem("sound-level")) || 75;
    const savedBrightness = Number(localStorage.getItem("brightness-level")) || 100;
    setSoundLevel(savedSound);
    setBrightnessLevel(savedBrightness);
    document.getElementById("monitor-screen")!.style.filter = `brightness(${(3 / 400) * savedBrightness + 0.25})`;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        toggleVisible();
      }
    };
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, toggleVisible]);

  const handleBrightness = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setBrightnessLevel(value);
    localStorage.setItem("brightness-level", value.toString());
    document.getElementById("monitor-screen")!.style.filter = `brightness(${(3 / 400) * value + 0.25})`;
  };

  const handleSound = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSoundLevel(value);
    localStorage.setItem("sound-level", value.toString());
  };

  return (
    <div
      ref={wrapperRef}
      className={`absolute bg-ub-cool-grey rounded-md py-4 top-9 right-3 shadow border-black border border-opacity-20 status-card ${visible ? "visible animateShow" : "invisible"}`}
    >
      <div className="absolute w-0 h-0 -top-1 right-6 top-arrow-up" />
      <div className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20">
        <div className="w-8">
          <img width="16px" height="16px" src="./themes/Yaru/status/audio-headphones-symbolic.svg" alt="ubuntu headphone" />
        </div>
        <Slider onChange={handleSound} className="ubuntu-slider w-2/3" value={soundLevel} name="headphone_range" />
      </div>
      <div className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20">
        <div className="w-8">
          <img width="16px" height="16px" src="./themes/Yaru/status/display-brightness-symbolic.svg" alt="ubuntu brightness" />
        </div>
        <Slider onChange={handleBrightness} className="ubuntu-slider w-2/3" name="brightness_range" value={brightnessLevel} />
      </div>
      <div className="w-64 flex content-center justify-center">
        <div className="w-2/4 border-black border-opacity-50 border-b my-2 border-solid" />
      </div>
      <div className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20" onClick={lockScreen}>
        <div className="w-8">
          <img width="16px" height="16px" src="./themes/Yaru/status/changes-prevent-symbolic.svg" alt="ubuntu lock" />
        </div>
        <span>Lock</span>
      </div>
      <div className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20" onClick={shutDown}>
        <div className="w-8">
          <img width="16px" height="16px" src="./themes/Yaru/status/system-shutdown-symbolic.svg" alt="ubuntu power" />
        </div>
        <span>Power Off / Log Out</span>
        <SmallArrow angle="right" />
      </div>
    </div>
  );
};

export default StatusCard;
