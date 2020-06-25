import React from "react";
import { colors } from "./style";
import { Map } from "immutable";

export const Blockquote: React.FC = ({ children }) => {
  return (
    <div
      style={{
        borderLeftWidth: 4,
        borderLeftStyle: "solid",
        borderLeftColor: colors.lightGray,
        paddingLeft: 10,
        fontSize: "1.5rem",
        fontFamily: "Georgia, serif"
      }}
    >
      {children}
    </div>
  );
};
