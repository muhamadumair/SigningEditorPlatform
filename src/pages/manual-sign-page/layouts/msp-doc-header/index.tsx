import { Button, PageHeader, Tag, Modal, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { FileTextFilled } from "@ant-design/icons";
import {
  WHITE,
  SPACE_XS,
  SPACE_MD,
  G20,
  GOOGLEBLUE,
  UNABLE_USER_SELECT,
  MAINBLUE,
} from "../../../../styles/style.constant";
import { useSelector } from "react-redux";
import { ManualSignReducerRootState } from "../../reducer";
import {
  selectDocumentDetailsFileNameByDocId,
  selectDocumentDetailsScale,
  selectDeviceStateIsDesktop,
  selectDocumentDetailsSignsetList,
} from "../../reducer/selectors/documents-details.selector";
import { useEffect, useState } from "react";
import {
  selectAllSignsetDetails,
  selectAllFieldtypeTextfieldSignsetDetails,
  selectSignsetsDetailsSelectedDocumentId,
  isOverlappedSignset,
} from "../../reducer/selectors/signsets-details.selector";
import { useTranslation } from "react-i18next";
import { MSPDocHeaderToolbar } from "../../components/msp-doc-header-toolbar";
import {
  isDocumentSigned,
  reactLibraryFormatter,
} from "../../../../utils/manual-sign-doc.util";
import { Content } from "antd/lib/layout/layout";
import { Scalable } from "../../../../models/views/generic.model";
import { ModalError } from "../../../../commons/modal-error";

interface StyledFileIconProps extends Scalable { $isDesktop: boolean }
interface StyledPageHeaderProps extends Scalable { $isDesktop: boolean }
interface StyledContentProps { $isDesktop: boolean }

export const MSPDocHeader = ({
  onClickThumbnail,
}: {
  onClickThumbnail: () => void;
}) => {
  const { t } = useTranslation(["common"]);
  const [, setAllTextfieldApplied] = useState(false);
  const [isTextfieldSignsetExist] = useState(false);
  const [openModalError] = useState<any>({ isOpen: false, modalTitle: "", modalDescription: "" });


  /**
   * selector:
   */
  const selectedDocumentId = useSelector((state: ManualSignReducerRootState) => selectSignsetsDetailsSelectedDocumentId(state));

  const signsetList = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignsetList(state));
  const fileName = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsFileNameByDocId(state, selectedDocumentId));
  const textFieldSignsets = useSelector(selectAllFieldtypeTextfieldSignsetDetails());
  const allSignsetDetails = useSelector((state: ManualSignReducerRootState) => selectAllSignsetDetails(state));
  const isOverlapped = useSelector((state: ManualSignReducerRootState) => isOverlappedSignset(state));
  const scale = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsScale(state));
  const isDesktop = useSelector((state: ManualSignReducerRootState) => selectDeviceStateIsDesktop(state));


  useEffect(() => {
    if (textFieldSignsets.length !== 0 && isTextfieldSignsetExist) {
      const isTextFromTextfieldExist = textFieldSignsets.every((signset) => { return signset?.hasOwnProperty('textField') && signset?.textField !== ""; });
      setAllTextfieldApplied(isTextFromTextfieldExist);
    }

  }, [textFieldSignsets]);

  const onClickReactLibraryApply = () => {
    if (isOverlapped) {
      Modal.error({
        content: (
          <div style={{ display: "flex" }}>
            <div style={{ textAlign: "start", color: 'red', fontSize: 24, paddingRight: 20 }}>
              <ExclamationCircleOutlined />
            </div>
            <div style={{ textAlign: "start" }}>
              {/* {t("pleaseRemoveOverlappedAttributes")} */}
              Please remove overlapped attributes
            </div>
          </div>
        ),
        icon: ""
      });
      return;
    }
    else {
      // format signset from redux store:
      const allSignset = reactLibraryFormatter({ signsets: allSignsetDetails });

      let resultArrays = signsetList.map((signer: any) => {
        const matchingSignsets = allSignset.filter((item) => item.email === signer.email);
        return {
          email: signer.email,
          signset: matchingSignsets, // Update signset with an array of matching signsets
        };
      });


      // Check if every signer in resultArray has at least one signset with fieldtype "sign"
      const allSignersHaveSignatureSignSet = resultArrays.every((item: any) =>
        item.signset.some((signsetItem: any) => signsetItem.fieldtype === "sign")
      );


      if (allSignersHaveSignatureSignSet) {
        // Remove the 'email' property from the 'signset' objects
        resultArrays.forEach((item: any) => {
          item.signset.forEach((signsetItem: any) => {
            signsetItem.top = Math.round(signsetItem.top);
            signsetItem.left = Math.round(signsetItem.left);
            signsetItem.width = Math.round(signsetItem.width);
            signsetItem.height = Math.round(signsetItem.height);
            delete signsetItem.email;
          });
        });

        //console.log("onClickReactLibraryApply - all-signsets:", resultArrays);

        // create a custom event for react-library user to listen to:
        const event = new CustomEvent("submit_sign_coordinate__event", {
          detail: {
            signset: resultArrays,
          },
        });

        //console.log("onClickReactLibraryApply - Dispatching submit_sign_coordinate__event");
        document.dispatchEvent(event);

      }
      else {
        ModalErrorValidation("Add at least one signature attribute for each signer to finish preparation");
        return;
      }
    }
  };

  const ModalErrorValidation = (contentDetails: string) => {
    return (
      Modal.error({
        content: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ textAlign: "start", color: 'red', fontSize: 24, paddingRight: 20 }}><ExclamationCircleOutlined /></div>
            <div style={{ textAlign: "start" }}>{contentDetails}</div>
          </div>
        ),
        icon: ""
      })
    )
  }


  const reactLibraryList = [
    <Space wrap key="apply-action">
      <Button key="1" type="primary"
        onClick={onClickReactLibraryApply}
        style={{ fontSize: isDesktop ? 14 : 1, backgroundColor: signsetList.length !== 0 ? MAINBLUE : "#d9dfe4", cursor: signsetList.length !== 0 ? "pointer" : "default" }}
        disabled={signsetList.length !== 0 ? false : true}
      >
        {t("Apply")}
      </Button>
    </Space>,
  ];


  const renderStatusTag = () => {
    const contractInfoState = window.__INITIAL_STATE__.contractInfoState;
    if (isDocumentSigned()) {
      return <Tag color="green" style={{ fontSize: isDesktop ? 14 : 10 }}>{t("documentSigned")}</Tag>;
    } else if (contractInfoState === "6") {
      return <Tag color="red" style={{ fontSize: isDesktop ? 14 : 10 }}>{t("rejectByOtherSigner")}</Tag>;
    }

  };

  const renderRightButtons = () => {

    if (isDocumentSigned() || window.__INITIAL_STATE__.contractInfoState === "6") {
      return [];
    }

    // REACT DOCUMENT CREATOR D&D LIBRARY:
    return reactLibraryList;
  };

  return (
    <>
      <Wrapper>
        <StyledPageHeader
          tags={!isDesktop ? undefined : renderStatusTag()}
          ghost={false}
          avatar={{
            icon: <StyledFileIcon scale={scale} $isDesktop={isDesktop} />,
            style: { backgroundColor: WHITE },
          }}
          title={fileName}
          extra={renderRightButtons()}
          scale={scale}
          $isDesktop={isDesktop}

        >
          {!isDesktop ? (
            <StyledContent $isDesktop={isDesktop}>{renderStatusTag()}</StyledContent>
          ) : (
            ""
          )}
        </StyledPageHeader>
        <MSPDocHeaderToolbar onClickThumbnail={onClickThumbnail} />
      </Wrapper>
      <ModalError modalDescription={openModalError.modalDescription} openModal={openModalError.isOpen} />
    </>
  );
};

const Wrapper = styled.div``;

const StyledContent = styled(Content) <StyledContentProps>`
  display: flex;
  align-content: center;
`;

const StyledPageHeader = styled(PageHeader) <StyledPageHeaderProps>`
  padding: ${SPACE_XS} ${SPACE_MD};
  border-bottom: 1px solid ${G20};
  ${UNABLE_USER_SELECT};

  .ant-page-header-heading-title {
    font-size: ${(p) => p.$isDesktop ? 20 : 15}px;
  }
`;

const StyledFileIcon = styled(FileTextFilled) <StyledFileIconProps>`
  color: ${GOOGLEBLUE};
  font-size: ${(p) => p.$isDesktop ? 22 : 17}px;
`;
