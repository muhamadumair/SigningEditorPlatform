import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

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

