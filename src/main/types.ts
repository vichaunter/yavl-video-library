export interface FFprobeOutput {
  format: {
    filename: string;
    duration: string;
    bit_rate: string;
  };
  streams: {
    codec_name: string;
    codec_type: string;
    codec_long_name: string;
    channel_layout: string;
    tags?: {
      title: string;
      language: string;
    };
  }[];
}
