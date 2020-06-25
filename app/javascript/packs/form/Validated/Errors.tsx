import React from "react";
import { FormComponent, wrapFormContext } from "./Context";

type ErrorsProps = {
  id: string;
  Display: React.FC<{ error: string }>;
};

//const ErrorProp: <T extends {}>FormComponent<ErrorsProps<T>> = <T extends {}>({id, ErrorDisplay}: FormComponentProps<ErrorsProps<T>>) => {
export const UnwrappedErrorFor: FormComponent<ErrorsProps> = ({
  id,
  Display,
  formState
}) => {
  const state = formState.inputs[id];
  if (state === undefined) {
    return <></>;
  }

  const [_, errors] = state;

  return (
    <>
      {errors.map(e => {
        return <Display error={e} />;
      })}
    </>
  );
};

export const ErrorFor = wrapFormContext(UnwrappedErrorFor);