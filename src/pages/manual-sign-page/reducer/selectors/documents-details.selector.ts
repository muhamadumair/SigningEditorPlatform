import { createSelector } from "@reduxjs/toolkit";
import { ManualSignReducerRootState } from "..";

const documentsDetailsState = (state: ManualSignReducerRootState) =>
  state.manualSign.documentsDetails;

export const selectDocumentDetailsSignerEmail = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.signerEmail
);

export const selectDocumentDetailsSignsetList = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.signsetList
);

export const selectDocumentDetailsScale = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.scale
);

export const selectDocumentDetailsBase64SignatureImage = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.base64SignatureImage
);

export const selectDeviceStateWindowDimensions = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.windowDimensions
);

export const selectDeviceStateIsDesktop = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.isDesktop
);

export const selectIsThumbnailClicked = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.isThumbnailClicked
);

export const selectDocumentDetailsBase64SignatureDraw = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.base64SignatureDraw
);

export const selectDocumentDetailsTransparent = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.transparent
);

export const selectDocumentDetailsBase64SealImage = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.base64SealImage
);

export const selectDocumentDetailsBase64CompanyImage = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.base64CompanyImage
);

export const selectDocumentDetailsIsSignCanvas = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.isSignCanvas
);

export const selectDocumentDetailsAllSignatureApplied = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.allSignatureApplied
);

export const selectDocumentDetailsAllSealApplied = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.allSealApplied
);

export const selectDocumentDetailsSignatureDrawSaveData = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.signatureDrawSaveData
);

export const selectDocumentDetailsIds = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.ids
);

export const selectDocumentDetailsAllLoaded = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.allLoaded
);

export const selectDocumentDetailsIdExist = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.ids.length >= 1
);

export const selectDocumentDetailsEntities = createSelector(
  [documentsDetailsState],
  (documentsDetails) => documentsDetails.entities
);

export const selectDocumentDetailsByDocId = (
  state: ManualSignReducerRootState,
  documentId: string
) => {
  return selectDocumentDetailsEntities(state)[documentId];
};

// to do here:
export const selectDocumentDetailsPageInfoByDocid = (
  state: ManualSignReducerRootState,
  documentId: string
) => {
  return selectDocumentDetailsEntities(state)[documentId]?.pageInfo;
};

export const selectDocumentDetailsFileBlobByDocId = (
  state: ManualSignReducerRootState,
  documentId: string,
) => {
  return selectDocumentDetailsEntities(state)[documentId]?.fileBlob;
};

export const selectDocumentDetailsFileNameByDocId = (
  state: ManualSignReducerRootState,
  documentId: string
) => {
  return selectDocumentDetailsEntities(state)[documentId]?.fileName;
};

export const selectDocumentDetailsTotalPageNumberByDocId = (
  state: ManualSignReducerRootState,
  documentId: string
) => {
  return selectDocumentDetailsEntities(state)[documentId]?.totalPage;
};
