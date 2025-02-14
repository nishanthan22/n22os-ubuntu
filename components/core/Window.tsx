import React, { useState, useEffect, JSX } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";
// import ReactGA from "react-ga4";
import { displayTerminal } from "../apps/Terminal";
import Settings from "../apps/Settings";

interface WindowProps {
  id: string;
  title: string;
  minimized: boolean;
  isFocused: boolean;
  screen: () => JSX.Element;
  addFolder?: (name: string) => void;
  openApp: (id: string) => void;
  hideSideBar: (id: string, hide: boolean) => void;
  hasMinimised: (id: string) => void;
  closed: (id: string) => void;
  changeBackgroundImage?: (img: string) => void;
  bg_image_name?: string;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  minimized,
  isFocused,
  screen,
  addFolder,
  openApp,
  hideSideBar,
  hasMinimised,
  closed,
  changeBackgroundImage,
  bg_image_name,
}) => {
  const [cursorType, setCursorType] = useState("cursor-default");
  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(85);
  const [closedState, setClosedState] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [parentSize, setParentSize] = useState({ height: 100, width: 100 });

  useEffect(() => {
    setDefaultWindowDimension();
    // ReactGA.send({ hitType: "pageview", page: `/${id}`, title: "Custom Title" });
    window.addEventListener("resize", resizeBoundaries);
    return () => {
      // ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });
      window.removeEventListener("resize", resizeBoundaries);
    };
  }, []);

  const setDefaultWindowDimension = () => {
    if (window.innerWidth < 640) {
      setHeight(60);
      setWidth(85);
    } else {
      setHeight(85);
      setWidth(60);
    }
  };

  const resizeBoundaries = () => {
    setParentSize({
      height: window.innerHeight - window.innerHeight * (height / 100) - 28,
      width: window.innerWidth - window.innerWidth * (width / 100),
    });
  };

  const changeCursorToMove = () => {
    focusWindow();
    if (maximized) restoreWindow();
    setCursorType("cursor-move");
  };

  const changeCursorToDefault = () => setCursorType("cursor-default");

  const focusWindow = () => openApp(id);

  const closeWindow = () => {
    setClosedState(true);
    hideSideBar(id, false);
    setTimeout(() => closed(id), 300);
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        left: 0,
        top: 0,
        right: parentSize.width,
        bottom: parentSize.height
      }}
      dragElastic={0} // Prevents dragging beyond bounds
      dragMomentum={false} // Matches react-draggable behavior
      onDragStart={changeCursorToMove}
      onDragEnd={changeCursorToDefault}
      initial={{ x: 60, y: 10 }} // Equivalent to defaultPosition
      className="bg-ub-window-title" // Handle styling remains the same
    >
      <div
        style={{ width: `${width}%`, height: `${height}%` }}
        className={`${cursorType} ${closedState ? " closed-window " : ""} ${maximized ? " duration-300 rounded-none" : " rounded-lg rounded-b-none"} ${minimized ? " opacity-0 invisible duration-200 " : ""} ${isFocused ? " z-30 " : " z-20 notFocused"} opened-window overflow-hidden min-w-1/4 min-h-1/4 main-window absolute window-shadow border-black border-opacity-40 border border-t-0 flex flex-col`}
        id={id}
      >
        <WindowTopBar title={title} />
        { id === "settings" ? (
          <Settings 
            changeBackgroundImage={changeBackgroundImage ?? (() => {})} 
            currBgImgName={bg_image_name ?? "default-wallpaper"} 
          />
        ) : (
          <WindowMainScreen screen={screen} addFolder={id === "terminal" ? addFolder : undefined} openApp={openApp} />
        )}
      </div>
    </motion.div>
  );
};

export default Window;

const WindowTopBar: React.FC<{ title: string }> = ({ title }) => (
  <div className="relative bg-ub-window-title border-t-2 border-white border-opacity-5 py-1.5 px-3 text-white w-full select-none rounded-b-none">
    <div className="flex justify-center text-sm font-bold">{title}</div>
  </div>
);

const WindowMainScreen: React.FC<{ screen: () => JSX.Element; addFolder?: (name: string) => void; openApp: (id: string) => void }> = ({ screen, addFolder, openApp }) => {
  const [setDarkBg, setSetDarkBg] = useState(false);

  useEffect(() => {
    setTimeout(() => setSetDarkBg(true), 3000);
  }, []);

  return (
    <div className={`w-full flex-grow z-20 max-h-full overflow-y-auto windowMainScreen${setDarkBg ? " bg-ub-drk-abrgn " : " bg-ub-cool-grey"}`}>
      {addFolder ? displayTerminal(addFolder, openApp) : screen()}
    </div>
  );
};
function restoreWindow() {
  throw new Error("Function not implemented.");
}

