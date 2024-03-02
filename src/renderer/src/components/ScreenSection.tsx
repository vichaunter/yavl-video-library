import { ReactNode } from 'react';
import styled from 'styled-components';

const Styled = styled.div``;

type Props = {
  title?: string;
  children: ReactNode;
};
const ScreenSection = ({ title, children }: Props) => {
  return (
    <Styled>
      {title && <h2>{title}</h2>}
      <div className="container-fluid">{children}</div>
    </Styled>
  );
};

export default ScreenSection;
