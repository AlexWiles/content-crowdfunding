import React from "react";
import { MdFormatListNumbered, MdFormatSize } from "react-icons/md";
import { GoQuote } from "react-icons/go";
import { colors } from "./style";
import { EditorState, RichUtils } from "draft-js";
import { StyleButton } from "./StyleButton";
import { LinkButton } from "./Link";
import { ImageButton } from "./Image/ImageButton";
import { FiBold, FiItalic, FiList, FiCode } from "react-icons/fi";

const CONTROLS = [
  { label: <MdFormatSize />, style: "header-three", type: "block" },
  { label: <FiBold name="bold" />, style: "BOLD", type: "inline" },
  { label: <FiItalic name="italic" />, style: "ITALIC", type: "inline" },

  { label: <GoQuote />, style: "blockquote", type: "block" },
  { label: <FiList name="list" />, style: "unordered-list-item", type: "block" },
  {
    label: <MdFormatListNumbered />,
    style: "ordered-list-item",
    type: "block"
  },
  { label: <FiCode name="code" />, style: "code-block", type: "block" }
];

type ToolbarProps = {
  editorState: EditorState;
  fakeImages: boolean;
  resourceURL: string;
  onChange: (s: EditorState) => void;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  resourceURL,
  editorState,
  fakeImages = false,
  onChange
}) => {
  return (
    <div
      className="sticky-top py-3"
      style={{
        top: 48,
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        borderBottomStyle: "solid",
        marginBottom: 10,
        zIndex: 1
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          fontSize: 24
        }}
      >
        {CONTROLS.map(s => (
          <StyleButton
            key={s.style}
            active={
              s.type === "inline"
                ? editorState.getCurrentInlineStyle().has(s.style)
                : editorState
                    .getCurrentContent()
                    .getBlockForKey(editorState.getSelection().getStartKey())
                    .getType() === s.style
            }
            label={s.label}
            onChange={() => {
              const newState =
                s.type === "inline"
                  ? RichUtils.toggleInlineStyle(editorState, s.style)
                  : RichUtils.toggleBlockType(editorState, s.style);
              onChange(newState);
            }}
          />
        ))}
        <LinkButton editorState={editorState} onChange={onChange} />
        <ImageButton
          fakeImages={fakeImages}
          resourceURL={resourceURL}
          editorState={editorState}
          onChange={onChange}
        />
      </div>
      <div className="text-muted d-flex align-items-center justify-content-center">
      </div>
    </div>
  );
};
