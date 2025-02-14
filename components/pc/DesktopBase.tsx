"use client";
import React, { useState, useEffect } from "react";
import BgPic from "../utils/BgPic";
import SideBar from "./SideBar";
import apps from "../../apps.config";
import Window from "../core/Window";
import AllApplications from "../pc/AllApps";
import ContextMenu from "../menu/Context";
import DefaultMenu from "../menu/Default";
// import ReactGA from "react-ga4";

interface DesktopProps {
  bg_image_name: string;
  changeBackgroundImage: (img: string) => void;
}

const Desktop: React.FC<DesktopProps> = ({ bg_image_name, changeBackgroundImage }) => {
  const [focusedWindows, setFocusedWindows] = useState<Record<string, boolean>>({});
  const [closedWindows, setClosedWindows] = useState<Record<string, boolean>>({});
  const [minimizedWindows, setMinimizedWindows] = useState<Record<string, boolean>>({});
  const [desktopApps, setDesktopApps] = useState<string[]>([]);
  const [contextMenus, setContextMenus] = useState({ desktop: false, default: false });
  const [showNameBar, setShowNameBar] = useState(false);
  const [allAppsView, setAllAppsView] = useState(false);
  const [appStack, setAppStack] = useState<string[]>([]);

  // Context Menu Handler
  const checkContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenus({ desktop: false, default: false });

    if ((e.target as HTMLElement).dataset.context === "desktop-area") {
      setContextMenus({ desktop: true, default: false });
    } else {
      setContextMenus({ desktop: false, default: true });
    }
  };

  // Hide all Context Menus
  const hideAllContextMenu = () => {
    setContextMenus({ desktop: false, default: false });
  };

  useEffect(() => {
    // ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });
    fetchAppsData();
    document.addEventListener("contextmenu", checkContextMenu);
    document.addEventListener("click", hideAllContextMenu);

    return () => {
      document.removeEventListener("contextmenu", checkContextMenu);
      document.removeEventListener("click", hideAllContextMenu);
    };
  }, []);

  const fetchAppsData = () => {
    const focused: Record<string, boolean> = {};
    const closed: Record<string, boolean> = {};
    const minimized: Record<string, boolean> = {};
    const desktop: string[] = [];

    apps.forEach((app) => {
      focused[app.id] = false;
      closed[app.id] = true;
      minimized[app.id] = false;
      if (app.desktop_shortcut) {
        desktop.push(app.id);
      }
    });

    setFocusedWindows(focused);
    setClosedWindows(closed);
    setMinimizedWindows(minimized);
    setDesktopApps(desktop);
  };

  const renderWindows = () => {
    function addFolder(folder: string): void {
      throw new Error("Function not implemented.");
    }

    return apps.map((app, index) =>
      !closedWindows[app.id] ? (
        <Window
          key={index}
          title={app.title}
          id={app.id}
          screen={() => {
            if (typeof app.screen === "function") {
              const screenComponent = app.screen(addFolder, openApp); // Call it with required arguments
              if (React.isValidElement(screenComponent)) {
                return screenComponent; // Return directly if it's JSX
              } else if (typeof screenComponent === "function") {
                return React.createElement(screenComponent); // Create element if it's a component function
              }
            }
            return <div>Invalid Screen</div>;
          }}
          
          closed={() => closeApp(app.id)}
          openApp={openApp}
          isFocused={focusedWindows[app.id]}
          minimized={minimizedWindows[app.id]}
          changeBackgroundImage={changeBackgroundImage}
          bg_image_name={bg_image_name}
          hideSideBar={(id, hide) => console.log(`Hide Sidebar called for ${id}, hide: ${hide}`)}
          hasMinimised={(id) => console.log(`Minimized ${id}`)}
        />
      ) : null
    );
  };
  

  const openApp = (id: string) => {
    // ReactGA.event({ category: "Open App", action: `Opened ${id} window` });
    setClosedWindows((prev) => ({ ...prev, [id]: false }));
    setAppStack((prev) => [...prev, id]);
  };

  const closeApp = (id: string) => {
    setAppStack((prev) => prev.filter((app) => app !== id));
    setClosedWindows((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent relative overflow-hidden">
      {/* Window Area */}
      <div className="absolute h-full w-full bg-transparent" data-context="desktop-area">
        {renderWindows()}
      </div>

      {/* Background Image */}
      <BgPic img={bg_image_name} />

      {/* Ubuntu Side Menu Bar */}
      <SideBar
        apps={apps}
        favourite_apps={{}} // TODO: Implement favourite apps properly
        closed_windows={closedWindows}
        focused_windows={focusedWindows}
        isMinimized={minimizedWindows}
        openAppByAppId={openApp}
        openFromMinimised={() => {}} // TODO: Implement minimized app reopening
        hideSideBar={(id, hide) => console.log(`Hide Sidebar called for ${id}, hide: ${hide}`)}
        hide={false}
        showAllApps={() => setAllAppsView(true)}
      />

      {/* Context Menus */}
      <ContextMenu active={contextMenus.desktop} openApp={openApp} addNewFolder={() => setShowNameBar(true)} />
      <DefaultMenu active={contextMenus.default} />

      {/* All Apps View */}
      {allAppsView && <AllApplications apps={apps} openApp={openApp} />}
    </div>
  );
};

export default Desktop;
