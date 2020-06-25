import React from "react";
import { Paywall } from "./types";

export const CrowdfundForm: React.FC<{
  published: boolean;
  paywall: Paywall;
  onChange: (paywall: Paywall) => void;
}> = ({ paywall, published, onChange }) => {
  return (
    <div className="border px-3 py-2 mb-4">
      <div className="mb-2">
        <div className="text-smaller font-weight-medium mb-0">Goal</div>
        <div
          className="input-group input-group-sm mb-2"
          style={{ maxWidth: 120 }}
        >
          <div className="input-group-prepend">
            <div className="input-group-text">$</div>
          </div>
          <input
            readOnly={published}
            step="1"
            min="1"
            className="form-control input-sm"
            type="number"
            name="project[paywalls_attributes][0][amount]"
            id="project_paywalls_amount"
            value={paywall.amount || 100}
            onChange={(e) =>
              onChange({
                ...paywall,
                ...{ amount: String(Number(e.target.value)) },
              })
            }
          ></input>
        </div>
        <div
          className="text-muted text-smaller line-height-1-4"
          style={{ maxWidth: 450 }}
        >
          The fundraising goal of the campaign. If this amount is reached before
          the deadline, the project is successful and you will receive the
          money.
        </div>
      </div>

      <div className="mb-2">
        <div className="text-smaller font-weight-medium">Minimum Pledge</div>
        <div
          className="input-group input-group-sm mb-2"
          style={{ maxWidth: 120 }}
        >
          <div className="input-group-prepend">
            <div className="input-group-text">$</div>
          </div>
          <input
            readOnly={published}
            step="1"
            min="1"
            className="form-control input-sm"
            type="number"
            name="project[paywalls_attributes][0][minimum]"
            id="project_paywalls_minimum"
            value={paywall.minimum || "1"}
            onChange={(e) =>
              onChange({
                ...paywall,
                ...{ minimum: String(Number(e.target.value)) },
              })
            }
          ></input>
        </div>

        <div
          className="text-muted text-smaller line-height-1-4"
          style={{ maxWidth: 450 }}
        >
          The minimum pledge for a backer to receive the content. Backers that
          contribute at least this amount will get access to the content.
          Backers that contribute less than this amount will not get access to
          the content.
        </div>
      </div>

      <div className="mb-2">
        <div className="text-smaller font-weight-medium">Duration</div>
        <div className="input-group input-group-sm" style={{ maxWidth: 150 }}>
          <input
            readOnly={published}
            step="1"
            min="1"
            max="60"
            className="form-control input-sm"
            type="number"
            name="project[paywalls_attributes][0][duration]"
            id="project_paywalls_duration"
            value={paywall.duration || 30}
            onChange={(e) =>
              onChange({ ...paywall, ...{ duration: e.target.value } })
            }
          ></input>

          <div className="input-group-append">
            <div className="input-group-text">days</div>
          </div>
        </div>
        <div className="text-muted text-smaller mt-2">
          Campaigns can be between 1 and 60 days long.
        </div>
      </div>

      <input
        type="hidden"
        name="project[paywalls_attributes][0][funding_type]"
        value="crowdfund"
      ></input>

      <input
        type="hidden"
        name="project[paywalls_attributes][0][id]"
        value={String(paywall.id || "")}
      ></input>
    </div>
  );
};
