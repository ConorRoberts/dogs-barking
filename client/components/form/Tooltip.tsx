import React, { useState } from "react";

const Tooltip = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative inline-block p-1"
      onMouseOver={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}>
      {/* <TooltipIcon /> */}
      {visible && (
        <div className="absolute top-0 right-0 p-2 rounded-md bg-gray-800 text-gray-100 bg-opacity-95 border border-gray-600 w-48 font-medium shadow-md z-10">
          {props.text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
