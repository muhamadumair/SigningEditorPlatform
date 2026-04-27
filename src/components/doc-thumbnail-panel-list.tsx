import { useSelector } from "react-redux";
import styled from "styled-components";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import {
  selectSignsetsDetailsSelectedDocumentId,
  selectSignsetsDetailsSelectedPageNumber,
} from "../pages/manual-sign-page/reducer/selectors/signsets-details.selector";
import { DocThumbnailPanel } from "./doc-thumbnail-panel";
import { useRef } from "react";

export const DocThumbnailPanelList = () => {
  const thumbnailWrapperRef = useRef<any>(null);

  /**
   * selectors:
   */

  const selectedDocumentId = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedDocumentId(state)
  );

  const selectedPageNumber = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedPageNumber(state)
  );


  return (
    <Wrapper ref={thumbnailWrapperRef}>
      <DocThumbnailPanel
        selectedPageNumber={selectedPageNumber}
        selectedDocumentId={selectedDocumentId}
        documentId={selectedDocumentId as string}
        key={selectedDocumentId as string}
        thumbnailWrapperRef={thumbnailWrapperRef}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* height from parent */
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;
`;
