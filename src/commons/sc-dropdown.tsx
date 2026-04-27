import { Select, Tooltip } from "antd";
import styled from "styled-components";
import { MAINBLUE } from "../styles/style.constant";
import { ScTooltip } from "../commons/sc-tooltip";
import React, { useState } from "react";
import { TooltipPlacement } from "antd/es/tooltip";

const { Option } = Select;

export interface ScDropdownOption<K, V> {
  key: K;
  value: V;
}

export interface ScDropdownProps<K, V> {
  dropdowncssinjection?: string;
  dropdownOnChange: (value: any, option: any) => void;
  dropdownOptions: ScDropdownOption<K, V>[];
  dropdownValue: K;
  tooltipTitle?: string;
  tooltipPlacement?: TooltipPlacement;
}

interface SelectProps {
  selectcssinjection?: string;
}

export function ScDropdown<K extends React.Key | null | undefined, V>({
  tooltipTitle = "",
  tooltipPlacement = "bottom",
  dropdownValue,
  dropdownOptions,
  dropdowncssinjection = "",
  dropdownOnChange,
}: ScDropdownProps<K, V>) {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  return (
    <>
      <ScTooltip
        placement={tooltipPlacement}
        open={tooltipOpen}
        onOpenChange={(open) => {
          if (selectOpen) {
            setTooltipOpen(false);
          } else {
            setTooltipOpen(open);
          }
        }}
        title={tooltipTitle}
      >
        <StyleSelect
          selectcssinjection={dropdowncssinjection}
          value={dropdownValue}
          bordered={false}
          onChange={dropdownOnChange}
          onDropdownVisibleChange={(open: boolean) => {
            setSelectOpen(open);
            setTooltipOpen(false);
          }}
        >
          {dropdownOptions.map((option) => {
            return (

              <Option key={option.key} value={option.key}>
                <Tooltip title={option.value as string}>
                  {option.value as string}
                </Tooltip>
              </Option>

            );
          })}
        </StyleSelect>
      </ScTooltip>
    </>
  );
}

const StyleSelect = styled(Select) <SelectProps>`
  &:hover {
    color: ${MAINBLUE};
  }
  ${(p) => p.selectcssinjection}
`;
