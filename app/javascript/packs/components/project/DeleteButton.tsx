import React from "react";
import { ClickWithModal } from "../ClickWithModal";
import { Row, Col } from "../Grid";
import { deleteReq } from "../../lib/api";

const ModalBody: React.FC<{ messages: string[] }> = ({ messages }) => {
  return (
    <>
      {messages.map((m, idx) => {
        return (
          <Row key={idx} className="mt-4">
            <Col xs={12}>
              <div className="">{m}</div>
            </Col>
          </Row>
        );
      })}
    </>
  );
};

const deleteAction = async (path: string): Promise<void> => {
  const resp = await deleteReq(path, {});
  if (resp.ok) {
    document.location.href = "/dashboard";
  } else {
  }
};

export const DeleteButton: React.FC<{
  text: string | undefined;
  messages: string[];
  path: string;
}> = ({ text, messages, path }) => {
  console.log(text);

  return (
    <ClickWithModal
      modalBody={<ModalBody messages={messages} />}
      modalTitle={<div className="text-bigger font-weight-bold">Archive</div>}
      clickable={<div className="btn btn-danger">{text || "Delete"}</div>}
      buttonText={"Archive"}
      onConfirm={() => deleteAction(path)}
      confirmButtonClassName="btn-danger"
    />
  );
};
