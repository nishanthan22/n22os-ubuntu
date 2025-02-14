"use client";
import React, { useEffect } from "react";
import Clock from "../utils/Clock";

interface LockScreenProps {
  isLocked: boolean;
  unLockScreen: () => void;
  bgImgName: string;
}

const LockScreen: React.FC<LockScreenProps> = ({ isLocked, unLockScreen, bgImgName }) => {
  const wallpapers: Record<string, string> = {
    "wp1": "./images/wallpapers/wp1.webp",
    "wp2": "./images/wallpapers/wp2.webp",
    "wp3": "./images/wallpapers/wp3.webp",
  };

  useEffect(() => {
    if (isLocked) {
      window.addEventListener("click", unLockScreen);
      window.addEventListener("keypress", unLockScreen);
    }
    return () => {
      window.removeEventListener("click", unLockScreen);
      window.removeEventListener("keypress", unLockScreen);
    };
  }, [isLocked, unLockScreen]);

  return (
    <div
      id="ubuntu-lock-screen"
      style={{ zIndex: 100 }}
      className={`absolute outline-none bg-black bg-opacity-90 transform duration-500 select-none top-0 right-0 overflow-hidden m-0 p-0 h-screen w-screen ${
        isLocked ? "visible translate-y-0" : "invisible -translate-y-full"
      }`}
    >
      <div
        style={{
          backgroundImage: `url(${wallpapers[bgImgName]})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "center",
        }}
        className="absolute top-0 left-0 w-full h-full transform z-20 blur-md"
      ></div>
      <div className="w-full h-full z-50 overflow-hidden relative flex flex-col justify-center items-center text-white">
        <div className="text-7xl">
          <Clock onlyTime={true} />
        </div>
        <div className="mt-4 text-xl font-medium">
          <Clock onlyDay={true} />
        </div>
        <div className="mt-16 text-base">Click or Press a key to unlock</div>
      </div>
    </div>
  );
};

export default LockScreen;
