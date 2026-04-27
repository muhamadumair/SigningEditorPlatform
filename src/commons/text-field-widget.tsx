import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AutoTextSize } from "auto-text-size";
import { Scalable } from "../models/views/generic.model";

interface TextFieldWidgetProps extends Scalable {
  textfieldValue: string;
}
interface TextFieldHolderProps {
  parentHeight: number;
  parentWidth: number;
}

export const TextFieldWidget = React.forwardRef<
  HTMLInputElement,
  TextFieldWidgetProps
>(
  (
    { scale, textfieldValue: textFieldValue }: TextFieldWidgetProps,
    parentRef: any
  ) => {
    const [parentHeight, setParentHeight] = useState<number>(0);
    const [parentWidth, setParentWidth] = useState<number>(0);

    useEffect(() => {
      setParentHeight(parentRef.current.offsetHeight);
      setParentWidth(parentRef.current.offsetWidth);
    }, [scale]);

    return (
      <Wrapper parentHeight={parentHeight} parentWidth={parentWidth}>
        <AutoTextSize mode="box" minFontSizePx={0.1} maxFontSizePx={16}>
          <div style={{fontWeight: "solid 1px"}}>{textFieldValue}</div>
        </AutoTextSize>
      </Wrapper>
    );
  }
);

const Wrapper = styled.div<TextFieldHolderProps>`
  display: flex;
  ${(p) => (p.parentHeight ? `height: ${p.parentHeight}px !important;` : "")}
  ${(p) => (p.parentWidth ? `width: ${p.parentWidth}px !important;` : "")}
`;
