import React, { useState, useEffect } from "react";
import {
  ValidityIcon,
  yes,
  useValidFiles,
  ValidityState,
  validateFile,
  nascentValidity
} from "../../lib/valid";
import { patch } from "../../lib/api";
import { User } from "../../lib/react_service";

type AvatarInputProps = {
  onChange: (value: string | undefined, validity: ValidityState) => void;
};

export const AvatarInput: React.FC<AvatarInputProps> = ({ onChange }) => {
  const [validState, setValidState] = useState(nascentValidity);

  const validationOptions = {
    onlyOne: true,
    okMsg: "Looks good",
    fileTypes: ["image/jpeg", "image/jpg", "image/png"],
    maxSize: 10485760
  };

  return (
    <div>
      <input
        type="file"
        onChange={e => {
          if (e.target.files) {
            const files = e.target.files
            const reader = new FileReader();
            const validState = validateFile(validationOptions, e.target.files);
            setValidState(validState);

            reader.onload = () => {
              if (typeof reader.result === "string") {
                onChange(reader.result, validState);
              }
            };

            if (files && files[0] && validState.validState === "yes") {
              reader.readAsDataURL(files[0]);
            } else {
              onChange(undefined, validState);
            }
          }
        }}
      />
      <div
        className="d-flex align-items-center mt-1"
        style={{ height: "1.2rem" }}
      >
        <div className="mr-1 d-flex align-items-center">
          <ValidityIcon validity={validState.validState} size="1rem" />
        </div>
        <div className="text-smaller">{validState.msg}</div>
      </div>
    </div>
  );
};
