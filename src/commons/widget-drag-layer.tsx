import { useDragLayer } from "react-dnd";
import styled from "styled-components";
import { SignSetFieldTypeIconKeys, SignSetDimensionValues } from "../models/views/signset.model";
import { Scalable } from "../models/views/generic.model";
import { WidgetIconBox } from "./widget-icon-box";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../store";
import { signsetsDetailsActions } from "../pages/manual-sign-page/reducer/slices/signsets-details.slice";

const getItemStyles = (
  initialSourceOffset: any,
  currentSourceOffset: any,
  currentClientOffset: any,
) => {
  if (!initialSourceOffset || !currentSourceOffset) {
    return {
      display: "none",
    };
  }

  let { x, y } = currentClientOffset;
  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform,
    WebkitTransform: transform,
  };

};

export const WidgetDragLayer = ({ scale }: Scalable) => {
  const dispatch = useDispatch<StoreDispatch>();

  const renderItem = () => {
    const fieldType = itemType as SignSetFieldTypeIconKeys;

    return <WidgetIconBox
      scale={scale}
      fieldType={fieldType}
      width={SignSetDimensionValues[fieldType]?.width}
      height={SignSetDimensionValues[fieldType]?.height}
    />;
  };


  const {
    itemType,
    isDragging,
    initialSourceOffset,
    currentSourceOffset,
    currentClientOffset,
    differencefromInitialSet,
    initialClientOffset
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialSourceOffset: monitor.getInitialSourceClientOffset(),
    // for item existing in main dock:
    currentSourceOffset: monitor.getSourceClientOffset(),
    // for item from sidebar:
    currentClientOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
    differencefromInitialSet: monitor.getDifferenceFromInitialOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }));

  if (!isDragging) {
    return null;
  }

  dispatch(signsetsDetailsActions.setDragClientSignset({
    itemType: itemType,
    clientOffsetX: initialClientOffset?.x,
    clientOffsetY: initialClientOffset?.y,
    differencefromInitialSet: differencefromInitialSet
  }));


  return (
    <Wrapper>
      <div
        style={getItemStyles(initialSourceOffset, currentSourceOffset, currentClientOffset)}
      >
        {isDragging && renderItem()}
        {/* Render a hidden div to capture mouse events */}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;
