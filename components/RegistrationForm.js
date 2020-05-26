import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import React, { useState } from 'react';
import Router from "next/router"

class RegisterationForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { firstName: "John", lastName: "Doe" };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    //? this is an event listener
    handleInputChange(event) {
        const { name, value } = event.target
        this.state[name] = value
        console.log(this.state)
    }

    handleSubmit() {
        event.preventDefault();
        console.log("form submitted")
        Router.push("/home")
    }
    // const[firstName, setFirstName] = useState(props.firstName)
    // const[lastName, setLastName] = useState(props.lastName)

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control name="email" type="email" placeholder={this.state.firstName + " " + this.state.lastName} onChange={this.handleInputChange} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Password" onChange={this.handleInputChange} />
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