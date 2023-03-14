import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";

import { Header, RegistroGeneral } from "~/components";
import Script from "next/script";

const Registro: NextPage = () => {


  return (
    <>
      <Head>
        <title>Registro | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <RegistroGeneral />
    </>
  );
};

export default Registro;