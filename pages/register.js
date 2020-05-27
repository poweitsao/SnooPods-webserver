import Layout from "../components/layout"
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import RegisterationForm from "../components/RegistrationForm"
import store from "../redux/store"
import Router from "next/router"


const register = () => {
  // // const [showMe, setShowMe] = useState(false);
  // // const [subreddit, setSubreddit] = useState("")
  // // const [podcast, setPodcast] = useState("")
  // // console.log(store.getState())
  // const userPayload = store.getState().userInfo.payload
  // // console.log("userPayload", userPayload)

  // const [firstName, setFirstName] = useState("")
  // const [lastName, setLastName] = useState("")
  // const [email, setEmail] = useState("")
  // if (!userPayload) {
  //   useEffect(() => {
  //     Router.push('/')
  //     // } else {
  //     //   console.log(userPayload)
  //     //   setFirstName(userPayload.given_name)
  //     //   setLastName(userPayload.family_name)
  //     //   setEmail(userPayload.email)
  //     //   console.log("email: ", email)
  //     //   console.log("firstName: ", firstName)


  //     // }

  //   })
  // } else {
  //   useEffect(() => {
  //     console.log(userPayload)
  //     setFirstName(userPayload.given_name)
  //     setLastName(userPayload.family_name)
  //     setEmail(userPayload.email)
  //     console.log("email: ", email)
  //     console.log("firstName: ", firstName)
  //   })

  // }



  return (
    <Layout>
      <div className="container">
        <div className="heading">
          <h1> Register here, new user</h1>
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