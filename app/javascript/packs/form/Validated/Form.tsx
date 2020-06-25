import React, { useState, useEffect } from "react";
import { FormContext, initialFormContext, FormContextState } from "./Context";

type ValidatedFormProps = {
  className?: string;
  id?: string;
  action: string;
  method: string;
  token: string;
  enctype?: string;
};

export const ValidatedForm: React.FC<ValidatedFormProps> = ({
  className = "",
  id = "",
  action,
  method,
  token,
  enctype,
  children
}) => {
  const [state, setState] = useState<FormContextState>(initialFormContext)

  useEffect(() => {
    setState({...state, ...{ stateSetter: setState }})
  }, [setState])

  return (
    <FormContext.Provider value={state}>
      <form
        className={className}
        id={id}
        action={action}
        acceptCharset="UTF-8"
        encType={enctype}
        method="post"
      >
        <input type="hidden" name="_method" value={method}></input>
        <input type="hidden" name="authenticity_token" value={token}></input>

        {children}
      </form>
    </FormContext.Provider>
  );
};
