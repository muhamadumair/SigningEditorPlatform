import { strEnumType } from "../../utils";
import Icon, {
  CalendarOutlined,
  EditOutlined,
  FontSizeOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  GENERIC_MIN_WIDTH_HEIGHT,
  SEAL_IMAGE_HEIGHT,
  SEAL_IMAGE_WIDTH,
  SIGN_DATE_HEIGHT,
  SIGN_DATE_MIN_WIDTH,
  SIGN_DATE_WIDTH,
  TEXT_FIELD_MIN_HEIGHT,
  TEXT_FIELD_MIN_WIDTH,
} from "../../styles/style.constant";

const iconStyle = { userSelect: "none", pointerEvents: "none", fontSize: 18 } as const;

export const SignSetFieldTypeIcon = {
  sign: <EditOutlined style={iconStyle} />,
  seal: <SafetyOutlined style={iconStyle} />,
  signdate: <CalendarOutlined style={iconStyle} />,
  textfield: <FontSizeOutlined style={iconStyle} />,
};

/**
 * default signset dimension from drag and drop
 */
export const SignSetDimensionValues = {
  sign: { width: 100, height: 50 },
  signdate: { width: 169, height: 25 },
  textfield: { width: 150, height: 50 },
  seal: { width: 150, height: 150 },
};

/**
 * minimum resizable signset dimension:
 */
export const SignSetMinDimensionValues = {
  sign: {
    width: GENERIC_MIN_WIDTH_HEIGHT,
    height: GENERIC_MIN_WIDTH_HEIGHT,
  },
  seal: {
    width: GENERIC_MIN_WIDTH_HEIGHT,
    height: GENERIC_MIN_WIDTH_HEIGHT,
  },
  signdate: {
    width: SIGN_DATE_WIDTH,
    height: SIGN_DATE_HEIGHT,
  },
  textfield: {
    width: TEXT_FIELD_MIN_WIDTH,
    height: TEXT_FIELD_MIN_HEIGHT,
  },
};

export type SignSetFieldTypeIconKeys = keyof typeof SignSetFieldTypeIcon;

export const signSetFieldType = strEnumType([
  "sign",
  "seal",
  "signdate",
  "textfield",
]);

export const SignSetFieldTypeArray = Object.values(signSetFieldType);

export enum SignSetFieldTypeView {
  sign = "Signature",
  seal = "Seal",
  signdate = "Sign Date",
  textfield = "Text Field",
}

export type SignSetFieldType = Uncapitalize<keyof typeof signSetFieldType>;

export interface SignSetPosition {
  left: number;
  top: number;
}

export interface SignSetDimension {
  width: number;
  height: number;
}

export interface SignSetMeta {
  fieldType: SignSetFieldType;
  pageIndex: number;
  isDesktop: boolean;
  isThumbnailClicked: boolean;
  signerEmail: string;
  contextItemExist: boolean;
}

export interface SignSet
  extends SignSetMeta,
  SignSetDimension,
  SignSetPosition { }

export interface SignSetMetaAndPosition extends SignSetMeta, SignSetPosition { }

export interface SignSetDimesionAndPosition
  extends SignSetDimension,
  SignSetPosition { }

export interface SignSetState extends SignSet {
  id: string;
  textField?: string;
  documentId: string;
  reason?: string;
  reasonAcknowledge?: boolean;
}

interface SignSetRecord extends Record<string, any>, SignSet { }

export type SignSetsRecord = SignSetRecord[];
