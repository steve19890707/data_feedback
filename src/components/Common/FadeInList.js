import React from "react";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";

// style
const StyledFadeInList = styled(CSSTransition)`
  @keyframes fadeIn {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }
  position: relative;
  opacity: 0;
  z-index: ${({ zKey }) => zKey};
  animation: fadeIn 0.3s ${({ delay }) => delay}s forwards;
`;
export default ({ children, showItemNum = 12, index }) => {
  const startKey = index % showItemNum;
  const zKey = showItemNum - startKey;
  const delay = startKey * 0.05;
  return (
    <StyledFadeInList timeout={300} delay={delay < 1 ? delay : 1} zKey={zKey}>
      {children}
    </StyledFadeInList>
  );
};
