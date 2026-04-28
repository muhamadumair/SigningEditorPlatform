import { useEffect, useMemo, useState } from "react";
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
  }, [t]);


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

