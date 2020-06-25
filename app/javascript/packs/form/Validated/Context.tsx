import React from "react";

export type InputState = [boolean | undefined, string[]];
export type InputStates = { [id: string]: InputState };

const notUndefined = <T extends unknown>(state: T | undefined): state is T => {
  return state !== undefined;
};

type StateSetter = (state: FormContextState) => void;
type FormState = { inputs: InputStates };

export type FormContextState = {
  stateSetter: StateSetter;
  formState: FormState;
};

export const updateInputState = (
  stateSetter: StateSetter,
  formState: FormState,
  id: string,
  value: InputState
) => {
  const newInputs = { ...formState.inputs, ...{ [id]: value } };
  const newFormState = { ...formState, ...{ inputs: newInputs } };
  stateSetter({ ...{ stateSetter }, ...{ formState: newFormState } });
};

export const formIsValid = (formState: FormState) => {
  const { inputs } = formState;

  const values: boolean[] = Object.values(inputs)
    .map(([v]) => v)
    .filter(notUndefined);

  if (values.length === 0) {
    return false;
  }

  return values.reduce((curr, next) => curr && next, true);
};

export type FormComponentProps<T> = T & FormContextState;
export type FormComponent<T> = React.FC<T & FormContextState>;

export const initialFormContext = {
  formState: { inputs: {} },
  stateSetter: (s: FormContextState) => {}
};

export const FormContext = React.createContext(initialFormContext);

export const wrapFormContext = <T extends {}>(
  Component: FormComponent<T>
): React.FC<T> => props => {
  return (
    <FormContext.Consumer>
      {contextProps => {
        return <Component {...{ ...props, ...contextProps }} />;
      }}
    </FormContext.Consumer>
  );
};
