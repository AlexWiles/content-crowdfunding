import React from "react";

export const Button: React.FC<{
  value: string;
  selected: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ value, selected, className, onClick = () => {} }) => (
  <button
    className={`btn btn-outline-primary ${selected ? "active" : ""} ${String(
      className
    )}`}
    type="button"
    style={{ marginRight: 10 }}
    onClick={e => onClick()}
  >
    {value}
  </button>
);