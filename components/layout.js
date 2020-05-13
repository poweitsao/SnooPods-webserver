import Head from 'next/head';

const Layout = (props) => (
    <div>
        <Head>
            <title>Listen To Reddit</title>
            <link rel="stylesheet" href="https://bootswatch.com/4/flatly/bootstrap.min.css" />
        </Head>
        <div>
            {props.children}
        </div>
        <style jsx>
            {`.container{
                
        }`}
        </style>
    </div>

)
export default Layout;