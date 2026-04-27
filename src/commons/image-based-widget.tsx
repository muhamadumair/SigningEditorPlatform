import styled from "styled-components";
import { Scalable } from "../models/views/generic.model";
import { SignSetDimension } from "../models/views/signset.model";
import { useState } from "react";

export interface ImageBasedWidgetProps extends SignSetDimension, Scalable {
  src?: string;
  extraStyle?: string;
}

export const ImageBasedWidget = ({
  width,
  height,
  scale,
  src,
  extraStyle,
}: ImageBasedWidgetProps) => {

  return (
    <ImageHolder
      src={src}
      width={width}
      height={height}
      scale={scale}
      extraStyle={extraStyle}
    />
  );
};

const ImageHolder = styled.img<ImageBasedWidgetProps>`
  /* dimension settings which are effected by scale */
  ${(p) => (p.width ? `width: ${p.width * p.scale}px;` : "")}
  ${(p) =>
    p.height ? `height: ${p.height * p.scale}px;` : ""}
  pointer-events: none;
  z-index: 1;
  ${(p) => p.extraStyle}
`;
