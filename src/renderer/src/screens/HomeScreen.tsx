import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import {
  FaEye,
  FaEyeSlash,
  FaRegStar,
  FaSortAlphaDown,
  FaSortAlphaUpAlt,
  FaStar,
} from 'react-icons/fa';
import styled from 'styled-components';
import MediaModel from '../../../main/models/MovieModel';
import MediaItem from '../components/MediaItem';
import useFiles from '../hooks/useFiles';
import useFolder from '../hooks/useFolder';
import { ascDesc } from '../helpers';

const Styled = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
  }
`;

const SORTERS: Record<
  string,
  (items: MediaModel[], dir: 'asc' | 'desc') => MediaModel[]
> = {
  id: (items, dir) => orderBy(items, 'id', dir),
  favorites: (items, dir) =>
    dir === 'desc' ? items : orderBy(items, 'user.favorite', 'desc'),
};
const sortItems = (items: MediaModel[], sort: Record<string, boolean>) => {
  let sortedItems = items;

  // Loop through each sort option
  for (const [key, value] of Object.entries(sort)) {
    sortedItems = SORTERS[key](sortedItems, ascDesc(value));
  }

  return sortedItems;
};

const HomeScreen = () => {
  const [sort, setSort] = useState<Record<string, boolean>>({
    id: true,
    favorites: false,
  });
  const [filter, setFilter] = useState<Record<string, boolean>>({
    watched: true,
  });

  const { current, openDialog } = useFolder();

  const { items, loading } = useFiles();

  const toggleSort = (type: string) => {
    const newSort = { ...sort, [type]: !sort[type] };
    setSort(newSort);
  };

  const togglefilter = (type: string) => {
    const newFilter = { ...filter, [type]: !filter[type] };
    setFilter(newFilter);
  };

  const filteredItems = !filter.watched
    ? items.filter((item) => !item.user?.watched)
    : items;

  const sortedItems = useMemo(() => {
    let sortedItems = filteredItems;

    // Loop through each sort option
    for (const [key, value] of Object.entries(sort)) {
      sortedItems = SORTERS[key](sortedItems, ascDesc(value));
    }

    return sortedItems;
  }, [filteredItems, sort]);

  return (
    <Styled>
      <div className="header">
        <button onClick={openDialog}>{current}</button>
        {loading && <div>Loading...</div>}
        <div className="actions">
          <button onClick={() => toggleSort('id')}>
            {sort.id ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />}
          </button>
          <button onClick={() => toggleSort('favorites')}>
            {sort.favorites ? <FaStar /> : <FaRegStar />}
          </button>
          <button onClick={() => togglefilter('watched')}>
            {filter.watched ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </div>
      <div className="grid-container">
        {sortedItems?.map((file) => {
          return (
            <MediaItem
              key={file.fileInfo?.data?.fullpath}
              item={file}
              className="grid-item"
            />
          );
        })}
      </div>
    </Styled>
  );
};

export default HomeScreen;
