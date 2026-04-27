import { useTranslation } from "react-i18next";
import { LIGHTBLUE } from "../styles/style.constant";
import { ScToolbarButton } from "./sc-toolbar-button";
import { MenuUnfoldOutlined } from "@ant-design/icons";

export const ThumbnailButton = ({
  onClick,
  margin = "",
  disabled,
  isDesktop
}: {
  onClick?: React.MouseEventHandler<HTMLElement>;
  margin?: string;
  disabled?: boolean;
  isDesktop?: boolean;
}) => {
  const { t } = useTranslation(["common"]);

  return (
    <ScToolbarButton
      icon={<MenuUnfoldOutlined />}
      iconSize={16}
      activeIconSize={18}
      tooltipTitle={t("thumbnail")!}
      tooltipPlacement="left"
      disabled={disabled}
      onClick={onClick}
      hoverBackground={LIGHTBLUE}
      margin={margin}
    />
  );
};
