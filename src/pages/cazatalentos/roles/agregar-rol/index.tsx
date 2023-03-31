import { type NextPage } from 'next'
import Head from 'next/head'
import { MainLayout, MenuLateral } from '~/components'

const AgregarRolPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>DashBoard ~ Cazatalentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true} >
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                </div>
            </MainLayout>
        </>
    )
}

export default AgregarRolPage