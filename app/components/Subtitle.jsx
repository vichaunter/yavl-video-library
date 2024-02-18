import React from "react";
import { MessageOutlined } from "@ant-design/icons";
import Flag from "./Flag";

const Subtitle = ({ languages }) => (
  <div className="languages subtitle">
    <MessageOutlined className="icon" />
    {languages.map((stream, idx) => (
      <Flag
        key={`${stream.language}_${stream.title}_${idx}`}
        language={stream.language}
        title={stream.title}
      />
    ))}
  </div>
);

export default Subtitle;
