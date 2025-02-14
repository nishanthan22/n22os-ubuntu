"use client";
import React, { useState, useEffect } from "react";
import BootingScreen from "./pc/Boot";
import Desktop from "./pc/DesktopBase";
import LockScreen from "./pc/LockScreen";
import Navbar from "./pc/NavBar";
// import ReactGA from "react-ga4";

const Ubuntu: React.FC = () => {
  const [screenLocked, setScreenLocked] = useState<boolean>(false);
  const [bgImageName, setBgImageName] = useState<string>("wp2");
  const [bootingScreen, setBootingScreen] = useState<boolean>(true);
  const [shutDownScreen, setShutDownScreen] = useState<boolean>(false);

  useEffect(() => {
    getLocalData();
  }, []);

  const setTimeOutBootScreen = () => {
    setTimeout(() => {
      setBootingScreen(false);
    }, 2000);
  };

  const getLocalData = () => {
    const bgImage = localStorage.getItem("bg-image");
    if (bgImage) setBgImageName(bgImage);

    const bootScreen = localStorage.getItem("booting_screen");
    if (bootScreen) {
      setBootingScreen(false);
    } else {
      localStorage.setItem("booting_screen", "false");
      setTimeOutBootScreen();
    }

    const shutDown = localStorage.getItem("shut-down");
    if (shutDown === "true") shutDownHandler();
    else {
      const screenLock = localStorage.getItem("screen-locked");
      setScreenLocked(screenLock === "true");
    }
  };

  const lockScreen = () => {
    // ReactGA.send({ hitType: "pageview", page: "/lock-screen", title: "Lock Screen" });
    // ReactGA.event({ category: "Screen Change", action: "Set Screen to Locked" });
    document.getElementById("status-bar")?.blur();
    setTimeout(() => setScreenLocked(true), 100);
    localStorage.setItem("screen-locked", "true");
  };

  const unLockScreen = () => {
    // ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });
    window.removeEventListener("click", unLockScreen);
    window.removeEventListener("keypress", unLockScreen);
    setScreenLocked(false);
    localStorage.setItem("screen-locked", "false");
  };

  const changeBackgroundImage = (imgName: string) => {
    setBgImageName(imgName);
    localStorage.setItem("bg-image", imgName);
  };

  const shutDownHandler = () => {
    // ReactGA.send({ hitType: "pageview", page: "/switch-off", title: "Custom Title" });
    // ReactGA.event({ category: "Screen Change", action: "Switched off the Ubuntu" });
    document.getElementById("status-bar")?.blur();
    setShutDownScreen(true);
    localStorage.setItem("shut-down", "true");
  };

  const turnOn = () => {
    // ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });
    setShutDownScreen(false);
    setBootingScreen(true);
    setTimeOutBootScreen();
    localStorage.setItem("shut-down", "false");
  };

  return (
    <div className="w-screen h-screen overflow-hidden" id="monitor-screen">
    <LockScreen isLocked={screenLocked} bgImgName={bgImageName} unLockScreen={unLockScreen} />
    <BootingScreen visible={bootingScreen} isShutDown={shutDownScreen} turnOn={turnOn} />
    <Navbar lockScreen={lockScreen} shutDown={shutDownHandler} />
    <Desktop bg_image_name={bgImageName} changeBackgroundImage={changeBackgroundImage} />
  </div>  
  );
};

export default Ubuntu;
