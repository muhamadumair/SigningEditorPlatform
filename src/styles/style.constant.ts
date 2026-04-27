import { keyframes } from "styled-components";

// spacing:
export const SPACE_UNIT = 4;
export const SPACE_TIMES = (multiple?: number) =>
  `${SPACE_UNIT * (multiple || 1)}px`;
export const SPACE = SPACE_TIMES(1); // 4
export const SPACE_XS = SPACE_TIMES(2); // 8
export const SPACE_SM = SPACE_TIMES(3); // 12
export const SPACE_MD = SPACE_TIMES(4); // 16
export const SPACE_LG = SPACE_TIMES(5); // 20
export const SPACE_XL = SPACE_TIMES(9); // 36 = 16 + 20
export const SPACE_XXL = SPACE_TIMES(14); // 56 = 20 + 36

// color theme:
export const SCBLUE = "#007BFF";
export const MAINBLUE = "#0063f7";
export const LIGHTBLUE = "#EBF0FE";
export const GOOGLEBLUE = "#666eb2";
export const PRIMARY_BACKGROUND_BLUE = "#e6f7ff";
export const SUCCESS_BACKGROUND = "#F6FFED";
export const SUCCESS_PRIMARY = "#52c41a";
export const PENDING_PRIMARY = "#eb2f96";
export const PENDING_BACKGROUND = "#FAF0F6";

/**
 * gray
 * G10 - body background
 * G20 - split line light
 * G30 - split line dark
 * G40 - border
 * G50 - disabled font
 * G60 - light font
 * G70 - secondary font
 * G80 - font
 */
export const WHITE = "#FFFFFF";
export const G10 = "#f8f9fa";
export const G20 = "#e9ecef";
export const G30 = "#dee2e6";
export const G40 = "#ced4da";
export const G50 = "#adb5bd";
export const G60 = "#6c757d";
export const G70 = "#495057";
export const G80 = "#343a40";
export const G90 = "#212529";
export const BLACK = "#000000";
export const RED = "#f44336";

export const UNABLE_USER_SELECT = `
  -webkit-user-select: none !important;
  -moz-user-select: -moz-none !important;
  -ms-user-select: none !important;
  user-select: none !important;
`;

export const DISABLE_TRANSITION = `
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
  transition: none !important;
`;

export const LIGHT_BORDER = ({ scale = 1 }: { scale?: number }) => {
  return `
  border: ${scale * 1}px solid ${G20};
`;
};

export const ACTIVE_BORDER = ({ scale = 1 }: { scale?: number }) => {
  return `
  border: ${scale * 1}px solid ${SCBLUE};
`;
};

export const DEFAULT_BORDER_STYLE = `
  1px solid ${G20};
`;

/**
 * animation:
 */
export const moveFromRightToLeftAnimation = keyframes`
  from {
    transform: translateX(calc(100vw - 100%));
  }
  to {
    transform: translateX(0);
  }
`;

/**
 * font constant styles:
 */
export const FONT_SIZE_BASE = 16;
export const FONT_BODY = FONT_SIZE_BASE * 0.875;

/**
 * element styles:
 */
export const ICON_SIZE = 22;
export const SMALL_ICON_SIZE = 20;

/**
 * signset styles
 */
export const SEAL_IMAGE_WIDTH = 150;
export const SEAL_IMAGE_HEIGHT = 150;

export const SIGN_DATE_WIDTH = 50;
export const SIGN_DATE_HEIGHT = 10;

export const GENERIC_MIN_WIDTH_HEIGHT = 10;
export const TEXT_FIELD_MIN_WIDTH = 20;
export const TEXT_FIELD_MIN_HEIGHT = 10;
export const SIGN_DATE_MIN_WIDTH = 90;
