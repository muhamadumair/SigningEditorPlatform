import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* need to move to other file */
export interface PageDetailsConfig {
  pageNumber: number;
  width: number;
  height: number;
}

const initialState = {} as Record<string, Record<number, PageDetailsConfig>>;

export const pagesDetailsSlice = createSlice({
  name: "manualSign",
  initialState,
  reducers: {
    setPageDetailsByDocId(
      state,
      action: PayloadAction<{
        documentId: string;
        pageNumber: number;
        width: number;
        height: number;
      }>
    ) {
      const { pageNumber, width, height, documentId } = action.payload;

      const pageDetails = {
        ...state[documentId],
        [pageNumber]: {
          pageNumber,
          width,
          height,
        },
      };

      if (documentId !== undefined) {
        state[documentId] = pageDetails;
      }
    },
  },
});

export const { actions: pageDetailsActions } = pagesDetailsSlice;
