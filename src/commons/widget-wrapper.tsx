import { useDrag } from "react-dnd";
import styled from "styled-components";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { SignSetFieldType } from "../models/views/signset.model";
import { getEmptyImage } from "react-dnd-html5-backend";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import { selectDeviceStateIsDesktop, selectDocumentDetailsSignsetList } from "../pages/manual-sign-page/reducer/selectors/documents-details.selector";


interface WidgetProps {
  type: SignSetFieldType;
  onClick?: () => void;
  children?: ReactNode;
  _key: string | number;
  widgetListData: any[];
  handleChangeActiveWidget: (type: string) => void;
}

interface WrapperProps {
  isActive?: boolean;
  signsetList?: any;
}

export const WidgetWrapper = ({ type, children, _key, handleChangeActiveWidget }: WidgetProps) => {

  const signsetList = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignsetList(state));


  const isDesktop = useSelector((state: ManualSignReducerRootState) =>
    selectDeviceStateIsDesktop(state)
  );


  const [, drag, preview] = useDrag(
    () => ({
      type,
      item: { type },
      canDrag: isDesktop,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [type, isDesktop, signsetList],
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);


  return (
    <Wrapper
      ref={!isDesktop || signsetList.length === 0 ? undefined : drag}
      key={_key}
      onClick={() => {
        if (signsetList.length !== 0) handleChangeActiveWidget(type);
      }}
      signsetList={signsetList}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<WrapperProps>`
  cursor: ${(p) => (p.signsetList.length !== 0 ? "pointer" : "default")};
`;