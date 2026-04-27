import { Divider } from "antd";
import styled from "styled-components";
import {
  G30,
  G70,
  PENDING_PRIMARY,
  UNABLE_USER_SELECT,
} from "../styles/style.constant";

export interface ItemProps {
  title: string;
  success: boolean;
}

interface Props {
  itemList?: ItemProps[];
}

export const SidebarActionVerticleDivider = ({ itemList = [] }: Props) => {
  const height = itemList.length ? itemList.length * 40 : 40;

  return (
    <DividerWrapper style={{ height: height }}>
      <DividerDiv>
        <StyledDivider type="vertical" />
      </DividerDiv>
      <ContentDiv>
        {itemList.map((item) => {
          return (
            <ContentItem
              style={{ color: item.success ? "" : `${PENDING_PRIMARY}` }}
            >
              {item.title}
            </ContentItem>
          );
        })}
      </ContentDiv>
    </DividerWrapper>
  );
};

const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
  //   height: 200px;
  margin: 8px 0px;
  ${UNABLE_USER_SELECT}
`;

const DividerDiv = styled.div`
  width: 30%;
  height: 100%;
  text-align: center;
`;

const StyledDivider = styled(Divider)`
  height: 100%;
  border-left: 3px solid ${G30};
  margin: 0px;
`;

const ContentDiv = styled.div`
  height: 100%;
  width: 70%;
  display: flex;
  flex-direction: column;
`;

const ContentItem = styled.div`
  font-size: 10px;
  color: ${G70};
  margin: 4px 0px;
  padding-right: 12px;
`;
