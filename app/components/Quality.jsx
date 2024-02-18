import React from 'react';
import PropTypes from 'prop-types';

import imageSD from '../images/flagging/video/480.png';
import image720 from '../images/flagging/video/720.png';
import image1080 from '../images/flagging/video/1080.png';
import image4K from '../images/flagging/video/4K.png';
import { VideoResolution } from '../tools/ffprobe';

// https://github.com/cisco-open-source/kodi/tree/master/addons/skin.confluence/media/flagging/video
function Quality({ value }) {
  switch (value) {
    case VideoResolution.SD:
      return <img src={imageSD} alt="" />;
    case VideoResolution.HDTV_720:
      return <img src={image720} alt="" />;
    case VideoResolution.HDTV_1080:
      return <img src={image1080} alt="" />;
    case VideoResolution.UHDTV_4K:
      return <img src={image4K} alt="" />;
    default:
      return <span>-</span>;
  }
}

Quality.propTypes = {
  value: PropTypes.string,
};

Quality.defaultProps = {
  value: '',
};

export default Quality;
