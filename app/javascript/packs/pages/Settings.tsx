import React, { useState } from "react";
import { DisplayNameInput } from "../components/settings/DisplayNameInput";
import { User } from "../lib/react_service";
import { ValidityState, nascentValidity } from "../lib/valid";
import { AvatarInput } from "../components/settings/AvatarInput";
import { Avatar } from "../components/User";
import { patch } from "../lib/api";
import { FiLoader, FiCheck } from "react-icons/fi";
import { EffectStatus } from "../components/EffectStatus";

type ButtonStateInfo = { text: string; icon?: React.ReactElement };

const normal: ButtonStateInfo = { text: "Save" };
const loading: ButtonStateInfo = {
  text: "Loading",
  icon: <FiLoader name="loader" className="spin mr-2" />,
};
const success: ButtonStateInfo = {
  text: "Saved",
  icon: <FiCheck name="check" color="green" className="mr-2" />,
};

const StatefuleSaveButton: React.FC<{
  buttonClick: (loading: () => void, success: () => void) => Promise<void>;
  onReset: () => void;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>> = (props) => {
  const { buttonClick, onReset, ...divProps } = props;
  const [buttonState, setButtonState] = useState<ButtonStateInfo>(normal);

  return (
    <div
      {...divProps}
      style={{ width: 150 }}
      onClick={() =>
        buttonClick(
          () => setButtonState(loading),
          () => {
            setButtonState(success);
            setTimeout(() => {
              setButtonState(normal);
              onReset();
            }, 500);
          }
        )
      }
    >
      {buttonState.icon ? (
        buttonState.icon
      ) : (
        <span style={{ width: "1rem", height: "1rem" }}></span>
      )}
      {buttonState.text}
    </div>
  );
};

const updateUser = (url: string, data: { [v: string]: string }) => {
  const resp = patch(url, { user: data });
  return resp;
};

type Tab = { display: string; key: string; page: React.ReactElement };

type TabNavProps = {
  currentTab: string;
  tabs: Tab[];
  onChange: (v: string) => void;
};

const TabNav: React.FC<TabNavProps> = ({ currentTab, onChange, tabs }) => {
  const activeClasses = "active font-weight-medium border-bottom-strong";

  return (
    <ul className="nav flex-row mb-b border-bottom">
      {tabs.map(({ key, display }) => {
        return (
          <li key={key} className="nav-item">
            <a
              href=""
              className={` flex-sm-fill text-sm-center nav-link ${
                currentTab === key ? activeClasses : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(key);
              }}
            >
              {display}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

type TabPageProps = { tabs: Tab[]; currentTab: string };
const TabPage: React.FC<TabPageProps> = ({ currentTab, tabs }) => {
  const tab = tabs.find(({ key }) => key === currentTab);

  if (tab) {
    return tab.page;
  } else {
    return <></>;
  }
};

type ValueAndValidity<T> = {
  validity: ValidityState;
  value: T;
};

type UserSettingsProps = { user: User; updateUrl: string };

export const SettingsUserPage: React.FC<UserSettingsProps> = ({
  user,
  updateUrl,
}) => {
  const [displayNameState, setDisplayNameState] = useState<
    ValueAndValidity<string>
  >({
    value: user.displayName || "",
    validity: nascentValidity,
  });

  const [avatarState, setAvatarState] = useState<
    ValueAndValidity<string | undefined>
  >({ value: undefined, validity: nascentValidity });

  const states = [displayNameState.validity, avatarState.validity];
  const initialValue: { [v: string]: number } = {};

  const { loading = 0, nascent = 0, no = 0, yes = 0 } = states.reduce(
    (counts, curr) => {
      counts[curr.validState] = counts[curr.validState] || 0;
      counts[curr.validState] += 1;
      return counts;
    },
    initialValue
  );

  const formValid = yes >= 1 && no === 0 && loading === 0;

  const [effectStatus, setEffectStatus] = useState<EffectStatus>("nascent");

  return (
    <div className="mt-3">
      <div className="mb-2">
        <div className="align-items-center">
          <div className="mr-3 mb-2">
            <Avatar
              user={{
                ...user,
                ...{
                  avatar: avatarState.value ? avatarState.value : user.avatar,
                },
              }}
            />
          </div>
          <div className="font-weight-medium text-smaller mb-1">
            Profile photo
          </div>
          <div style={{ maxWidth: 300 }}>
            <AvatarInput
              onChange={(v, s) => setAvatarState({ value: v, validity: s })}
            />
          </div>
        </div>
      </div>

      {user.profileURL ? (
        <div className="mb-4">
          <div className="font-weight-medium text-smaller">Profile URL</div>
          <div className="align-items-center">
            <div className="mr-3 mb-2">
              <a href={user.profileURL}>{user.profileURL}</a>
            </div>
          </div>
        </div>
      ) : (
        undefined
      )}

      <div className="mb-4">
        <div className="font-weight-medium text-smaller">Display Name</div>
        <div style={{ maxWidth: 300 }}>
          <DisplayNameInput
            value={displayNameState.value}
            validState={displayNameState.validity}
            onChange={(v, s) => {
              setDisplayNameState({ value: v, validity: s });
            }}
          />
        </div>
      </div>

      <div className="d-flex align-items-end">
        <button
          className={`btn btn-primary ${formValid && effectStatus === "nascent" ? "" : "disabled"}`}
          style={{width: 150}}
          onClick={async () => {
            if (formValid && effectStatus === "nascent") {
              var updates: { [v: string]: string } | undefined = undefined;

              if (displayNameState.validity.validState === "yes") {
                updates = updates || {};
                updates["display_name"] = displayNameState.value;
              }
              if (
                avatarState.validity.validState === "yes" &&
                avatarState.value
              ) {
                updates = updates || {};
                updates["avatar"] = avatarState.value;
              }

              if (updates) {
                setEffectStatus("loading");
                await updateUser(updateUrl, updates);
                setEffectStatus("yes");
                setTimeout(() => location.reload(), 300);
              }
            }
          }}
        >
          <EffectStatus state={effectStatus} messages={{ nascent: "Save" }} />
        </button>
        <a className="text-muted ml-5" href="">
          cancel
        </a>
      </div>
    </div>
  );
};

export const SettingsPaymentPage: React.FC<{
  user: User;
  stripeDashboardUrl: string;
  stripeOauthUrl: string;
}> = ({ user, stripeDashboardUrl, stripeOauthUrl }) => {
  if (user.stripeConnected) {
    return (
      <div className="mt-3">
        <h5>Stripe</h5>
        <p>
          Click below to visit your Stripe dashboard to view your balance and
          account information.
        </p>
        <a
          className="mt-2 btn btn-primary"
          href={stripeDashboardUrl}
          target="_blank"
        >
          Visit your Stripe dashboard
        </a>
      </div>
    );
  } else {
    return (
      <div className="mt-3">
        <h5>Stripe</h5>
        <div className="text-muted text-smaller">
          Connect with Stripe to enable crowdfunding and the ability to receive
          money.
        </div>
        <div className="d-flex flex-column justify-content-center">
          <div style={{ width: 200 }}>
            <a className="stripe-connect" href={stripeOauthUrl}>
              <span>Connect with Stripe</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
};

type SettingsPageProps = {
  user: User;
  updateUrl: string;
  stripeOauthUrl: string;
  stripeDashboardUrl: string;
};

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  updateUrl,
  stripeOauthUrl,
  stripeDashboardUrl,
}) => {
  const [tab, setTab] = useState<string>("user");

  const tabs = [
    {
      key: "user",
      display: "User",
      page: <SettingsUserPage user={user} updateUrl={updateUrl} />,
    },
    {
      key: "payments",
      display: "Payments",
      page: (
        <SettingsPaymentPage
          user={user}
          stripeDashboardUrl={stripeDashboardUrl}
          stripeOauthUrl={stripeOauthUrl}
        />
      ),
    },
  ];

  return (
    <div>
      <h1>Settings</h1>
      <TabNav currentTab={tab} tabs={tabs} onChange={(v) => setTab(v)} />
      <TabPage currentTab={tab} tabs={tabs} />
    </div>
  );
};
