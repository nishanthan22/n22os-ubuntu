import React from "react";

interface BgPicProps {
  img: string;
}

const BgPic: React.FC<BgPicProps> = ({ img }) => {
  const bgImages: Record<string, string> = {
    "wp1": "./images/wallpapers/wp1.webp",
    "wp2": "./images/wallpapers/wp2.webp",
    "wp3": "./images/wallpapers/wp3.webp",
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImages[img]})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "center",
      }}
      className="bg-ubuntu-img absolute -z-10 top-0 right-0 overflow-hidden h-full w-full"
    ></div>
  );
};

export default BgPic;
