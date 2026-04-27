import styled from "styled-components";
import { SMALL_ICON_SIZE, MAINBLUE, BLACK } from "../styles/style.constant";
import {
  SignSetFieldTypeIcon,
  SignSetFieldTypeIconKeys,
  SignSetFieldTypeView,
} from "../models/views/signset.model";
import { Scalable } from "../models/views/generic.model";
import { useTranslation } from "react-i18next";


interface WidgetIconBoxProps extends Scalable {
  fieldType: SignSetFieldTypeIconKeys;
  showBorder?: boolean;
  width?: any;
  height?: number;
  scale: number;
}

export const WidgetIconBox = ({
  scale,
  fieldType,
  showBorder = true,
  width,
  height,
}: WidgetIconBoxProps) => {
  const { t } = useTranslation(["common"]);

  return (
    <StyledBox
      scale={scale}
      fieldType={fieldType}
      showBorder={showBorder}
      width={width}
      height={height}
    >
      <ContentWrapper scale={scale}>
        {t(SignSetFieldTypeView[fieldType])}
      </ContentWrapper>
      {fieldType !== "signdate" &&
        <IconWrapper scale={scale}>
          {SignSetFieldTypeIcon[fieldType]}
        </IconWrapper>
      }
    </StyledBox>
  );
};

const StyledBox = styled.div<WidgetIconBoxProps>`
  ${(p) => (p.showBorder ? `border: 1px solid ${MAINBLUE};` : "")}

  color: ${BLACK};
  display: flex;
  flex-direction: column;
  order: 1;
  ${(p) => `width: ${p.width! * p.scale}px;`}
  ${(p) => `height: ${p.height! * p.scale}px;`}
  justify-content: center;
`;

const IconWrapper = styled.div<Scalable>`
  text-align: center;
  flex-grow: -1;
  ${(p) => `font-size: ${SMALL_ICON_SIZE * p.scale}px;`}

  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const ContentWrapper = styled.div<Scalable>`
  text-align: center;
  flex-grow: -1;
  ${(p) => `font-size: ${14 * p.scale}px;`}

  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
`;
