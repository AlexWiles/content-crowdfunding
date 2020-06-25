import React, { useState } from "react";
import { post } from "../lib/api";

const updateFollow = async (url: string): Promise<boolean> => {
  await post(url, {});
  return true;
};

type FollowButtonProps = {
  follows: boolean;
  followUrl: string;
  unfollowUrl: string;
};

export const FollowButton: React.FC<FollowButtonProps> = ({
  followUrl,
  unfollowUrl,
  follows
}) => {
  const [disabled, setDisabled] = useState(false);
  const [followState, setFollowState] = useState(follows);

  const disabledClass = disabled ? "disabled" : "";
  const btnClass = followState ? "btn-secondary" : "btn-success";
  const btnText = followState ? "Unfollow" : "Follow project";
  const updateUrl = followState ? unfollowUrl : followUrl;

  return (
    <div
      className={`btn btn-sm ${btnClass} ${disabledClass}`}
      onClick={async () => {
        if (!disabled) {
          setDisabled(true);
          await updateFollow(updateUrl);
          setDisabled(false);
          setFollowState(!followState);
          window.location.reload();
        }
      }}
    >
      {btnText}
    </div>
  );
};
