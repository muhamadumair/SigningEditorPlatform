import { Modal, Space, ModalProps } from "antd";
import TextArea from "antd/lib/input/TextArea";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { MAINBLUE } from "../styles/style.constant";

interface TextFieldModalProps extends ModalProps {
  modalTitle?: string;
  textAreaValue?: string;
  onTextAreaChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  textAreaStyle?: React.CSSProperties;
  fieldType: any;
  warningSentence: string;
}

export const TextFieldModal = ({
  modalTitle,
  open,
  onOk,
  onCancel,
  destroyOnClose = true,
  afterClose,
  textAreaValue,
  textAreaStyle = { height: 120, resize: "none" },
  onTextAreaChange,
  fieldType,
  warningSentence
}: TextFieldModalProps) => {
  const { t } = useTranslation(["common"]);

  return (

    <Modal
      title={
        <ModelHolder>
          <Space>
            <div>{modalTitle ? modalTitle : t("Text Field")}</div>
          </Space>
        </ModelHolder>
      }
      open={open}
      onOk={onOk}
      cancelText={t("cancel")}
      okText={t("Apply")}
      onCancel={onCancel}
      destroyOnClose={destroyOnClose}
      afterClose={afterClose}
      okButtonProps={{ style: { backgroundColor: MAINBLUE } }}
    >
      <TextArea
        showCount
        value={textAreaValue}
        defaultValue={""}
        style={fieldType === "textfield" ? textAreaStyle : { height: 30, resize: "none" }}
        onChange={onTextAreaChange}
        placeholder={fieldType === "sign" ? t("reason") : t("Textfield")!}
        maxLength={fieldType === "sign" ? 30 : 255}
      />
      {warningSentence}
    </Modal>

  );
};

const ModelHolder = styled.div`
  display: flex;
  align-items: center;
`;
