import React, { useState } from "react";
import { basicEmailValid } from "../../lib/email";

type SubscribeCTAProps = {
  url: string;
  token: string;
  projectId: number;
  projectTitle: string;
  authorName: string;
};

export const SubscribeCTA: React.FC<SubscribeCTAProps> = ({
  url,
  token,
  projectId,
  projectTitle,
  authorName,
}) => {
  const [email, setEmail] = useState("");

  return (
    <div
      className="row d-flex justify-content-center border-bottom transition-max-height"
    >
      <div className="col-12 col-md-10 col-lg-8 max-width-content py-3">
        <div className="d-flex">
          <div className="">
            <div className="mb-1 font-weight-light">
              <span className="font-weight-medium">{projectTitle}</span>
              {authorName ? ` by ${authorName}` : undefined}
            </div>

            <div className="text-smaller font-weight-light mb-1">
              Get new posts emailed to you as they are published.
            </div>

            <div className="mb-1" style={{ display: "flex" }}>
              <form
                className="new_user"
                id="new_user"
                action={url}
                acceptCharset="UTF-8"
                method="post"
              >
                <input
                  type="hidden"
                  name="authenticity_token"
                  defaultValue={token}
                ></input>
                <div
                  className="d-flex justify-content-end"
                  style={{ maxWidth: 500 }}
                >
                  <input
                    placeholder="Email"
                    type="email"
                    className="mr-2 w-100 px-2 form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="user[email]"
                    id="user_email"
                  ></input>
                  <input
                    disabled={!basicEmailValid(email)}
                    type="submit"
                    name="commit"
                    value="Subscribe"
                    className="btn btn-success"
                    data-disable-with="Subscribe"
                  ></input>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
