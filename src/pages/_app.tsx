import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>
          notan
        </title>
        <meta
          name="description"
          content="Conversational Note Taking App"
          key="desc"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
