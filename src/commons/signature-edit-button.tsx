import { Button, ButtonProps } from "antd";
import styled from "styled-components";
import { CssValueType, Scalable } from "../models/views/generic.model";
import {
  DISABLE_TRANSITION,
  WHITE,
  FONT_BODY,
  MAINBLUE,
} from "../styles/style.constant";

interface IsSelectedWidgetProps {
  isselectedwidget: boolean;
}

interface GenericTextEditButtonProps {
  right?: CssValueType;
  top?: CssValueType;
  left?: CssValueType;
  bottom?: CssValueType;
  color?: string;
  backgroundcolor?: string;
  borderradius?: number;
  width?: CssValueType;
  height?: CssValueType;
  iconSize?: number;
  position?: string;
}

interface SignatureEditButtonProps
  extends GenericTextEditButtonProps,
  Scalable,
  IsSelectedWidgetProps,
  ButtonProps { }

/**
 * work around to pass a boolean for a custom boolean attribute:
 * https://stackoverflow.com/questions/49784294/warning-received-false-for-a-non-boolean-attribute-how-do-i-pass-a-boolean-f
 */
interface EditButtonProps
  extends GenericTextEditButtonProps,
  Scalable,
  ButtonProps {
  isselectedwidget: 1 | 0;
}

export const SignatureEditButton = ({
  onClick,
  scale,
  isselectedwidget,
  right = 0,
  left = 0,
  borderradius = 2,
  position = "absolute",
  backgroundcolor = `${MAINBLUE}`,
  color = `${WHITE}`,
  type = "link",
  bottom,
  width,
  height,
  children,
}: SignatureEditButtonProps) => {
  return (
    <>
      <EditButton
        scale={scale}
        isselectedwidget={isselectedwidget ? 1 : 0}
        type={type}
        onClick={onClick}
        right={right}
        left={left}
        bottom={bottom}
        height={height}
        width={width}
        position={position}
        backgroundcolor={backgroundcolor}
        color={color}
        borderradius={borderradius}
      >
        {children ? children : <>Edit Signature</>}
      </EditButton>
    </>

  );
};

const EditButton = styled(Button) <EditButtonProps>`
  /* position */
  ${(p) => `position: ${p.position};`}
  left: ${(p) => (typeof p.left === "string" ? `${p.left}` : `${p.left}px`)};
  right: ${(p) =>
    typeof p.right === "string" ? `${p.right}` : `${p.right}px`};
  bottom: ${(p) =>
    typeof p.bottom === "string" ? `${p.bottom}` : `${p.bottom}px`};
  top: ${(p) => (typeof p.top === "string" ? `${p.top}` : `${p.top}px`)};

  ${DISABLE_TRANSITION}

  /* dimension */
  width: ${(p) => (typeof p.width === "string" ? `100%` : `${p.width}px`)};
  height: ${(p) =>
    typeof p.height === "string" ? `${p.height}` : `${p.height}px`};

  ${(p) => `font-size: ${FONT_BODY * p.scale}px;`}
  ${(p) => `border-radius: ${p.borderradius! * p.scale}px;`}

  /* element-style */
  display: ${(p) => (p.isselectedwidget ? "inline-block" : "none")};

  /* color */
  ${(p) => `color: ${p.color}`};
  ${(p) => `background-color: ${p.backgroundcolor} !important`};

  &:hover {
    ${(p) => `color: ${p.color} !important`};
  }

  &:active {
    ${(p) => `color: ${p.color} !important`};
  }

  &:focus {
    ${(p) => `color: ${p.color} !important`};
  }

  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding: 0px;
  //transform: rotate(90deg);
`;
