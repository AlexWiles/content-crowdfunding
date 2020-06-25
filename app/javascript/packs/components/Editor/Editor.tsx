import React, { useEffect, useReducer } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  RawDraftContentState,
} from "draft-js";
import { Toolbar } from "./Toolbar";
import { handleImages } from "./Image/lib";
import { Context } from "./Context";
import { codeblockRenderMap } from "./Codeblock";
import { Map } from "immutable";
import { colors } from "./style";
import { newDecorator } from "./Decorator";
import { reducer } from "./Action";

const defaultTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "18px",
  lineHeight: "28px",
  fontWeight: 400,
};

const systemFont =
  "-apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, Ubuntu, roboto, noto, segoe ui, arial, sans-serif";

const BLOCK_RENDER_MAP = Map<{
  element: string;
  wrapper?: JSX.Element;
  aliasedElements?: string[];
}>({
  "ordered-list-item": {
    element: "li",
    wrapper: <ol style={defaultTextStyle} />,
  },
  "unordered-list-item": {
    element: "li",
    wrapper: <ul style={defaultTextStyle} />,
  },
  "header-three": {
    element: "h4",
    aliasedElements: ["h1", "h2", "h3", "h5", "h6"],
  },
  atomic: { element: "figure" },
  unstyled: {
    element: "div",
    aliasedElements: ["p"],
    wrapper: <div style={defaultTextStyle} />,
  },
  blockquote: {
    element: "div",
    wrapper: (
      <div
        style={{
          borderLeftWidth: 2,
          borderLeftStyle: "solid",
          borderLeftColor: colors.lightGray,
          paddingLeft: 10,
          fontFamily: systemFont,
          fontSize: "15px",
          lineHeight: "25px",
        }}
      />
    ),
  },
}).merge(codeblockRenderMap);

const decorator = newDecorator();

type EditorProps = {
  resourceURL: string;
  body: undefined | RawDraftContentState;
  defaultBody?: RawDraftContentState;
  onChange: (s: RawDraftContentState) => void;
  readOnly: boolean;
  style?: React.CSSProperties;
  focus?: boolean;
  fakeImages?: boolean;
  placeholder?: string;
};

export const UncommaEditor: React.FC<EditorProps> = ({
  resourceURL,
  body,
  defaultBody = { blocks: [], entityMap: {} },
  onChange,
  readOnly,
  style,
  focus,
  placeholder,
  fakeImages = false,
}) => {
  const initialContentState = convertFromRaw(body || defaultBody);
  const initialEditorState = initialContentState
    ? EditorState.createWithContent(initialContentState, decorator)
    : EditorState.createEmpty(decorator);

  const [editorState, dispatch] = useReducer(reducer, initialEditorState);
  const editor = React.useRef<any>();
  const focusEditor = () => editor.current?.focus();

  useEffect(() => {
    if (focus) {
      focusEditor();
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const raw = convertToRaw(editorState.getCurrentContent());
      onChange(raw);
    }, 400);
    return () => clearTimeout(timer);
  }, [editorState.getCurrentContent()]);

  return (
    <Context.Provider
      value={{
        resourceURL,
        fakeImages: fakeImages || false,
        editorState,
        dispatch,
      }}
    >
      <div onClick={focusEditor} style={style}>
        {readOnly ? (
          <div className="mt-3"></div>
        ) : (
          <Toolbar
            resourceURL={resourceURL}
            editorState={editorState}
            fakeImages={fakeImages}
            onChange={(editorState) =>
              dispatch({ type: "SET_EDITOR_STATE", editorState })
            }
          />
        )}

        <Editor
          ref={editor}
          readOnly={readOnly}
          editorState={editorState}
          placeholder={placeholder}
          handlePastedFiles={(files) => {
            handleImages(
              files,
              resourceURL,
              editorState,
              !!fakeImages,
              (editorState: EditorState) => {
                dispatch({ type: "SET_EDITOR_STATE", editorState });
              }
            );
            return "handled";
          }}
          handleDroppedFiles={(_, files) => {
            handleImages(
              files,
              resourceURL,
              editorState,
              !!fakeImages,
              (editorState: EditorState) => {
                dispatch({ type: "SET_EDITOR_STATE", editorState });
              }
            );
            return "handled";
          }}
          handleKeyCommand={(command, editorState) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
              dispatch({ type: "SET_EDITOR_STATE", editorState: (newState as any as EditorState) });
              return "handled";
            }
            return "not-handled";
          }}
          onChange={(editorState) => {
            dispatch({ type: "SET_EDITOR_STATE", editorState });
          }}
          blockRenderMap={BLOCK_RENDER_MAP}
        />
      </div>
    </Context.Provider>
  );
};
