// import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { Document, Page } from "react-pdf";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  LIGHTBLUE,
  MAINBLUE,
  SPACE_MD,
  UNABLE_USER_SELECT,
} from "../styles/style.constant";
import { Card } from "antd";
import { PDFPageProxy } from "react-pdf";
import { useDispatch, useSelector } from "react-redux";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import {
  selectSignsetsDetailsSelectedDocumentId,
  selectSignsetsDetailsSelectedPageNumber,
} from "../pages/manual-sign-page/reducer/selectors/signsets-details.selector";
import { StoreDispatch } from "../store";
import {
  selectDocumentDetailsFileBlobByDocId,
  selectDocumentDetailsFileNameByDocId,
  selectDocumentDetailsTotalPageNumberByDocId,
} from "../pages/manual-sign-page/reducer/selectors/documents-details.selector";
import { signsetsDetailsActions } from "../pages/manual-sign-page/reducer/slices/signsets-details.slice";
import { pageDetailsActions } from "../pages/manual-sign-page/reducer/slices/pages-details.slice";
import { DocThumbnailHeader } from "../commons/doc-thumbnail-header";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { documentsDetailsActions } from "../pages/manual-sign-page/reducer/slices/documents-details.slice";

interface ItemProps {
  isSelectedPage: boolean;
}

interface DocumentWrapperProps {
  openHeader: boolean;
}

interface DocThumbnailPanelProps {
  documentId: string;
  thumbnailWrapperRef: any;
}

export const DocThumbnailPanel = ({
  documentId,
  thumbnailWrapperRef,
}: DocThumbnailPanelProps) => {
  const selectedDocumentId = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedDocumentId(state)
  );
  const selectedPageNumber = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedPageNumber(state)
  );
  const options = {
    cMapUrl: "cmaps/",
    cMapPacked: true,
  };

  const dispatch = useDispatch<StoreDispatch>();

  /**
   * react hooks:
   */
  const [openHeader, setOpenHeader] = useState(true);
  const docWrapperRef = useRef<any>(null);
  const itemWrapperRef = useRef<any[]>([]) // Create a ref for the ItemWrapper


  /**
   * selectors:
   */
  const fileBlob = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsFileBlobByDocId(state, documentId));

  const totalPageNumber = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsTotalPageNumberByDocId(state, documentId)!);

  const fileName = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsFileNameByDocId(state, documentId));

  /**
   * functions:
   */
  const isSelectedPage = (pageNum: number) => {
    return pageNum === selectedPageNumber && documentId === selectedDocumentId;
  };

  const onDocLoadSuccess = (pdf: PDFDocumentProxy) => {
    dispatch(
      documentsDetailsActions.setTotalPageByDocId({
        documentId: documentId,
        totalPage: pdf._pdfInfo.numPages,
      })
    );
  };

  useEffect(() => {
    const container = thumbnailWrapperRef.current;
    const itemToScroll = itemWrapperRef.current[selectedPageNumber];

    if (container && itemToScroll) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = itemToScroll.getBoundingClientRect();
      dispatch(signsetsDetailsActions.setSelectedPageNumber(selectedPageNumber));
      if (selectedPageNumber === 1) {
        // If the container is already scrolled to the top or selectedPageNumber is 1, scroll to the top
        container.scrollTop = 0;
      } else if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
        // Scroll only if the item is not already within the visible area of the container
        if (itemRect.top < containerRect.top) {
          // Scroll up to make the item visible at the top of the container
          container.scrollTop = container.scrollTop - (containerRect.top - itemRect.top);
        } else if (itemRect.bottom > containerRect.bottom) {
          // Scroll down to make the item visible at the bottom of the container
          container.scrollTop = container.scrollTop + (itemRect.bottom - containerRect.bottom);
        }
      }
    }
  }, [selectedPageNumber]);

  return (
    <Wrapper>
      <DocThumbnailHeader
        fileName={fileName!}
        totalPageNumber={totalPageNumber}
        openHeader={openHeader}
        onClick={() => {
          setOpenHeader(!openHeader);
        }}
      />
      <DocumentWrapper openHeader={openHeader} ref={docWrapperRef}>
        <Document
          file={fileBlob}
          options={options}
          renderMode="canvas"
          onLoadSuccess={onDocLoadSuccess}
        >
          {Array.from(new Array(totalPageNumber), (_, index) => {
            const pageNumber = index + 1;
            return (
              <ItemWrapper
                isSelectedPage={isSelectedPage(pageNumber)}
                className={`item-wrapper${pageNumber === selectedPageNumber ? ' selected' : ''}`}
                key={pageNumber}
                ref={(event) => {
                  itemWrapperRef.current[pageNumber] = event;
                }}
              >
                <Card>
                  <Page
                    onClick={(event: React.MouseEvent, page: PDFPageProxy) => {
                      dispatch(signsetsDetailsActions.setSelectedPageNumber(pageNumber));
                      dispatch(signsetsDetailsActions.setSelectedDocumentId(documentId));
                      dispatch(documentsDetailsActions.setIsThumbnailClicked(true));
                      dispatch(
                        pageDetailsActions.setPageDetailsByDocId({
                          width: page.width,
                          pageNumber: pageNumber,
                          height: page.height,
                          documentId: selectedDocumentId,
                        })
                      );
                    }}
                    key={`page_${pageNumber}`}
                    pageNumber={pageNumber}
                    width={150}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Card>
                {pageNumber}
              </ItemWrapper>
            )
          })}
        </Document>
      </DocumentWrapper>
    </Wrapper>
  );
};

const DocumentWrapper = styled.div<DocumentWrapperProps>`
  ${(p) => (p.openHeader ? "" : "display: none;")}
  margin-top: ${SPACE_MD};

`;

const Wrapper = styled.div``;

const ItemWrapper = styled.div<ItemProps>`
  ${UNABLE_USER_SELECT};
  display: flex;
  align-items: center;
  flex-direction: column;

  padding-bottom: ${SPACE_MD};
  cursor: pointer;

  .ant-card {
    /* border */
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
        rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    }

    &.selected {
      box-shadow: ${MAINBLUE} 0px 4px 6px -1px, ${LIGHTBLUE} 0px 2px 4px -1px;
    }
  }

  .ant-card-body {
    padding: 0px !important;
    width: 150px !important;
  }

  ${(p) =>
    p.isSelectedPage
      ? `.ant-card-bordered {border: 1px solid ${MAINBLUE}}`
      : ""}
`;
