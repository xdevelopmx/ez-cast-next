import { Grid, Typography } from "@mui/material";
import Head from "next/head";
import Image from 'next/image';
import { Alertas, MainLayout, MenuLateral, FormGroup } from "~/components";


const NuevoHorarioAgendaVirtual = () => {
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
                                    <Grid container item columns={12}>
                                        <Grid item md={1} textAlign={'center'}>
                                            <Image src="/assets/img/iconos/agenda.svg" width={50} height={50} style={{margin: '15px 0 0 0', filter: 'invert(43%) sepia(92%) saturate(431%) hue-rotate(140deg) brightness(97%) contrast(101%)'}} alt="" />
                                        </Grid>
                                        <Grid item md={11}>
                                            <Typography fontWeight={800} sx={{ color: '#069cb1', fontSize: '2rem' }}>Agenda Virtual</Typography>
                                            <Typography fontWeight={600} sx={{ color: '#000', fontSize: '`.7rem' }}>La organización es la base de un buen proyecto, ¡Comencemos!</Typography>
                                        </Grid>
                                        
                                    </Grid>
								</Grid>
                                <Grid container item xs={20} sx={{ padding: '5px 10px', margin: '45px 0 4px', border: '1px solid #069cb1', borderRadius: '10px' }} columns={18}>
                                    <Grid container item xs={20} sx={{ padding: '5px 10px', margin: '4px 0', borderBottom: '1px solid #069cb1', borderRadius: '10px' }} columns={18}>
                                        <div style={{display: 'block'}}>
                                            <FormGroup
                                                className={'form-input-md'}
                                                labelClassName={'form-input-label'}
                                                labelStyle={{ fontWeight: 400 }}
                                                label='Nombre de horario'
                                            />
                                            <p style={{color: '#069cb1'}}>
                                                Para tu control interno. No será visto por talento o representantes.
                                            </p>
                                        </div>
                                    </Grid>
                                    <Grid container item xs={20} sx={{ padding: '5px 10px', margin: '4px 0', borderBottom: '1px solid #069cb1', borderRadius: '10px' }} columns={18}>
                                        <div style={{display: 'block'}}>
                                            <FormGroup
                                                type="radio"
                                                className={'form-input-md'}
                                                labelClassName={'form-input-label'}
                                                labelStyle={{ fontWeight: 400 }}
                                                label='Fecha audición'
                                            />
                                        </div>
                                    </Grid>
                                </Grid>						
							</Grid>
						</div>
					</div>
                </div>
            </MainLayout>
        </>

    )
}

export default NuevoHorarioAgendaVirtual