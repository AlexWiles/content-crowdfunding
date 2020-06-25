import React from "react";
import ReactDOM from "react-dom";
import { ProjectSettingsDropdown } from "./components/project/SettingsDropdown";
import { UserDropdown } from "./components/UserDropdown";
import { PublishButton } from "./components/PublishButton";
import { DeleteButton } from "./components/project/DeleteButton";
import { PaywallSwitch } from "./components/project/PaywallSwitch";
import { BackerForm } from "./components/PaywallForm/BackerForm";
import { PostSettingsDropdown } from "./components/post/SettingsDropdown";
import { UsernamePage } from "./pages/Username";
import {
  SettingsPage,
  SettingsUserPage,
  SettingsPaymentPage,
} from "./pages/Settings";
import { FollowButton } from "./components/FollowButton";
import { Flash } from "./components/Flash";
import { SubscribeCTA } from "./components/project/SubscribeCTA";
import { UncommaEditor } from "./components/Editor/Editor";
import { PostForm } from "./components/post/Form";
import { PostBody } from "./components/post/Body";
import { ProjectBody } from "./components/project/Body";
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { BuyForm } from "./components/PaywallForm/BuyForm";
import { PostPublicSwitch } from "./components/post/PublicSwitch";
import { ProjectEmailButton } from "./components/settings/ProjectEmailButton";
import { AppProvider } from "./context";
import { ExampleEditor } from "./components/ExampleEditor";
import { ProjectEdit } from "./components/project/Form";

const components: any = [
  [BackerForm, "BackerForm"],
  [BuyForm, "BuyForm"],
  [DeleteButton, "DeleteButton"],
  [ExampleEditor, "ExampleEditor"],
  [FaFacebook, "FaFacebookSquare"],
  [FaInstagram, "FaInstagram"],
  [FaLinkedin, "FaLinkedin"],
  [FaTwitter, "FaTwitterSquare"],
  [FiLock, "FiLock"],
  [Flash, "Flash"],
  [FollowButton, "FollowButton"],
  [MdEmail, "MdEmail"],
  [PaywallSwitch, "PaywallSwitch"],
  [PostBody, "PostBody"],
  [PostForm, "PostForm"],
  [PostPublicSwitch, "PostPublicSwitch"],
  [PostSettingsDropdown, "PostSettingsDropdown"],
  [ProjectBody, "ProjectBody"],
  [ProjectEdit, "ProjectEdit"],
  [ProjectEmailButton, "ProjectEmailButton"],
  [ProjectSettingsDropdown, "ProjectSettingsDropdown"],
  [PublishButton, "PublishButton"],
  [SettingsPage, "SettingsPage"],
  [SettingsPaymentPage, "SettingsPaymentPage"],
  [SettingsUserPage, "SettingsUserPage"],
  [SubscribeCTA, "SubscribeCTA"],
  [UncommaEditor, "UncommaEditor"],
  [UserDropdown, "UserDropdown"],
  [UsernamePage, "UsernamePage"],
];

export const portals = <T extends any>(
  doc: Document,
  component: React.FC<T>,
  componentName: string
): React.ReactPortal[] => {
  const nodes = Array.from(
    doc.getElementsByClassName(`react-${componentName}`)
  );

  return nodes.map((node) => {
    const data = node.getAttribute("data");
    const parsedData = data && data.length > 2 ? JSON.parse(data) : {};
    const props = parsedData;
    const el = React.createElement(component, { ...props }, []);
    node.innerHTML = ''
    return ReactDOM.createPortal(el, node);
  });
};

document.addEventListener("turbolinks:load", () => {
  const allPortals: React.ReactPortal[] = components.flatMap(
    <T extends any>([c, n]: [React.FC<T>, string]) => {
      return portals(document, c, n);
    }
  );
  const app = React.createElement(AppProvider, {}, [allPortals]);
  ReactDOM.render(app, document.getElementById("react-main"));
});
