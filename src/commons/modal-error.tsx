import { Modal, Button } from "antd";
import styled from "styled-components";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
    LIGHT_BORDER,
    SPACE_XL,
    SPACE_XS,
    UNABLE_USER_SELECT,
    WHITE,
} from "../styles/style.constant";

interface ModalErrorProps {
    modalTitle?: string;
    modalDescription: string;
    openModal: boolean;
}

export const ModalError = ({
    modalDescription,
    openModal
}: ModalErrorProps) => {

    return (
        <Modal 
        open={openModal} 
        closable={false}
        footer={[
            <Button key="ok" type="primary">
              OK
            </Button>
          ]}
        >
            <div style={{
                textAlign: "center",
                color: "red",
                fontSize: 50,
                paddingBottom: 10
            }}>
                <ExclamationCircleOutlined />
            </div>
            <div style={{textAlign: "center", fontSize: 15}}><p>{modalDescription}</p></div>
        </Modal>
    );
};

const Wrapper = styled.div`
  position: absolute;
  z-index: 10;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  background: ${WHITE};
  border-radius: ${SPACE_XL};
  ${LIGHT_BORDER({})}
  width: 220px;

  padding: ${SPACE_XS} 0px;
  margin-bottom: ${SPACE_XL};

  ${UNABLE_USER_SELECT};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;

  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    font-size: 16px;
  }
`;
