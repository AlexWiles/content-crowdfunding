import React, { useState, useEffect } from "react";
import { get } from "../../lib/api";
import {
  Validity,
  yes,
  ValidityIcon,
  validateText,
  useValidText,
  ValidityState,
} from "../../lib/valid";

const validationOptions = {
  minLength: 3,
  maxLength: 30,
  alphanumeric: true,
};

const remoteValidation = (
  path: string,
  value: string
): { resp: Promise<ValidityState>; controller: AbortController } => {
  const { controller, resp } = get(path, { query: { slug: value } });
  const validResp = resp.then(
    ({ available }: { available: boolean }): ValidityState => {
      if (available) {
        return { validState: "yes", msg: ["Username is available"] };
      } else {
        return { validState: "no", msg: ["Username is already taken"] };
      }
    }
  );

  return { controller, resp: validResp };
};

export const SlugInput: React.FC<{
  value: string;
  onChange: (value: string, validityState: ValidityState) => void;
  validationPath: string;
  domain: string;
}> = ({ value, validationPath, domain, onChange }) => {
  const validState = useValidText({
    value: value,
    validationOptions,
    asyncValidation: (value: string) => remoteValidation(validationPath, value),
  });

  useEffect(() => onChange(value, validState), [validState]);

  return (
    <div>
      <div className="d-flex align-items-center">
        <input
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value, validState)}
          className="form-control"
        ></input>
      </div>
      <div
        className="d-flex align-items-center mt-2"
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
