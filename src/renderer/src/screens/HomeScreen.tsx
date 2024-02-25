import { useEffect, useState } from 'react';
import api from '../api/apiMedia';
import MediaItem from '../components/MediaItem';
import useFolder from '../hooks/useFolder';
import { Media as MediaType } from '../../../main/helpers';
import useWatchedStore from '../store/useWatchedStore';

const HomeScreen = () => {
  const [files, setFiles] = useState<MediaType[]>([]);
  const { current, openDialog } = useFolder();

  useEffect(() => {
    if (!current) return;
    api.listFiles({ folder: current }).then((files) => setFiles(files));
  }, [current]);

  return (
    <div>
      <button onClick={openDialog}>{current}</button>
      <div className="grid-container">
        {files?.map((file) => {
          return (
            <MediaItem
              key={file.fullPath}
              fullPath={file.fullPath}
              fileName={file.name}
              className="grid-item"
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomeScreen;
