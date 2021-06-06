// Layout for index.html, no sidebar

import Head from 'next/head';
import { Provider } from 'react-redux';
import store from "../redux/store"
import Sidebar from "./Sidebar"

const IndexLayout = (props) => (
    <div className="screen-container">
        <div className="page-container">
            <Head>
                <title>SnooPods</title>
                <link rel="stylesheet" href="https://bootswatch.com/4/united/bootstrap.min.css" />
            </Head>
            <div style={{ width: "100%" }}>
                {/* <Provider store={store}> */}
                {props.children}
                {/* </Provider> */}
            </div>
            
        </div>
        <style jsx>
                {`
                .screen-container{
                    display: flex;
                    justify-content: center;
                    max-width: none;
                    padding: 0;
                    margin: 0;
                }
                .page-container{
                    select: focus;
                    textarea: focus;
                    font-size: 16px;
                    
                    display:flex;
                    margin-top:30px;
                    margin-bottom:30px;
                    justify-content: center;
                    flex-direction:row;
                    align-content:center;
                    align-text:center;
                    width: 88%;
                }

                
                `}
            </style>
            <style global jsx>{`
                html,
                body,
                body > div:first-child,
                div#__next,
                div#__next > div {
                    height: 100%;
                }
            `}</style>
    </div>

)
export default IndexLayout;