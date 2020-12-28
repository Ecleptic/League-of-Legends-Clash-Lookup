import '../styles/globals.css'
import Router from 'next/router'
import { useState, useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(false);

    // Listen to loading start/end events
    useEffect(() => {
        const start = () => setLoading(true);
        const end = () => setLoading(false);

        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);
        Router.events.on("routeChangeError", end);

        // Cleanup: Stop listening to the events
        return () => {
            Router.events.off("routeChangeStart", start);
            Router.events.off("routeChangeComplete", end);
            Router.events.off("routeChangeError", end);
        }
    }, []); // No dependecy list

    // Show loading Text between pages
    return (
        <>
            {loading ? (
                <h1> Loading...</h1>
            ) : (
                <Component {...pageProps} />
            )}
        </>
    )
}

