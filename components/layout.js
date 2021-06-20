import Head from 'next/head';
import { Provider } from 'react-redux';
import store from "../redux/store"
import Sidebar from "./sidebar/Sidebar"
import useSWR, { SWRConfig } from 'swr'
import fetch from "isomorphic-unfetch"
// import withRedux from "next-redux-wrapper"
import SimpleBar from 'simplebar-react';
const Layout = (props) => (
    
        
        <div className="screen-container">
            <Head>
                <title>SnooPods</title>
                <link rel="stylesheet" href="https://bootswatch.com/4/united/bootstrap.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,700;1,700&family=Roboto:wght@700&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,700;1,700&family=Roboto:wght@700&display=swap" rel="stylesheet"></link>

                {/* <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:wght@700&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"></link> */}
            </Head>
            <SWRConfig value={{fetcher: (url) => fetch(url).then((r) => r.json())}}>
                
                    <div style={{ width: "100%", height: "100%" }}>
                        {/* <Provider store={store}> */}
                        {/* <Provider store={QueueStore} > */}
                            {props.children}
                        {/* </Provider> */}
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
// const makeStore = () => QueueStore;

//withRedux wrapper that passes the store to the App Component
// export default withRedux(makeStore)(Layout);

export default Layout;