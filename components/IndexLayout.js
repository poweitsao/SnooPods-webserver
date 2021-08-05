// Layout for index.html, no sidebar

import Head from 'next/head';
import { Provider } from 'react-redux';
import store from "../redux/store"
import Sidebar from "./sidebar/Sidebar"

const IndexLayout = (props) => (
    <div className="screen-container">
        <div className="page-container">
            <Head>
                <title>SnooPods</title>
                <link rel="stylesheet" href="https://bootswatch.com/4/united/bootstrap.min.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"/>
            </Head>
            <div style={{ width: "100%", height: "156%" }}>
                {props.children}
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
                    justify-content: center;
                    flex-direction:row;
                    align-content:center;
                    align-text:center;
                    width: 100%;
                    height: 100%;
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