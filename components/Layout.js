import PageMeta from "./PageMeta";

export default function Layout({ children, title }) {

    return(
        <>
            <PageMeta title={title}/>
            {children}
        </>
    )
}