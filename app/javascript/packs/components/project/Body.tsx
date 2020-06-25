import React from "react";
import { UncommaEditor } from "../Editor/Editor";
import { RawDraftContentState } from "draft-js";

type ProjectBodyProps = { body: RawDraftContentState };

export const ProjectBody: React.FC<ProjectBodyProps> = ({ body }) => {
  return (
    <UncommaEditor
      readOnly={true}
      resourceURL=""
      body={body}
      onChange={_ => {}}
    />
  );
};
