import { DndProviderWrapper } from "../../commons/dnd-provider-wrapper";
import { Layout, Affix } from "antd";
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
  selectDeviceStateIsDesktop,
  selectDocumentDetailsScale,
} from "./reducer/selectors/documents-details.selector";
import { MSPSidebar } from "./layouts/msp-sidebar";
import { Scalable } from "../../models/views/generic.model";
import { PageRefsProvider } from "../../layouts/doc-workboard/page-refs-context";

interface DocSiteLayoutProps extends Scalable { }

export const ManualSignPage = () => {
  const dispatch = useDispatch<StoreDispatch>();
  const pageLayoutRef = useRef<any>(null);

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
      signsetList: window.__INITIAL_STATE__.signsetList,
      contractInfoState: "1", // 1 for pending sign (fixed value)
      addresseeSignState: "9", // (fixed value)
      addresseeHasTextfield: "0", // 0, show textfield (fixed value)
      addresseeHasSealImage: "0", // 0, show seal (fixed value)
      addresseeHasSignImage: "0", // 0, show sign (fixed value)
    };


    console.log("window.__INITIAL_STATE__ :", window.__INITIAL_STATE__);
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
              <DocWorkboardPanel pageLayoutRef={pageLayoutRef} />
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

const DocSiteLayout = styled(Layout) <DocSiteLayoutProps>`
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
