import { findImageEntities, ImageEntityData } from "./lib";
import { ImageComponent } from "./ImageComponent";
import { EditorState } from "draft-js";
import produce from "immer";

export const imageDecorator: Draft.DraftDecorator = {
  strategy: findImageEntities,
  component: ImageComponent,
};

export const updateImageEntityData = (
  editorState: EditorState,
  entityKey: string,
  entityData: ImageEntityData
) => {
  const currentEntityData = editorState
    .getCurrentContent()
    .getEntity(entityKey)
    .getData();

  const newContentState = editorState.getCurrentContent().replaceEntityData(
    entityKey,
    produce(currentEntityData, (draftData: ImageEntityData) => {
      draftData.width = entityData.width;
      draftData.shadow = entityData.shadow;
      draftData.src = entityData.src;
      draftData.uncommaId = entityData.uncommaId;
    })
  );

  return EditorState.set(editorState, { currentContent: newContentState });
};
