import Head from 'next/head';
import { Provider } from 'react-redux';
import store from "../redux/store"
import Sidebar from "../components/Sidebar"
import useSWR, { SWRConfig } from 'swr'
import fetch from "isomorphic-unfetch"
// import withRedux from "next-redux-wrapper"

const Layout = (props) => (
    
        
        <div className="screen-container">
            <Head>
                <title>SnooPods</title>
                <link rel="stylesheet" href="https://bootswatch.com/4/united/bootstrap.min.css" />
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