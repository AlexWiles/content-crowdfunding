import React from "react";
import { Dropdown } from "./Dropdown";
import {
  FiChevronDown,
  FiHome,
  FiUsers,
  FiPlus,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { User } from "./project/types";

export const Avatar: React.FC<{
  image: string | undefined;
  color: string;
}> = ({ image, color }) => {
  if (image) {
    return (
      <div className="d-flex align-items-center">
        <img
          src={image}
          style={{
            height: "2rem",
            width: "2rem",
            borderRadius: "2rem",
            objectFit: "cover",
          }}
        />
        <FiChevronDown name="chevron-down" size="1.5rem"/>
      </div>
    );
  } else {
    return (
      <div className="d-flex align-items-center">
        <div
          style={{
            height: "2rem",
            width: "2rem",
            borderRadius: "2rem",
            objectFit: "cover",
            backgroundColor: color,
          }}
        ></div>
        <FiChevronDown name="chevron-down" size="1.5rem"/>
      </div>
    );
  }
};

const icons: { [k: string]: JSX.Element } = {
  home: <FiHome strokeWidth="1" size="1rem" />,
  users: <FiUsers strokeWidth="1" size="1rem" />,
  plus: <FiPlus strokeWidth="1" size="1rem" />,
  settings: <FiSettings strokeWidth="1" size="1rem" />,
  logout: <FiLogOut strokeWidth="1" size="1rem" />,
};

export const UserDropdown: React.FC<{
  user: User;
  email: string;
  links: { text: string; href: string; method: string; icon: string }[];
}> = ({ links, email, user }) => {
  return (
    <Dropdown clickable={<Avatar image={user.avatar} color={user.color} />}>
      <div className="p-1" style={{ width: 150 }}>
        {links.map(({ text, href, method, icon }) => (
          <div key={text}>
            <a
              href={href}
              data-method={method}
              className="py-1 text-smaller text-left d-flex"
            >
              <div className="d-flex flex-column justify-content-center mr-2 text-muted">
                {icon ? icons[icon] : <div style={{ width: "1rem" }}></div>}
              </div>

              <div className="d-flex flex-column justify-content-center">
                {text}
              </div>
            </a>
          </div>
        ))}
        <div
          className="text-muted text-smallest text-left mt-2"
          style={{ lineHeight: "1rem", wordWrap: "break-word" }}
        >
          <div>logged in as:</div>
          <div>{email}</div>
        </div>
      </div>
    </Dropdown>
  );
};
