import styled from "styled-components";
import { Tooltip } from "antd";
import { ScTooltip } from "../commons/sc-tooltip";
import { InfoCircleOutlined, WarningTwoTone } from "@ant-design/icons";
import { SPACE_SM, UNABLE_USER_SELECT, BLACK, SPACE, MAINBLUE } from "../styles/style.constant";
import { Collapsable } from "../models/views/generic.model";
import { selectDocumentDetailsSignsetList } from "../pages/manual-sign-page/reducer/selectors/documents-details.selector";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import { useSelector } from "react-redux";

interface Props {
  collapsed: boolean;
  title: string;
  tooltipDescription?: string;
}

interface TitleProps extends Collapsable { }

export const SidebarListTitle = ({
  collapsed,
  title,
  tooltipDescription = "",
}: Props) => {
  const signsetList = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignsetList(state));


  return (
    <Wrapper>
      <Title collapsed={collapsed}>
        <div style={{ display: "flex" }}>
          {title}
          {signsetList.length === 0 && title === "Signers" &&
            <Tooltip title={"Please assign at least one signer before placing attributes."} placement="right" color={MAINBLUE}>
              <WarningTwoTone style={{ paddingLeft: 10, paddingTop: 4 }} twoToneColor={"#ffcc00"} />
            </Tooltip>
          }
        </div>
        {collapsed ? (
          ""
        ) : (
          <ScTooltip title={tooltipDescription}>
            <InfoCircleOutlined style={{ fontSize: "16px" }} />
          </ScTooltip>
        )}
      </Title>
    </Wrapper>
  );
};

const Title = styled.div<TitleProps>`
  font-size: ${(p) => (p.collapsed ? "10px" : "15px")};
  margin: ${SPACE_SM} 0px 0px 6px;
  ${(p) => (p.collapsed ? "text-align: center;" : "")}
  ${(p) => (p.collapsed ? "" : "justify-content: space-between;")}
  ${(p) => (p.collapsed ? "" : "display: flex;")}
  ${UNABLE_USER_SELECT}
  font-weight: 600;
  letter-spacing: 0.05em;
  color: ${BLACK};
  //padding-top: 45px;
  `;


const Wrapper = styled.div`
  margin-left: ${SPACE};
  margin-right: ${SPACE};
`;
