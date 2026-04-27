import { Button, ButtonProps } from "antd";
import styled from "styled-components";
import { Scalable } from "../models/views/generic.model";
import { DISABLE_TRANSITION, RED, WHITE } from "../styles/style.constant";

interface ShowProps {
  show: boolean;
}

interface GenericDeleteButtonProps {
  right?: number;
  top?: number;
  left?: number;
  bottom?: number;
  color?: string;
  backgroundcolor?: string;
  borderradius?: number;
  dimension?: number;
  iconSize?: number;
  position?: string;
}

export interface CircleDeleteButtonProps
  extends GenericDeleteButtonProps,
  Scalable,
  ShowProps,
  ButtonProps { }

/**
 * work around to pass a boolean for a custom boolean attribute:
 * https://stackoverflow.com/questions/49784294/warning-received-false-for-a-non-boolean-attribute-how-do-i-pass-a-boolean-f
 */
interface DeleteButtonProps
  extends GenericDeleteButtonProps,
  Scalable,
  ButtonProps {
  isselectedwidget: 1 | 0;
}

export const CircleDeleteButton = ({
  onClick,
  scale,
  show: isselectedwidget,
  iconSize = 20,
  right = -12,
  top = scale < 1.25 ? -15 : -12,
  dimension = 25,
  borderradius = 50,
  position = "absolute",
  backgroundcolor = `${RED}`,
  color = `${WHITE}`,
  type = "link",
}: CircleDeleteButtonProps) => {


  return (
    <DeleteButton
      scale={scale}
      isselectedwidget={isselectedwidget ? 1 : 0}
      icon={<img src="./signingcloud-editor/media/deleteCloseIcon.png" style={{ width: iconSize * scale }}/>}
      type={type}
      onClick={onClick}
      right={right}
      top={top}
      position={position}
      backgroundcolor={backgroundcolor}
      color={color}
      dimension={dimension}
      borderradius={borderradius}
    />
  );
};

const DeleteButton = styled(Button) <DeleteButtonProps>`
  /* position */
  ${(p) => `position: ${p.position}`};
  ${(p) => (p.right ? `right: ${p.right! * p.scale}px;` : "")}
  ${(p) => (p.top ? `top: ${p.scale >= 1 ? p.top! * p.scale : -16}px;` : "")}
  ${(p) => (p.bottom ? `bottom: ${p.bottom! * p.scale}px;` : "")}
  ${(p) => (p.left ? `left: ${p.left! * p.scale}px;` : "")}

  /* dimension */
  ${(p) => `width: ${p.dimension! * p.scale}px;`}
  ${(p) => `height: ${p.dimension! * p.scale}px;`}
  ${(p) => `border-radius: ${p.borderradius! * p.scale}px;`}

  /* element-style */
  display: ${(p) => (p.isselectedwidget ? " inline-block" : "none")};
  ${(p) => `color: ${p.color}`};
  //${(p) => `background-color: ${p.backgroundcolor} !important`};
  padding: 0px;
  &:hover {
    ${(p) => `color: ${p.color}`};
  }
  z-index: 9999999;
  ${DISABLE_TRANSITION}
`;
