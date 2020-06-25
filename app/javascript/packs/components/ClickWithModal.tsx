import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";


export const ClickWithModal: React.FC<{
  clickable: React.ReactNode;
  buttonText?: string;
  modalBody: React.ReactNode;
  modalTitle?: React.ReactNode;
  onConfirm?: () => void;
  confirmButtonClassName?: string;
}> = ({ buttonText, modalBody, modalTitle, clickable, onConfirm, confirmButtonClassName}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div onClick={() => setShowModal(true)}>
        {clickable}
      </div>
      {showModal ? (
        <Modal
          title={modalTitle}
          buttonText={buttonText}
          onConfirm={onConfirm}
          onClose={() => setShowModal(false)}
          confirmButtonClassName={confirmButtonClassName}
        >
        {modalBody}
        </Modal>
      ) : (
        undefined
      )}
    </>
  );
};
