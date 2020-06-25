import React from "react";
import { Project } from "./types";
import { User } from "../../lib/react_service";
import { PublishButton } from "../PublishButton";

const cannotPublishReason = (
  project: Project,
  user: User
): [boolean, string] => {
  if (!project.title) {
    return [false, "The project needs a title before publishing."];
  }

  if (project.paywall?.requiresPayment) {
    if (user.stripeConnected) {
      return [true, ""];
    } else {
      return [
        false,
        "Connect Stripe in account settings before publishing this project.",
      ];
    }
  }

  return [true, ""];
};

const modalMessages = (project: Project): string[] => {
  let messages = ["Publishing this project will make it visible for all users"];

  if (project.paywall?.fundingType === "crowdfund") {
    messages.push("The crowdfunding campaign will go live.");
  }

  return messages;
};

export const ProjectPublishButton: React.FC<{
  user: User;
  project: Project;
}> = ({ user, project }) => {

  const [canPublish, reason] = cannotPublishReason(project, user);

  return (
    <PublishButton
      messages={modalMessages(project)}
      path={project.urls.publish}
      canPublish={canPublish}
      publishReason={reason}
    />
  );
};
