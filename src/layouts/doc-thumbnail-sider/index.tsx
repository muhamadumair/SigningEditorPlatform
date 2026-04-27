import { Layout } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  G20,
  SPACE_SM,
  SPACE_XS,
  WHITE,
} from "../../styles/style.constant";
import { DocThumbnailPanelList } from "../../components/doc-thumbnail-panel-list";
import { ThumbnailButton } from "../../commons/thumbnail-button";
import { ManualSignReducerRootState } from "../../pages/manual-sign-page/reducer";
import { selectDeviceStateIsDesktop } from "../../pages/manual-sign-page/reducer/selectors/documents-details.selector";

const { Sider } = Layout;

interface Props { collapsed: boolean; }

interface DocThumbnailSiderProps extends Props {
  setCollapsed: (collapsed: boolean) => void;
  showSiderFixed?: boolean;
}

export const DocThumbnailSider = ({
  collapsed,
  setCollapsed,
  showSiderFixed = true,
}: DocThumbnailSiderProps) => {

  const isDesktop = useSelector((state: ManualSignReducerRootState) =>
    selectDeviceStateIsDesktop(state)
  );


  useEffect(() => {
    if (!isDesktop) {
      setCollapsed(true);
    }
  }, [isDesktop,])

  return (
    <Wrapper>
      {showSiderFixed ? (
        <SiderFixed collapsed={collapsed}>
          <StyledThumbnailButton
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            disabled={!isDesktop ? true : false}
          />
        </SiderFixed>
      ) : (
        ""
      )}
      <StyledSider trigger={null} collapsible collapsed={collapsed}>
        <DocThumbnailPanelList />
      </StyledSider>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* as parent */
  display: flex;
`;

const SiderFixed = styled.div<Props>`
  /* these are for sider fixed {icon && sider} */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background: ${WHITE};
  border: 0px;
  border-left: 1px solid ${G20};
  border-right: ${(p) => (p.collapsed ? "0px;" : `1px solid ${G20};`)};
  padding: ${SPACE_SM} ${SPACE_XS};
`;

const StyledThumbnailButton = styled(ThumbnailButton)``;

const StyledSider = styled(Sider) <Props>`
  background: ${WHITE};

  .ant-layout-sider-trigger {
    ${(p) => (p.collapsed ? "width: 0px !important;" : "")}
  }

  ${(p) =>
    p.collapsed
      ? `
      width: 0px !important;
      min-width: 0px !important;
      max-width: 0px !important;
      flex: 0 0 0px !important;`
      : ""}
`;
