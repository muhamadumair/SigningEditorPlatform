import { signSetFieldType } from "../../../models/views/signset.model";
import { ImageBasedWidgetProps } from "../../../commons/image-based-widget";
import { TextFieldWidget } from "../../../commons/text-field-widget";
import React from "react";
import { useSelector } from "react-redux";
import { ManualSignReducerRootState } from "../reducer";
import { selectSignsetTextFieldById } from "../reducer/selectors/signsets-details.selector";
import { MSPImageWidget } from "./msp-image-widget";
import { WidgetIconBox } from "../../../commons/widget-icon-box";
import {  selectDocumentDetailsScale } from "../reducer/selectors/documents-details.selector";
import { useTranslation } from "react-i18next";

interface MSPDocWorkboardWidgetProps extends ImageBasedWidgetProps {
  id: string;
  isselectedwidget: boolean;
  fieldType: keyof typeof signSetFieldType;
  onClickEdit: () => void;
  onClickEditSignature: () => void;
  signatureSrc: string;
  sealSrc: string;
  dataPageNumber: number;
  setAcknowledgeReason: (acknowledge: boolean) => void;
  acknowledgeReason: any;
}

export const MSPDocWorkboardWidget = React.forwardRef<
  HTMLInputElement,
  MSPDocWorkboardWidgetProps
>(
  (
    {
      id,
      fieldType,
      width,
      height,
      signatureSrc,
      sealSrc,
   
    }: MSPDocWorkboardWidgetProps,
    textfieldParentRef: any
  ) => {
    const { t } = useTranslation(["common"]);

    const signsetTextFieldValue = useSelector(
      (state: ManualSignReducerRootState) =>
        selectSignsetTextFieldById(state, id)
    );

    const scale = useSelector((state: ManualSignReducerRootState) =>
      selectDocumentDetailsScale(state)
    );


    switch (fieldType) {
      case signSetFieldType.signdate:
        return <div style={{ fontWeight: "bold" }}>{t("Sign Date")}</div>;

      case signSetFieldType.sign:
        return (
          <>
            {signatureSrc === "" ?
              <WidgetIconBox
                scale={scale}
                fieldType={fieldType}
                showBorder={false}
                height={height}
              />
              :
              <MSPImageWidget
                src={signatureSrc}
                width={width}
                height={height}
                scale={scale}
                fieldType={signSetFieldType.sign}
              />
            }

          </>
        );

      case signSetFieldType.seal:
        return (
          <MSPImageWidget
            src={sealSrc}
            width={width}
            height={height}
            scale={scale}
            fieldType={signSetFieldType.seal}
          />
        );

      case signSetFieldType.textfield:
        return (
          <>
            {signsetTextFieldValue === "" ? (
              <WidgetIconBox
                scale={scale}
                fieldType={fieldType}
                showBorder={false}
                height={height}
              />
            ) : (
              <TextFieldWidget
                scale={scale}
                textfieldValue={signsetTextFieldValue}
                ref={textfieldParentRef}
              />
            )}
          </>
        );
      default:
        return fieldType;
    }
  }
);
