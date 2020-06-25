import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Col, Row } from "../Grid";
import { Paywall } from "../project/types";

const OtherAmountInput: React.FC<{
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}> = ({ value, onChange }) => {
  const [invalid, setInvalid] = useState<undefined | string>(undefined);

  // debouncing so it doesnt switch to predefined value
  // if the entered value begins with a predefined amount
  const [currValue, setCurrValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => onChange(currValue), 1000);
    return () => clearTimeout(timer);
  }, [currValue]);

  return (
    <div className="form-group">
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon">
            $
          </span>
        </div>
        <input
          type="number"
          className={`form-control ${invalid ? "is-invalid" : ""}`}
          style={{ maxWidth: 200 }}
          placeholder="Other Amount"
          min="0"
          step="1"
          value={String(currValue ? currValue / 100 : "")}
          onChange={e => {
            const value = e.target.value;
            if (value === "") {
              setCurrValue(undefined);
            } else {
              const intVal = value.replace(/[^-0-9]/g, "");
              setCurrValue(Number(intVal) * 100);
            }
          }}
        />
        {invalid ? <div className="invalid-feedback">{invalid}</div> : <></>}
      </div>
    </div>
  );
};

export const AmountInput: React.FC<{
  paywall: Paywall;
  value: undefined | number;
  onChange: (amount: number | undefined) => void;
}> = ({ onChange, value, paywall }) => {
  const minNum = Number(paywall.minimum || 2);
  const buttonsInfo = [
    {
      display: `$${minNum}`,
      amount: minNum * 100
    },
    {
      display: `$${minNum * 2}`,
      amount: minNum * 200
    }
  ];

  const [otherAmount, setOtherAmount] = useState(false);

  useEffect(() => {
    if (buttonsInfo.find(v => v.amount === value)) {
      setOtherAmount(false);
    } else {
      setOtherAmount(true);
    }
  }, [value]);

  return (
    <>
      <Row>
        <Col>
          {buttonsInfo.map(v => (
            <Button
              value={v.display}
              className="mb-2"
              key={v.amount}
              selected={value === v.amount}
              onClick={() => {
                onChange(v.amount);
                setOtherAmount(false);
              }}
            />
          ))}
          <Button
            value="Other Amount"
            className="mb-2"
            selected={otherAmount}
            onClick={() => {
              onChange(undefined);
              setOtherAmount(!otherAmount);
            }}
          />
        </Col>
      </Row>
      {otherAmount ? (
        <div className="row" style={{ paddingBottom: 0 }}>
          <div className="col-12">
            <OtherAmountInput value={value} onChange={v => onChange(v)} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
