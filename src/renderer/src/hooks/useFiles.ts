import { useEffect } from 'react';
import useFavoriteStore from '../store/useFavoriteStore';
import useFilesStore from '../store/useFileStore';
import useWatchedStore from '../store/useWatchedStore';
import useFolder from './useFolder';

const useFiles = () => {
  const { current } = useFolder();
  const [isWatched] = useWatchedStore((state) => [state.isWatched]);
  const [isFavorite] = useFavoriteStore((state) => [state.isFavorite]);

  const [files, loading, loadFolder] = useFilesStore((state) => [
    state.files,
    state.loading,
    state.loadFolder,
  ]);

  useEffect(() => {
    if (!current) return;
    loadFolder(current);
  }, [current]);

  const items = files.map((item) => {
    item.user = {
      watched: item.tmdb?.id ? isWatched(item.tmdb?.id) : undefined,
      favorite: isFavorite(item.id),
    };

    return item;
  });

  return {
    items,
    loading,
  };
};

export default useFiles;
