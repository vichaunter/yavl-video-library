import { ReactNode } from 'react';
import styled from 'styled-components';

const Styled = styled.div``;

type Props = {
  title?: string | ReactNode;
  children: any;
  className?: string;
};
const ScreenSection = ({ title, children, className }: Props) => {
  return (
    <Styled className={className}>
      {typeof title === 'string' ? <h2>{title}</h2> : title}
      <div className="container-fluid">{children}</div>
    </Styled>
  );
};

export default ScreenSection;
