import { useSelector } from "react-redux";
import styled from "styled-components";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import { selectSignsetsDetailsSelectedDocumentId } from "../pages/manual-sign-page/reducer/selectors/signsets-details.selector";
import { DocThumbnailPanel } from "./doc-thumbnail-panel";
import { useRef } from "react";

export const DocThumbnailPanelList = () => {
  const thumbnailWrapperRef = useRef<any>(null);

  // Used as both the panel's `documentId` and as a remount key when the
  // selected document changes.
  const selectedDocumentId = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedDocumentId(state)
  );

  return (
    <Wrapper ref={thumbnailWrapperRef}>
      <DocThumbnailPanel
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
