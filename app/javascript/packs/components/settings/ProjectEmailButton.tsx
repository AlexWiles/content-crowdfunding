import React, { useState, useContext } from "react";
import { post } from "../../lib/api";
import { useEffectWithStatus, EffectStatus } from "../EffectStatus";

const updateNotificationStatus = async (
  url: string,
  notify: boolean
): Promise<{ notify: boolean }> => {
  return await post(url, { notify });
};

type ProjectEmailButtonProps = {
  notify: boolean;
  url: string;
};

export const ProjectEmailButton: React.FC<ProjectEmailButtonProps> = ({
  url,
  notify,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [shouldNotify, setShouldNotify] = useState(notify);

  const status = useEffectWithStatus(async () => {
    setDisabled(true);
    const { notify } = await updateNotificationStatus(url, shouldNotify);
    setShouldNotify(notify);
    setDisabled(false);
  }, [shouldNotify]);

  return (
    <div className="pb-2 mb-2 border-bottom">
      <div className="d-flex align-items-center">
        <input
          style={{ marginRight: 10 }}
          type="checkbox"
          checked={shouldNotify}
          disabled={disabled}
          onChange={() => setShouldNotify(!shouldNotify)}
        />
        <div
          className="text-smaller font-weight-light d-flex cursor-pointer"
          onClick={() => setShouldNotify(!shouldNotify)}
        >
          <span style={{ marginRight: 10 }}>Subscribed to emails</span>
          <EffectStatus state={status} />
        </div>
      </div>
    </div>
  );
};
