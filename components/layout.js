import Head from 'next/head';
import { Provider } from 'react-redux';
import store from "../redux/store"
import Sidebar from "../components/Sidebar"

const Layout = (props) => (
    
        
        <div className="screen-container">
            <Head>
                <title>SnooPods</title>
                <link rel="stylesheet" href="https://bootswatch.com/4/united/bootstrap.min.css" />
            </Head>
            <div style={{ width: "100%", height: "100%" }}>
                {/* <Provider store={store}> */}
                {props.children}
                {/* </Provider> */}
            </div>
            
        
            <style jsx>
                {`
                .screen-container{
                    display: flex;
                    justify-content: center;
                    max-width: none;
                    padding: 0px;
                    margin: 0px;
                    select: focus;
                    textarea: focus;
                    font-size: 16px;
                    width: 100%;
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
export default Layout;