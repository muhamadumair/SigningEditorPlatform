import styled from "styled-components";
import { RightOutlined } from "@ant-design/icons";
import {
  DEFAULT_BORDER_STYLE,
  G60,
  LIGHTBLUE,
  SCBLUE,
  SPACE,
  SPACE_SM,
  UNABLE_USER_SELECT,
} from "../styles/style.constant";
import { useTranslation } from "react-i18next";

interface DocThumbnailHeaderProps {
  openHeader?: boolean;
  onClick?: () => void;
  totalPageNumber: number;
  fileName: string;
}

export const DocThumbnailHeader = ({
  openHeader = true,
  onClick,
  totalPageNumber,
}: DocThumbnailHeaderProps) => {
  const { t } = useTranslation(["common"]);

  const rotate = openHeader ? "rotate(90deg)" : "rotate(0)";
  return (
    <Header onClick={onClick}>
      <Content>
        <Descriptions>
          {t("Pages")}: {totalPageNumber}
        </Descriptions>
      </Content>
      <Icon style={{ transform: rotate }}>{<RightOutlined />}</Icon>
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  border-bottom: ${DEFAULT_BORDER_STYLE};
  padding: ${SPACE} ${SPACE_SM} ${SPACE} ${SPACE_SM};
  cursor: pointer;
  :hover {
    background: ${LIGHTBLUE};
    color: ${SCBLUE};
  }
  ${UNABLE_USER_SELECT}
`;

const Content = styled.div`
  width: 100%;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  transition: all 0.2s;
`;

const Descriptions = styled.div`
  color: ${G60};
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;
