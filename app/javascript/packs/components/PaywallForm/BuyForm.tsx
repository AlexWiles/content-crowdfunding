import React, { useState } from "react";
import { Row, Col } from "../Grid";

import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { loadStripe, Stripe, SetupIntent } from "@stripe/stripe-js";

import { Pledge, StripeSourceObject } from "./types";
import { SelectSource, NewCardInfo } from "./SourceSelect";
import { deleteReq, post } from "../../lib/api";
import { Paywall, Project } from "../project/types";
import { EffectStatus } from "../EffectStatus";

const createPaymentMethod = async (
  setupIntent: SetupIntent,
  paywallId: number
): Promise<{
  clientSecret: string;
  sourceId: number;
  paymentMethod: string;
}> => {
  const { clientSecret, sourceId, paymentMethod } = await post(
    "/payments/method",
    {
      setupIntent: setupIntent,
      paywallId: paywallId,
    }
  );
  return { clientSecret, sourceId, paymentMethod };
};

const getPaymentIntent = async (
  sourceId: number,
  paywallId: number
): Promise<{
  clientSecret: string;
  paymentMethod: string;
}> => {
  const { clientSecret, paymentMethod } = await post("/payments/intent", {
    sourceId: sourceId,
    paywallId: paywallId,
  });
  return { clientSecret, paymentMethod };
};

const recordPayment = async (
  paymentIntentId: string,
  sourceId: number,
  paywallId: number
): Promise<{ nextUrl: string }> => {
  return await post("/payments/record", {
    paymentIntentId,
    paywallId,
    sourceId,
  });
};

type BuyFormProps = {
  stripeKey: string;
  setupIntentClientSecret: string;
  paywallId: number;
  paywall: Paywall;
  pledgesPath: string;
  faqsExpanded?: boolean;
  pledge: Pledge;
  stripeSources: StripeSourceObject[];
  stripeLogoPath: string;
  project: Project;
};

const validation = (
  sourceId: undefined | number,
  newCardInfo: undefined | NewCardInfo
): { valid: boolean; invalidMessage: string } => {
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

const _BuyForm: React.FC<BuyFormProps> = ({
  paywallId,
  paywall,
  pledgesPath,
  pledge,
  project,
  stripeSources,
  stripeLogoPath,
  setupIntentClientSecret,
}) => {
  const [newCardInfo, setNewCardInfo] = useState<undefined | NewCardInfo>();
  const [sourceId, setSourceId] = useState<undefined | number>();
  const { valid, invalidMessage } = validation(sourceId, newCardInfo);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [status, setStatus] = useState<EffectStatus>("nascent");

  const stripe = useStripe();
  const elements = useElements();

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
        <Row className="mt-2">
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
            <p className="text-smaller text-muted">
              Your payment information is processed through Stripe. Your payment
              method will be charged ${paywall.amount} when you click submit.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-between">
            <a href={project.urls.resource}>
              <button className="btn btn-outline-secondary">Cancel</button>
            </a>
            {valid ? (
              <button
                disabled={status === "loading"}
                className="btn btn-success"
                onClick={async () => {
                  setIsSubmitting(true);
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
                      // display error
                      setStatus("no");
                    } else if (setupIntent) {
                      try {
                        // add payment method
                        // get client secret from response
                        // Call stripe.confirmCardPayment()
                        // record payment
                        const {
                          clientSecret,
                          sourceId,
                          paymentMethod,
                        } = await createPaymentMethod(setupIntent, paywallId);

                        const {
                          paymentIntent,
                        } = await stripe.confirmCardPayment(clientSecret, {
                          payment_method: paymentMethod,
                        });

                        if (paymentIntent) {
                          const { nextUrl } = await recordPayment(
                            paymentIntent.id,
                            sourceId,
                            paywallId
                          );
                          window.location.href = nextUrl;
                        }
                      } catch (err) {
                        setStatus("no");
                      }
                    }
                  } else {
                    try {
                      if (sourceId && stripe) {
                        const {
                          clientSecret,
                          paymentMethod,
                        } = await getPaymentIntent(sourceId, paywallId);

                        const {
                          paymentIntent,
                        } = await stripe.confirmCardPayment(clientSecret, {
                          payment_method: paymentMethod,
                        });

                        if (paymentIntent) {
                          const { nextUrl } = await recordPayment(
                            paymentIntent.id,
                            sourceId,
                            paywallId
                          );
                          setStatus("yes");
                          window.location.href = nextUrl;
                        }
                      }
                    } catch (err) {
                      setStatus("no");
                    }
                  }
                }}
              >
                <div style={{ display: "flex" }}>
                  <span style={{ marginRight: 8 }}>
                    <EffectStatus state={status} />
                  </span>
                  Submit
                </div>
              </button>
            ) : (
              <button className="btn btn-secondary disabled" disabled>
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
              <div className="error-feedback">{invalidMessage}</div>
            )}
          </Col>
        </Row>
      </Col>
    </form>
  );
};

export const BuyForm: React.FC<BuyFormProps> = (props) => {
  const { stripeKey } = props;

  const [stripePromise] = useState<Promise<Stripe | null>>(
    loadStripe(stripeKey)
  );

  return (
    <Elements stripe={stripePromise}>
      <_BuyForm {...props} />
    </Elements>
  );
};
