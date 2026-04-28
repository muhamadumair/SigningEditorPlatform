import { useSelector } from "react-redux";
import { ImageBasedWidget } from "../../../commons/image-based-widget";
import { WidgetIconBox } from "../../../commons/widget-icon-box";
import { Scalable } from "../../../models/views/generic.model";
import { signSetFieldType } from "../../../models/views/signset.model";
import { ManualSignReducerRootState } from "../reducer";
import { useState, useEffect } from "react";
import {
  selectDocumentDetailsAllSealApplied,
  selectDocumentDetailsAllSignatureApplied,
} from "../reducer/selectors/documents-details.selector";

interface MSPImageWidgetProps extends Scalable {
  width: number;
  height: number;
  src: string;
  fieldType: keyof typeof signSetFieldType;
}

interface ShowImageProps extends MSPImageWidgetProps {
  show: boolean;
}

export const MSPImageWidget = ({
  width,
  height,
  src,
  fieldType,
  scale,
}: MSPImageWidgetProps) => {
  const allSignatureApplied = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsAllSignatureApplied(state)
  );

  const allSealApplied = useSelector((state: ManualSignReducerRootState) =>
    selectDocumentDetailsAllSealApplied(state)
  );

  const [, setIsAllApplied] = useState<boolean>(false);

  useEffect(() => {
    if (fieldType === "sign") {
      setIsAllApplied(allSignatureApplied);
    } else if (fieldType === "seal") {
      setIsAllApplied(allSealApplied);
    }
  }, [allSignatureApplied, allSealApplied]);

  return (
    <ShowImage
      scale={scale}
      width={width}
      height={height}
      show={src !== ""}
      src={src}
      fieldType={fieldType}
    />)
};

const ShowImage = ({
  show,
  src,
  scale,
  width,
  height,
  fieldType,
}: ShowImageProps) => {
  return show ? (
    <ImageBasedWidget src={src} width={width} height={height} scale={scale} />
  ) : (
    <WidgetIconBox
      scale={scale}
      fieldType={fieldType}
      showBorder={false}
      width={width}
      height={height}
    />
  );
};
