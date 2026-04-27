import { ManualSignReducerRootState } from "..";
import { createSelector } from "@reduxjs/toolkit";

const signsetsDetailsState = (state: ManualSignReducerRootState) =>
  state.manualSign.signsetsDetails.present;

export const selectSignsetsDetailsSelectedPageNumber = createSelector(
  [signsetsDetailsState],
  (signsetsDetails) => signsetsDetails.selectedPageNumber
);

export const selectSignsetsDetailsSelectedSignsetId = createSelector(
  [signsetsDetailsState],
  (signsetsDetails) => signsetsDetails.selectedSignsetId
);

export const selectClickedWidget = createSelector(
  [signsetsDetailsState],
  (signsetsDetails) => signsetsDetails.selectedClickedWidget
);

export const dragClientSignset = createSelector(
  [signsetsDetailsState],
  (signsetsDetails) => signsetsDetails.dragClientSignset
);

export const isOverlappedSignset = createSelector(
  [signsetsDetailsState],
  (signsetsDetails) => signsetsDetails.isOverlapped
);


export const selectSignsetsDetailsSelectedDocumentId = createSelector(
  [signsetsDetailsState],
  (signsetsDetails) => signsetsDetails.selectedDocumentId
);

export const selectSignsetsDetailsEntities = createSelector(
  [signsetsDetailsState],
  (signsetsDetails) => signsetsDetails.entities
);

export const selectSignsetsDetailsById = (
  state: ManualSignReducerRootState,
  id: string
) => {
  return selectSignsetsDetailsEntities(state)[id];
};

export const selectSignsetTextFieldById = (
  state: ManualSignReducerRootState,
  id: string
) => {
  const textField = selectSignsetsDetailsEntities(state)[id]?.textField;
  return textField ? textField : "";
};

export const selectSignsetReasondById = (
  state: ManualSignReducerRootState,
  id: string
) => {
  const reason = selectSignsetsDetailsEntities(state)[id]?.reason;
  return reason ? reason : "";
};

export const selectSignsetReasondAckById = (
  state: ManualSignReducerRootState,
  id: string
) => {
  const reason = selectSignsetsDetailsEntities(state)[id]?.reasonAcknowledge;
  return reason ? reason : false;
};

export const selectSignsetTextFields = (
  state: ManualSignReducerRootState,
) => {
  const textField = selectSignsetsDetailsEntities(state);
  return textField ? textField : "";
};

export const selectAllSignsetDetails = createSelector(
  selectSignsetsDetailsEntities,
  (entities) => Object.values(entities)
);

export const selectAllSignsetDetailsByPageNum = (selectedPageNumber: number) =>
  createSelector(selectAllSignsetDetails, (entities) =>
    Object.values(entities.filter((e) => e?.pageIndex === selectedPageNumber))
  );

export const selectAllFieldtypeTextfieldSignsetDetails = () =>
  createSelector(selectAllSignsetDetails, (entities) =>
    Object.values(entities.filter((e) => e?.fieldType === "textfield"))
  );

export const selectAllFieldtypeSignatureSignsetDetails = () =>
  createSelector(selectAllSignsetDetails, (entities) =>
    Object.values(entities.filter((e) => e?.fieldType === "sign"))
  );

export const selectAllFieldtypeSigndateSignsetDetails = () =>
  createSelector(selectAllSignsetDetails, (entities) =>
    Object.values(entities.filter((e) => e?.fieldType === "signdate"))
  );

export const selectAllFieldtypeSealSignsetDetails = () =>
  createSelector(selectAllSignsetDetails, (entities) =>
    Object.values(entities.filter((e) => e?.fieldType === "seal"))
  );

export const selectAllSignsetIdsByPageNumAndDocId = (
  selectedPageNumber: number,
  selectedDocumentId: string
) =>
  createSelector(selectAllSignsetDetails, (entities) =>
    entities
      .filter((e) => e?.documentId === selectedDocumentId)
      .filter((e) => e?.pageIndex === selectedPageNumber)
      .map((e) => ({ 
        id: e?.id, 
        pageIndex: e?.pageIndex, 
        documentId: e?.documentId, 
        signerEmail: e?.signerEmail, 
        fieldType: e?.fieldType,
        top: e?.top,
        left: e?.left,
        width: e?.width,
        height: e?.height
      })),
  );


const signsetsDetailsPastState = (state: ManualSignReducerRootState) =>
  state.manualSign.signsetsDetails.past;

const signsetsDetailsFutureState = (state: ManualSignReducerRootState) =>
  state.manualSign.signsetsDetails.future;

/**
 * select the Past array [], from @type {StateWithHistory}
 */
export const selectSignsetsDetailsPastState = createSelector(
  [signsetsDetailsPastState],
  (signsetsDetails) => signsetsDetails
);

/**
 * select the Future array [], from @type {StateWithHistory}
 */
export const selectSignsetsDetailsFutureState = createSelector(
  [signsetsDetailsFutureState],
  (signsetsDetails) => signsetsDetails
);
