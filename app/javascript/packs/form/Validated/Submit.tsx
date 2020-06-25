import React from "react";
import { FormComponent, wrapFormContext, formIsValid } from "./Context";

type SubmitProps = {
  className?: string;
  name?: string;
  value: string;
  dataDisableWith?: string;
};

const UnwrappedSubmit: FormComponent<SubmitProps> = ({
  className,
  name,
  value,
  dataDisableWith,
  formState
}) => {

  return (
    <input
      type="submit"
      name={name}
      value={value}
      className={className}
      data-disable-with={dataDisableWith}
      disabled={!formIsValid(formState) }
    ></input>
  );
};

export const Submit = wrapFormContext(UnwrappedSubmit);