import { Row, Col, Form } from 'react-bootstrap/'
// import Col from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import React, { useState } from 'react';
import Router from "next/router"
import { RegisterStore } from "../redux/store"
import Cookie from "js-cookie"



class RegisterationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { firstName: "", lastName: "", email: "" };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // componentWillMount() {

    // }
    componentDidMount() {

        // console.log("store: ", RegisterStore.getState())
        const store = RegisterStore.getState()
        console.table(store.payload)
        const userPayload = store.payload
        const userID = store.userID

        // console.log(userPayload)
        if (userPayload) {
            this.setState(
                { userID: userID, userPayload: userPayload, firstName: userPayload.given_name, lastName: userPayload.family_name, email: userPayload.email, picture_url: userPayload.picture }
            )
        }
        else {
            Router.push("/")
        }
    }

    //? this is an event listener
    handleInputChange(event) {
        const { name, value } = event.target
        this.state[name] = value
        console.log(this.state)
    }

    async handleSubmit(email, firstName, lastName, picture_url) {
        event.preventDefault();
        console.log("form submitted")
        let user = {
            firstName: firstName,
            lastName: lastName,
            picture_url: picture_url,
            email: email
        }
        let response = await fetch("/api/user/register", {
            method: "POST", body: JSON.stringify(user)
        })
        // console.log("post request response: ", response)
        if (response.status == 201) {
            let res = await response.json()
            if (res.registeration_complete) {
                Cookie.set("session_id", res.session_id)
                Cookie.set("email", res.email)
                Router.push("/home")

            }
        }
    }

    render() {
        return (
            <div>
                <div style={{ padding: "10px", display: "flex", justifyContent: "center" }}>
                    <img width="70px" src={this.state.picture_url} />
                </div>
                <Form onSubmit={() => { this.handleSubmit(this.state.email, this.state.firstName, this.state.lastName, this.state.picture_url) }}>
                    <Row >
                        <Form.Group as={Col} controlId="formGridFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control name="firstName" type="name" defaultValue={this.state.firstName} onChange={this.handleInputChange} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridFirstName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control name="lastName" type="name" defaultValue={this.state.lastName} onChange={this.handleInputChange} />
                        </Form.Group>
                    </Row>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control name="email" type="email" defaultValue={this.state.email} onChange={this.handleInputChange} disabled={true} />
                        <Form.Text className="text-muted">
                            You are logging in with Google, so we'll use your Google Email address.
              </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" >
                        Submit
            </Button>
                </Form>
            </div>
        )
    }
}

export default RegisterationForm