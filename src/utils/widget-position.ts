import { SignSetDimension } from "../models/views/signset.model";

/**
 * Clamp a widget's top-left corner so it stays fully inside a page.
 * Inputs and output are in unscaled (PDF) coordinate space.
 */
export const clampToPage = (
  point: { left: number; top: number },
  pageRect: { width: number; height: number },
  scale: number,
  size: SignSetDimension,
) => {
  const maxLeft = pageRect.width / scale - size.width;
  const maxTop = pageRect.height / scale - size.height;

  return {
    left: Math.max(0, Math.min(point.left, maxLeft)),
    top: Math.max(0, Math.min(point.top, maxTop)),
  };
};

/**
 * Convert a viewport-space cursor position into the equivalent unscaled
 * coordinate inside a page rect.
 */
export const toUnscaledPagePoint = (
  cursor: { x: number; y: number },
  pageRect: { left: number; top: number },
  scale: number,
) => ({
  left: Math.round(cursor.x - pageRect.left) / scale,
  top: Math.round(cursor.y - pageRect.top) / scale,
});
