import React from 'react';
import PropTypes from 'prop-types';

import imageH264 from '../images/flagging/video/h264.png';
import imageH265 from '../images/flagging/video/hevc.png';

const Codec = ({ value }) => {
  switch (value) {
    case 'h264':
      return <img src={imageH264} alt="" />;
    case 'h265':
    case 'hevc':
      return <img src={imageH265} alt="" />;
    default:
      return <span>{value}</span>;
  }
};

Codec.defaultProps = {
  value: '',
};

Codec.propTypes = {
  value: PropTypes.string,
};

export default Codec;
