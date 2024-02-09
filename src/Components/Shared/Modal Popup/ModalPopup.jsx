import { Modal } from "react-bootstrap";

const ModalPopup = (props) => {
  return (
    <>
      <Modal
        show={props.show}
        contentClassName={props.contentClassName}
        dialogClassName={props.dialogClassName + " modal-dialog-centered"}
      >
        {props.children}
      </Modal>
    </>
  );
};

export default ModalPopup;
