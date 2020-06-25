import React, { useState } from "react";
import { UncommaEditor } from "../Editor/Editor";
import { RawDraftContentState } from "draft-js";
import TextareaAutosize from "react-autosize-textarea";
import { post } from "../../lib/api";
import { Row } from "../Grid";
import { PublishButton, PublishButtonProps } from "../PublishButton";
import { useSave, BottomSaveBar } from "../BottomSaveBar";

type PostFormProps = {
  title: string;
  resourceURL: string;
  subtitle: string;
  body: RawDraftContentState;
  published: boolean;
  publishButton?: PublishButtonProps;
};

export const PostForm: React.FC<PostFormProps> = ({
  resourceURL,
  title: initialTitle,
  subtitle: initialSubtitle,
  body: initialBody,
  published,
  publishButton,
}) => {
  const initialData = {
    title: initialTitle,
    subtitle: initialSubtitle,
    body: initialBody,
  };
  const initialDataString = JSON.stringify(initialData);

  const [data, setData] = useState(initialData);

  const [triggerSave, lastSaved, setLastSaved] = useSave(() =>
    post(resourceURL + "/update_post", data)
  );

  React.useEffect(() => {
    const stringData = JSON.stringify(data);
    if (!published && initialDataString !== stringData) {
      window.onbeforeunload = () => true;
      setLastSaved("");
      const timer = setTimeout(triggerSave, 1000);
      return () => clearTimeout(timer);
    } else if (initialDataString !== stringData) {
      setLastSaved("Unsaved changes");
      window.onbeforeunload = () => true;
    }
    return;
  }, [data]);

  return (
    <Row className="justify-content-center">
      <div className="col-12 col-md-10 col-lg-8 max-width-content">
        <div className="row mb-1">
          <div className="col-12 mb-5 pb-5">
            <h1>
              <TextareaAutosize
                placeholder="Title"
                style={{
                  border: "none",
                  outline: "none",
                  padding: 0,
                  fontWeight: 500,
                }}
                className="w-100"
                value={data.title || ""}
                onChange={(e) => {
                  setData({ ...data, ...{ title: e.currentTarget.value } });
                }}
              />
            </h1>

            <h5 className="text-muted w-100">
              <TextareaAutosize
                placeholder="Subtitle"
                className="w-100"
                style={{
                  border: "none",
                  outline: "none",
                  padding: 0,
                  fontWeight: 300,
                  fontSize: "1.4rem",
                }}
                value={data.subtitle || ""}
                onChange={(e) => {
                  setData({ ...data, ...{ subtitle: e.currentTarget.value } });
                }}
              />
            </h5>
            <UncommaEditor
              readOnly={false}
              resourceURL={resourceURL}
              body={data.body}
              onChange={(newBody) => {
                setData({ ...data, ...{ body: newBody } });
              }}
              style={{ minHeight: 400 }}
            />
          </div>
        </div>
      </div>
      <BottomSaveBar
        lastSaved={lastSaved}
        triggerSave={triggerSave}
        saveButton={
          publishButton ? (
            <PublishButton {...publishButton} />
          ) : (
            <div className="btn btn-success" onClick={triggerSave}>
              Save and publish
            </div>
          )
        }
      />
    </Row>
  );
};
