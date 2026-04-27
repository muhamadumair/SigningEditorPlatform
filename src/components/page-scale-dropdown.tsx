import { ScDropdown, ScDropdownOption } from "../commons/sc-dropdown";
import {
  convertPercentToScale,
  convertScaleToPercent,
} from "../utils/manual-sign-doc.util";
import { Scalable } from "../models/views/generic.model";
import { useTranslation } from "react-i18next";

const pageScaleOptions: ScDropdownOption<string, string>[] = [
  { key: "50%", value: "50%" },
  { key: "75%", value: "75%" },
  { key: "100%", value: "100%" },
  { key: "125%", value: "125%" },
  { key: "150%", value: "150%" },
  { key: "200%", value: "200%" },
  { key: "300%", value: "300%" },
  { key: "400%", value: "400%" }
];

interface PageScaleDropdownProps extends Scalable {
  setScale: (scale: number) => void;
  isDesktop: boolean;
}

export const PageScaleDropdown = ({
  scale,
  isDesktop,
  setScale,
}: PageScaleDropdownProps) => {
  const { t } = useTranslation(["common"]);

  const onScaleChange = (value: string, option: any) => {
    setScale(convertPercentToScale(value));
  };


  return (
    <ScDropdown
      dropdownValue={convertScaleToPercent(scale)}
      dropdownOnChange={onScaleChange}
      tooltipTitle={t("Zoom")!}
      dropdownOptions={pageScaleOptions}
      dropdowncssinjection={`
      width: ${isDesktop ? 100 : 70}px;
      font-size: ${isDesktop  ? 14 : 10}px;
      `}
    />
  );
};
