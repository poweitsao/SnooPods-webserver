import Layout from "../components/layout"
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import RegisterationForm from "../components/RegistrationForm"
import Router from "next/router"


const register = () => {

  return (
    <Layout>
      <div className="container">
        <div className="heading">
          <h1> Please Register Here</h1>
          {/* <button type="button" className="btn btn-primary" onClick={() => { clickHandler() }}>Play a podcast</button> */}
        </div>
        {/* //! use redux to get user object from login screen */}
        <RegisterationForm />
        <style>{`
      .container{
        margin-top:50px;
        display:flex;
        flex-wrap:wrap;
        flex-direction:column;
        justify-content:center;
        align-content:center;
        align-text:center;
      }
    .button-container{
      margin:20px;
      text-align:center;
    }
    .image{
      -webkit-user-select: none;
      margin: auto;}
      .heading{
        text-align:center;
      }
      .musicPlayer{
        text-align:center;
        padding: 20px;
      }
`}</style>
      </div>
    </Layout >

  )
}

// register.getInitialProps = ({ store }) => (
//   console.log(store)
// )

export default register