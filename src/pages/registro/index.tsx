import { type NextPage } from "next";
import Head from "next/head";

import { MainLayout, RegistroGeneral } from "~/components";

const Registro: NextPage = () => {


  return (
    <>
      <Head>
        <title>Registro | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <RegistroGeneral />
      </MainLayout>
    </>
  );
};

export default Registro;