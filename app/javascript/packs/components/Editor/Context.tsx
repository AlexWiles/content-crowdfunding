import React  from "react";
import { EditorState } from "draft-js";
import { Action } from "./Action";

export const Context = React.createContext<{
  resourceURL: string;
  fakeImages: boolean;
  dispatch: React.Dispatch<Action>;
  editorState: EditorState;
}>({
  resourceURL: "",
  fakeImages: false,
  dispatch: (action: any) => {},
  editorState: EditorState.createEmpty(),
});
