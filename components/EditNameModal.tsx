import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button"


const EditNameModal = (props) => {
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Please pick a new name for your collection.
          </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
                Edit name here
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditNameModal