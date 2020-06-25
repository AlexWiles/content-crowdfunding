import React from "react";
import { User } from "../lib/react_service";

export const Avatar: React.FC<{ user: User }> = ({
  user: { color, avatar }
}) => {
  if (avatar) {
    return (
      <img
        src={avatar}
        style={{
          height: 100,
          width: 100,
          borderRadius: 100,
          objectFit: "cover"
        }}
      />
    );
  } else {
    return (
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 100,
          backgroundColor: color
        }}
      ></div>
    );
  }
};
