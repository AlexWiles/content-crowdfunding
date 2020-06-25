import React, { useState } from "react";
import moment from "moment";
import { FiLoader } from "react-icons/fi";
import { FaRedo } from "react-icons/fa";

export const useSave = (saveFn: () => Promise<void>): [() => Promise<void>, string, (s: string) => void] => {
  const [lastSaved, setLastSaved] = useState<string>("");

  const triggerSave = async () => {
    try {
      setLastSaved("Saving");
      await saveFn();
      setLastSaved("Saved at " + moment().format("HH:mm a"));
      window.onbeforeunload = null;
    } catch (e) {
      setLastSaved("Error");
    }
  };

  return [triggerSave, lastSaved, setLastSaved];
};

const LastSaved: React.FC<{ lastSaved: string; redo: () => void }> = ({
  lastSaved,
  redo,
}) => {
  if (lastSaved === "Saving") {
    return (
      <>
        <FiLoader className="spin mr-1" />
        Saving
      </>
    );
  } else if (lastSaved === "Error") {
    return (
      <div className="d-flex align-items-center cursor-pointer" onClick={redo}>
        <FaRedo className="mr-2" />
        Error try again
      </div>
    );
  } else {
    return <>{lastSaved}</>;
  }
};

export const BottomSaveBar: React.FC<{
  lastSaved: string;
  triggerSave: () => Promise<void>;
  saveButton: React.ReactNode;
}> = ({ lastSaved, triggerSave, saveButton }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        zIndex: 100
      }}
      className="bg-white  border-top"
    >
      <div className="d-flex justify-content-center">
        <div
          className="col-12 max-width-content"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 80,
          }}
        >
          <div className="d-flex align-items-center">{saveButton}</div>
          <div className="d-flex align-items-center text-muted">
            <LastSaved lastSaved={lastSaved} redo={triggerSave} />
          </div>
        </div>
      </div>
    </div>
  );
};
