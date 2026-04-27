import { useSelector } from "react-redux";
import { uuidv4 } from ".";
import {
  SignSetDimensionValues,
  SignSetFieldType,
  SignSetMetaAndPosition,
  SignSetPosition,
  SignSetsRecord,
  SignSetState,
} from "../models/views/signset.model";
import { PageDetailsConfig } from "../pages/manual-sign-page/reducer/slices/pages-details.slice";

/**
 * REACT DOCUMENT CREATOR D&D LIBRARY:
 * convert from redux store signsets into signset parameter as according to https://docs.signingcloud.com/?docs=api-reference/upload-document 
 * @param signsets
 */
export const reactLibraryFormatter = ({
  signsets,
}: {
  signsets: (SignSetState | undefined)[];
}) => {
  return signsets.map((entity) => {
    return {
      fieldtype: entity!.fieldType,
      left: entity!.left,
      top: entity!.top,
      width: entity!.width,
      height: entity!.height,
      pageindex: entity?.pageIndex,
      email: entity?.signerEmail
    };
  });
};

/**
 * convert from signsets record into signset state which includes 2 additional fields: id & document id
 * @param signsets
 * @param documentId
 * @returns @type {SignSetState}
 */
export const setSignsetsDetailsStateFromAPI = ({
  documentId,
  signsets,
}: {
  documentId: string;
  signsets: SignSetsRecord;
}): any => {
  return signsets.map((signset) => {
    signset["id"] = uuidv4();
    signset["documentId"] = documentId;
    return signset;
  });
};

export const addSignsetDetailsStateFromView = ({
  fieldType,
  pageIndex,
  left,
  top,
  pageDetails,
  documentId,
  isDesktop,
  isThumbnailClicked,
  signerEmail,
  contextItemExist,
}: SignSetMetaAndPosition & {
  documentId: string;
  pageDetails: PageDetailsConfig;
}): SignSetState => {
  const autoConfig = autoConfigSignsetPositionInBound({
    fieldType,
    top,
    left,
    pageDetails,
    isDesktop,
    isThumbnailClicked,
    signerEmail,
    contextItemExist,
  });

  let dimensionValue = { width: 0, height: 0 };

  dimensionValue = SignSetDimensionValues[fieldType]

  return {
    id: uuidv4(),
    fieldType: fieldType,
    left: autoConfig.left,
    top: autoConfig.top,
    width: dimensionValue?.width,
    height: dimensionValue?.height,
    pageIndex: pageIndex,
    documentId: documentId,
    isDesktop: isDesktop,
    isThumbnailClicked: isThumbnailClicked,
    signerEmail: signerEmail,
    contextItemExist: contextItemExist,
  };
};

interface AutoConfigProps extends SignSetPosition {
  fieldType: SignSetFieldType;
  pageDetails: PageDetailsConfig;
  isDesktop: boolean;
  isThumbnailClicked: boolean;
  signerEmail: string;
  contextItemExist: boolean;
}

/**
 * to auto configure a new signset position @see SignSetPosition if right or bottom is out of bound
 * @param PageDetails @type {PageDetailsConfig} is the page details of the current page number
 */
const autoConfigSignsetPositionInBound = ({
  fieldType,
  top,
  left,
  pageDetails,
  isDesktop,
  isThumbnailClicked,
  contextItemExist,
}: AutoConfigProps): SignSetPosition => {

  let dimensionValue = { width: 0, height: 0 };
  //User agent
  if (isDesktop && !isThumbnailClicked && !contextItemExist) {

    dimensionValue = SignSetDimensionValues[fieldType];

    const right = left + dimensionValue?.width;
    const bottom = top + dimensionValue?.height;


    if (right > pageDetails?.width) {
      const difference = right - pageDetails?.width;
      left = left - difference;
    }

    if (bottom > pageDetails?.height) {
      const difference = bottom - pageDetails?.height;
      top = top - difference;
    }
  }


  return {
    top,
    left,
  };
};

/**
 * convert @param scale which is a decimal with one decimal point to percent
 */
export const convertScaleToPercent = (scale: number): string => {
  const percent = `${(scale * 100).toFixed().toString()}%`;
  return percent;
};

/**
 * convert @param percent which is a number string ends with % symbol to scale which is a decimal with one decimal point
 */
export const convertPercentToScale = (percent: string): number => {
  const scale = +percent.replace("%", "") / 100;
  return scale;
};

export const isDocumentSigned = () => {
  const contractInfoState = window.__INITIAL_STATE__.contractInfoState;
  const addresseeSignState = window.__INITIAL_STATE__.addresseeSignState;
  if (contractInfoState === "4" || addresseeSignState === "1") {
    return true;
  } else {
    return false;
  }
};
