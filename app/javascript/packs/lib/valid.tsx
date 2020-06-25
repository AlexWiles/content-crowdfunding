import React, { useEffect, useState } from "react";
import { FiLoader, FiX, FiCheck } from "react-icons/fi";
import { IconBaseProps } from "react-icons/lib/cjs/iconBase";

export type Validity = "nascent" | "loading" | "yes" | "no";
export type ValidityState = { validState: Validity; msg: string[] };
export const nascentValidity: ValidityState = {validState: "nascent", msg: []}

export const ValidityIcon: React.FC<{
  validity: Validity;
} & IconBaseProps> = props => {
  switch (props.validity) {
    case "nascent":
      return <></>;
    case "loading":
      return <FiLoader name="loader" className="spin" {...props} />;
    case "no":
      return <FiX name="x" color="red" {...props} />;
    case "yes":
      return <FiCheck name="check" color="green" {...props} />;
  }
};

export const yes = (state: ValidityState): boolean => {
  return state.validState === "yes";
};

export type ValidTextOptions = {
  minLength?: number;
  maxLength?: number;
  alphanumeric?: boolean;
  okMsg?: string;
};

export const validateText = (
  { minLength, maxLength, alphanumeric, okMsg }: ValidTextOptions,
  s: string
): ValidityState => {
  if (minLength && s.length < minLength) {
    return {
      validState: "no",
      msg: [`Minimum length is ${minLength} characters.`]
    };
  }

  if (maxLength && s.length > maxLength) {
    return {
      validState: "no",
      msg: [`Maximum length is ${maxLength} characters.`]
    };
  }

  if (alphanumeric && !s.match(/^[0-9a-zA-Z]+$/)) {
    return {
      validState: "no",
      msg: ["Username may only contain letters and numbers."]
    };
  }

  return { validState: "yes", msg: okMsg ? [okMsg] : [] };
};

type ValidateFilesOptions = {
  onlyOne: boolean;
  minSize?: number;
  maxSize?: number;
  fileTypes?: string[];
  okMsg?: string;
};

export const validateFile = (
  { okMsg, onlyOne, minSize, maxSize, fileTypes }: ValidateFilesOptions,
  files: FileList | Blob[]
): ValidityState => {
  if (onlyOne && files.length > 1) {
    return {
      validState: "no",
      msg: ["Please select only one file"]
    };
  }

  if (files && fileTypes) {
    let newState: ValidityState | undefined = undefined;
    Array.from(files).forEach(f => {
      if (!fileTypes.includes(f.type)) {
        newState = {
          validState: "no",
          msg: ["Please select a valid file type"]
        };
      }
    });
    if (newState) {
      return newState;
    }
  }

  if (files && maxSize) {
    let newState: ValidityState | undefined = undefined;
    Array.from(files).forEach(f => {
      if (f.size > maxSize) {
        newState = {
          validState: "no",
          msg: ["This file is too large."]
        };
      }
    });
    if (newState) {
      return newState;
    }
  }
  return { validState: "yes", msg: okMsg ? [okMsg] : [] };
};

export const useValidFiles = ({
  value,
  validationOptions
}: {
  value: FileList | undefined;
  validationOptions: ValidateFilesOptions;
}): ValidityState => {

  const [validState, setValid] = React.useState<{
    validState: Validity;
    msg: string[];
  }>({ validState: "nascent", msg: [] });

  useEffect(() => {
    if (!value) {
      setValid({ validState: "nascent", msg: [] });
      return;
    } else {
      const newState = validateFile(validationOptions, value);
      setValid(newState);
    }
  }, [value, setValid]);

  return validState;
};


export const useValidText = ({
  value,
  validationOptions,
  asyncValidation
}: {
  value: string;
  validationOptions: ValidTextOptions;
  asyncValidation?: (
    value: string
  ) => { controller: AbortController; resp: Promise<ValidityState> };
}): ValidityState => {
  const [validState, setValid] = React.useState<{
    validState: Validity;
    msg: string[];
  }>({ validState: "nascent", msg: [] });

  const [reqController, setReqController] = useState<AbortController | undefined>();

  useEffect(() => {
    if (value === "") {
      setValid({ validState: "nascent", msg: [] });
      return;
    }

    const newState = validateText(validationOptions, value);

    if (asyncValidation && yes(newState)) {

      setValid({ validState: "loading", msg: ["verifying..."] });
      const { controller, resp } = asyncValidation(value);
      reqController?.abort()
      setReqController(controller)

      resp
        .then(state => setValid(state))
        .catch(err => err);
    } else {
      setValid(newState);
    }
  }, [value, setValid]);

  return validState;
};
