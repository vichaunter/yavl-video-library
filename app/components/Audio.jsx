import { SoundOutlined } from "@ant-design/icons";
import Flag from "./Flag";

const Audio = ({ languages }) => {
  return (
    <div className="languages audio">
      <SoundOutlined className="icon" />
      {languages.map((stream, idx) => (
        <Flag
          key={`${stream.language}_${stream.codecName}_${idx}`}
          language={stream.language}
          title={stream.codecName}
        />
      ))}
    </div>
  );
};

export default Audio;
