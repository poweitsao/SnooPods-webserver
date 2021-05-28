import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button"
import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { trigger } from 'swr'
import { UserSessionStore } from '../redux/store'


const EditNameModal = (props) => {

    const {runonsubmit, name, onHide, show} = props 
    const [newName, setNewName] = useState(name)
    

    const handleInputChange = (event) => {
        
        const { value } = event.target
        setNewName(value)
        
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (runonsubmit == undefined){
            console.log("runOnSubmit is undefined")
            console.log("submitting new name", newName)

        }else{
            await runonsubmit(newName)
            trigger("/api/user/collections/getCollections/"+ UserSessionStore.getState().email)
        }
    }

    return (
        <Modal
            show={show} 
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Please pick a new name for your collection.
          </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
                <Form onSubmit={handleSubmit} autoComplete="off">
                    <Row >
                        <Form.Group as={Col} controlId="formGridFirstName">
                            <Form.Label>New Collection Name</Form.Label>
                            <Form.Control name="newCollectionName" type="name" defaultValue={name} onChange={handleInputChange} />
                        </Form.Group>
                    </Row>
                    
                    <Modal.Footer style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Button onClick={props.onHide}>Close</Button>
                        <Button variant="primary" type="submit" onClick={props.onHide}>
                            Submit
                        </Button>
                    </Modal.Footer>

                </Form>

            </Modal.Body>
            
        </Modal>
    )
}

export default EditNameModal