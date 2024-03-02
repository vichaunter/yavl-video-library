import styled from 'styled-components';
import TraktConfig from './ConfigScreen/TraktConfig';

const Styled = styled.div``;

const Header = styled.header`
  padding: 1rem;
`;

const ConfigScreen = () => {
  return (
    <Styled>
      <Header className="container-fluid">
        <h5>Configuration</h5>
      </Header>
      <main className="container-fluid">
        <TraktConfig />
      </main>
    </Styled>
  );
};

export default ConfigScreen;
