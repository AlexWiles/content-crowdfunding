import React, { useState } from "react";
import { SlugInput } from "../components/settings/SlugInput";
import { ValidityState, yes, nascentValidity } from "../lib/valid";
import { Row, Col } from "../components/Grid";
import { patch } from "../lib/api";
import { DisplayNameInput } from "../components/settings/DisplayNameInput";

const buttonClass = (slugState: ValidityState | undefined, displayNameState: ValidityState): string => {
  if (slugState && yes(slugState) && yes(displayNameState)) {
    return "";
  } else {
    return "disabled";
  }
};

const submitUsername = async (
  url: string,
  nextUrl: string,
  username: string,
  displayName: string,
) => {
  const resp = await patch(url, { user: { username, display_name: displayName } });
  window.location.href = nextUrl;
};

type UsernamePageProps = {
  slugValidationUrl: string;
  updateUrl: string;
  nextUrl: string;
  domain: string;
};

export const UsernamePage: React.FC<UsernamePageProps> = ({
  slugValidationUrl,
  updateUrl,
  nextUrl,
  domain,
}) => {
  const [slug, setSlug] = useState<string>("");
  const [slugState, setSlugState] = useState<ValidityState | undefined>();

  const [displayName, setDisplayName] = useState<string>("");
  const [displayNameState, setDisplayNameState] = useState<ValidityState>(
    nascentValidity
  );

  return (
    <Row className="justify-content-center mt-3">
      <Col md={10}>
        <div className="mb-3">
          <h5>Choose your username</h5>
          <div className="text-muted font-weight-light">
            <div>This is used as the domain name of your profile on Uncomma.</div>
            <div>
              Once it is set, you can only change it by contacting support, so
              pick something you like.
            </div>
          </div>
        </div>

        <Row className="mb-4">
          <Col xs={8}>
            <div className="mt-2">
              <div className="text-smaller">
                Your profile URL will look like this:
              </div>
              <div
                className="font-weight-medium"
                style={{ fontSize: "1.3rem" }}
              >
                https://{slug.toLowerCase()}.{domain}
              </div>
            </div>
          </Col>

          <Col xs={8}>
            <div className="mt-2">
              <div className="font-weight-medium">Username</div>
              <SlugInput
                value={slug}
                validationPath={slugValidationUrl}
                domain={domain}
                onChange={(v, s) => {
                  setSlug(v);
                  setSlugState(s);
                }}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="mt-2">
              <div className="font-weight-medium">Display Name</div>
              <DisplayNameInput
                value={displayName}
                validState={displayNameState}
                onChange={(v, s) => {
                  setDisplayName(v);
                  setDisplayNameState(s);
                }}
              />

              <div className="text-muted font-weight-light">
                <div>
                  This is how your name is displayed on the website.
                </div>
                <div>
                  You can change this at any time.
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-4 d-flex  align-items-end">
          <div
            className={`btn btn-primary ${buttonClass(slugState, displayNameState)}`}
            onClick={() => {
              if (buttonClass(slugState, displayNameState) !== "disabled") {
                submitUsername(updateUrl, nextUrl, slug, displayName);
              }
            }}
          >
            Continue
          </div>
          <a href="/following" className="text-muted ml-4">
            Skip
          </a>
        </div>
      </Col>
    </Row>
  );
};
