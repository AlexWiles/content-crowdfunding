import { EditorState, convertToRaw } from "draft-js";
import { ImageEntityData } from "./Image/lib";
import { updateImageEntityData } from "./Image";

export type Action =
  | {
      type: "SET_EDITOR_STATE";
      editorState: EditorState;
    }
  | {
      type: "SET_IMAGE_ENTITY_DATA";
      key: string;
      data: ImageEntityData;
    };

export const reducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case "SET_EDITOR_STATE":
      return action.editorState;
    case "SET_IMAGE_ENTITY_DATA":
      return updateImageEntityData(state, action.key, action.data);
  }
};
