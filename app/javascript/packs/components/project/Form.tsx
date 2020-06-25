import React, { useState } from "react";
import { Project, Post, PostOrder, FundingType } from "./types";
import TextareaAutosize from "react-autosize-textarea";
import { UncommaEditor } from "../Editor/Editor";
import produce from "immer";
import { patch } from "../../lib/api";
import { PublishButtonProps } from "../PublishButton";
import { User } from "../../lib/react_service";
import { FundingOption } from "./FundingOption";
import { CrowdfundForm } from "./CrowdfundForm";
import { PaywallForm } from "./PaywallForm";
import { EffectStatus } from "../EffectStatus";

type ProjectTitleProps = {
  title: string;
  editing: boolean;
  onChange: (v: string) => void;
};

const ProjectTitle: React.FC<ProjectTitleProps> = ({
  title,
  editing,
  onChange,
}) => {
  return (
    <TextareaAutosize
      placeholder="Project title"
      className="border"
      style={{
        width: "100%",
        outline: "none",
      }}
      value={title || ""}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

type ProjectDescriptionProps = {
  description: string;
  editing: boolean;
  onChange: (v: string) => void;
};

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  description,
  editing,
  onChange,
}) => {
  return (
    <TextareaAutosize
      className="border"
      placeholder="Project subtitle"
      style={{
        width: "100%",
        outline: "none",
      }}
      value={description || ""}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

type PostList = {
  published: Post[];
  drafts: Post[];
};

type ProjectEditProps = {
  updateUrl: string;
  newPostUrl: string;
  project: Project;
  user: User;
  postList: PostList;
  publishButton: PublishButtonProps;
};

export const ProjectEdit: React.FC<ProjectEditProps> = ({
  project,
  publishButton,
}) => {
  const editing = true;
  const [updated, setUpdated] = useState(false);
  const [editableProject, setEditableProject] = useState(project);

  const [effectStatus, setEffectStatus] = useState<EffectStatus>("nascent");
  const saveFn = async () => {
    setUpdated(false);
    setEffectStatus("loading");
    const { title, description, body, postOrder, paywall } = editableProject;
    await patch(project.urls.update, {
      project: {
        title,
        description,
        body,
        post_order: postOrder,
        paywalls_attributes: [
          {
            id: paywall.id,
            funding_type: paywall.fundingType,
            amount: paywall.amount || "100",
            minimum: paywall.minimum || "1",
            duration: paywall.duration || 30,
          },
        ],
      },
    });
    setEffectStatus("yes");
    setTimeout(() => (window.location.href = project.urls.view), 300);
  };

  return (
    <>
      <div
        className="d-flex justify-content-center"
        style={{ marginBottom: 100 }}
      >
        <div className="w-100 max-width-content my-4">
          <div className="text-smaller font-weight-medium">Project title</div>
          <div className="d-flex mb-3">
            <ProjectTitle
              title={editableProject.title}
              editing={editing}
              onChange={(v) => {
                setUpdated(true);
                setEditableProject(
                  produce(editableProject, (p) => {
                    p.title = v;
                  })
                );
              }}
            />
          </div>

          <div className="text-smaller font-weight-medium">
            Project subtitle
          </div>
          <div className="d-flex mb-3">
            <ProjectDescription
              description={editableProject.description}
              editing={editing}
              onChange={(v) => {
                setUpdated(true);
                setEditableProject(
                  produce(editableProject, (p) => {
                    p.description = v;
                  })
                );
              }}
            />
          </div>

          <div className="text-smaller font-weight-medium">
            Project description
          </div>
          <div className="p-2 border mb-3">
            <UncommaEditor
              body={editableProject.body}
              resourceURL={project.urls.resource}
              readOnly={false}
              onChange={(v) => {
                setUpdated(true);
                setEditableProject(
                  produce(editableProject, (p) => {
                    p.body = v;
                  })
                );
              }}
            />
          </div>

          <div className="mb-4">
            <FundingOption
              disabled={project.published}
              value={editableProject.paywall.fundingType}
              onChange={(v) => {
                setUpdated(true);
                setEditableProject(
                  produce(editableProject, (newState) => {
                    newState.paywall.fundingType = v as FundingType;
                  })
                );
              }}
            />

            <div className="mt-2">
              {editableProject.paywall.fundingType === "crowdfund" ? (
                <CrowdfundForm
                  paywall={editableProject.paywall}
                  published={project.published}
                  onChange={(paywall) => {
                    setUpdated(true);
                    setEditableProject({
                      ...editableProject,
                      ...{ paywall },
                    });
                  }}
                />
              ) : (
                undefined
              )}

              {editableProject.paywall.fundingType === "paywall" ? (
                <PaywallForm
                  paywall={editableProject.paywall}
                  onChange={(paywall) => {
                    setUpdated(true);
                    setEditableProject({
                      ...editableProject,
                      ...{ paywall },
                    });
                  }}
                />
              ) : (
                undefined
              )}
            </div>
          </div>

          <div className="mb-5">
            <div className="text-smaller font-weight-medium">
              Set the order of the posts displayed on the project page
            </div>
            <fieldset>
              <div>
                <input
                  type="radio"
                  id="desc"
                  name="postOrder"
                  value="desc"
                  checked={editableProject.postOrder === "desc"}
                  onChange={(v) => {
                    setUpdated(true);
                    setEditableProject({
                      ...editableProject,
                      ...{ postOrder: "desc" },
                    });
                  }}
                />
                <label className="text-smaller ml-2 mb-0" htmlFor="desc">
                  Newer first
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="asc"
                  name="postOrder"
                  value="asc"
                  checked={editableProject.postOrder === "asc"}
                  onChange={(v) => {
                    setUpdated(true);
                    setEditableProject({
                      ...editableProject,
                      ...{ postOrder: "asc" },
                    });
                  }}
                />
                <label className="text-smaller ml-2 mb-0" htmlFor="asc">
                  Older first
                </label>
              </div>
            </fieldset>
          </div>

          <div style={{ display: "flex" }}>
            <button
              disabled={!updated}
              className="btn btn-success"
              onClick={saveFn}
              style={{ minWidth: 150 }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <EffectStatus
                  state={effectStatus}
                  messages={{ nascent: "Save" }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
