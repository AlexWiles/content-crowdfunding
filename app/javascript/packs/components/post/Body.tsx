import React from "react";
import { UncommaEditor } from "../Editor/Editor";
import { RawDraftContentState } from "draft-js";

type PostBodyProps = { body: RawDraftContentState };

export const PostBody: React.FC<PostBodyProps> = ({ body }) => {
  return (
    <UncommaEditor
      readOnly={true}
      resourceURL=""
      body={body}
      onChange={_ => {}}
    />
  );
};
