import React from "react";

interface ArrowProps {
  angle?: "up" | "down" | "left" | "right";
}

const Arrow: React.FC<ArrowProps> = ({ angle = "up" }) => {
  return <div className={`arrow-custom-${angle}`}></div>;
};

export default Arrow;
