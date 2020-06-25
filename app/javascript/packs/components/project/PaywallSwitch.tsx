import React, { useState } from "react";
import { FundingOption } from "./FundingOption";
import { CrowdfundForm } from "./CrowdfundForm";
import { Project, FundingType } from "./types";
import { PaywallForm } from "./PaywallForm";
import produce from "immer";

const canSubmit = ({ fundingType }: Project): boolean => {
  const fundingTypeEmpty = fundingType === null || fundingType === "";
  return !fundingTypeEmpty;
};

type PaywallSwitchProps = {
  token: string;
  project: Project;
};

export const PaywallSwitch: React.FC<PaywallSwitchProps> = ({
  token,
  project,
}) => {
  const [state, setState] = useState<Project>(project);

  return (
    <form action={project.urls.resource} acceptCharset="UTF-8" method="post">
      <input type="hidden" name="_method" value="patch"></input>
      <input type="hidden" name="authenticity_token" value={token}></input>

      <div className="mb-4" style={{ minHeight: 100 }}>
        <FundingOption
          disabled={project.published}
          value={state.paywall.fundingType}
          onChange={(v) =>
            setState(
              produce(state, (newState) => {
                newState.paywall.fundingType = v as FundingType;
              })
            )
          }
        />
      </div>

      <input
        type="hidden"
        name={`project[paywalls_attributes][0][id]`}
        id="project_paywalls_id"
        value={state.paywall.id}
      />

      <div
        style={{
          maxHeight: state.paywall.fundingType === "crowdfund" ? 750 : 0,
        }}
      >
        {state.paywall.fundingType === "crowdfund" ? (
          <div className="row">
            <div className="col-12">
              <CrowdfundForm
                paywall={state.paywall}
                published={project.published}
                onChange={(paywall) => {
                  setState({ ...state, ...{ paywall } });
                }}
              />
            </div>
          </div>
        ) : (
          undefined
        )}
      </div>

      <div
        style={{
          maxHeight: state.paywall.fundingType === "paywall" ? 400 : 0,
        }}
      >
        {state.paywall.fundingType === "paywall" ? (
          <div className="row">
            <div className="col-12">
              <PaywallForm
                paywall={state.paywall}
                onChange={(paywall) => {
                  setState({ ...state, ...{ paywall } });
                }}
              />
            </div>
          </div>
        ) : (
          undefined
        )}
      </div>

      {state.paywall.fundingType === "free" ? (
        <input
          type="hidden"
          name="project[paywalls_attributes][0][funding_type]"
          id="project_paywalls_funding_type"
          value="free"
        />
      ) : (
        undefined
      )}

      <div className="d-flex justify-content-between">
        <a
          className="btn btn-outline-secondary"
          href=""
          onClick={() => history.back()}
        >
          Cancel
        </a>
        <input
          type="submit"
          name="commit"
          value={project.published ? "Save" : "Save Draft"}
          disabled={!canSubmit(state)}
          className={`btn btn-success ${canSubmit(state) ? "" : "disabled"}`}
          data-disable-with={project.published ? "Save" : "Save Draft"}
        ></input>
      </div>
    </form>
  );
};
