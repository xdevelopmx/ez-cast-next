import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import { Header, Pagepiling } from "~/components";

const Home: NextPage = () => {

  const [pagina, setPagina] = useState(0)

  return (
    <>
      <Head>
        <title>Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header tieneFondoBlanco={pagina !== 0} />
      <Pagepiling onCambiarPagina={pagina => setPagina(pagina)} />
    </>
  );
};

export default Home;
