import React from "react";
import PropTypes from "prop-types";
import QuestionCircleOutlined from "@ant-design/icons/lib/icons/QuestionCircleOutlined";

const mapping = {
  fre: "fr",
  fra: "fr",
  fr: "fr",
  ita: "it",
  eng: "gb",
  spa: "es",
};

const unknown = {
  und: true,
  unknown: true,
};

const Flag = ({ language, title }) => {
  const short = language in mapping ? mapping[language] : language.substr(0, 2);
  if (!mapping[language]) {
    // console.log(language);
  }
  if (language in unknown) {
    return (
      <QuestionCircleOutlined
        twoToneColor="#eb2f96"
        style={{ marginRight: 5 }}
      />
    );
  }
  return (
    <span
      className={`flag-icon flag-icon-${short}`}
      title={title}
      style={{ marginRight: 5 }}
    />
  );
};

Flag.defaultProps = {
  language: "",
  title: "",
};

Flag.propTypes = {
  language: PropTypes.string,
  title: PropTypes.string,
};

export default Flag;
