import Head from 'next/head'
import Image from 'next/image'
import Prices from '../components/prices'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Prueba front-end Jafet Alvarado</title>
        <meta name="description" content="Websocket" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Prices></Prices>
      </main>
    </div>
  )
}
