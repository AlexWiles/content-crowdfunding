import React from "react";
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
  defaultValue?: string;
  rows?: number;
  autoFocus?: boolean;
  onChange?: (v: string) => void;
  className?: string;
  placeholder?: string;
  type?: string;
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
  type = "",
  className,
  minLength,
  maxLength,
  value,
  rows,
  autoFocus,
  defaultValue,
  stateSetter,
  formState,
  placeholder,
  onChange = v => {}
}) => {
  return (
    <>
      <textarea
        {...{
          className,
          name,
          id,
          value,
          defaultValue,
          placeholder,
          type,
          rows,
          autoFocus
        }}
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

export const Textarea = wrapFormContext(UnwrappedInput);
