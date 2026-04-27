import { PageProps, PDFPageProxy, Document, Page, pdfjs } from "react-pdf";

import { useDrop } from "react-dnd";
import styled from "styled-components";
import { SCBLUE, UNABLE_USER_SELECT } from "../../styles/style.constant";
import { useEffect, useRef, useState } from "react";
import { DraggableWrapper } from "../../commons/draggable-wrapper";
import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch } from "../../store";
import {
  SignSetDimensionValues,
  SignSetFieldType,
  SignSetFieldTypeArray,
  SignSetFieldTypeIcon,
  SignSetMetaAndPosition,
  signSetFieldType,
} from "../../models/views/signset.model";
import { signsetsDetailsActions } from "../../pages/manual-sign-page/reducer/slices/signsets-details.slice";
import { addSignsetDetailsStateFromView } from "../../utils/manual-sign-doc.util";
import {
  selectAllSignsetIdsByPageNumAndDocId,
  selectSignsetsDetailsSelectedDocumentId,
  selectClickedWidget,
  selectAllSignsetDetails,
} from "../../pages/manual-sign-page/reducer/selectors/signsets-details.selector";
import { ManualSignReducerRootState } from "../../pages/manual-sign-page/reducer";
import {
  selectDeviceStateIsDesktop,
  selectDocumentDetailsFileBlobByDocId,
  selectDocumentDetailsScale,
  selectIsThumbnailClicked,
  selectDocumentDetailsSignerEmail,
  selectDocumentDetailsSigners,
  selectDocumentDetailsBase64SealImage,
  selectDeviceStateWindowDimensions,
  selectDocumentDetailsSignsetList
} from "../../pages/manual-sign-page/reducer/selectors/documents-details.selector";
import { Scalable } from "../../models/views/generic.model";
import { selectPagesDetailsByDocIdAndPageNumber } from "../../pages/manual-sign-page/reducer/selectors/pages-details.selector";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ResultDocPage } from "../../commons/result-doc-page";
import { documentsDetailsActions } from "../../pages/manual-sign-page/reducer/slices/documents-details.slice";
import ContextMenu from "./ContextMenu";
import { useTranslation } from "react-i18next";
import { clampToPage, toUnscaledPagePoint } from "../../utils/widget-position";
import { useLatestRef } from "../../utils/use-latest-ref";
import { usePageRefs } from "./page-refs-context";


interface DocWrapperProps extends Scalable {
  isLoadError: boolean;
}

interface PageWrapper extends Scalable { }

interface StyledPage extends Scalable {
  isRenderLoading: boolean;
}

interface DocWorkboardPanelProps {
  selectedPageNumber: number;
  totalPageNumber: number;
  setSelectedPageNumber: (pageNumber: number) => void;
  pageLayoutRef: any;
  selectedDocumentId: any;
}

export const DocWorkboardPanel = ({
  selectedPageNumber,
  totalPageNumber,
  setSelectedPageNumber,
  pageLayoutRef,
}: DocWorkboardPanelProps) => {
  const [showAllWidgets, setShowAllWidgets] = useState<any[]>([]);
  const { t } = useTranslation(["common"]);
  const [renderLoading, setRenderLoading] = useState(false);
  const [isLoadError, setIsLoadError] = useState(false);
  const [pageOrientation, setPageOrientation] = useState<string>("");
  const pageWrapperRef = usePageRefs();
  const docWrapperRef = useRef<any>(null);
  const dispatch = useDispatch<StoreDispatch>();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [selectedDragPageNumber, setSelectedDragPageNumber] = useState(0);
  const [allWidgets, setAllWidgets] = useState<any[]>([])


  //Context Menu
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextItemExist, setContextItemExist] = useState<boolean>(true);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [contextMenuItems, setContextMenuItems] = useState<any[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);


  const options = {
    cMapUrl: "cmaps/",
    cMapPacked: true,
  };


  const scale = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsScale(state));
  // react-dnd retains the previous drop closure for one render after deps change,
  // so we read scale through a ref that always tracks the latest value.
  const scaleRef = useLatestRef(scale);
  const isThumbnailClicked = useSelector((state: ManualSignReducerRootState) => selectIsThumbnailClicked(state));
  const selectedDocumentId = useSelector((state: ManualSignReducerRootState) => selectSignsetsDetailsSelectedDocumentId(state));
  const signerEmail = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignerEmail(state));
  const currPageDetails = useSelector((state: ManualSignReducerRootState) =>
    selectPagesDetailsByDocIdAndPageNumber(
      state,
      selectedDocumentId,
      selectedPageNumber,
    ),
  )!;

  const fileBlob = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsFileBlobByDocId(state, selectedDocumentId)
  );

  const isDesktop = useSelector((state: ManualSignReducerRootState) =>
    selectDeviceStateIsDesktop(state)
  );

  const selectedClickedWidget = useSelector((state: ManualSignReducerRootState) => selectClickedWidget(state));

  const allSignsetIdsByPageNum = useSelector(selectAllSignsetIdsByPageNumAndDocId(selectedPageNumber, selectedDocumentId));
  const allSignsetDetails = useSelector((state: ManualSignReducerRootState) => selectAllSignsetDetails(state));


  const windowDimensions = useSelector((state: ManualSignReducerRootState) =>
    selectDeviceStateWindowDimensions(state)
  );

  const base64SealImage = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsBase64SealImage(state));

  const signers = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSigners(state));
  const signsetList = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignsetList(state));




  const loadingIcon = (
    <LoadingOutlined
      style={{
        fontSize: 48,
        color: `${SCBLUE}`,
      }}
      spin
    />
  );

  useEffect(() => {
    if (allSignsetDetails.length !== 0) {
      const isDuplicate = (array: any, id: any) => array.some((item: any) => item.id === id);
      const uniqueWidgets = allSignsetDetails.filter(obj => !isDuplicate(showAllWidgets, obj?.id));
      if (uniqueWidgets.length !== 0) {
        setShowAllWidgets(prevWidgets => [...prevWidgets, ...uniqueWidgets]);
      }

    }
    else {
      setShowAllWidgets([]);
    }
  }, [allSignsetDetails])


  useEffect(() => {
    setupIntersectionObserver();

    // Clean up the IntersectionObserver when the component unmounts
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [totalPageNumber, scale, selectedDocumentId, windowDimensions]);


  //Set the initial to the first page to enable the dropping fucntion on first page
  useEffect(() => {
    if (!renderLoading) {
      setSelectedPageNumber(1);
    }
  }, [renderLoading])

  //For detecting portal view based on screen size and userAgent
  useEffect(() => {
    if (!isDesktop) {
      dispatch(documentsDetailsActions.setScale(0.5));
    }
    else {
      dispatch(documentsDetailsActions.setScale(1));
    }
  }, [isDesktop])

  const handleContextMenu = (event: any) => {
    event.preventDefault();
    if ((selectedClickedWidget) || signsetList.length === 0) {
      setContextMenuVisible(false);
    }
    else {
      setContextMenuVisible(true);
    }

    setContextMenuPosition({ top: event.clientY, left: event.clientX });
    let pageNumber = parseInt(event.target.parentElement.getAttribute('data-page-number'));

    if (!pageNumber) {
      //pageNumber = parseInt(event.target.parentElement.offsetParent.className.split(":")[1]);
      pageNumber = selectedPageNumber;
    }

    const pageRect = pageWrapperRef.current[pageNumber]?.getBoundingClientRect();
    if (!pageRect) return;

    const rawPoint = toUnscaledPagePoint(
      { x: event.clientX, y: event.clientY },
      pageRect,
      scale,
    );

    const placeAt = (fieldType: SignSetFieldType) => {
      const { left, top } = clampToPage(
        rawPoint,
        pageRect,
        scale,
        SignSetDimensionValues[fieldType],
      );

      setAddOneSignsetDetails({
        left,
        top,
        fieldType,
        pageIndex: pageNumber,
        isDesktop,
        isThumbnailClicked,
        signerEmail,
        contextItemExist,
      });
    };

    const menuItems = [
      { id: 1, type: signSetFieldType.sign, name: t("Signature"), icon: SignSetFieldTypeIcon.sign },
      { id: 2, type: signSetFieldType.seal, name: t("Seal"), icon: SignSetFieldTypeIcon.seal },
      { id: 3, type: signSetFieldType.signdate, name: t("Sign Date"), icon: SignSetFieldTypeIcon.signdate },
      { id: 4, type: signSetFieldType.textfield, name: t("Text Field"), icon: SignSetFieldTypeIcon.textfield },
    ].map((item) => ({ ...item, action: () => placeAt(item.type) }));

    setContextMenuItems(menuItems);
  };

  const setupIntersectionObserver = () => {
    // Function to determine the currently displayed page based on the scroll position
    const updatePageNumber = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        const pageNumber = parseInt(entry.target.getAttribute('data-page-number') || '1', 10);
        // Get the page number from the data attribute
        if (entry.isIntersecting && !isThumbnailClicked) {
          setSelectedPageNumber(pageNumber);
        }
      });
      dispatch(documentsDetailsActions.setIsThumbnailClicked(false));
    };

    const calculateThreshold = () => {
      // Adjust the threshold dynamically based on window dimensions
      const windowWidth = windowDimensions.width;
      const windowHeight = windowDimensions.height;

      //const scale = /* calculate your scale here based on window dimensions */;

      // Example: Adjust threshold based on the width of the window
      const widthThreshold = windowWidth > 1090 ? 0.9 : 0.5;

      // Example: Adjust threshold based on the height of the window
      const heightThreshold = windowHeight > 800 ? 0.8 : 0.5;

      return Math.min(widthThreshold, heightThreshold);
    };

    const threshold = calculateThreshold();

    // Adjust the threshold dynamically
    //const threshold = scale === 0.5 ? 0.3 : 0.9;

    observerRef.current = new IntersectionObserver(updatePageNumber, {
      threshold: scale > 1 ? threshold * (1 / scale) : threshold, // Adjust the threshold as needed for your use case
    });

    // Observe each page element
    for (let pageNumber = 1; pageNumber <= totalPageNumber; pageNumber++) {
      const pageElement = pageWrapperRef.current[pageNumber];
      if (pageElement) {
        observerRef.current?.observe(pageElement);
      }
    }
  };

  // on Page click change to
  const unselectSelectedSignset = (e: any) => {
    e.stopPropagation();
    dispatch(signsetsDetailsActions.unselectSelectedSignsetId(""));
  };

  const [_, dropping] = useDrop(
    () => ({
      accept: SignSetFieldTypeArray,
      drop: (item: { type: SignSetFieldType }, monitor) => {
        const currentScale = scaleRef.current;
        const offset = monitor.getInitialClientOffset();
        const delta = monitor.getDifferenceFromInitialOffset();
        const pageRect = pageWrapperRef?.current[selectedPageNumber]?.getBoundingClientRect();
        if (!offset || !delta || !pageRect) return;

        const rawPoint = toUnscaledPagePoint(
          { x: offset.x + delta.x, y: offset.y + delta.y },
          pageRect,
          currentScale,
        );
        const { left, top } = clampToPage(
          rawPoint,
          pageRect,
          currentScale,
          SignSetDimensionValues[item.type],
        );

        setAddOneSignsetDetails({
          left,
          top,
          fieldType: item.type,
          pageIndex: selectedPageNumber,
          isDesktop,
          isThumbnailClicked,
          signerEmail,
          contextItemExist,
        });
      },
    }),
    [selectedPageNumber, scale, currPageDetails, signerEmail],
  );

  const setAddOneSignsetDetails = ({
    left,
    top,
    fieldType,
    pageIndex,
    isThumbnailClicked,
    signerEmail,
    contextItemExist,
  }: SignSetMetaAndPosition) => {
    // need to clear this
    const signsetDetails = addSignsetDetailsStateFromView({
      fieldType,
      pageIndex,
      left,
      top,
      pageDetails: currPageDetails,
      documentId: selectedDocumentId,
      isDesktop: isDesktop,
      isThumbnailClicked: isThumbnailClicked,
      signerEmail: signerEmail,
      contextItemExist: contextItemExist,
    });

    dispatch(signsetsDetailsActions.setSelectedClickedWidget(""));
    dispatch(signsetsDetailsActions.addOneSignsetDetails(signsetDetails));
  };

  const onPageRenderSuccess = (page: PDFPageProxy) => {
    const pageOrientation = determinePageOrientation(page);

    // Find the rendered page element based on its data-page-number attribute
    const pageNumber = page.pageNumber;
    const pageElement = document.querySelector(`[data-page-number="${pageNumber}"]`);

    if (pageElement) {
      // Add the custom data-page-orientation attribute
      pageElement.setAttribute('data-page-orientation', pageOrientation);
    }

    setRenderLoading(false);
  };

  const handleDragEnter = (event: any) => {
    const pageNumber = parseInt(event.target.parentElement.getAttribute("data-page-number"));
    // currentTarget is the single <PageWrapper>; using parentElement would point at
    // the container holding all pages and break bounding-rect math.
    const pageEl = event.currentTarget;

    if (!isNaN(pageNumber)) {
      setSelectedDragPageNumber(pageNumber);
      pageWrapperRef.current[pageNumber] = pageEl;
      setSelectedPageNumber(pageNumber);
    } else {
      pageWrapperRef.current[selectedDragPageNumber] = pageEl;
      setSelectedPageNumber(selectedDragPageNumber);
    }

    dropping(pageEl);
    dispatch(documentsDetailsActions.setIsThumbnailClicked(false));
  }


  const handlePageClick = (event: any) => {
    if (event.button === 0) {
      //setContextMenuVisible(false);
      let pageNumber = parseInt(event.target.parentElement.getAttribute('data-page-number'));

      if (!pageNumber) {
        //pageNumber = parseInt(event.target.parentElement.offsetParent.className.split(":")[1]);
        pageNumber = selectedPageNumber;
      }
      const pageRect = pageWrapperRef.current[pageNumber]?.getBoundingClientRect();

      if (selectedClickedWidget !== "" && pageRect) {
        const cursor = event.type === "touchstart"
          ? { x: event.touches[0].pageX, y: event.touches[0].pageY }
          : { x: event.pageX, y: event.pageY };
        const fieldType = selectedClickedWidget.split("-")[0] as SignSetFieldType;

        const rawPoint = toUnscaledPagePoint(cursor, pageRect, scale);
        const { left, top } = clampToPage(
          rawPoint,
          pageRect,
          scale,
          (SignSetDimensionValues as any)[fieldType],
        );

        setAddOneSignsetDetails({
          left,
          top,
          fieldType,
          pageIndex: pageNumber,
          isDesktop,
          isThumbnailClicked,
          signerEmail,
          contextItemExist,
        });
        dispatch(signsetsDetailsActions.setSelectedClickedWidget(""));
      }

      setSelectedPageNumber(pageNumber);
      dropping(pageWrapperRef.current[pageNumber]);
      dispatch(documentsDetailsActions.setIsThumbnailClicked(false));
    }
  }

  // Scroll the doc wrapper to the selected page when the user picks a thumbnail.
  useEffect(() => {
    if (docWrapperRef.current && isThumbnailClicked) {
      let pageOffsetTop;

      // At scales below 1 the page sits inside an additional layout offset
      // we need to subtract; at >= 1 the page's own offsetTop is correct.
      const pageEl = pageWrapperRef.current[selectedPageNumber];
      if (!pageEl) return;
      pageOffsetTop = scale >= 1
        ? pageEl.offsetTop
        : pageEl.offsetTop - pageLayoutRef.current.offsetTop;

      docWrapperRef.current.scrollTo({
        top: pageOffsetTop,
        behavior: "smooth"
      });
    }
  }, [selectedPageNumber])



  // Add a click event listener to the document to close the context menu when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenuVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Function to determine the page orientation (portrait or landscape)
  const determinePageOrientation = (page: PDFPageProxy) => {
    const { width, height } = page.getViewport({ scale: 1 });
    return width > height ? 'landscape' : 'portrait';
  }

  const isOverlappedWidget = (widgetId: string) => {
    let isOverlap = false;
    allWidgets.forEach((element) => {

      element.widgetsState.forEach((widget: any) => {
        if (widget.id === widgetId && widget.overlapped === true) {
          isOverlap = true;
        }
      });

    })
    return isOverlap;
  };


  const onSetAllWidgets = (theAllWidgets: any) => {
    let updatedAllWidgets = [...theAllWidgets];

    updatedAllWidgets.forEach((element: any, index1: number) => {
      element.widgetsState.forEach((widget: any, index2: number) => {
        // Check for overlap between elements inside the widgetsState
        element.widgetsState.forEach((otherWidget: any, otherIndex: number) => {
          if (index2 !== otherIndex) { // Avoid comparing the widget with itself
            const overlapX = (widget.left < otherWidget.left + otherWidget.width) && (widget.left + widget.width > otherWidget.left);
            const overlapY = (widget.top < otherWidget.top + otherWidget.height) && (widget.top + widget.height > otherWidget.top);

            if (overlapX && overlapY) {
              // Update the "overlapped" property for the widgets
              updatedAllWidgets[index1].widgetsState[index2].overlapped = true;
              updatedAllWidgets[index1].widgetsState[otherIndex].overlapped = true;
            }
          }
        });
      });
    });

    setAllWidgets(updatedAllWidgets);
  }

  useEffect(() => {
    if (allWidgets.length !== 0) {
      const isOverlapped = allWidgets.some((element: any, index1: number) => {
        return element.widgetsState.some((widget: any, index2: number) => widget.overlapped === true);
      })

      dispatch(signsetsDetailsActions.setIsOverlappedSignset(isOverlapped));
    }
  }, [allWidgets])

  const onSetDisableWidget = (email: string, disableWidget: boolean) => {
    // currently a no-op; the DraggableWrapper still expects this callback prop.
  }


  return (
    <DocWrapper scale={scale} isLoadError={isLoadError} ref={docWrapperRef}>
      <ResultDocPage
        isDisplay={isLoadError}
        status={"500"}
        subTitle="Failed to load PDF file."
      />
      <StyledDoc
        scale={scale}
        isLoadError={isLoadError}
        file={fileBlob}
        onLoadSuccess={() => setIsLoadError(false)}
        options={options}
        renderMode="canvas"
        loading=""
        noData=""
        onLoadError={() => setIsLoadError(true)}
        className="pdf-document"
      >
        {isLoadError === true &&
          <div> The load error page displayed</div>}
        {contextMenuVisible && (
          <div ref={contextMenuRef}>
            <ContextMenu
              top={contextMenuPosition.top}
              left={contextMenuPosition.left}
              items={contextMenuItems}
              onClose={() => setContextMenuVisible(false)}
              setContextMenuVisible={setContextMenuVisible}
              contextMenuVisible={contextMenuVisible}
            />
          </div>
        )}
        <StyledSpin spinning={renderLoading} indicator={loadingIcon}>
          {Array.from(new Array(totalPageNumber), (_, index) => {
            const pageNumber = index + 1;
            return (
              <PageWrapper
                key={`page-wrapper-${pageNumber}`}
                //onMouseEnter={handleMouseEnter}
                onDragEnter={handleDragEnter}
                onMouseDown={handlePageClick}
                onTouchStart={handlePageClick}
                data-page-number={pageNumber}
                data-page-orientation={pageOrientation}
                ref={(el) => {
                  pageWrapperRef.current[pageNumber] = el;
                }}
                onContextMenu={handleContextMenu}
                scale={scale}
              >
                {showAllWidgets.length !== 0 &&
                  showAllWidgets.map((ids: any) => {
                    if (ids.pageIndex === pageNumber) {
                      const resizableStyleCreator: React.CSSProperties = {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transformOrigin: "0 0",
                        transform: `translate(${ids.left}px, ${ids.top}px)`,
                        zIndex: 99,
                        background: signerEmail !== ids.signerEmail ? "#d9dfe4" : isOverlappedWidget(ids.id) ? "#FF8A8A" : "#a6d1ff",
                        opacity: signerEmail !== ids.signerEmail ? 0.8
                          : isOverlappedWidget(ids.id) ? 0.5 : 0.8,
                        borderRadius: "5px",
                      }

                      return <DraggableWrapper
                        id={ids.id}
                        key={ids.id}
                        pageIndex={pageNumber}
                        resizableStyleCreator={resizableStyleCreator}
                        disableWidget={signerEmail !== ids.signerEmail}
                        onSetAllWidgets={onSetAllWidgets}
                        onSetDisableWidget={onSetDisableWidget}
                      />
                    }
                  }
                  )}
                <StyledPage
                  key={`page_${pageNumber}`}
                  pageNumber={pageNumber}
                  isRenderLoading={renderLoading}
                  loading=""
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  onRenderSuccess={onPageRenderSuccess}
                  onClick={unselectSelectedSignset}
                  onLoadSuccess={() => setRenderLoading(true)}
                  data-page-number={pageNumber}
                />
              </PageWrapper>
            )
          })}
        </StyledSpin>
      </StyledDoc>
    </DocWrapper>
  );
};

const StyledSpin = styled(Spin)`
  top: 0;
  bottom: 0;
  margin: auto 0;
`;

const StyledPage = styled(Page) <StyledPage>``;

const PageWrapper = styled.div<PageWrapper>`
  /*ensure parent follow child's width & height */
  display: inline-block;

  /*centering inline-block*/
  //position: relative;
  margin-left: 50%;
  //left: 50%;
  //transform: translateX(-50%);

  //margin-left: ${(p) => p.scale * 0.5 * 100}%;
  transform: ${(p) => p.scale >= 1.75 ? `translateX(-33%);` : `translateX(-50%);`}
  //overflow: auto;
  //scroll-behavior: smooth;
`;

const DocWrapper = styled.div<DocWrapperProps>`
  /* as child */
  flex: 1;

  overflow: auto;
  overflow-x: ${(p) => p.scale >= 1.75 ? "visible" : "hidden"};
  scroll-behavior: smooth;
  height: 100%;
  width: 100%;
  //padding: ${(p) => (p.isLoadError ? 28 : 28 * p.scale)}px 0px;
  padding-top: 5px;
  ${UNABLE_USER_SELECT};

  
`;

const StyledDoc = styled(Document) <DocWrapperProps>`
  position: relative;
  flex-grow: 1;
  ${(p) => (p.isLoadError ? "display: none;" : "")}

`;





