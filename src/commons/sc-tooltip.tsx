import { Tooltip, TooltipProps } from "antd";
import { MAINBLUE, UNABLE_USER_SELECT } from "../styles/style.constant";
import { ReactNode } from "react";
import styled from "styled-components";

type ScTooltipProps = TooltipProps & {
  children: ReactNode;
};

export const ScTooltip = ({
  title,
  children,
  zIndex,
  color,
  placement,
  ...tooltipProps
}: ScTooltipProps) => {
  return (
    <StyledTooltip
      destroyTooltipOnHide={true}
      title={title}
      placement={placement ? placement : "right"}
      zIndex={zIndex}
      color={color ? color : MAINBLUE}
      {...tooltipProps}
    >
      {/**
       *  need to something here to prevent dom error:
       *  https://stackoverflow.com/questions/70684982/adding-tooltip-to-input-causes-finddomnode-is-deprecated-in-strictmode-error
       */}
      <StyledWrapper>{children}</StyledWrapper>
    </StyledTooltip>
  );
};

const StyledTooltip = styled(Tooltip)`
  ${UNABLE_USER_SELECT}
  //cursor: pointer;
`;

const StyledWrapper = styled.div`
  align-content: center;
  display: grid;
`;
