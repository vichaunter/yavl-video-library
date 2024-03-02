import styled from 'styled-components';
import TraktConfig from './ConfigScreen/TraktConfig';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const Styled = styled.div``;

const Header = styled.header`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
`;

const ConfigScreen = () => {
  return (
    <Styled>
      <Header className="container-fluid">
        <h5>Configuration</h5>
        <Link to="/">
          <FaTimesCircle />
        </Link>
      </Header>
      <main className="container-fluid">
        <TraktConfig />
      </main>
    </Styled>
  );
};

export default ConfigScreen;
