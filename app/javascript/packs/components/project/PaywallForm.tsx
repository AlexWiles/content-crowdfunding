import React from "react";
import { Paywall } from "./types";

export const PaywallForm: React.FC<{
  paywall: Paywall;
  onChange: (paywall: Paywall) => void;
}> = ({ paywall, onChange }) => {
  return (
    <div className="border px-3 py-2 mb-4">
      <div className="font-weight-medium text-smaller">Price</div>
      <div className="input-group input-group-sm" style={{ maxWidth: 150 }}>
        <div className="input-group-prepend">
          <div className="input-group-text">$</div>
        </div>
        <input
          step="1"
          min="1"
          className="form-control input-sm"
          type="number"
          name="project[paywalls_attributes][0][amount]"
          id="project_paywalls_amount"
          value={paywall.amount}
          onChange={(e) =>
            onChange({
              ...paywall,
              ...{
                fundingType: "paywall",
                amount: String(Number(e.target.value)),
              },
            })
          }
        ></input>
      </div>

      <div className="text-muted text-smaller mt-2">
        The one-time fee a buyer pays for access to this project.
      </div>

      <input
        type="hidden"
        name="project[paywalls_attributes][0][funding_type]"
        value="paywall"
      ></input>

      <input
        type="hidden"
        name="project[paywalls_attributes][0][id]"
        value={String(paywall.id || "")}
      ></input>
    </div>
  );
};
