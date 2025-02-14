import React, { useState, useEffect } from "react";

interface SideBarItemProps {
  id: string;
  icon: string;
  title: string;
  isMinimized: Record<string, boolean>;
  isClose: Record<string, boolean>;
  isFocus: Record<string, boolean>;
  openApp: (id: string) => void;
}

const DockItem: React.FC<SideBarItemProps> = ({ id, icon, title, isMinimized, isClose, isFocus, openApp }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [scaleImage, setScaleImage] = useState(false);

  useEffect(() => {
    if (!isMinimized[id] && isClose[id]) {
      scaleImageEffect();
    }
  }, [isMinimized, isClose]);

  const scaleImageEffect = () => {
    setScaleImage(true);
    setTimeout(() => setScaleImage(false), 1000);
  };

  const handleOpenApp = () => {
    openApp(id);
    setShowTitle(false);
  };

  return (
    <div
      tabIndex={0}
      onClick={handleOpenApp}
      onMouseEnter={() => setShowTitle(true)}
      onMouseLeave={() => setShowTitle(false)}
      className={`w-auto p-2 outline-none relative transition hover:bg-white hover:bg-opacity-10 rounded m-1 ${
        !isClose[id] && isFocus[id] ? "bg-white bg-opacity-10" : ""
      }`}
      id={`sidebar-${id}`}
    >
      <img width="28px" height="28px" className="w-7" src={icon} alt="Ubuntu App Icon" />
      <img
        className={`scalable-app-icon w-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          scaleImage ? " scale " : ""
        }`}
        src={icon}
        alt=""
      />
      {!isClose[id] && <div className="w-1 h-1 absolute left-0 top-1/2 bg-ub-orange rounded-sm"></div>}
      <div
        className={`w-max py-0.5 px-1.5 absolute top-1.5 left-full ml-3 m-1 text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md ${
          showTitle ? "visible" : "invisible"
        }`}
      >
        {title}
      </div>
    </div>
  );
};

export default DockItem;