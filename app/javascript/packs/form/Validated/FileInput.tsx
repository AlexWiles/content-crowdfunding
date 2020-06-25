import React, { useState } from "react";
import { FormContext, FormContextState, wrapFormContext, FormComponent, updateInputState } from "./Context";

type FileChecks = {
  types?: string[];
  maxSize?: number;
  maxCount?: number;
};

export type FileInputProps = FileChecks & {
  name?: string;
  id?: string;
};

const validate = (
  files: FileList | null,
  opts: FileChecks
): [boolean, string[]] => {
  const { types, maxSize, maxCount } = opts;
  const fileArr = Array.from(files || []);

  let valid = true;
  let messages: string[] = [];

  if (maxCount) {
    if (fileArr.length > maxCount) {
      valid = false;
      messages = [
        ...messages,
        `Please select a max of ${maxCount} file${maxCount === 1 ? "" : "s"}`
      ];
    }
  }

  if (types) {
    fileArr.forEach(f => {
      if (!types.includes(f.type)) {
        valid = false;
        messages = [...messages, "Invalid file type"];
      }
    });
  }

  if (maxSize) {
    fileArr.forEach(f => {
      if (f.size > maxSize) {
        valid = false;
        messages = [...messages, "File is too large"];
      }
    });
  }

  return [valid, messages];
};

const UnwrappedFileInput: FormComponent<FileInputProps> = ({
  name = "",
  id = "",
  types,
  maxCount,
  maxSize,
  stateSetter,
  formState
}) => {

  return (
    <>
      <input
        type="file"
        name={name}
        id={id}
        onChange={e => {
          const newState = validate(e.target.files, {
            types,
            maxCount,
            maxSize
          });
          updateInputState(stateSetter, formState, id, newState);
        }}
      />
    </>
  );
};

export const FileInput = wrapFormContext(UnwrappedFileInput);

