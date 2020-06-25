import { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../Context";
import { useClickOutside } from "../../../lib/hooks";
import { uploadImageAtURL, initialImageEntityData, imageSrc } from "./lib";
import { EditorState } from "draft-js";
import produce from "immer";
import React from "react";
import { ImageEntityData } from "./lib";

export const ImageComponent: React.FC<{
  contentState: Draft.ContentState;
  entityKey: string;
}> = ({ entityKey }) => {
  const { editorState, dispatch, resourceURL, fakeImages } = useContext(Context);

  if (entityKey) {
    const [selected, setSelected] = useState(false);

    const [entityData, setEntityData] = useState<ImageEntityData>(
      editorState
        .getCurrentContent()
        .getEntity(entityKey)
        .getData()
    );

    const imageContainerRef = useClickOutside(() => setSelected(false), []);
    const imageWidthRef = useRef<HTMLDivElement>(null);

    // UPLOAD IMAGE IF NO UNCOMMA ID
    useEffect(() => {
      if (!entityData.uncommaId && !fakeImages) {
        uploadImageAtURL(entityData.src, resourceURL).then((id) => {
          setEntityData(
            produce(entityData, (s) => {
              s.src = imageSrc(resourceURL, id);
            })
          );
        });
      }
    }, [entityData, setEntityData]);

    // WATCH IMAGE WIDTH AND UPDATE STYLE
    useEffect(() => {
      const interval = setInterval(() => {
        if (
          imageWidthRef.current &&
          imageWidthRef.current.style.width !== entityData.width
        ) {
          const newWidth = imageWidthRef.current.style.width;
          setEntityData(
            produce(entityData, (s) => {
              s.width = newWidth;
            })
          );
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [entityData, imageWidthRef]);

    // UPDATE EDITOR STATE ON ENTITY DATA CHANGE
    useEffect(() => {
      dispatch({type: "SET_IMAGE_ENTITY_DATA", key: entityKey, data: entityData});
    }, [entityData]);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
        contentEditable={false}
        onClick={() => setSelected(true)}
        ref={imageContainerRef}
      >
        <div
          contentEditable={false}
          ref={imageWidthRef}
          style={{
            overflow: "auto",
            resize: "horizontal",
            cursor: "pointer",
            maxWidth: "100%",
            width: entityData.width || "100%",
            outline: selected ? "1px hotpink solid" : "none",
          }}
          className={entityData.shadow ? "shadow" : ""}
        >
          <img src={entityData.src} style={{ width: "100%" }} />
        </div>
        {selected ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              bottom: -30,
            }}
          >
            <a
              href=""
              className={`text-smaller ${
                entityData.shadow ? "font-weight-bold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setEntityData(
                  produce(entityData, (s) => {
                    s.shadow = !s.shadow;
                  })
                );
              }}
            >
              shadow
            </a>
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  } else {
    return <></>;
  }
};
