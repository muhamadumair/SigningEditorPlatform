import { Button, ButtonProps } from "antd";
import styled from "styled-components/macro";
import {
  FONT_SIZE_BASE,
  G50,
  G80,
  MAINBLUE,
  SPACE,
} from "../styles/style.constant";
import { mergeClassNames } from "../utils";
import { ScTooltip } from "./sc-tooltip";

declare type TooltipPlacement =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

export interface ScToolbarButtonProps extends ButtonProps {
  activeIconSize?: number;
  iconSize?: number;
  padding?: string;
  margin?: string;
  color?: string;
  background?: string;
  hoverColor?: string;
  hoverBackground?: string;
  disabled?: boolean;
  tooltipTitle?: string;
  tooltipPlacement?: TooltipPlacement;
}

export const ScToolbarButton = ({
  activeIconSize = FONT_SIZE_BASE * 1.25,
  iconSize = FONT_SIZE_BASE * 1.125,
  padding,
  margin,
  color = G80,
  background = "transparent",
  hoverColor = MAINBLUE,
  hoverBackground = "transparent",
  disabled,
  onClick,
  tooltipTitle = "",
  tooltipPlacement = "bottom",
  ...buttonProps
}: ScToolbarButtonProps) => {
  return (
    <ScTooltip title={tooltipTitle} placement={tooltipPlacement}>
      <Wrapper
        onClick={onClick}
        activeIconSize={activeIconSize}
        iconSize={iconSize}
        padding={padding}
        margin={margin}
        color={color}
        background={background}
        hoverColor={hoverColor}
        hoverBackground={hoverBackground}
        disabled={disabled}
      >
        <Button
          type="link"
          disabled={disabled}
          {...buttonProps}
          className={mergeClassNames(buttonProps.className, "btn")}
        />
      </Wrapper>
    </ScTooltip>
  );
};

const Wrapper = styled.span<ScToolbarButtonProps>`
  padding: ${(p) => p.padding};
  margin: ${(p) => p.margin};
  background: ${(p) => p.background};
  cursor: pointer;

  &:hover {
    background: ${(p) => p.hoverBackground};
    border-radius: ${SPACE};
    .ant-btn-link {
      color: ${(p) => p.hoverColor};
    }
  }

  &:active {
    .anticon svg {
      ${(p) => (p.disabled ? "" : `font-size: ${p.activeIconSize}px;`)}
    }
  }

  .ant-btn-link {
    color: ${(p) => p.color};
  }

  .ant-btn-link:active,
  .ant-btn-link:hover {
    color: ${(p) => p.hoverColor};
  }

  .ant-btn-link:active {
    .anticon svg {
      ${(p) => (p.disabled ? "" : `font-size: ${p.activeIconSize}px;`)}
    }
  }

  .ant-btn-link[disabled],
  .ant-btn-link[disabled]:hover,
  .ant-btn-link[disabled]:focus,
  .ant-btn-link[disabled]:active {
    color: ${G50};
  }

  .anticon svg {
    font-size: ${(p) => p.iconSize}px;
  }
`;
