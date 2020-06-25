import React, { useState } from "react";
import { post } from "../../lib/api";
import { useEffectWithStatus, EffectStatus } from "../EffectStatus";

type PostPublicSwitchProps = { url: string; isPublic: boolean };

export const PostPublicSwitch: React.FC<PostPublicSwitchProps> = ({
  url,
  isPublic,
}) => {
  const [pub, setPub] = useState(String(isPublic));

  const status = useEffectWithStatus(() => post(url, { public: pub }), [pub]);

  return (
    <div>
      <div className="d-flex font-weight-medium text-smaller">
        Set visibility of this post
        <span className="ml-2">
          <EffectStatus
            state={status}
            messages={{ no: "Network error. Please try again." }}
          />
        </span>
      </div>

      <fieldset id="visibilityOption">
        <div className="mb-1">
          <input
            type="radio"
            id="notPublic"
            name="visibilityOption"
            value="false"
            checked={pub === "false"}
            onChange={() => setPub("false")}
          />
          <label className="text-smaller ml-2 mb-0" htmlFor="notPublic">
            Only paying users
          </label>
        </div>
        <div className="mb-1">
          <input
            type="radio"
            id="isPublic"
            name="visibilityOption"
            value="false"
            checked={pub === "true"}
            onChange={() => setPub("true")}
          />
          <label className="text-smaller ml-2 mb-0" htmlFor="isPublic">
            Publicly available
          </label>
        </div>
      </fieldset>
      <div className="font-weight-light"></div>
    </div>
  );
};
