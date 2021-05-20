import Head from 'next/head';
import { Provider } from 'react-redux';
import store from "../redux/store"
import Sidebar from "../components/Sidebar"
import useSWR, { SWRConfig } from 'swr'
import fetch from "isomorphic-unfetch"

const Layout = (props) => (
    
        
        <div className="screen-container">
            <Head>
                <title>SnooPods</title>
                <link rel="stylesheet" href="https://bootswatch.com/4/united/bootstrap.min.css" />
            </Head>
            <SWRConfig value={{fetcher: (...args) => fetch(...args).then(res => res.json())}}>
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
            </SWRConfig>
        </div>
    

)
export default Layout;