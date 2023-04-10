import { Divider, Grid, Typography } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import { Alertas, MSelect, MainLayout, MenuLateral } from "~/components";
import { PerfilTable } from "~/components/cazatalento/billboard/PerfilTable";
import { MContainer } from "~/components/layout/MContainer";

const BillboardPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Cazatalentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true}>
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                    <div className="seccion_container col" style={{ paddingTop: 0 }}>
                        <br /><br />
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <Alertas />
                            </div>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography fontWeight={800} sx={{ color: '#069cb1', fontSize: '2rem' }}>Billboard</Typography>
                                    <MContainer direction="horizontal">
                                        <MSelect
                                            id="nombre-proyecto-select"
                                            options={[
                                                { value: 'Nombre de Proyecto', label: 'Nombre de Proyecto' },
                                                { value: 'Nombre de Proyecto 2', label: 'Nombre de Proyecto 2' },
                                                { value: 'Nombre de Proyecto 3', label: 'Nombre de Proyecto 3' }
                                            ]}
                                            className={'form-input-md'}
                                            value={'Nombre de Proyecto'}
                                            onChange={(e) => {
                                                /* onFormChange({
                                                    id_sindicato: parseInt(e.target.value)
                                                }) */
                                            }}
                                            label=''
                                        />
                                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                        <MSelect
                                            id="nombre-personaje-select"
                                            options={[
                                                { value: 'Nombre de personaje', label: 'Nombre de personaje' },
                                                { value: 'Nombre de personaje 2', label: 'Nombre de personaje 2' },
                                                { value: 'Nombre de personaje 3', label: 'Nombre de personaje 3' }
                                            ]}
                                            className={'form-input-md'}
                                            value={'Nombre de personaje'}
                                            onChange={(e) => {
                                                /* onFormChange({
                                                    id_sindicato: parseInt(e.target.value)
                                                }) */
                                            }}
                                            label=''
                                        />
                                    </MContainer>
                                    <Divider style={{ borderWidth: 1, marginTop: '10px' }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <PerfilTable />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export default BillboardPage