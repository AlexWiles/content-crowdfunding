import { RawDraftContentState } from "draft-js";

export type Post = {
  id: undefined | number;
  title: string;
  description: string;
  body: undefined | RawDraftContentState;
  published: boolean;
  resourceUrl: string;
  displayDate: string;
  firstImageUrl: string | undefined;
  color: string;
  urls: {
    view: string;
    edit: string;
  };
};


export type PostOrder = undefined | "asc" | "desc";

export type Project = {
  id: undefined | number;
  fundingType: string;
  title: string;
  description: string;
  about: string;
  published: boolean;
  body: undefined | RawDraftContentState;
  firstImageUrl: string | undefined;
  color: string;
  paywalls: Paywall[];
  paywall: Paywall;
  postOrder: PostOrder,
  urls: {
    view: string;
    edit: string;
    update: string;
    publish: string;
    imageUpload: string;
    resource: string;
  };
  displayDate: string;
};

export type FundingType = "free" | "paywall" | "crowdfund";

export type Paywall = {
  id?: number;
  amount: string;
  amountCents: number;
  minimum: string;
  minimumCents: number;
  fundingType: FundingType;
  duration: string;
  requiresPayment: boolean;
  state: string;
};

export type User = {
  color: string;
  displayName: string | undefined;
  userName: string | undefined;
  avatar: string | undefined;
  stripeConnected: boolean;
  profileURL: string | undefined;
};
