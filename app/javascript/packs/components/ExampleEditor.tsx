import React, { useState } from "react";
import { UncommaEditor } from "./Editor/Editor";
import { RawDraftContentState } from "draft-js";

export const ExampleEditor: React.FC<{body: RawDraftContentState}> = ({ body }) => {
  const [editorState, setEditorState] = useState<RawDraftContentState>(body);

  return (
    <UncommaEditor
      readOnly={false}
      resourceURL=""
      body={editorState}
      onChange={setEditorState}
      style={{ minHeight: 400 }}
      focus={true}
      fakeImages={true}
    />
  );
};
