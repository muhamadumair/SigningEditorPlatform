import { useDrag } from "react-dnd";
import styled from "styled-components";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { SignSetFieldType } from "../models/views/signset.model";
import { getEmptyImage } from "react-dnd-html5-backend";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import { selectDeviceStateIsDesktop, selectDocumentDetailsSigners, selectDocumentDetailsSignsetList } from "../pages/manual-sign-page/reducer/selectors/documents-details.selector";
import { debugLog } from '../utils/debug-logger';


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

  const signers = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSigners(state));
  const signsetList = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignsetList(state));


  const isDesktop = useSelector((state: ManualSignReducerRootState) =>
    selectDeviceStateIsDesktop(state)
  );


  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: type,
      item: { type },
      canDrag: isDesktop,
      collect: (monitor) => {
        const dragging = monitor.isDragging();
        if (dragging) {
          const clientOffset = monitor.getClientOffset();
          const initialClientOffset = monitor.getInitialClientOffset();
          
          debugLog('🚀 [SIDEBAR DRAG START] Widget drag initiated from sidebar');
          debugLog('  📦 Widget Type:', type);
          debugLog('  🖥️ Is Desktop:', isDesktop);
          debugLog('  👥 Signset List Length:', signsetList.length);
          debugLog('  📍 Initial Position:', initialClientOffset);
          debugLog('  🖱️ Current Position:', clientOffset);
        }
        return {
          isDragging: dragging,
        };
      },
    }),
    [type, isDesktop, signsetList]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);


  return (
    <Wrapper ref={!isDesktop || signsetList.length === 0 ? undefined : drag} key={_key} onClick={(event) => {
      if (signsetList.length !== 0) {
        debugLog('👆 [SIDEBAR CLICK] Widget clicked for click-to-place mode');
        debugLog('  📦 Widget Type:', type);
        debugLog('  🖥️ Is Desktop:', isDesktop);
        handleChangeActiveWidget(type);
      }
    }} signsetList={signsetList}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<WrapperProps>`
  cursor: ${(p) => (p.signsetList.length !== 0 ? "pointer" : "default")};
`;