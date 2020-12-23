import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SearchBar } from '../components/searchBar.js'

export default function Home() {

    return (
        <div className={styles.container}>
            <Head>
            <title>Clash Lookup</title>
            <link rel="icon" href="/favicon.ico" />
            </Head>

            
            <main className={styles.main}>
                <img src="ClashTitleTransparent.png" className={styles.logo}></img>
                <SearchBar/>
            </main>
        </div>
  )
}