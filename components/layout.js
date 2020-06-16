import Head from 'next/head';
import { Provider } from 'react-redux';
import store from "../redux/store"

const Layout = (props) => (
    <div className="container">
        <Head>
            <title>Listen To Reddit</title>
            <link rel="stylesheet" href="https://bootswatch.com/4/united/bootstrap.min.css" />
        </Head>
        <div >
            <Provider store={store}>
                {props.children}
            </Provider>
        </div>
        <style jsx>
            {`.container{
                display:flex;
                justify-content: center;
        }`}
        </style>
    </div>

)
export default Layout;