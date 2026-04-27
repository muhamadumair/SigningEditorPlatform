import { DndProviderWrapper } from "../../commons/dnd-provider-wrapper";
import { Layout, Affix, Tabs } from "antd";
import { MSPDocHeader } from "./layouts/msp-doc-header";
import styled from "styled-components";
import { G20, WHITE } from "../../styles/style.constant";
import { DocThumbnailSider } from "../../layouts/doc-thumbnail-sider";
import { DocWorkboardPanel } from "../../layouts/doc-workboard/doc-workboard-panel";
import { useEffect, useRef, useState } from "react";
import { fetchManualSignDocument } from "./reducer/thunks/manual-sign-doc.thunk";
import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch } from "../../store";
import { ManualSignReducerRootState } from "./reducer";
import {
  selectDocumentDetailsTotalPageNumberByDocId,
  selectDeviceStateIsDesktop,
  selectDocumentDetailsScale
} from "./reducer/selectors/documents-details.selector";
import { signsetsDetailsActions } from "./reducer/slices/signsets-details.slice";
import {
  selectSignsetsDetailsSelectedDocumentId,
  selectSignsetsDetailsSelectedPageNumber,
} from "./reducer/selectors/signsets-details.selector";
import { MSPSidebar } from "./layouts/msp-sidebar";
import { useTranslation } from "react-i18next";
import { Scalable } from "../../models/views/generic.model";
import { PageRefsProvider } from "../../layouts/doc-workboard/page-refs-context";

interface DocSiteLayout extends Scalable { }

export const ManualSignPage = () => {
  const dispatch = useDispatch<StoreDispatch>();
  const pageLayoutRef = useRef<any>(null);

  const { t } = useTranslation(["common"]);

  /**
   * initialisation:
   */
  useEffect(() => {
    /**
     * REACT DOCUMENT CREATOR D&D LIBRARY:
     * - scope: initialize the encapsulated remaining window's intial state:
     */
    window.__INITIAL_STATE__ = {
      contractname: window.__INITIAL_STATE__.contractName, // (param)
      base64Pdf: window.__INITIAL_STATE__.base64Pdf, // (param)
      //signers: window.__INITIAL_STATE__.signers,
      signsetList: window.__INITIAL_STATE__.signsetList,
      accesscode: "F9B40675C931220E851638325ED60881AF798AA53CF83B0ABF3825E73940FA72", //contractNumber
      contractid: "10921", // not required (fixed value)
      addresseeid: "21720", // not required (fixed value)
      email: "-funny@yopmail.com", // not required (fixed value)
      fromPage: "integratorsign", // follow integratorsign interface (fixed value)
      contractInfoState: "1", // 1 for pending sign (fixed value)
      addresseeHasLogo: "0", // 1, no logo (fixed value)
      addresseeAuthType: "0", // 0, no otp (fixed value)
      addresseeSignState: "9", // (fixed value)
      addresseeHasTextfield: "0", // 0, show textfield (fixed value)
      addresseeHasSigndate: "0", // 0, show signdate (fixed value)
      addresseeHasSealImage: "0", // 0, show seal (fixed value)
      addresseeHasSignImage: "0", // 0, show sign (fixed value)
      //totalPages: 0,
      basePath: "./"
    };


    console.log("window.__INITIAL_STATE__ 1 :", window.__INITIAL_STATE__);
    dispatch(fetchManualSignDocument());
  }, []);



  /**
   * local state control:
   */
  const [thumbnailCollapse, setThumbnailCollapse] = useState<boolean>(false);

  /**
   * selectors:
   */
  const scale = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsScale(state)
  );

  const selectedPageNumber = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedPageNumber(state)
  );

  const selectedDocumentId = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedDocumentId(state)
  );

  const totalPageNumber = useSelector(
    (state: ManualSignReducerRootState) =>
      selectDocumentDetailsTotalPageNumberByDocId(state, selectedDocumentId)!
  );

  const isDesktop = useSelector((state: ManualSignReducerRootState) =>
    selectDeviceStateIsDesktop(state)
  );



  //For UserAgent
  useEffect(() => {
    if (!isDesktop) {
      setThumbnailCollapse(true);
    }

    if (isDesktop) {
      setThumbnailCollapse(false);
    }
  }, [isDesktop]);

  /**
   * functions:
   */
  const setPaginationSelectedPageNumber = (pageNumber: number) => {
    dispatch(signsetsDetailsActions.setSelectedPageNumber(pageNumber));
  };

  return (
    <DndProviderWrapper>
     <PageRefsProvider>
      <MainLayout>
        <MSPSidebar />
        <DocSiteLayout scale={scale}>
          <Affix offsetTop={0}>
            <DocHeaderWrapper>
              <MSPDocHeader
                onClickThumbnail={() => {
                  setThumbnailCollapse(!thumbnailCollapse);
                }}
              />
            </DocHeaderWrapper>
          </Affix>
          <DocBodyLayout>
            <PageLayout ref={pageLayoutRef}>
              <DocWorkboardPanel
                totalPageNumber={totalPageNumber}
                selectedPageNumber={selectedPageNumber}
                setSelectedPageNumber={setPaginationSelectedPageNumber}
                pageLayoutRef={pageLayoutRef}
                selectedDocumentId={selectedDocumentId}
              />
            </PageLayout>
            <DocThumbnailSider
              showSiderFixed={!isDesktop ? false : true}
              collapsed={thumbnailCollapse}
              setCollapsed={setThumbnailCollapse}
            />
          </DocBodyLayout>
        </DocSiteLayout>
      </MainLayout>
     </PageRefsProvider>
    </DndProviderWrapper>

  )
};

const MainLayout = styled(Layout)`
  background: ${WHITE};
`;

const DocSiteLayout = styled(Layout) <DocSiteLayout>`
  border-left: 1px solid ${G20};

  /* Fixed the height of site-layout */
  height: 100vh;

  /* Hide the main scroll */
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  `;

const DocBodyLayout = styled(Layout)`
  /* as child of site layout */
  flex-grow: 1;

  /* fill entirely */
  height: 100%;

  /* as parent */
  display: flex;
`;

const DocHeaderWrapper = styled.div`
  /* as child of site-layout */
  flex-grow: 1;
`;

const PageLayout = styled(Layout)`
  /* for the bottom page navigation toolbar to be absolute to parent: */
  position: relative;
  overflow: auto;
`;
