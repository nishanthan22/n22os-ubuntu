"use client";
import React, { useState, useEffect, ReactElement, FC } from "react";
import BgPic from "../utils/BgPic";
import SideBar from "./SideBar";
import apps from "../../apps.config";

interface AppConfig {
  id: string;
  title: string;
  icon: string;
  favourite: boolean;
  desktop_shortcut: boolean;
  screen: FC<{}> | ((addFolder: (folder: string) => void, openApp: (appId: string) => void) => ReactElement);
  disabled?: boolean;
  isExternalApp?: boolean;
  url?: string;
}

import Window from "../core/Window";
import AllApplications from "../pc/AllApps";
import ContextMenu from "../menu/Context";
import DefaultMenu from "../menu/Default";

interface DesktopProps {
  bg_image_name: string;
  changeBackgroundImage: (img: string) => void;
}

interface App {
  id: string;
  title: string;
  screen?: FC<{}> | ((addFolder: (folder: string) => void, openApp: (appId: string) => void) => ReactElement);
  icon: string;
  favourite: boolean;
  desktop_shortcut: boolean;
  disabled?: boolean;
  isExternalApp?: boolean;
  url?: string;
}

const Desktop: React.FC<DesktopProps> = ({ bg_image_name, changeBackgroundImage }) => {
  const [focusedWindows, setFocusedWindows] = useState<Record<string, boolean>>({});
  const [closedWindows, setClosedWindows] = useState<Record<string, boolean>>({});
  const [minimizedWindows, setMinimizedWindows] = useState<Record<string, boolean>>({});
  const [desktopApps, setDesktopApps] = useState<string[]>([]);
  const [favouriteApps, setFavouriteApps] = useState<Record<string, boolean>>({});
  const [contextMenus, setContextMenus] = useState({ desktop: false, default: false });
  const [showNameBar, setShowNameBar] = useState(false);
  const [allAppsView, setAllAppsView] = useState(false);
  const [appStack, setAppStack] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [localApps, setLocalApps] = useState<AppConfig[]>([]);

  useEffect(() => {
    setMounted(true);
    setLocalApps(
      apps.map((app) => ({
        ...app,
        screen: app.screen as FC<{}> | ((addFolder: (folder: string) => void, openApp: (appId: string) => void) => ReactElement),
      }))
    );
    fetchAppsData();
    document.addEventListener("contextmenu", checkContextMenu);
    document.addEventListener("click", hideAllContextMenu);
    return () => {
      document.removeEventListener("contextmenu", checkContextMenu);
      document.removeEventListener("click", hideAllContextMenu);
    };
  }, []);

  const checkContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenus({ desktop: false, default: false });

    if ((e.target as HTMLElement).dataset.context === "desktop-area") {
      setContextMenus({ desktop: true, default: false });
    } else {
      setContextMenus({ desktop: false, default: true });
    }
  };

  const hideAllContextMenu = () => setContextMenus({ desktop: false, default: false });

  const fetchAppsData = () => {
    const focused: Record<string, boolean> = {};
    const closed: Record<string, boolean> = {};
    const minimized: Record<string, boolean> = {};
    const desktop: string[] = [];
    const favourites: Record<string, boolean> = {};

    apps.forEach((app) => {
      focused[app.id] = false;
      closed[app.id] = true; // Ensures all apps start as closed
      minimized[app.id] = false;
      favourites[app.id] = app.favourite;
      if (app.desktop_shortcut) {
        desktop.push(app.id);
      }
    });

    setFocusedWindows(focused);
    setClosedWindows(closed);
    setMinimizedWindows(minimized);
    setDesktopApps(desktop);
    setFavouriteApps(favourites);
  };

  const addToDesktop = (folder: string) => {
    console.log("Adding folder:", folder);
  };

  const renderWindows = () => {
    if (!mounted) return null; // Prevents rendering on the server

    return localApps.map((app: App) => {
      console.log(`🔍 Checking app: ${app.id}, closed: ${closedWindows[app.id]}`);
      if (closedWindows[app.id]) {
        console.warn(`❌ Skipping ${app.id} because it is closed.`);
        return null;
      }
      console.log("📜 Current Apps-Localapps:", localApps);
      console.log("🚪 Closed Windows State:", closedWindows);

      let screenComponent: ReactElement | null = null;

      try {
        if (typeof app.screen === "function") {
          console.log(`🟢 Rendering screen for: ${app.id}`);
          const result = app.screen(addToDesktop, openApp);
          screenComponent = React.isValidElement(result) ? result : null;
        }
      } catch (error) {
        console.error(`Error rendering app ${app.id}:`, error);
        screenComponent = <div>Error loading application</div>;
      }

      if (!screenComponent) {
        console.warn(`❌ No screen found for ${app.id}`);
        return null;
      }

      return (
        <Window
          key={app.id}
          title={app.title}
          id={app.id}
          screen={() => screenComponent}
          closed={() => closeApp(app.id)}
          openApp={openApp}
          isFocused={focusedWindows[app.id]}
          minimized={minimizedWindows[app.id]}
          changeBackgroundImage={changeBackgroundImage}
          bg_image_name={bg_image_name}
          hideSideBar={() => {}}
          hasMinimised={() => {}}
        />
      );
    });
  };

  const openApp = (id: string) => {
    console.log(`🟢 Trying to Open App: ${id}`);

    setClosedWindows((prev) => ({ ...prev, [id]: false }));
    setMinimizedWindows((prev) => ({ ...prev, [id]: false }));
    setFocusedWindows((prev) => Object.fromEntries(Object.keys(prev).map((key) => [key, key === id])));
    setAppStack((prev) => [...prev.filter((app) => app !== id), id]);

    setTimeout(() => {
      setFocusedWindows((prev) => ({ ...prev, [id]: true }));
    }, 100);
  };

  const closeApp = (id: string) => {
    setAppStack((prev) => prev.filter((app) => app !== id));
    setClosedWindows((prev) => ({ ...prev, [id]: true }));
    setFocusedWindows((prev) => ({ ...prev, [id]: false }));
    setMinimizedWindows((prev) => ({ ...prev, [id]: false }));
  };

  const renderDesktopApps = () => (
    <div className="absolute right-5 top-20 flex flex-col items-center space-y-6">
      {apps.map((app) =>
        app.desktop_shortcut ? (
          <div key={app.id} onClick={() => openApp(app.id)} className="flex flex-col items-center cursor-pointer">
            <img src={app.icon} alt={app.title} className="w-12 h-12" />
            <p className="text-xs text-white mt-1 text-center font-medium">{app.title}</p>
          </div>
        ) : null
      )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent relative overflow-hidden">
      <div className="absolute h-full w-full bg-transparent" data-context="desktop-area">
        {renderWindows()}
      </div>
      <BgPic img={bg_image_name} />
      <SideBar
  apps={apps}
  favourite_apps={favouriteApps}
  closed_windows={closedWindows}
  focused_windows={focusedWindows}
  isMinimized={minimizedWindows}
  openAppByAppId={openApp}
  showAllApps={() => setAllAppsView(true)}
  setClosedWindows={setClosedWindows}
  setIsMinimized={setMinimizedWindows}
  setFocusedWindows={setFocusedWindows}
  openFromMinimised={(id) => {
    setMinimizedWindows((prev) => ({ ...prev, [id]: false }));
    setFocusedWindows((prev) => ({ ...prev, [id]: true }));
  }}
  hideSideBar={() => {}}
  hide={false}
/>
      {renderDesktopApps()}
      <ContextMenu active={contextMenus.desktop} openApp={openApp} addNewFolder={() => setShowNameBar(true)} />
      <DefaultMenu active={contextMenus.default} />
      {allAppsView && <AllApplications apps={localApps} openApp={openApp} />}
    </div>
  );
};

export default Desktop;