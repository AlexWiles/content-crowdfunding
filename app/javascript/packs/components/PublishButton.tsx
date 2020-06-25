import React from "react";
import { ClickWithModal } from "./ClickWithModal";
import { Row, Col } from "./Grid";
import { post } from "../lib/api";

const ModalBody: React.FC<{ messages: string[] }> = ({ messages }) => {
  return (
    <div className="text-left">
      {messages.map((m, idx) => {
        return (
          <Row key={idx} className="mt-4">
            <Col xs={12}>
              <div className="">{m}</div>
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

const publishAction = async (path: string): Promise<void> => {
  const resp = await post(path, {});
  if (resp.ok) {
    location.reload();
  } else {
    console.log(resp);
  }
};

export type PublishButtonProps = {
  messages: string[];
  path: string;
  canPublish?: boolean;
  publishReason?: string;
};

export const PublishButton: React.FC<PublishButtonProps> = ({
  messages,
  path,
  canPublish,
  publishReason,
}) => {
  if (canPublish) {
    return (
      <ClickWithModal
        modalBody={<ModalBody messages={messages} />}
        buttonText="Publish"
        onConfirm={() => publishAction(path)}
        confirmButtonClassName="btn-outline-success"
        clickable={<div className="btn btn-success btn-sm">Publish</div>}
        modalTitle={<div className="text-bigger font-weight-bold">Publish</div>}
      />
    );
  } else {
    return (
      <div className="text-muted text-smaller text-left">{publishReason}</div>
    );
  }
};
