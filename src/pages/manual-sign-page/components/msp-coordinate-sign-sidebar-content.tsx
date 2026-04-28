import { SidebarActionProgress } from "../../../components/sidebar-action-progress";
import { SidebarListTitle } from "../../../components/sidebar-list-title";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ManualSignReducerRootState } from "../reducer";
import {
  selectDocumentDetailsAllSealApplied,
  selectDocumentDetailsAllSignatureApplied,
} from "../reducer/selectors/documents-details.selector";
import { Collapsable } from "../../../models/views/generic.model";
import { selectAllFieldtypeTextfieldSignsetDetails, selectAllSignsetDetails } from "../reducer/selectors/signsets-details.selector";
import { useEffect, useState } from "react";

export const MSPCoordinateSignSidebarContent = ({ collapsed }: Collapsable) => {
  const { t } = useTranslation(["common"]);
  const [allTextfieldApplied, setAllTextfieldApplied] = useState(false);
  const [isSealSignsetExist, setIsSealSignsetExist] = useState(false);
  const [isSignatureSignsetExist, setIsSignatureSignsetExist] = useState(false);
  const [isTextfieldSignsetExist, setIsTextFieldSignsetExist] = useState(false);



  const allSignatureApplied = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsAllSignatureApplied(state)
  );

  const allSealApplied = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsAllSealApplied(state)
  );

  const textFieldSignsets = useSelector(
    selectAllFieldtypeTextfieldSignsetDetails()
  );

  const allSignsetDetails = useSelector((state: ManualSignReducerRootState) =>
    selectAllSignsetDetails(state)
  );


  useEffect(() => {
    if (textFieldSignsets.length !== 0) {
      const isTextFromTextfieldExist = textFieldSignsets.every((signset) => { return signset?.hasOwnProperty('textField') && signset?.textField !== ""; });
      setAllTextfieldApplied(isTextFromTextfieldExist);
    }
  }, [textFieldSignsets]);

  useEffect(() => {
    if (allSignsetDetails.length !== 0) {
      const isSealExist = allSignsetDetails.some((signset) => { return signset?.fieldType === "seal" });
      const isSignatureExist = allSignsetDetails.some((signset) => { return signset?.fieldType === "sign" });
      const isTextFieldExist = allSignsetDetails.some((signset) => { return signset?.fieldType === "textfield" });

      setIsSealSignsetExist(isSealExist);
      setIsSignatureSignsetExist(isSignatureExist)
      setIsTextFieldSignsetExist(isTextFieldExist);

    }
  }, [allSignsetDetails])


  return (
    <div style={{ borderTop: "1px groove" }}>
      <SidebarListTitle
        collapsed={collapsed}
        title={t("requiredFieldActions")}
        tooltipDescription={t("requiredFieldTooltipDescription")!}
      />
      <>
        {window.__INITIAL_STATE__.addresseeHasSignImage === "0" && isSignatureSignsetExist &&
          <>
            <div style={{ paddingBottom: 10 }} />
            <SidebarActionProgress
              collapsed={collapsed}
              title={t("applyAllSignatures")!}
              isSuccess={allSignatureApplied}
            />
          </>
        }
        {window.__INITIAL_STATE__.addresseeHasTextfield === "0" && isTextfieldSignsetExist &&
          <>
            <div style={{ paddingBottom: 10 }} />
            <SidebarActionProgress
              collapsed={collapsed}
              title={t("applyAllTextfields")}
              isSuccess={allTextfieldApplied}
            />
          </>
        }
        {window.__INITIAL_STATE__.addresseeHasSealImage === "0" && isSealSignsetExist &&
          <>
            <div style={{ paddingBottom: 10 }} />
            <SidebarActionProgress
              collapsed={collapsed}
              title={t("applyAllSeals")!}
              isSuccess={allSealApplied}
            />
          </>
        }
      </>
    </div>
  );
};
