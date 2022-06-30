import Head from "next/head";

export default function PageMeta({ title, desc }) {

    return(
        <Head>
            <title>{title ? title : "Home"} | Foxtrot Swap</title>
            <meta name="description" content={desc && desc} />
            <meta name="keywords" content="some,fancy,keywords,for,your,rsps"/>
            <link rel="shortcut icon" type="image/png" href="/img/favicon.png"/>
        </Head>
    )
}