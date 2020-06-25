import React from "react";
import { Dropdown } from "../../components/Dropdown";
import { PublishButtonProps } from "../PublishButton";
import { FiDollarSign, FiSettings, FiEye, FiChevronDown, FiEdit } from "react-icons/fi";


const icons: { [k: string]: JSX.Element } = {
  eye: <FiEye strokeWidth="1" size="1rem" />,
  settings: <FiSettings strokeWidth="1" size="1rem" />,
  edit: <FiEdit strokeWidth="1" size="1rem" />,
  dollarsign: <FiDollarSign strokeWidth="1" size="1rem" />,
};


export const ProjectSettingsDropdown: React.FC<{
  publishButton?: PublishButtonProps;
  links: { icon: string; text: string; href: string; method: string }[];
}> = ({ links }) => {
  return (
    <Dropdown
      clickable={
        <div className="d-flex">
          <a
            href=""
            className="d-flex flex-column justify-content-center text-smaller font-weight-medium"
            onClick={e => e.preventDefault()}
          >
            Project
          </a>
          <div className="d-flex flex-column justify-content-center">
            <FiChevronDown name="chevron-down" size="1.5rem" />
          </div>
        </div>
      }
    >
      <div className="p-1" style={{ width: 150 }}>
        {links.map(({ icon, text, href, method }) => {
          return (
            <div key={text}>
              <a
                href={href}
                data-method={method}
                className="py-1 text-smaller text-left d-flex"
              >
                <div className="d-flex flex-column justify-content-center mr-2 text-muted">
                  {icon ? (
                    icons[icon]
                  ) : (
                    <div style={{ width: "1rem" }}></div>
                  )}
                </div>

                <div className="d-flex flex-column justify-content-center">
                  {text}
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </Dropdown>
  );
};
