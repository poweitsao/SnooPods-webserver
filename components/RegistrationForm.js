import { Row, Col, Form } from 'react-bootstrap/'
// import Col from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import React, { useState } from 'react';
import Router from "next/router"
import store from "../redux/store"
import Cookie from "js-cookie"



class RegisterationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { firstName: "", lastName: "", email: "" };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        console.log("store: ", store.getState())
        const userPayload = store.getState().userInfo.payload
        const userID = store.getState().userInfo.userID

        // console.log(userPayload)
        if (userPayload) {
            this.setState(
                { userID: userID, userPayload: userPayload, firstName: userPayload.given_name, lastName: userPayload.family_name, email: userPayload.email }
            )
        }
    }
    componentDidMount() {
        if (!this.state.firstName) {
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

            <Form onSubmit={() => { this.handleSubmit(this.state.email, this.state.firstName, this.state.lastName, this.state.userPayload.picture) }}>
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
                    <Form.Control name="email" type="email" defaultValue={this.state.email} onChange={this.handleInputChange} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
              </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit" >
                    Submit
            </Button>
            </Form>
        )
    }
}

export default RegisterationForm