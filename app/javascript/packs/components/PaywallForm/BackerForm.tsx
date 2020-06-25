import React, { useState, useEffect } from "react";
import { Row, Col } from "../Grid";

import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { loadStripe, Stripe, SetupIntent } from "@stripe/stripe-js";
import { AmountInput } from "./AmountInput";
import { Pledge, StripeSourceObject } from "./types";
import { SelectSource, NewCardInfo } from "./SourceSelect";
import { deleteReq } from "../../lib/api";
import { Paywall } from "../project/types";
import { EffectStatus } from "../EffectStatus";

const submitPledge = async ({
  pledgesPath,
  paywallId,
  amount,
  sourceId,
  setupIntent,
}: {
  pledgesPath: string;
  paywallId: number;
  amount: number | undefined;
  sourceId: undefined | number;
  setupIntent: undefined | SetupIntent;
}) => {
  if (!amount) return;

  const railsToken = (document.getElementsByName(
    "csrf-token"
  )[0] as HTMLMetaElement).content;

  const response = await fetch(pledgesPath, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": railsToken,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      amount_cents: amount,
      paywall_id: paywallId,
      source_id: sourceId,
      setup_intent: setupIntent,
    }),
  });
  return await response.json();
};

type BackerFormProps = {
  stripeKey: string;
  setupIntentClientSecret: string;
  paywallId: number;
  paywall: Paywall;
  pledgesPath: string;
  faqsExpanded?: boolean;
  pledge: Pledge;
  stripeSources: StripeSourceObject[];
  stripeLogoPath: string;
};

const validation = (
  amount: undefined | number,
  sourceId: undefined | number,
  newCardInfo: undefined | NewCardInfo
): { valid: boolean; invalidMessage: string } => {
  if (!amount) {
    return { valid: false, invalidMessage: "Please enter an amount" };
  }

  if (amount && amount < 200) {
    return {
      valid: false,
      invalidMessage: "Please enter an amount greater than $2",
    };
  }

  if (newCardInfo && newCardInfo.cardName.length === 0) {
    return {
      valid: false,
      invalidMessage: "Please enter the name on the card",
    };
  }

  if (newCardInfo && !newCardInfo.cardState?.complete) {
    return {
      valid: false,
      invalidMessage: "Please finish entering the payment method",
    };
  }

  if (!sourceId && !newCardInfo) {
    return { valid: false, invalidMessage: "Please choose a payment method" };
  }

  return { valid: true, invalidMessage: "" };
};

const _BackerForm: React.FC<BackerFormProps> = ({
  paywallId,
  paywall,
  pledgesPath,
  pledge,
  stripeSources,
  stripeLogoPath,
  setupIntentClientSecret,
}) => {
  const [amount, setAmount] = useState<undefined | number>();
  const [newCardInfo, setNewCardInfo] = useState<undefined | NewCardInfo>();
  const [sourceId, setSourceId] = useState<undefined | number>();
  const { valid, invalidMessage } = validation(amount, sourceId, newCardInfo);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    setAmount(pledge.amountCents || Number(paywall.minimum) * 100);
    setSourceId(pledge.sourceId);
  }, [pledge.amountCents, pledge.sourceId]);

  const [status, setStatus] = useState<EffectStatus>("nascent");

  return (
    <form className="row" onSubmit={(e) => e.preventDefault()}>
      <Col xs={12}>
        {pledge.id ? (
          <Row className="mb-3">
            <Col>
              <a
                className="text-smaller"
                href=""
                onClick={async (e) => {
                  e.preventDefault();
                  const { nextUrl } = await deleteReq(
                    "/pledges/" + pledge.id,
                    {}
                  );
                  window.location = nextUrl;
                }}
              >
                cancel pledge
              </a>
            </Col>
          </Row>
        ) : (
          undefined
        )}
        <Row className="mb-1">
          <Col className="font-weight-medium">Amount</Col>
        </Row>
        <Row className="mb-1">
          <Col className="text-smaller line-smaller">
            <p>
              All pledge amounts ${paywall.minimum || 2} and over will have
              access to the project once published. If you contribute less than
              ${paywall.minimum || 2} you will help the project be funded but
              you will not have access to the content.
            </p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <AmountInput
              paywall={paywall}
              value={amount}
              onChange={(v) => {
                setAmount(v);
              }}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="font-weight-medium d-flex justify-content-between">
            <div>Payment Method</div>
            <div>
              <a href="https://stripe.com" target="_blank">
                <img src={stripeLogoPath} />
              </a>
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <SelectSource
              sourceId={sourceId}
              newCardInfo={newCardInfo}
              stripeSources={stripeSources}
              onChange={({ sourceId, newCardInfo }) => {
                setSourceId(sourceId);
                setNewCardInfo(newCardInfo);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="text-smaller line-smaller text-muted">
              Your payment information is processed through Stripe. Your payment
              method will not be charged immediately. If the project is
              successfully funded, your payment method will be charged{" "}
              {amount ? `$${amount / 100} USD` : " the entered amount "} when
              the project ends. If the project does not reach it's funding goal
              your payment method will not be charged.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              onClick={() => history.back()}
            >
              Cancel
            </button>
            {valid ? (
              <button
                style={{ minWidth: 100 }}
                className="btn btn-success"
                onClick={async () => {
                  setStatus("loading");
                  const cardElement = elements?.getElement(CardElement);

                  if (stripe && newCardInfo && cardElement) {
                    const {
                      setupIntent,
                      error,
                    } = await stripe.confirmCardSetup(setupIntentClientSecret, {
                      payment_method: {
                        card: cardElement,
                        billing_details: { name: newCardInfo.cardName },
                      },
                    });

                    if (error) {
                      setStatus("no");
                      // display error
                    } else {
                      try {
                        const { nextUrl } = await submitPledge({
                          pledgesPath,
                          paywallId,
                          amount,
                          sourceId,
                          setupIntent,
                        });
                        setStatus("yes");
                        window.location = nextUrl;
                      } catch (err) {
                        setStatus("no");
                      }
                    }
                  } else {
                    try {
                      const { nextUrl } = await submitPledge({
                        pledgesPath,
                        paywallId,
                        amount,
                        sourceId,
                        setupIntent: undefined,
                      });
                      setStatus("yes");
                      window.location = nextUrl;
                    } catch (err) {
                      setStatus("no");
                    }
                  }
                }}
              >
                <EffectStatus state={status} messages={{ nascent: "Submit" }} />
              </button>
            ) : (
              <button
                className="btn btn-secondary disabled"
                disabled
                style={{ minWidth: 100 }}
              >
                Submit
              </button>
            )}
          </Col>
        </Row>

        <Row className="mt-2" style={{ height: 25 }}>
          <Col>
            {valid ? (
              undefined
            ) : (
              <div className="error-feedback text-smaller">
                {invalidMessage}
              </div>
            )}
          </Col>
        </Row>
      </Col>
    </form>
  );
};

export const BackerForm: React.FC<BackerFormProps> = (props) => {
  const { stripeKey } = props;

  const [stripePromise] = useState<Promise<Stripe | null>>(
    loadStripe(stripeKey)
  );

  return (
    <Elements stripe={stripePromise}>
      <_BackerForm {...props} />
    </Elements>
  );
};
