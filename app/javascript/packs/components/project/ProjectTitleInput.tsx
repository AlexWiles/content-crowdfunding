import React from "react";
import { ErrorFor } from "../../form/Validated/Errors";
import { Wrapper } from "../../form/Validated/Wrapper";
import { Textarea } from "../../form/Validated/Textarea";

type ProjectTitleProps = {
  value: string;
  rows?: number;
  minLength?: number;
};

export const ProjectTitleInput: React.FC<ProjectTitleProps> = ({
  value,
  minLength,
  rows
}) => {
  return (
    <Wrapper>
        <Textarea
          id="project_title"
          rows={rows}
          placeholder="Project Title"
          defaultValue={value}
          name="project[title]"
          className="input w-100 outline-none border-none"
          minLength={minLength}
        ></Textarea>

      <div className="mt-1" style={{ height: "2rem" }}>
        <ErrorFor
          id="project_title"
          Display={({ error }) => (
            <div className="text-smallest text-danger">{error}</div>
          )}
        />
      </div>
    </Wrapper>
  );
};
