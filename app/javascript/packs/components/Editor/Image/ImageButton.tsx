import React, { useRef } from "react";
import { handleImages } from "./lib";
import { StyleButton } from "../StyleButton";
import { FaRegImage } from "react-icons/fa";
import { EditorState } from "draft-js";

type ImageButtonProps = {
  resourceURL: string;
  editorState: EditorState;
  fakeImages: boolean;
  onChange: (s: EditorState) => void;
};

export const ImageButton: React.FC<ImageButtonProps> = ({
  resourceURL,
  editorState,
  fakeImages,
  onChange,
}) => {
  const fileInput = useRef<any>();

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) {
            const files = e.target.files;
            handleImages(files, resourceURL, editorState, fakeImages, onChange);
          }
        }}
      />

      <StyleButton
        label={<FaRegImage />}
        active={false}
        onChange={() => {
          if (fileInput.current) {
            fileInput.current.click();
          }
        }}
      />
    </>
  );
};
