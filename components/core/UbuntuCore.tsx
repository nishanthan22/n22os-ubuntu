import React from "react";

interface UbuntuCoreProps {
  id: string;
  name: string;
  icon: string;
  url?: string;
  isExternalApp?: boolean;
  openApp: (id: string) => void;
}

const UbuntuCore: React.FC<UbuntuCoreProps> = ({ id, name, icon, url, isExternalApp, openApp }) => {
  const handleOpenApp = () => {
    if (isExternalApp && url) {
      window.open(url, "_blank");
    } else {
      openApp(id);
    }
  };

  return (
    <div
      className="p-1 m-px z-10 bg-white bg-opacity-0 hover:bg-opacity-20 focus:bg-ub-orange focus:bg-opacity-50 focus:border-yellow-700 focus:border-opacity-100 border border-transparent outline-none rounded select-none w-24 h-20 flex flex-col justify-start items-center text-center text-xs font-normal text-white relative"
      id={`app-${id}`}
      onDoubleClick={handleOpenApp}
      tabIndex={0}
    >
      <div className="relative">
        <img width="40px" height="40px" className="mb-1 w-10" src={icon} alt={`Ubuntu ${name}`} />
        {isExternalApp && (
          <img 
            src="./themes/Yaru/status/arrow-up-right.svg" 
            alt="External Link" 
            className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5"
          />
        )}
      </div>
      {name}
    </div>
  );
};

export default UbuntuCore;
