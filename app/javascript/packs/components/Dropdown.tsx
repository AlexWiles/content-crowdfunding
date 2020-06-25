import React, { useState, ReactNode } from "react";
import { useClickOutside } from "../lib/hooks";

export const Dropdown: React.FC<{ clickable: ReactNode }> = ({
  clickable,
  children
}) => {
  const [clicked, setClicked] = useState(false);
  const ref = useClickOutside(() => setClicked(false), [setClicked]);

  return (
    <div className="settings-container position-relative" ref={ref}>
      <div className="cursor-pointer" onClick={() => setClicked(!clicked)}>

      {clickable}
      </div>
      {clicked ? (
        <div className="dropdown-dropdown position-relative">
          <div
            className="border-left border-top position-absolute bg-white"
            style={{
              width: 20,
              height: 20,
              top: 5,
              right: 2,
              transform: "rotate(45deg)",
              zIndex: 10
            }}
          ></div>
          <div
            className="position-absolute tight-shadow bg-white border p-3 sans-serif"
            style={{ top: 15, right: -10, zIndex: 9 }}
          >
            {children}
          </div>
        </div>
      ) : (
        undefined
      )}
    </div>
  );
};