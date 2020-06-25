import React from "react";

const fundingTypes = [
  {
    value: "free",
    title: "Free",
  },
  {
    value: "crowdfund",
    title: "Crowdfunded",
  },
  {
    value: "paywall",
    title: "Paywall",
  },
];

export const FundingOption: React.FC<{
  value: string;
  onChange?: (v: string) => void;
  disabled: boolean;
}> = ({ value, onChange = (v) => {}, disabled }) => {
  return (
    <div>
      <div className="text-smaller font-weight-medium">Funding option</div>
      <fieldset id="fundingOption">
        <div className="d-flex flex-wrap">
          {fundingTypes.map((ft) => {
            return (
              <div className="mr-4">
                <input
                  type="radio"
                  id={ft.value}
                  name="fundingOption"
                  value={ft.value}
                  checked={value === ft.value}
                  disabled={disabled}
                  onChange={() => onChange(ft.value)}
                />
                <label className="text-smaller ml-2 mb-0" htmlFor={ft.value}>
                  {ft.title}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};
