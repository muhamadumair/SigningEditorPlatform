import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ReactNode, useEffect } from "react";
import { documentsDetailsActions } from "../pages/manual-sign-page/reducer/slices/documents-details.slice";
import { StoreDispatch } from "../store";
import { useDispatch } from "react-redux";

export const DndProviderWrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<StoreDispatch>();

  // Function to update window dimensions
  const updateWindowDimensions = () => {

    dispatch(documentsDetailsActions.setWindowDimensions({
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    }))
  };


  const isPC = () => {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }
  useEffect(() => {
    dispatch(documentsDetailsActions.setIsDesktop(isPC()));
    if (isPC()) {
      dispatch(documentsDetailsActions.setScale(1));
    }
    else {
      dispatch(documentsDetailsActions.setScale(0.5));
    }
  }, []);

  // Effect to add and remove the resize event listener
  useEffect(() => {
    // Attach the updateWindowDimensions function to the resize event
    window.addEventListener('resize', updateWindowDimensions);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []); // Empty dependency array ensures that the effect runs only once on mount



  const touchOptions = { enableTouchEvents: true, enableMouseEvents: true };

  /**
   * we need different react dnd backend for different device
   */
  return (
    <DndProvider backend={isPC() ? HTML5Backend : TouchBackend}
      options={touchOptions}
    >
      {children}
    </DndProvider>
  );
};
