import { createAsyncThunk } from "@reduxjs/toolkit";
import { b64toBlob } from "../../../../utils";
import { documentsDetailsActions } from "../slices/documents-details.slice";
import { signsetsDetailsActions } from "../slices/signsets-details.slice";
import { setSignsetsDetailsStateFromAPI } from "../../../../utils/manual-sign-doc.util";

export const fetchManualSignDocument = createAsyncThunk(
  "manualSign/fetchManualSignDocument",
  async (_, { getState, dispatch }: { getState: () => any; dispatch: any }) => {
    const initialState = window.__INITIAL_STATE__ || {};
    const contractName = initialState.contractname;

    // DISPATCH SECTION:
    // REACT DOCUMENT CREATOR D&D LIBRARY:
    console.log("Displaying Editor version in localhost");

    const signsetList = initialState.signsetList ?? [];
    dispatch(documentsDetailsActions.setSignsetList(signsetList));

    const base64Pdf = initialState.base64Pdf;

    if (base64Pdf) {
      reactLibrarySetting({ dispatch, base64Pdf, contractName, signsetList });
    }
  }
);

// REACT DOCUMENT CREATOR D&D LIBRARY:
const reactLibrarySetting = ({
  dispatch,
  base64Pdf,
  contractName,
  signsetList
}: {
  dispatch: any;
  base64Pdf: any;
  contractName: string;
  signsetList: any;
}) => {

  const documentDetailsEntities = base64Pdf.map((pdfString: string, index: number) => {
    const fileBlob = b64toBlob({ b64Data: pdfString });
    return {
      id: `dumb-document-id-${index}`,
      fileName: contractName,
      fileBlob: fileBlob,
      totalPage: 0,
      pageInfo: "",
    }
  })

  // Extract all signset fields and include email in each object
  const allSignsetFields = signsetList.flatMap((signer: any) =>
    signer.signset.map((signset: any) => ({
      ...signset, // Keep all existing signset properties
      signerEmail: signer.email, // Add email as a property inside each signset object
      documentId: documentDetailsEntities[0].id,
      contextItemExist: true,
      isDesktop: true,
      isThumbnailClicked: false
    }))
  );

  const singleSignsetDetails = setSignsetsDetailsStateFromAPI({
    documentId: documentDetailsEntities[0].id,
    signsets: allSignsetFields
  });

  // initial selected document id:
  dispatch(signsetsDetailsActions.setSelectedDocumentId(documentDetailsEntities[0].id));
  dispatch(documentsDetailsActions.setInitialDocumentsDetails(documentDetailsEntities));

  dispatch(signsetsDetailsActions.setInitialSignsetsDetails(singleSignsetDetails));

};
