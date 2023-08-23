import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout, RestablecerContrasenaComponent } from "~/components";

const RestablecerContrasena: NextPage = () => {
  return (
    <>
      <Head>
        <title>Restablecer contraseña | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <RestablecerContrasenaComponent />
      </MainLayout>
    </>
  );
};

export default RestablecerContrasena;
