import React from "react";
import Audio from "../Audio";
import Codec from "../Codec";
import Quality from "../Quality";
import Subtitle from "../Subtitle";

const VideoInfo = ({ data }) => (
  <>
    <span className="title">
      {data.title} <span>({data?.tmdb?.release_date?.slice(0, 4)})</span>{" "}
    </span>
    <div className="extra">
      <div className="description">{data?.tmdb?.overview}</div>
      <div className="audio">
        {data.audio.length && <Audio languages={data.audio} />}
      </div>
      {data.subtitle.length && <Subtitle languages={data.subtitle} />}
      <div className="quality">
        <Quality value={data.quality} />
        <Codec value={data.codecName} />
      </div>
    </div>
  </>
);

export default VideoInfo;
