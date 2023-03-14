import { type NextPage } from "next";
import Head from "next/head";

import { Header, Pagepiling } from "~/components";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Pagepiling />
    </>
  );
};

export default Home;
