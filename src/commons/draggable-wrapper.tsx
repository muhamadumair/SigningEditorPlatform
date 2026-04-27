import Draggable, { DraggableEventHandler, DraggableData, DraggableEvent } from "react-draggable";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import {
  selectSignsetsDetailsSelectedSignsetId,
  selectSignsetsDetailsById,
  selectSignsetTextFieldById,
  selectAllSignsetDetails,
  selectSignsetReasondById,
} from "../pages/manual-sign-page/reducer/selectors/signsets-details.selector";
import { StoreDispatch } from "../store";
import {
  SignSetDimension,
  SignSetMinDimensionValues,
  SignSetPosition,
} from "../models/views/signset.model";
import { signsetsDetailsActions } from "../pages/manual-sign-page/reducer/slices/signsets-details.slice";
import {
  selectDocumentDetailsScale,
  selectDocumentDetailsBase64SealImage,
  selectDocumentDetailsBase64SignatureImage,
  selectDocumentDetailsBase64SignatureDraw,
  selectDocumentDetailsIsSignCanvas,
  selectDocumentDetailsTransparent,
  selectDocumentDetailsSignerEmail,
  selectDeviceStateIsDesktop
} from "../pages/manual-sign-page/reducer/selectors/documents-details.selector";
import {
  WHITE,
  FONT_BODY,
  LIGHT_BORDER,
  ACTIVE_BORDER,
  BLACK,
  RED,
} from "../styles/style.constant";
import { Scalable } from "../models/views/generic.model";
import { TextFieldModal } from "../components/text-field-modal";
import { CircleDeleteButton } from "./circle-delete-button";
import { MSPDocWorkboardWidget } from "../pages/manual-sign-page/components/msp-doc-workboard-widget";
import { Resizable } from "re-resizable";
import { debugLog } from '../utils/debug-logger';
import { Button } from "antd";
import { DeleteFilled } from "@ant-design/icons";

interface DraggableWrapper {
  id: any;
  pageIndex: number;
  pageWrapperRef: any;
  resizableStyleCreator: React.CSSProperties;
  disableWidget: boolean;
  onSetAllWidgets: (theAllWidgets: any) => void;
  onSetDisableWidget: (email: string, disableWidget: boolean) => void;
}

interface Position {
  x: number;
  y: number;
}

interface IsSelectedWidgetProps {
  isselectedwidget: boolean;
}

interface ScalableDimension
  extends SignSetDimension,
  Scalable,
  IsSelectedWidgetProps { }

interface WrapperProps extends ScalableDimension, SignSetPosition {
  isTextField: boolean;
  transparent: any;
  fieldType: string;
  dataPageNumber: number;
  disableWidget: boolean;
}

interface ChildWrapperProps extends Scalable, IsSelectedWidgetProps {
  dataPageNumber: number;
  fieldType: any;
}

/**
 *
 * need to do something about here:
 *
 */

export const DraggableWrapper = ({ id, pageIndex, pageWrapperRef, resizableStyleCreator, disableWidget, onSetAllWidgets, onSetDisableWidget }: DraggableWrapper) => {
  const dispatch = useDispatch<StoreDispatch>();

  const signerEmail = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignerEmail(state));

  const isDesktop = useSelector((state: ManualSignReducerRootState) =>
    selectDeviceStateIsDesktop(state)
  );
  // need to remove these
  const oneSignsetDetails = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsById(state, id)
  );

  const allSignsetDetails = useSelector((state: ManualSignReducerRootState) => selectAllSignsetDetails(state));

  const selectedSignsetId = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedSignsetId(state)
  );

  const signsetTextField = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetTextFieldById(state, id)
  );

  const signsetReason = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetReasondById(state, id)
  );

  const isSelectedWidget = selectedSignsetId === id;

  const scale = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsScale(state)
  );

  const base64SignatureImage = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsBase64SignatureImage(state)
  );

  const transparentState = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsTransparent(state)
  );

  const base64SealImage = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsBase64SealImage(state)
  );


  const initialPosition: Position = {
    x: oneSignsetDetails?.left! * scale,
    y: oneSignsetDetails?.top! * scale,
  };

  const initialSize: SignSetDimension = {
    width: oneSignsetDetails?.width! * scale,
    height: oneSignsetDetails?.height! * scale
  }

  const [position, setPosition] = useState<Position>(initialPosition);
  const [size, setSize] = useState<SignSetDimension>(initialSize);
  const [currentWidgets, setCurrentWidgets] = useState<any[]>([]);
  const [widgetList, setWidgetList] = useState<any[]>([]);
  //const [disableWidget, setDisableWidget] = useState(false);
  const [acknowledgeReason, setAcknowledgeReason] = useState(false);
  const [warningSentence, setWarningSentence] = useState<string>("")


  // State to keep track of previous touch Y position
  const [prevTouchY, setPrevTouchY] = useState<number | null>(null);

  useEffect(() => {
    setPosition((_) => initialPosition);
    setSize((_) => initialSize);

  }, [scale, oneSignsetDetails?.left, oneSignsetDetails?.top, oneSignsetDetails?.width, oneSignsetDetails?.height])


  const handleOnDrag: DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => {
    const { x, y } = position;
    let newX = x + data.deltaX;

    debugLog('🔄 [WITHIN-PAGE DRAG] Widget being dragged');
    debugLog('  🆔 Widget ID:', id);
    debugLog('  📍 Page Index:', pageIndex);
    debugLog('  📏 Scale:', scale);
    debugLog('  📊 Current Position:', { x, y });
    debugLog('  ↔️ Delta:', { deltaX: data.deltaX, deltaY: data.deltaY });

    // Get page and widget dimensions
    const draggableHeight = size.height;
    const draggableWidth = size.width;
    const pageRect = pageWrapperRef.current[pageIndex].getBoundingClientRect();
    // pageRect is already scaled (it's the rendered DOM size). Don't multiply by scale again.
    const pageHeight = pageRect.height;
    const pageWidth = pageRect.width;

    debugLog('  📐 Widget Size:', { width: size.width, height: size.height });
    debugLog('  📄 Page Dimensions:', { width: pageWidth, height: pageHeight });

    // Calculate max positions (widget must stay fully inside page)
    const maxY = pageHeight - (draggableHeight || 0);
    const maxX = pageWidth - (draggableWidth || 0);

    debugLog('  🚧 Max Positions:', { maxX, maxY });

    if (window.TouchEvent && e instanceof TouchEvent) {
      const { touches } = e as TouchEvent;

      if (prevTouchY !== null) {
        // Calculate the vertical movement
        const currentY = touches[0].pageY;
        const deltaY = currentY - prevTouchY;
        setPrevTouchY(currentY); // Update the previous touch Y position

        // Calculate the new Y position based on the delta
        let newY = y + deltaY;

        // Constrain both X and Y within the valid range
        newX = Math.min(Math.max(newX, 0), maxX);
        newY = Math.min(Math.max(newY, 0), maxY);

        debugLog('  📱 Touch - New Position (after constraints):', { x: newX, y: newY });

        //findOverlap(newX, newY, draggableWidth, draggableHeight, widgetList);

        // Update the position state with the constrained values
        setPosition({
          x: newX,
          y: newY,
        });

      }
      else {
        // Set the initial touch Y position when it's not set yet
        setPrevTouchY(touches[0].pageY);
      }
    }
    else {
      const { movementY } = e as MouseEvent;

      // Calculate the new position
      let newY = y + movementY;

      // Constrain both X and Y within the valid range
      newX = Math.min(Math.max(newX, 0), maxX);
      newY = Math.min(Math.max(newY, 0), maxY);

      debugLog('  🖱️ Mouse - New Position (after constraints):', { x: newX, y: newY });

      //findOverlap(newX, newY, draggableWidth, draggableHeight, widgetList);

      setPosition({
        x: newX,
        y: newY,
      });
    }

  };

  const findOverlap = (newX: number, newY: number, draggableWidth: number, draggableHeight: number, theAllWidgets: any) => {
    // Calculate the bounds of the current element

    const draggedBounds = {
      left: newX,
      top: newY,
      right: newX + draggableWidth,
      bottom: newY + draggableHeight,
    };

    let isOverlapping = false;
    const draggedIndex = theAllWidgets.findIndex((widget: any) => widget.id === id);

    for (let index = 0; index < theAllWidgets.length; index++) {
      const element = theAllWidgets[index];
      if (element.id !== id && element.pageIndex === pageIndex) {
        const otherX = element.left * scale;
        const otherY = element.top * scale;
        const otherWidth = element.width * scale;
        const otherHeight = element.height * scale;

        const otherBounds = {
          left: otherX,
          top: otherY,
          right: otherX + otherWidth,
          bottom: otherY + otherHeight,
        };

        // Check for overlap between the dragged element and the other element
        if (
          draggedBounds.left < otherBounds.right &&
          draggedBounds.right > otherBounds.left &&
          draggedBounds.top < otherBounds.bottom &&
          draggedBounds.bottom > otherBounds.top
        ) {
          isOverlapping = true;
        } else {
          isOverlapping = false;
        }

        theAllWidgets[index].overlapped = isOverlapping;
      }
    }

    // Check for overlap between other elements beside dragged element
    for (let i = 0; i < theAllWidgets.length; i++) {
      if (i !== draggedIndex && theAllWidgets[i].pageIndex === pageIndex) { // Assuming you have the index of the dragged element (draggedIndex)
        for (let j = 0; j < theAllWidgets.length; j++) {
          if (i !== j) {
            const elementI = theAllWidgets[i];
            const elementJ = theAllWidgets[j];

            const boundsI = {
              left: elementI.left * scale,
              top: elementI.top * scale,
              right: (elementI.left + elementI.width) * scale,
              bottom: (elementI.top + elementI.height) * scale,
            };

            const boundsJ = {
              left: elementJ.left * scale,
              top: elementJ.top * scale,
              right: (elementJ.left + elementJ.width) * scale,
              bottom: (elementJ.top + elementJ.height) * scale,
            };

            // Check for overlap between elementI and elementJ
            if (
              boundsI.left < boundsJ.right &&
              boundsI.right > boundsJ.left &&
              boundsI.top < boundsJ.bottom &&
              boundsI.bottom > boundsJ.top
            ) {
              theAllWidgets[i].overlapped = true;
              theAllWidgets[j].overlapped = true;
            }
          }
        }
      }
    }

    setWidgetList(theAllWidgets);
  }


  useEffect(() => {
    if (widgetList.length !== 0) {
      let theCurrentWidgets = [...currentWidgets];
      theCurrentWidgets.forEach((element) => {
        if (element.pageIndex === pageIndex) {
          element.widgetsState = widgetList;
        }
      })

      onSetAllWidgets(theCurrentWidgets)

    }
  }, [widgetList])
 


  useEffect(() => {
    if (allSignsetDetails.length !== 0) {
      if (allSignsetDetails.length !== 0) {
        const updatedAllWidgets = allSignsetDetails.filter((widget) => widget?.pageIndex === pageIndex).map((widget) => {
          return { ...widget, overlapped: false, }
        });

        findOverlap(position.x, position.y, size.width, size.height, updatedAllWidgets);
      }
    }

  }, [id, oneSignsetDetails]);

  useEffect(() => {
    if (allSignsetDetails.length !== 0) {
      // Group widgets by pageIndex
      const groupedWidgets = allSignsetDetails.reduce((acc: any, widget) => {
        const pageIndex = widget?.pageIndex;
        if (pageIndex) {
          if (!acc[pageIndex]) {
            acc[pageIndex] = {
              pageIndex,
              widgetsState: [],
            };
          }

          acc[pageIndex].widgetsState.push({
            id: widget.id,
            fieldType: widget.fieldType,
            left: widget.left,
            top: widget.top,
            width: widget.width,
            height: widget.height,
            pageIndex: widget.pageIndex,
            documentId: widget.documentId,
            overlapped: false,
          });
        }

        return acc;
      }, {});

      // Convert the groupedWidgets object back to an array
      const updatedAllWidgets = Object.values(groupedWidgets);
      setCurrentWidgets(updatedAllWidgets);

    }
  }, [oneSignsetDetails])

  const handleOnStart: DraggableEventHandler = (e, data) => {
    if (window.TouchEvent && e instanceof TouchEvent) {
      const { touches } = e as TouchEvent;
      setPrevTouchY(touches[0].pageY); // Set the initial touch Y position
    }

    e.stopPropagation();
    onWidgetClick();
  };

  const _handleOnStop: DraggableEventHandler = (e, data) => {
    e.stopPropagation();
    setPrevTouchY(null); // Reset the previous touch Y position after dragging ends

    debugLog('🛑 [WITHIN-PAGE DRAG STOP] Drag ended');
    debugLog('  🆔 Widget ID:', id);
    debugLog('  📍 Page Index:', pageIndex);
    debugLog('  📏 Scale:', scale);
    debugLog('  📊 Final Position (scaled):', position);

    // the updated field on redux store is always in scale of 1: 
    const updatedFields = {
      top: position.y / scale,
      left: position.x / scale,
    };

    const initialFields = {
      top: initialPosition.y,
      left: initialPosition.x,
    };

    debugLog('  🔄 Position Conversion:');
    debugLog('    - Scaled Position:', position);
    debugLog('    - Unscaled Position (saved to Redux):', updatedFields);
    debugLog('    - Initial Position:', initialFields);

    /* only dispatch an action if initial fields not the same as updated fileds */
    if (JSON.stringify(initialFields) !== JSON.stringify(updatedFields)) {
      debugLog('  ✅ Position changed - Updating Redux');
      dispatch(
        signsetsDetailsActions.updateOneSignsetDetails({
          id: id,
          updatedFields: updatedFields,
        })
      );
    } else {
      debugLog('  ⏭️ Position unchanged - Skipping Redux update');
    }
  };

  const handleOnStop = useCallback(_handleOnStop, [position]);

  const onWidgetClick = () => {
    if (id !== selectedSignsetId) {
      dispatch(signsetsDetailsActions.setSelectedSignsetId(id));
    }
  };

  const onWidgetDelete = (event: any) => {
    dispatch(signsetsDetailsActions.deleteOneSignsetDetails(id));
  };

  const textfieldParentRef = useRef<any>();

  const [isTextFieldModalOpen, setIsTextFieldModalOpen] = useState<boolean>(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState<boolean>(false);

  const [textFieldValue, setTextFieldValue] = useState<string>("");
  const [reasonValue, setReasonValue] = useState<string>("");

  useEffect(() => {
    setTextFieldValue(signsetTextField);
  }, [signsetTextField]);

  useEffect(() => {
    setReasonValue(signsetReason);
  }, [signsetReason])

  const showTextFieldModal = () => {
    setIsTextFieldModalOpen(true);
  };

  const showSignaturedModal = () => {
    setIsSignatureModalOpen(true);
  };

  const handleOnOk = () => {

    setIsTextFieldModalOpen(false);

    // Trim and check if reasonValue is not empty or composed only of whitespace characters
    let trimmedReasonValue = reasonValue.trim();
    let isReasonValueValid = trimmedReasonValue !== "" && /\S/.test(trimmedReasonValue);

    // Trim and check if textFieldValue is not empty or composed only of whitespace characters
    let trimmedTextFieldValue = textFieldValue.trim();
    let isTextFieldValueValid = trimmedTextFieldValue !== "" && /\S/.test(trimmedTextFieldValue);

    if (oneSignsetDetails?.fieldType === "sign") {
      dispatch(
        signsetsDetailsActions.updateOneSignsetDetails({
          id: id,
          updatedFields: {
            reason: isReasonValueValid ? trimmedReasonValue : "",
            reasonAcknowledge: isReasonValueValid,
          },
        })
      );

      setAcknowledgeReason(isReasonValueValid);
    } else {
      dispatch(
        signsetsDetailsActions.updateOneSignsetDetails({
          id: id,
          updatedFields: {
            textField: isTextFieldValueValid ? trimmedTextFieldValue : "",
          },
        })
      );
    }

  };

  const handleOnCancel = () => {
    setIsTextFieldModalOpen(false);
  };

  const handleOnTextEditChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (oneSignsetDetails?.fieldType === "sign") {
      setReasonValue(e.target.value);
    }
    else {
      setTextFieldValue(e.target.value);
    }
  };

  const handleAfterClose = () => {
    /* set edit text to value from store once model is closed to reset text field value */
    if (oneSignsetDetails?.fieldType === "sign") {
      setReasonValue(signsetReason)
    }
    else {
      setTextFieldValue(signsetTextField);
    }
    dispatch(signsetsDetailsActions.setSelectedPageNumber(pageIndex));
  };

  const handleOnCoordinateSignMouseDown = (e: MouseEvent) => {
    if ((oneSignsetDetails?.fieldType! === "textfield" || oneSignsetDetails?.fieldType! === "sign")) {
      onWidgetClick();
    }
  };

  const showDeleteButton = () => {
    return isSelectedWidget;
  };

  const signatureSrc = () => {
    return base64SignatureImage;
  }


  const handleOnResize = (event: any, direction: any, refToElement: any, delta: any) => {
    const updatedSize = {
      width: initialSize.width + delta?.width,
      height: initialSize?.height + delta?.height,
    }
    setSize(updatedSize);
    dispatch(signsetsDetailsActions.setSelectedPageNumber(pageIndex));
  };

  const handleOnResizeStop = (event: any, direction: any, refToElement: any, delta: any) => {

    // the updated field on redux store is always in scale of 1: 
    const updatedFields = {
      width: size?.width / scale,
      height: size?.height / scale,
    };

    const initialFields = {
      width: initialSize?.width,
      height: initialSize?.height,
    };

    /* only dispatch an action if initial fields not the same as updated fileds */
    if (JSON.stringify(initialFields) !== JSON.stringify(updatedFields)) {
      dispatch(
        signsetsDetailsActions.updateOneSignsetDetails({
          id: id,
          updatedFields: updatedFields,
        })
      );
    }
  };

  useEffect(() => {
    if (signerEmail) {
      if (signerEmail === oneSignsetDetails?.signerEmail) {
        //setDisableWidget(false);
        onSetDisableWidget(signerEmail, false);
      }
      else {
        //setDisableWidget(true);
        onSetDisableWidget(signerEmail, true);
      }
    }
  }, [signerEmail])

  return (
    <>
      <TextFieldModal
        open={isTextFieldModalOpen}
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        afterClose={handleAfterClose}
        textAreaValue={oneSignsetDetails?.fieldType === "sign" ? reasonValue : textFieldValue}
        onTextAreaChange={handleOnTextEditChange}
        modalTitle={oneSignsetDetails?.fieldType === "sign" ? "Reason" : "Text Field"}
        fieldType={oneSignsetDetails?.fieldType}
        warningSentence={warningSentence}
      />
      {/*
       * If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
       * Unfortunately, in order for <Draggable> to work properly, we need raw access
       * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
       * as in this example:
       * https://stackoverflow.com/questions/63603902/finddomnode-is-deprecated-in-strictmode-finddomnode-was-passed-an-instance-of-d
       */}
      {oneSignsetDetails &&
        <Draggable
          disabled={disableWidget}
          onMouseDown={handleOnCoordinateSignMouseDown}
          position={position}
          bounds="parent"
          onStart={handleOnStart}
          onDrag={handleOnDrag}
          onStop={handleOnStop}
          handle=".draggable-class" // selector 
          cancel=".no-drag"
        >

          <Resizable
            style={resizableStyleCreator}
            onResize={handleOnResize}
            onResizeStop={handleOnResizeStop}
            size={{
              width: size.width,
              height: size.height,
            }}
            minHeight={SignSetMinDimensionValues[oneSignsetDetails?.fieldType].height * scale}
            minWidth={SignSetMinDimensionValues[oneSignsetDetails?.fieldType].width * scale}
            bounds="parent"
            // uncomment this section to support resizing: 
            enable={{
              //top: disableWidget || oneSignsetDetails.fieldType === "signdate" ? false : true,
              right: disableWidget || oneSignsetDetails.fieldType !== "signdate" ? false : true,
              //bottom: disableWidget || oneSignsetDetails.fieldType === "signdate" ? false : true,
              //left: disableWidget || oneSignsetDetails.fieldType === "signdate" ? false : true,
              //topRight: disableWidget || oneSignsetDetails.fieldType === "signdate" ? false : true,
              bottomRight: disableWidget || oneSignsetDetails.fieldType === "signdate" ? false : true,
              //bottomLeft: disableWidget || oneSignsetDetails.fieldType === "signdate" ? false : true,
              //topLeft: disableWidget || oneSignsetDetails.fieldType === "signdate" ? false : true,

              // top: true,
              // right: true,
              // bottom: true,
              // left: true,
              // topRight: true,
              // bottomRight: true,
              // bottomLeft: true,
              // topLeft: true
            }}

          //enable={{ top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
          >
            {/* {!isDesktop && !disableWidget &&
              <CircleDeleteButton
                scale={scale}
                show={showDeleteButton()}
                onClick={onWidgetDelete}
              />
            } */}
              <Wrapper
                className={`draggable-class pageIndex:${pageIndex}`} // selector
                ref={textfieldParentRef}
                isselectedwidget={isSelectedWidget}
                isTextField={oneSignsetDetails?.fieldType! === "textfield"}
                width={size.width} // changed, but its not used
                height={size.height} // changed, but its not used
                scale={scale}
                left={position.x}
                top={position.y}
                transparent={transparentState}
                fieldType={oneSignsetDetails?.fieldType!}
                dataPageNumber={pageIndex}
                disableWidget={disableWidget}
              >
                {isSelectedWidget && !disableWidget &&
                    <>
                      <Button
                        icon={<DeleteFilled style={{ color: RED }} />}
                        type="link"
                        style={{
                          position: "absolute",
                          top: -10,
                          right: -27,
                          //width: scale > 1.5 ? 30 : 20 * scale 
                        }}
                        onClick={onWidgetDelete}
                        className="no-drag"
                      />
                    </>
                  }
                <ChildWrapper isselectedwidget={isSelectedWidget} scale={scale} dataPageNumber={pageIndex} fieldType={oneSignsetDetails?.fieldType}>
                  <MSPDocWorkboardWidget
                    id={id}
                    fieldType={oneSignsetDetails?.fieldType!}
                    scale={1}
                    width={size.width}
                    height={size.height}
                    signatureSrc={signatureSrc()}
                    sealSrc={base64SealImage}
                    isselectedwidget={isSelectedWidget}
                    onClickEdit={showTextFieldModal}
                    onClickEditSignature={showSignaturedModal}
                    ref={textfieldParentRef}
                    dataPageNumber={pageIndex}
                    acknowledgeReason={acknowledgeReason}
                    setAcknowledgeReason={(acknowledge: boolean) => setAcknowledgeReason(acknowledge)}
                  />
                </ChildWrapper>
              </Wrapper>
            {!disableWidget &&
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: scale < 1 ? 18 : 16,
                  height: scale < 1 ? 18 : 16,
                  clipPath: "polygon(100% 100%, 100% 0%, 0% 100%)",
                  backgroundImage: "linear-gradient(-45deg, transparent 25%, black 25%, black 50%, transparent 50%, transparent 75%, black 75%, black)",
                  backgroundSize: "8px 8px", /* Adjust the size of the stripes as needed */
                }}
                onClick={() => dispatch(signsetsDetailsActions.setSelectedPageNumber(pageIndex))}
              />
            }
          </Resizable>
        </Draggable>

      }

    </>
  );
};

const Wrapper = styled.div<WrapperProps>`
  z-index: ${(p) => (p.isselectedwidget ? "999999999" : "10")} !important;

  position: absolute;
  ${(p) => (p.disableWidget ? "" : "cursor: move; !important")}
  ${(p) => (p.isTextField ? "cursor: pointer; !important" : "")}
  

  // background for widget-box:
  background: ${(p) =>
    (p.fieldType === "sign" ? "transparent" : "#D9DFE4")} !important;
 

  // border style for widget-box:
  border: 2px dashed #357eeb !important;
  border-radius: 5px;

  /* dimension settings which are effected by scale */
  // ${(p) => (p.width ? `width: ${p.width * p.scale}px;` : "")}
  // ${(p) => (p.height ? `height: ${p.height * p.scale}px;` : "")}

  width: calc(100%);
  height: calc(100%);

  ${(p) =>
    p.isselectedwidget
      ? `${ACTIVE_BORDER({ scale: p.scale })}`
      : `${LIGHT_BORDER({ scale: p.scale })}`}
  ${(p) => `font-size: ${FONT_BODY * p.scale}px;`}
`;

const ChildWrapper = styled.div<ChildWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.fieldType === "signdate" ? "start" : "center")};
  padding-left: ${(p) => (p.fieldType === "signdate" ? "10px" : undefined)};

  overflow: hidden;
  width: 100%;
  height: 100%;
  ${(p) => `font-size: ${FONT_BODY * p.scale}px;`}
`;