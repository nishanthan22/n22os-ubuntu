
import React, { useState } from "react";
import DockItem from "../core/DockItem";

interface App {
  id: string;
  title: string;
  icon: string;
}

interface SideBarProps {
  apps: App[];
  favourite_apps: Record<string, boolean>;
  closed_windows: Record<string, boolean>;
  focused_windows: Record<string, boolean>;
  isMinimized: Record<string, boolean>;
  openAppByAppId: (id: string) => void;
  openFromMinimised: (id: string) => void;
  hideSideBar: (id: string | null, hide: boolean) => void;
  hide: boolean;
  showAllApps: () => void;
}

const SideBar: React.FC<SideBarProps> = (props) => {
  const showSideBar = () => props.hideSideBar(null, false);

  const hideSideBar = () => {
    setTimeout(() => {
      props.hideSideBar(null, true);
    }, 2000);
  };

  const renderApps = () => {
    return props.apps
      .filter((app) => props.favourite_apps[app.id])
      .map((app, index) => (
        <DockItem
          key={index}
          id={app.id}
          title={app.title}
          icon={app.icon}
          isClose={props.closed_windows}
          isFocus={props.focused_windows}
          openApp={props.openAppByAppId}
          isMinimized={props.isMinimized}
        />
      ));
  };

  return (
    <>
      <div
        className={`absolute transform duration-300 select-none z-40 left-0 top-0 h-full pt-4 w-auto flex flex-col justify-start items-center bg-black bg-opacity-60 border-r border-gray-800 ${
          props.hide ? "-translate-x-full" : ""
        }`}
      >
        {Object.keys(props.closed_windows).length !== 0 ? renderApps() : null}
        <AllApps showApps={props.showAllApps} />
      </div>
      <div
        onMouseEnter={showSideBar}
        onMouseLeave={hideSideBar}
        className="w-1 h-full absolute top-0 left-0 bg-transparent z-50"
      ></div>
    </>
  );
};

interface AllAppsProps {
  showApps: () => void;
}

const AllApps: React.FC<AllAppsProps> = ({ showApps }) => {
  const [title, setTitle] = useState(false);

  return (
    <div
      className="w-10 h-10 rounded m-1 hover:bg-white hover:bg-opacity-10 flex items-center justify-center"
      style={{ marginTop: "auto" }}
      onMouseEnter={() => setTitle(true)}
      onMouseLeave={() => setTitle(false)}
      onClick={showApps}
    >
      <div className="relative">
        <img
          width="28px"
          height="28px"
          className="w-7"
          src="./themes/Yaru/system/view-app-grid-symbolic.svg"
          alt="Ubuntu view app"
        />
        <div
          className={`w-max py-0.5 px-1.5 absolute top-1 left-full ml-5 text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md ${
            title ? "visible" : "invisible"
          }`}
        >
          Show Applications
        </div>
      </div>
    </div>
  );
};

export default SideBar;
