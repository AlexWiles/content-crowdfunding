import React, { useState, useEffect, useRef } from "react";
import { IconBaseProps } from "react-icons/lib/cjs";
import { FiLoader, FiX, FiCheck } from "react-icons/fi";

export type EffectStatus = "nascent" | "loading" | "no" | "yes";

type EffectStatusText = {
  nascent?: string;
  loading?: string;
  yes?: string;
  no?: string;
};

export const EffectStatus: React.FC<{
  state: EffectStatus;
  messages?: EffectStatusText;
  iconProps?: IconBaseProps;
}> = ({ state, messages = {}, iconProps = {} }) => {
  const Message: React.FC<{ message: string | undefined }> = ({ message }) => {
    if (message) {
      return (
        <span className="text-smaller text-muted" style={{ marginLeft: 5 }}>
          {message}
        </span>
      );
    } else {
      return <></>;
    }
  };

  switch (state) {
    case "nascent":
      return <div>{messages.nascent}</div>;
    case "loading":
      return (
        <div>
          <FiLoader name="loader" className="spin" {...iconProps} />
          <Message message={messages.loading} />
        </div>
      );
    case "no":
      return (
        <div>
          <FiX name="x" color="red" {...iconProps} />
          <Message message={messages.no} />
        </div>
      );
    case "yes":
      return (
        <div>
          <FiCheck name="check" color="green" {...iconProps} />
          <Message message={messages.yes} />
        </div>
      );
  }
};

export const useEffectWithStatus = (
  callback: () => Promise<void>,
  watcher: any[]
) => {
  const [state, setState] = useState<EffectStatus>("nascent");
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setState("loading");
    var resetTimeout: any;

    const timer = setTimeout(async () => {
      try {
        await callback();
        setState("yes");
        resetTimeout = setTimeout(() => setState("nascent"), 700);
      } catch (err) {
        setState("no");
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, watcher);

  return state;
};
