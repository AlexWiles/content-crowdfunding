import React from "react";

export const Row: React.FC<{ className?: string, style?: React.CSSProperties}> = ({
  children,
  className = "",
  style = {}
}) => {
  return <div style={style} className={`row ${className}`}>{children}</div>;
};

export const Col: React.FC<{
  className?: string,
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}> = ({ children, xs=12, sm, md, lg, xl, className=""}) => {
  const colClasses = [
    "col",
    xs ? `col-${xs}` : "",
    sm ? `col-sm-${sm}` : "",
    md ? `col-md-${md}` : "",
    lg ? `col-lg-${lg}` : "",
    xl ? `col-xl-${xl}` : "",
    className
  ].filter(e => e !== "").join(" ");

  return <div className={colClasses}>{children}</div>;
};
