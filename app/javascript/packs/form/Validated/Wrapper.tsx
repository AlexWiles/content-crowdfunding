import React, { useState, useEffect } from "react";
import { FormContext, initialFormContext, FormContextState } from "./Context";

export const Wrapper: React.FC<{}> = ({ children }) => {
  const [state, setState] = useState<FormContextState>(initialFormContext)
  useEffect(() => {
    setState({...state, ...{ stateSetter: setState }})
  }, [setState])

  return (
    <FormContext.Provider value={state}>
      {children}
    </FormContext.Provider>
  );
};
