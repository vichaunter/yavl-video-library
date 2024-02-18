import { EyeFilled, EyeOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React, { FC, ReactEventHandler } from "react";

type Props = {
  watched?: boolean;
  className?: string;
  onClick?: ReactEventHandler;
};

const Watched: FC<Props> = ({ watched, className, onClick }) => {
  return (
    <div className={classNames(className, "icon-watch")}>
      {watched ? (
        <EyeFilled onClick={onClick} />
      ) : (
        <EyeOutlined onClick={onClick} />
      )}
    </div>
  );
};

export default Watched;
