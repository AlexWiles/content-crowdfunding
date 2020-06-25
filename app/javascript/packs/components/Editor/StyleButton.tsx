import React, { CSSProperties } from "react";
import { colors } from "./style";

type StyleButtonProps = {
  label: string | React.ReactElement;
  active: boolean;
  onChange: () => void;
};

export const StyleButton: React.FC<StyleButtonProps> = ({
  label,
  active,
  onChange
}) => {
  const buttonStyle: CSSProperties = active ? { color: colors.blue } : {};

  return (
    <div
      style={{
        ...{
          margin: 5,
          cursor: "pointer",
          color: colors.gray,
          display: "flex",
          alignItems: "center"
        },
        ...buttonStyle
      }}
      onMouseDown={e => {
        e.preventDefault();
        onChange();
      }}
    >
      {label}
    </div>
  );
};
