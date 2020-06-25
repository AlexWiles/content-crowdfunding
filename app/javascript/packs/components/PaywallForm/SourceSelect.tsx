import React, { useState, useEffect } from "react";
import { StripeSourceObject } from "./types";
import { CardElement } from "@stripe/react-stripe-js";
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDinersClub,
  FaCcDiscover,
  FaCcJcb
} from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

export type NewCardInfo = {
  cardName: string;
  cardState: undefined | StripeCardElementChangeEvent;
};

const defaultNewCardInfo: NewCardInfo = {
  cardName: "",
  cardState: undefined
};

const StripeCard: React.FC<{
  newCardInfo: undefined | NewCardInfo;
  onChange: (v: NewCardInfo) => void;
  className?: string;
}> = ({ onChange, newCardInfo, className = "" }) => {
  const cardInfo = newCardInfo || defaultNewCardInfo;

  return (
    <>
      <div className="my-2 font-weight-medium">New card</div>
      <input
        className="form-control"
        placeholder="Name on card"
        value={cardInfo.cardName}
        style={{ maxWidth: 350 }}
        onChange={e =>
          onChange({ ...cardInfo, ...{ cardName: e.target.value } })
        }
      ></input>
      <div
        style={{ padding: "0.5rem 0.75rem", height: "60px" }}
        className="border d-flex flex-column justify-content-center mt-2"
      >
        <CardElement
          onChange={v => onChange({ ...cardInfo, ...{ cardState: v } })}
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4"
                }
              },
              invalid: {
                color: "#9e2146"
              }
            }
          }}
        />
      </div>
    </>
  );
};

const CardBrand: React.FC<{ brand: string }> = ({ brand }) => {
  switch (brand) {
    case "visa":
      return <FaCcVisa />;
    case "mastercard":
      return <FaCcMastercard />;
    case "amex":
      return <FaCcAmex />;
    case "diners":
      return <FaCcDinersClub />;
    case "discover":
      return <FaCcDiscover />;
    case "jcb":
      return <FaCcJcb />;
    default:
      return <>{brand}</>;
  }
};

const StripeSource: React.FC<{
  source: StripeSourceObject;
  selected: boolean;
  onClick: () => void;
}> = ({ source: { brand, last4, expMonth, expYear }, selected, onClick }) => {
  return (
    <div
      className="border w-100 d-flex justify-content-between p-2 cursor-pointer hover-shadow"
      onClick={onClick}
    >
      <div className="d-flex">
        <div className="d-flex flex-column justify-content-center mx-4">
          <input type="radio" checked={selected} onChange={() => {}}></input>
        </div>
        <div className="d-flex flex-column justify-content-center mr-4">
          <div>
            <CardBrand brand={brand} />
          </div>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center text-muted text-smaller">
        <div className="d-flex justify-content-end">
          <div>
            Ending with <span className="font-weight-medium">{last4}</span>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <div>
            Expires on{" "}
            <span className="font-weight-medium">
              {expMonth}/{expYear}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

type SelectSourceProps = {
  stripeSources: StripeSourceObject[];
  sourceId: undefined | number;
  newCardInfo: NewCardInfo | undefined;
  onChange: (args: {
    sourceId: undefined | number;
    newCardInfo: NewCardInfo | undefined;
  }) => void;
};

export const SelectSource: React.FC<SelectSourceProps> = ({
  stripeSources,
  onChange,
  sourceId,
  newCardInfo
}) => {
  const [newCard, setNewCard] = useState(false);

  useEffect(() => {
    onChange({ sourceId, newCardInfo });
  }, [sourceId, newCardInfo]);

  return (
    <div>
      {stripeSources.map(source => (
        <div className="mt-2" key={source.id}>
          <StripeSource
            selected={sourceId === source.id}
            onClick={() => {
              setNewCard(false);
              if (sourceId == source.id) {
                onChange({ sourceId: undefined, newCardInfo: undefined });
              } else {
                onChange({ sourceId: source.id, newCardInfo: undefined });
              }
            }}
            source={source}
          />
        </div>
      ))}

      <div className="mt-2">
        <div
          className="transition-max-height"
          style={{ maxHeight: newCard ? 500 : 0 }}
        >
          <div className="pt-1 pb-3 ">
            <StripeCard
              newCardInfo={newCardInfo}
              onChange={v => onChange({ sourceId: undefined, newCardInfo: v })}
            />
          </div>
        </div>

        <div
          style={{ maxHeight: newCard ? 0 : 100 }}
          className="transition-max-height"
        >
          <div
            className="cursor-pointer border w-100 py-2 hover-shadow d-flex align-items-center"
            style={{ height: 60 }}
            onClick={e => {
              setNewCard(true);
              onChange({ sourceId: undefined, newCardInfo: undefined });
            }}
          >
            <div className="mx-4 text-muted" style={{ strokeWidth: 1 }}>
              <FiPlus name="plus" strokeWidth={1} />
            </div>

            <div className="d-flex flex-column justify-content-center mr-4">
              <div>New Card</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
