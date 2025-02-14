import React from 'react';

interface SettingsProps {
    currBgImgName: string;
    changeBackgroundImage: (imgPath: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ currBgImgName, changeBackgroundImage }) => {
    const wallpapers: Record<string, string> = {
        "wp1": "./images/wallpapers/wp1.webp",
        "wp2": "./images/wallpapers/wp2.webp",
        "wp3": "./images/wallpapers/wp3.webp",
    };

    const handleBackgroundChange = (imgPath: string) => {
        changeBackgroundImage(imgPath);
    };

    return (
        <div className="w-full flex-col flex-grow z-20 max-h-full overflow-y-auto windowMainScreen select-none bg-ub-cool-grey">
            {/* Preview of the selected wallpaper */}
            <div
                className="md:w-2/5 w-2/3 h-1/3 m-auto my-4"
                style={{
                    backgroundImage: `url(${wallpapers[currBgImgName]})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center"
                }}
            ></div>

            {/* Wallpaper Selection Grid */}
            <div className="flex flex-wrap justify-center items-center border-t border-gray-900">
                {Object.keys(wallpapers).map((name, index) => (
                    <div
                        key={index}
                        tabIndex={1}
                        onFocus={() => handleBackgroundChange(name)}
                        className={`md:px-28 md:py-20 md:m-4 m-2 px-14 py-10 outline-none border-4 border-opacity-80 ${
                            name === currBgImgName ? "border-yellow-700" : "border-transparent"
                        }`}
                        style={{
                            backgroundImage: `url(${wallpapers[name]})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center center"
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Settings;

export const displaySettings = () => {
    return <Settings currBgImgName="wp1" changeBackgroundImage={() => {}} />;
};
