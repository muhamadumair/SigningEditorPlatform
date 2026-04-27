import styled from "styled-components";
import { CheckOutlined } from "@ant-design/icons";
import {
  G10,
  G50,
  SUCCESS_BACKGROUND,
  SUCCESS_PRIMARY,
  UNABLE_USER_SELECT,
} from "../styles/style.constant";
import { useTranslation } from "react-i18next";
import { Collapsable } from "../models/views/generic.model";
import { selectAllSignsetDetails } from "../pages/manual-sign-page/reducer/selectors/signsets-details.selector";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectDocumentDetailsSignsetList } from "../pages/manual-sign-page/reducer/selectors/documents-details.selector";

interface SidebarActionProgressProps extends Collapsable {
  title?: string;
  isSuccess?: boolean;
  successText?: string;
  unsuccessText?: string;
}

export const SidebarActionProgress = ({
  title = "",
  isSuccess = true,
  successText,
  unsuccessText,
  collapsed,
}: SidebarActionProgressProps) => {
  const { t } = useTranslation(["common"]);

  const [textFieldCount, setTextFieldCount] = useState(0);

  const allSignsetDetails = useSelector((state: ManualSignReducerRootState) => selectAllSignsetDetails(state));
  const signsetList = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignsetList(state));



  useEffect(() => {
    const textFieldSignsets = allSignsetDetails.filter((signset) => { return signset?.fieldType === "textfield" });
    const isTextFromTextfieldExist = textFieldSignsets.filter((signset) => { return signset?.hasOwnProperty('textField') && signset?.textField !== ""; });
    setTextFieldCount(textFieldSignsets.length - isTextFromTextfieldExist.length);
  }, [allSignsetDetails]);


  return (
    <>
      <Wrapper collapsed={collapsed}>
        <IconDiv collapsed={collapsed}>
          {isSuccess ? <SuccessIcon /> : <PendingIcon />}
        </IconDiv>
        <ContentDiv collapsed={collapsed}>
          <ContentTitle collapsed={collapsed}>{title}</ContentTitle>
          <ContentSubtitle collapsed={collapsed}>
            {isSuccess
              ? successText
                ? successText
                : t("success")
              : unsuccessText
                ? unsuccessText
                : t("pending")}
          </ContentSubtitle>
          <div style={{ fontSize: collapsed ? "12px" : "" }}>
            {title === t("applyAllTextfields") && t("remainingToFill") + ": " + textFieldCount}
          </div>

        </ContentDiv>
      </Wrapper>

    </>
  );
};

const Wrapper = styled.div<Collapsable>`
  display: flex;
  align-items: center;
  ${UNABLE_USER_SELECT}
  ${(p) => (p.collapsed ? "flex-direction: column;" : "")}
`;

const IconDiv = styled.div<Collapsable>`
  ${(p) => (p.collapsed ? "" : "width: 20%;")}
  text-align: center;
`;

const SuccessIcon = styled(CheckOutlined)`
  font-size: 10px;
  padding: 8px;
  border-radius: 16px;

  background: ${SUCCESS_BACKGROUND};
  color: ${SUCCESS_PRIMARY};
  border: 1px solid ${SUCCESS_PRIMARY};
`;

const PendingIcon = styled(CheckOutlined)`
  font-size: 10px;
  padding: 8px;
  border-radius: 16px;

  background: ${G10};
  color: ${G50};
  border: 1px solid ${G50};
`;

// const PendingXIcon = styled(CloseOutlined)`
//   font-size: 14px;
//   padding: 8px;
//   border-radius: 20px;

//   background: ${PENDING_BACKGROUND};
//   color: ${PENDING_PRIMARY};
//   border: 1px solid ${PENDING_PRIMARY};
// `;

const ContentDiv = styled.div<Collapsable>`
  ${(p) => (p.collapsed ? "width: 90%" : "width: 70%;")}
`;

const ContentTitle = styled.div<Collapsable>`
  font-size: ${(p) => (p.collapsed ? "10px" : "11px")};
  font-weight: 700;
  letter-spacing: 0.05em;
  ${(p) => (p.collapsed ? "text-align: center;" : "")}
`;

const ContentSubtitle = styled.div<Collapsable>`
  ${(p) => (p.collapsed ? "font-size: 12px;" : "")}
  ${(p) => (p.collapsed ? "text-align: center;" : "")}
`;
