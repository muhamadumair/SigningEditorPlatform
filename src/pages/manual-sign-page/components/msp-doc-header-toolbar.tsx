import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch } from "../../../store";
import { ManualSignReducerRootState } from "../reducer";
import {
  selectDeviceStateIsDesktop,
  selectDocumentDetailsScale,
} from "../reducer/selectors/documents-details.selector";

import { documentsDetailsActions } from "../reducer/slices/documents-details.slice";

import { DocHeaderToolbar } from "../../../components/doc-header-toolbar";

export const MSPDocHeaderToolbar = ({
  onClickThumbnail,
}: {
  onClickThumbnail: () => void;
}) => {
  const dispatch = useDispatch<StoreDispatch>();

  const scale = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsScale(state)
  );

  const isDesktop = useSelector((state: ManualSignReducerRootState) =>
    selectDeviceStateIsDesktop(state)
  );


 
  const setScale = (value: number) => {
    if(value >= 0.5 && value <= 4){
      dispatch(documentsDetailsActions.setScale(value));
    }
  };

  return (
    <DocHeaderToolbar
      scale={scale}
      setScale={setScale}
      showZoomSlider={!isDesktop ? false : true}
      showThumbnailButton={!isDesktop ? true : false}
      onClickThumbnail={onClickThumbnail}
    />
  );
};
