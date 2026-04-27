import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { documentDetailsState } from "../../../../models/views/document-details.model";
import { fetchManualSignDocument } from "../thunks/manual-sign-doc.thunk";

export const multiDocDetailsAdapter = createEntityAdapter<
  documentDetailsState
>();

const initialState = multiDocDetailsAdapter.getInitialState({
  scale: 1,
  allLoaded: false,
  accessCode: "", // might change in future for sign server v2 api
  addressseeId: "", // might change in future for sign server v2 api
  contractId: "", // might change in future for sign server v2 api
  allSignatureApplied: false,
  allSealApplied: false,
  base64SignatureImage: "",
  transparent: [{ type: "signature", isTransparent: 0 }, { type: "seal", isTransparent: 0 }],
  base64SignatureDraw: "",
  signatureDrawSaveData: "",
  base64SealImage: "",
  base64CompanyImage: "",
  isSignCanvas: 1, // property for coordinate sign only, initial is true
  windowDimensions: false,
  isDesktop: true,
  isThumbnailClicked: false,
  signerEmail: "",
  signers: [],
  signsetList: []
});

export const documentsDetailsSlice = createSlice({
  name: "manualSign",
  initialState,
  reducers: {
    setInitialDocumentsDetails(
      state,
      action: PayloadAction<documentDetailsState[]>
    ) {
      const multipleDocs = action.payload;

      multipleDocs.forEach((documentDetails) => {
        multiDocDetailsAdapter.addOne(state, documentDetails);
      });
      state.allLoaded = true;
    },
    setAccessCode(state, action) {
      state.accessCode = action.payload;
    },
    setAddresseeId(state, action) {
      state.addressseeId = action.payload;
    },
    setSignerEmail(state, action) {
      state.signerEmail = action.payload;
    },
    setSigners(state, action) {
      state.signers = action.payload;
    },
    setSignsetList(state, action) {
      state.signsetList = action.payload;
    },
    setWindowDimensions(state, action) {
      state.windowDimensions = action.payload;
    },
    setIsDesktop(state, action) {
      state.isDesktop = action.payload;
    },
    setIsThumbnailClicked(state, action) {
      state.isThumbnailClicked = action.payload;
    },
    setContractId(state, action) {
      state.contractId = action.payload;
    },
    setScale(state, action) {
      state.scale = action.payload;
    },
    setTransparent(state, action) {
      state.transparent = action.payload;
    },
    setBase64SignatureImage(state, action) {
      state.base64SignatureImage = action.payload;
    },
    setBase64SignatureDraw(state, action) {
      state.base64SignatureDraw = action.payload;
    },
    setBase64SealImage(state, action) {
      state.base64SealImage = action.payload;
    },
    setBase64CompanyImage(state, action) {
      state.base64CompanyImage = action.payload;
    },
    setIsSignCanvas(state, action) {
      state.isSignCanvas = action.payload;
    },
    setSignatureDrawSaveData(state, action) {
      state.signatureDrawSaveData = action.payload;
    },
    clearSignatureDrawSaveData(state, _: PayloadAction<void>) {
      state.signatureDrawSaveData = "";
    },
    setAllSealApplied(state, action) {
      state.allSealApplied = action.payload;
    },
    setAllSignatureApplied(state, action) {
      state.allSignatureApplied = action.payload;
    },
    setTotalPageByDocId(
      state,
      action: PayloadAction<{ documentId: string; totalPage: number }>
    ) {
      multiDocDetailsAdapter.updateOne(state, {
        id: action.payload.documentId,
        changes: {
          totalPage: action.payload.totalPage,
        },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchManualSignDocument.pending, (state, action) => {
      state.allLoaded = false;
    });
    builder.addCase(fetchManualSignDocument.fulfilled, (state, action) => {
      state.allLoaded = true;
    });
  },
});

export const { actions: documentsDetailsActions } = documentsDetailsSlice;
