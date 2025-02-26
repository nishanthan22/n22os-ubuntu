import React, { useState, useEffect, JSX } from "react";
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
    console.log(`🟢 <Window /> component mounted for: ${id}`);
  }, []);
  
  useEffect(() => {
    setDefaultWindowDimension();
    resizeBoundaries();
    window.addEventListener("resize", resizeBoundaries);
    return () => {
      window.removeEventListener("resize", resizeBoundaries);
    };
  }, []);

   // Add this effect to handle visibility
   useEffect(() => {
    console.log(`🔄 Window ${id} | isFocused: ${isFocused} | closedState: ${closedState}`);
    if (isFocused) {
      setClosedState(false); // Reset closed state
    }
  }, [isFocused, closedState]);
  

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
    console.log(`🛑 Closing window: ${id}`);
    setClosedState(true);
    setTimeout(() => closed(id), 300);
  };

  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.9 }} // Start slightly faded
    animate={{
      opacity: 1, // Ensure the window is always visible
      scale: 1, 
    }}
    exit={{
      opacity: 0, 
      scale: 0.8
    }}
    transition={{ duration: 0.3 }}

   >

      <div
        style={{ width: `${width}%`, height: `${height}%` }}
        className={`${cursorType} 
          ${maximized ? "rounded-none" : "rounded-lg rounded-b-none"} 
          ${isFocused ? "z-30" : "z-20 notFocused"} 
          opened-window overflow-hidden min-w-1/4 min-h-1/4 main-window absolute window-shadow 
          border-black border-opacity-40 border border-t-0 flex flex-col`}
        id={id}
      >
       

<WindowTopBar title={title} closeWindow={closeWindow} />

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

const WindowTopBar: React.FC<{ title: string; closeWindow: () => void }> = ({ title, closeWindow }) => (
  <div className="relative bg-ub-window-title border-t-2 border-white border-opacity-5 py-1.5 px-3 text-white w-full select-none rounded-b-none flex justify-between items-center">
    <div className="text-sm font-bold">{title}</div>
    <button 
      className="text-white bg-red-600 hover:bg-red-800 px-2 py-0.5 rounded"
      onClick={closeWindow}
    >
      ✖
    </button>
  </div>
);


const WindowMainScreen: React.FC<{ screen: () => JSX.Element; addFolder?: (name: string) => void; openApp: (id: string) => void }> = ({ screen, addFolder, openApp }) => {
  const [setDarkBg, setSetDarkBg] = useState(false);

  useEffect(() => {
    setTimeout(() => setSetDarkBg(true), 3000);
  }, []);

  let screenComponent: JSX.Element | null = null;
  try {
    screenComponent = screen();
    console.log(`🟢 screen() executed for window, output:`, screenComponent);
  } catch (error) {
    console.error(`❌ Error rendering screen:`, error);
    screenComponent = <div>Error loading application</div>;
  }
  
  if (!screenComponent) {
    console.warn(`❌ screenComponent is null, window will not render!`);
    return null;
  }
  

  return (
    <div className={`w-full flex-grow z-20 max-h-full overflow-y-auto windowMainScreen${setDarkBg ? " bg-ub-drk-abrgn " : " bg-ub-cool-grey"}`}>
      {screenComponent}
    </div>
  );
};

function restoreWindow() {
  throw new Error("Function not implemented.");
}

