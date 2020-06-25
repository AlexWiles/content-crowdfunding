export type StripeSourceObject = {
  id: number;
  last4: string;
  brand: "Visa" | "Mastercard";
  expMonth: number;
  expYear: number;
};

export type Pledge = {
  id: number;
  paywallId: number;
  amountCents: number;
  sourceId: number;
}