import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { SignSetState } from "../../../../models/views/signset.model";
import undoable, { groupByActionTypes, includeAction } from "redux-undo";

export const signsetsDetailsAdapter = createEntityAdapter<SignSetState>();

const initialState = signsetsDetailsAdapter.getInitialState({
  //selectedPageNumber: 0,
  selectedPageNumber: 1,
  selectedSignsetId: "",
  selectedDocumentId: "",
  selectedClickedWidget: "",
  widgetCounts: 0,
  isOverlapped: false,
  dragClientSignset: {},
});

export const signsetsDetailsSlice = createSlice({
  name: "manualSign",
  initialState,
  reducers: {
    setSelectedPageNumber(state, action: PayloadAction<number>) {
      state.selectedPageNumber = action.payload;
    },
    setSelectedSignsetId(state, action: PayloadAction<string>) {
      state.selectedSignsetId = action.payload;
    },
    setSelectedDocumentId(state, action: PayloadAction<string>) {
      state.selectedDocumentId = action.payload;
    },
    setDragClientSignset(state, action: PayloadAction<any>) {
      state.dragClientSignset = action.payload;
    },
    setIsOverlappedSignset(state, action: PayloadAction<boolean>) {
      state.isOverlapped = action.payload;
    },
    unselectSelectedSignsetId(state, action) {
      state.selectedSignsetId = "";
    },
    setInitialSignsetsDetails(state, action) {
      const signsetsDetails = action.payload;
      signsetsDetailsAdapter.setAll(state, signsetsDetails);
    },
    setSelectedClickedWidget(state, action: PayloadAction<string>) {
      if (action.payload !== "") {
        state.selectedClickedWidget = action.payload + `-${state.widgetCounts + 1}`;
        state.widgetCounts = state.widgetCounts + 1;
      }
      else {
        state.selectedClickedWidget = action.payload
      }

    },
    addOneSignsetDetails(state, action: PayloadAction<SignSetState>) {
      signsetsDetailsAdapter.addOne(state, action);
    },
    deleteOneSignsetDetails(state, action: PayloadAction<string>) {
      signsetsDetailsAdapter.removeOne(state, action.payload);
    },
    updateOneSignsetDetails(
      state,
      action: PayloadAction<{ id: string; updatedFields: any }>
    ) {
      signsetsDetailsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload.updatedFields,
      });
    },
  },
});

export const { actions: signsetsDetailsActions } = signsetsDetailsSlice;

export const MANUAL_SIGN_UNDO = {
  undo: "MANUAL_SIGN_UNDO",
  redo: "MANUAL_SIGN_REDO",
};

const filterActions = [
  signsetsDetailsActions.setInitialSignsetsDetails,
  signsetsDetailsActions.setSelectedPageNumber,
  signsetsDetailsActions.setSelectedSignsetId,
  signsetsDetailsActions.unselectSelectedSignsetId,
  signsetsDetailsActions.addOneSignsetDetails,
  signsetsDetailsActions.deleteOneSignsetDetails,
  signsetsDetailsActions.updateOneSignsetDetails,
].map((ele) => ele.toString());

const groupByActions = [signsetsDetailsActions.setSelectedPageNumber].map(
  (ele) => ele.toString()
);

export const signsetsDetailsUndoableReducer = undoable(
  signsetsDetailsSlice.reducer,
  {
    undoType: MANUAL_SIGN_UNDO.undo,
    redoType: MANUAL_SIGN_UNDO.redo,
    filter: includeAction(filterActions),
    groupBy: groupByActionTypes(groupByActions),
    ignoreInitialState: true,
  }
);
