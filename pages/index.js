import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SearchBar } from '../components/searchBar.js'

export default function Home({/* username, totals, winrateArr, roleWinrates, allyBanArr, enemyBanArr */}) {

    return (
        <div className={styles.container}>
            <Head>
            <title>Clash Lookup</title>
            <link rel="icon" href="/favicon.ico" />
            </Head>

            
            <main className={styles.main}>
                <img src="ClashTitle.png"></img>
                <SearchBar></SearchBar>
            </main>
        </div>
  )
}