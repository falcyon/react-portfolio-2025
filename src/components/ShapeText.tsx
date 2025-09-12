// shape component
import React from "react";

interface ShapeTextProps {
  text?: string;
  textType?: string;
}

const ShapeText: React.FC<ShapeTextProps> = ({ text, textType }) => {
  if (!text) return null;
  return <span className={textType}>{text}</span>;
};
export default ShapeText;
