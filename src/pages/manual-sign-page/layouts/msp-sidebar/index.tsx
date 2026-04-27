import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "antd";
import { FileTextFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DraggableWidgetsSidebarContent } from "../../../../components/draggable-widgets-sidebar-content";
import Sidebar from "../../../../layouts/sidebar";
import {
  signSetFieldType,
  SignSetFieldTypeIcon,
} from "../../../../models/views/signset.model";
import { isDocumentSigned } from "../../../../utils/manual-sign-doc.util";
import { ManualSignReducerRootState } from "../../reducer";
import {
  selectDocumentDetailsScale,
  selectDeviceStateIsDesktop,
} from "../../reducer/selectors/documents-details.selector";
import { selectClickedWidget } from "../../reducer/selectors/signsets-details.selector";
import { G20, GOOGLEBLUE, SPACE_MD, SPACE_XS, UNABLE_USER_SELECT, WHITE } from "../../../../styles/style.constant";
import styled from "styled-components";
import { Content } from "antd/lib/layout/layout";
import { Scalable } from "../../../../models/views/generic.model";

interface StyledFileIcon extends Scalable { isDesktop: boolean }
interface StyledPageHeader extends Scalable { isDesktop: boolean }
interface StyledContent { isDesktop: boolean }

interface Wrapper {
  collapsed: boolean;
}


export const MSPSidebar = () => {
  const { t } = useTranslation(["common"]);

  /**
   * selector
   */
  const scale = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsScale(state));
  const isDesktop = useSelector((state: ManualSignReducerRootState) => selectDeviceStateIsDesktop(state));
  const selectedClickedWidget = useSelector((state: ManualSignReducerRootState) => selectClickedWidget(state));


  /**
   * local state control:
   */
  const [collapsed, setCollapsed] = useState(false);
  const [showCollapseButton, setShowCollapseButton] = useState(true);

  //FOr User Navigation
  useEffect(() => {
    if (!isDesktop) {
      setCollapsed(true);
      return;
    }

    if (isDesktop) {
      setCollapsed(false);
      setShowCollapseButton(true);
    }

    if (isDocumentSigned()) {
      setCollapsed(true);
      setShowCollapseButton(false);
      return;
    }

    if (!isDesktop && selectedClickedWidget) {
      setCollapsed(true);
      return;
    }
  }, [isDesktop, selectedClickedWidget]);

  const widgetListData = useMemo(() => {
    const list = [];
    list.push({
      id: 1,
      type: signSetFieldType.sign,
      name: t("Signature"),
      icon: SignSetFieldTypeIcon.sign,
    },
      {
        id: 2,
        type: signSetFieldType.seal,
        name: t("Seal"),
        icon: SignSetFieldTypeIcon.seal,
      },
      {
        id: 3,
        type: signSetFieldType.signdate,
        name: t("Sign Date"),
        icon: SignSetFieldTypeIcon.signdate,
      },
      {
        id: 4,
        type: signSetFieldType.textfield,
        name: t("Text Field"),
        icon: SignSetFieldTypeIcon.textfield,
      }
    );
    return list;
  }, [localStorage.getItem("i18nextLng")]);


  return (
    <>
      <Sidebar
        scale={scale}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        showCollapseButton={showCollapseButton}
      >
        <DraggableWidgetsSidebarContent
          collapsed={collapsed}
          widgetListData={widgetListData}
        />
      </Sidebar>
    </>

  );
};

const StyledFileIcon = styled(FileTextFilled) <StyledFileIcon>`
  color: ${GOOGLEBLUE};
  font-size: ${(p) => p.isDesktop ? 22 : 17}px;
`;

const StyledPageHeader = styled(PageHeader) <StyledPageHeader>`
  padding: ${SPACE_XS} ${SPACE_MD};
  border-bottom: 1px solid ${G20};
  ${UNABLE_USER_SELECT};

  .ant-page-header-heading-title {
    font-size: ${(p) => p.isDesktop ? 20 : 15}px;
  }
`;
const StyledContent = styled(Content) <StyledContent>`
  display: flex;
  align-content: center;
`;

const Wrapper = styled.div<Wrapper>`
width: ${(p) => p.collapsed ? "none" : "230px"};
padding-left: ${(p) => p.collapsed ? "none" : "10px"};
border-top: 1px groove;
`
