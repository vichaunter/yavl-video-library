import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import {
  FaEye,
  FaEyeSlash,
  FaFolder,
  FaRegStar,
  FaSortAlphaDown,
  FaSortAlphaUpAlt,
  FaStar,
} from 'react-icons/fa';
import { FaGear, FaSpinner } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TMDBId } from '../../../main/handlers/traktHandler';
import MediaModel from '../../../main/models/MovieModel';
import MediaItem from '../components/MediaItem';
import PageItemInfo from '../components/PageItemInfo/PageItemInfo';
import { ascDesc } from '../helpers';
import useFiles from '../hooks/useFiles';
import useFolder from '../hooks/useFolder';

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  > .info {
    min-height: 45vh;
    position: relative;
    .header {
      bottom: 0;
      width: 100vw;
      z-index: 10;
      position: absolute;
      display: flex;
      justify-content: space-between;
      .main-menu {
        position: fixed;
        top: 1rem;
        right: 1rem;
      }
    }
  }

  > .content {
    overflow-y: auto;
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
  const [selectedItem, setSelectedItem] = useState<TMDBId>();
  const [sort, setSort] = useState<Record<string, boolean>>({
    id: true,
    favorites: false,
  });
  const [filter, setFilter] = useState<Record<string, boolean>>({
    watched: true,
  });

  const { current, openDialog } = useFolder();

  const { items, loading } = useFiles();

  useEffect(() => {
    if (!selectedItem) setSelectedItem(items[0]?.tmdb?.id);
  }, [items]);

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
      <div className="info">
        {selectedItem && <PageItemInfo selectedId={selectedItem} />}
        <div className="header grid">
          <button onClick={openDialog} className="link">
            {current ? current : <FaFolder />}{' '}
            {loading && <FaSpinner className="spin" />}
          </button>

          <div className="actions">
            <button onClick={() => toggleSort('id')} className="link">
              {sort.id ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />}
            </button>
            <button onClick={() => toggleSort('favorites')} className="link">
              {sort.favorites ? <FaStar /> : <FaRegStar />}
            </button>
            <button onClick={() => togglefilter('watched')} className="link">
              {filter.watched ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <nav className="main-menu">
            <Link to="/config" className="link">
              <FaGear />
            </Link>
          </nav>
        </div>
      </div>
      <div className="content">
        <div className="grid-container">
          {sortedItems?.map((file) => {
            return (
              <MediaItem
                key={file.fileInfo?.data?.fullpath}
                item={file}
                className="grid-item"
                onClick={() => setSelectedItem(file.tmdb?.id)}
              />
            );
          })}
        </div>
      </div>
    </Styled>
  );
};

export default HomeScreen;
