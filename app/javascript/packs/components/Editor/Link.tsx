import React from "react";
import { EditorState, RichUtils } from "draft-js";
import { StyleButton } from "./StyleButton";
import { FiLink } from "react-icons/fi";

export const findLinkEntities = (
  contentBlock: Draft.ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: Draft.ContentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

export const Link: React.FC<{
  contentState: Draft.ContentState;
  entityKey: string;
}> = ({ contentState, entityKey, children }) => {
  const data = contentState.getEntity(entityKey).getData();
  return (
    <a href={data.href} style={{ textDecoration: "underline" }}>
      {children}
    </a>
  );
};
export const linkDecorator: Draft.DraftDecorator = {
  strategy: findLinkEntities,
  component: Link
};

export const LinkButton: React.FC<{
  editorState: EditorState;
  onChange: (s: EditorState) => void;
}> = ({ editorState, onChange }) => {
  return (
    <StyleButton
      label={<FiLink name="link" size={16} />}
      active={(() => {
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
          const contentState = editorState.getCurrentContent();
          const startKey = editorState.getSelection().getStartKey();
          const startOffset = editorState.getSelection().getStartOffset();
          const blockWithLinkAtBeginning = contentState.getBlockForKey(
            startKey
          );
          const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
          return !!linkKey
        }
        return false;
      })()}
      onChange={() => {
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
          const contentState = editorState.getCurrentContent();
          const startKey = editorState.getSelection().getStartKey();
          const startOffset = editorState.getSelection().getStartOffset();
          const blockWithLinkAtBeginning = contentState.getBlockForKey(
            startKey
          );
          const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

          let href = "";
          if (linkKey) {
            const linkInstance = contentState.getEntity(linkKey);
            href = linkInstance.getData().href;
          }
          const newURL = window.prompt("URL", href) || href;

          const contentStateWithEntity = contentState.createEntity(
            "LINK",
            "MUTABLE",
            { href: newURL }
          );

          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity
          });
          const newState = RichUtils.toggleLink(
            newEditorState,
            newEditorState.getSelection(),
            entityKey
          );

          onChange(newState);
        }
      }}
    />
  );
};
