import React, { useState } from "react";
import {
  wrapFormContext,
  FormComponent,
  InputState,
  updateInputState
} from "./Context";

type InputChecks = {
  minLength?: number;
  maxLength?: number;
};

export type InputProps = InputChecks & {
  name?: string;
  id?: string;
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
};

const validate = (value: string, opts: InputChecks): InputState => {
  if (value === "") {
    return [undefined, []];
  }

  const { minLength, maxLength } = opts;

  let valid = true;
  let messages: string[] = [];

  if (minLength) {
    if (value.length < minLength) {
      valid = false;
      messages = [...messages, `Must be longer than ${minLength}`];
    }
  }

  if (maxLength) {
    if (value.length > maxLength) {
      valid = false;
      messages = [...messages, `Max length is ${maxLength}`];
    }
  }

  return [valid, messages];
};

const UnwrappedInput: FormComponent<InputProps> = ({
  name = "",
  id = "",
  className,
  minLength,
  maxLength,
  value,
  stateSetter,
  formState,
  onChange = v => {}
}) => {
  return (
    <>
      <input
        className={className}
        name={name}
        id={id}
        value={value}
        onChange={e => {
          const newState = validate(e.target.value, {
            minLength,
            maxLength
          });
          updateInputState(stateSetter, formState, id, newState);
          onChange(e.target.value);
        }}
      />
    </>
  );
};

export const Input = wrapFormContext(UnwrappedInput);
