import { ManualSignReducerRootState } from "..";

const pagesDetailsState = (state: ManualSignReducerRootState) =>
  state.manualSign.pagesDetails;

export const selectPagesDetailsByDocIdAndPageNumber = (
  state: ManualSignReducerRootState,
  documentId: string,
  pageNumber: number,
) => {
  if (pagesDetailsState(state)[documentId]) {
    return pagesDetailsState(state)[documentId][pageNumber];
  }
};
