import React from "react";
import { colors } from "./style";
import { Map } from "immutable";

const Codeblock: React.FC = ({ children }) => {
  return (
    <div
      style={{
        fontFamily:
          "SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace",
        fontSize: 14,
        padding: 5,
        lineHeight: "1.2rem",
        backgroundColor: colors.lightestGray,
        overflowX: "scroll",
        whiteSpace: "nowrap"
      }}
    >
      {children}
    </div>
  );
};

export const codeblockRenderMap = Map({
  "code-block": {
    element: "pre",
    wrapper: <Codeblock />,
    aliasedElements: []
  }
});
