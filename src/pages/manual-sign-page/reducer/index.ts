import { combineReducers, EntityState } from "@reduxjs/toolkit";
import { StateWithHistory } from "redux-undo";
import { documentDetailsState } from "../../../models/views/document-details.model";
import { SignSetState } from "../../../models/views/signset.model";
import { documentsDetailsSlice } from "./slices/documents-details.slice";
import {
  PageDetailsConfig,
  pagesDetailsSlice,
} from "./slices/pages-details.slice";
import { signsetsDetailsUndoableReducer } from "./slices/signsets-details.slice";

const manualSignReducer = combineReducers({
  signsetsDetails: signsetsDetailsUndoableReducer,
  pagesDetails: pagesDetailsSlice.reducer,
  documentsDetails: documentsDetailsSlice.reducer,
});

export default manualSignReducer;

export interface ManualSignReducerRootState {
  manualSign: {
    signsetsDetails: StateWithHistory<
      EntityState<SignSetState> & {
        selectedPageNumber: number;
        selectedSignsetId: string;
        selectedDocumentId: string;
        selectedClickedWidget: any;
        isOverlapped: boolean;
        dragClientSignset: any;
      }
    >;
    pagesDetails: Record<string, Record<number, PageDetailsConfig>>;
    documentsDetails: EntityState<documentDetailsState> & {
      scale: number;
      allLoaded: boolean;
      accessCode: string;
      addressseeId: string;
      contractId: string;
      allSignatureApplied: boolean;
      allSealApplied: boolean;
      base64SignatureImage: string;
      base64SignatureDraw: string;
      transparent: any;
      signatureDrawSaveData: string;
      base64SealImage: string;
      base64CompanyImage: string;
      isSignCanvas: number;
      windowDimensions: any;
      isDesktop: boolean;
      isThumbnailClicked: boolean;
      signerEmail: string;
      signers: any;
      signsetList: any;
    };
  };
}
