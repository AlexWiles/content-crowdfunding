import React, { useState, Children } from "react";
import { useClickOutside } from "../lib/hooks";
import { Row, Col } from "./Grid";

export const Modal: React.FC<{
  onClose?: () => void;
  onConfirm?: () => void;
  title?: React.ReactNode;
  buttonText?: string;
  confirmButtonClassName?: string;
  hideButtons?: boolean;
}> = ({
  onClose = () => {},
  onConfirm = () => {},
  buttonText,
  children,
  title,
  confirmButtonClassName = "",
  hideButtons = false
}) => {
  const ref = useClickOutside(onClose, [onClose]);

  return (
    <div
      className="modal show fade d-flex align-items-center"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", overflowY: "auto" }}
    >
      <div
        className="modal-dialog "
        role="document"
        ref={ref}
      >
        <div className="modal-content">
          <div className="py-3">
              <Col>
                <Row>
                  <Col xs={12} className="d-flex justify-content-between">
                    <div>{title}</div>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={onClose}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>{children}</Col>
                </Row>
              </Col>
          </div>
          <div
            className={`${
              hideButtons ? "d-none" : "d-flex"
            } modal-footer justify-content-between`}
          >
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            {buttonText ? (
              <div
                className={`btn ${confirmButtonClassName}`}
                onClick={onConfirm}
              >
                {buttonText}
              </div>
            ) : (
              undefined
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
