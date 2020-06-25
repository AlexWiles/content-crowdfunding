import React, { useState } from "react";
import { FiX } from "react-icons/fi";

type FlashProps = {
  warning: undefined | string;
  notice: undefined | string;
};

export const Flash: React.FC<FlashProps> = ({ warning, notice }) => {
  const [show, setShow] = useState(true);

  return (
    <>
      {warning && show ? (
        <div className="alert alert-warning transition-max-height d-flex justify-content-between align-items-center text-smaller">
          {warning}
          <FiX
            name="x"
            className="cursor-pointer"
            onClick={() => setShow(false)}
          />
        </div>
      ) : (
        undefined
      )}
      {notice && show ? (
        <div className="alert alert-info transition-max-height d-flex justify-content-between align-items-center text-smaller">
          {notice}
          <FiX
            name="x"
            className="cursor-pointer"
            onClick={() => setShow(false)}
          />
        </div>
      ) : (
        undefined
      )}
    </>
  );
};
