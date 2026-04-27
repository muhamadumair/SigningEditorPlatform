import { Layout } from "antd";
import { ReactNode } from "react";
import styled from "styled-components";
import {
  WHITE,
  MAINBLUE,
  SPACE_MD,
  SPACE_SM,
  LIGHTBLUE,
  ACTIVE_BORDER,
  PRIMARY_BACKGROUND_BLUE,
} from "../../styles/style.constant";
import { Collapsable, Scalable } from "../../models/views/generic.model";
import { WidgetDragLayer } from "../../commons/widget-drag-layer";
const { Sider } = Layout;

interface WrapperProps extends Collapsable {
  showCollapseButton: boolean;
}

interface SidebarProps extends Collapsable, Scalable {
  setCollapsed: (value: any) => void;
  children: ReactNode;
  showCollapseButton?: boolean;
}

const Sidebar = ({
  collapsed,
  scale,
  setCollapsed,
  children,
  showCollapseButton = true,
}: SidebarProps) => {

  return (
    <>
      <WidgetDragLayer scale={scale} />
      <Wrapper collapsed={collapsed} showCollapseButton={showCollapseButton}>
        <StyledSider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          {children}
          <VersionNumber data-version="v1.1.5" />
        </StyledSider>
      </Wrapper>
    </>
  );
};

export default Sidebar;

const StyledSider = styled(Sider)`
min-width: ${(p) => (p.collapsed ? 80 : 230)}px !important;
`;

const ICON_DIMENSION = 32;

const VersionNumber = styled.div`
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 100%;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  font-size: 0;
  
  &::before {
    content: attr(data-version);
  }
`;

const Wrapper = styled.div<WrapperProps>`
  min-width: ${(p) => (p.collapsed ? 80 : 230)}px;
  .ant-layout-sider {
    background: ${WHITE};
    height: 100%;
  }

  .anticon {
    vertical-align: 0px !important;
  }

  .ant-layout-sider-trigger {
    ${(p) => (p.showCollapseButton ? "" : "display: none;")}

    position: absolute !important;
    // top: 50%;
    bottom: 2%;

    background: ${MAINBLUE};
    color: ${WHITE};
    border: 2px solid transparent;

    &:hover {
      color: ${MAINBLUE};
      // background: ${PRIMARY_BACKGROUND_BLUE};
      background: ${LIGHTBLUE};
      // border: 2px solid #91d5ff;
      ${ACTIVE_BORDER({ scale: 2 })}
    }

    width: ${ICON_DIMENSION}px !important;
    height: ${ICON_DIMENSION}px !important;
    line-height: ${ICON_DIMENSION}px;
    margin-bottom: ${SPACE_MD};
    /* width:- collapse = 80px, non-collapse = 200px*/
    margin-left: ${(p) =>
    p.collapsed
      ? `${80 - ICON_DIMENSION + (ICON_DIMENSION / 2 - 2)}px !important`
      : `${230 - ICON_DIMENSION + (ICON_DIMENSION / 2 - 2)}px !important`};

    border-radius: 40px;

    font-size: ${SPACE_MD};
    // margin: ${SPACE_MD} ${SPACE_SM};
    // width: ${(p) => (p.collapsed ? "56px !important" : "176px !important")};
    // border-radius: ${SPACE_SM};
  }
`;
