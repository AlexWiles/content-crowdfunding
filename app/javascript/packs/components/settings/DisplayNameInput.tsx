import React, { useState, useEffect } from "react";
import {
  useValidText,
  ValidityIcon,
  ValidityState,
  validateText,
} from "../../lib/valid";

export const DisplayNameInput: React.FC<{
  value: string;
  validState: ValidityState;
  onChange: (value: string, validState: ValidityState) => void;
}> = ({ value, validState, onChange }) => {

  const validationOptions = { minLength: 0, maxLength: 50, okMsg: "Looks good" }

  return (
    <div>
      <input
        className="form-control"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value, validateText(validationOptions, e.target.value))}
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
