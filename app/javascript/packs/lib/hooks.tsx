import React, { useEffect, useState } from "react";

export const useClickOutside = (
  callback: () => void,
  watcher: any[]
): React.MutableRefObject<any> => {
  const ref = React.useRef<any>(null);

  const handleClick = (event: MouseEvent): void => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  const effect = () => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  };

  React.useEffect(effect, watcher);
  return ref;
};