import { CompositeDecorator } from "draft-js";
import { linkDecorator } from "./Link";
import { imageDecorator } from "./Image";

export const newDecorator = () =>
  new CompositeDecorator([linkDecorator, imageDecorator]);
