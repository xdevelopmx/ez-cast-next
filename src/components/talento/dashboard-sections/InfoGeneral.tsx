import { Button, Grid, Link, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { MTable } from "~/components/shared/MTable/MTable";

export const InfoGeneral = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
                <Image width={400} height={512} src="/assets/img/no-image.png" alt="" /> 
            </Grid>
            <Grid item xs={12} md={7}>
                <MContainer className="ml-5 mt-5" direction="vertical">
                    <MContainer styles={{ alignItems: 'baseline' }} className={`m-1`} direction="horizontal">
                        <p style={{ fontSize: 22 }} className="bold">Información básica</p>
                        <Link href="/talento/editar-perfil" variant="button">
                            <Button size='small' className='ml-2 font-weight-bold color_a' variant="text">Editar</Button>
                        </Link>

                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                        <p style={{ fontSize: '1.1rem', fontWeight: 100 }}>Unión: </p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 300 }} className="ml-2">Unión</p>
                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                        <p style={{ fontSize: '1.1rem', fontWeight: 100 }}><span className="badge"><Image width={16} height={16} src="/assets/img/iconos/chair_dir_blue.svg" alt="" /> </span> Ubicación </p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 300 }} className="ml-2">Ubicación</p>
                    </MContainer>

                    <MContainer className={`m-1`} direction="horizontal">
                        <p style={{ fontSize: '1.1rem', fontWeight: 100 }}><span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icono_web_site_blue.svg" alt="" /> </span> Pagina Web </p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 300 }} className="ml-2">Unión</p>
                    </MContainer>
                    <MContainer className={`m-1`} direction='vertical'>
                        <p style={{ fontSize: '1.1rem', fontWeight: 100 }}><span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icono_regla_blue.svg" alt="" /> </span> Medidas </p>
                        <MContainer direction="horizontal">
                            <p style={{ fontSize: '1.1rem', fontWeight: 100 }}>Peso: </p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 300 }} className="ml-4">Unión</p>
                        </MContainer>
                        <MContainer direction="horizontal">
                            <p style={{ fontSize: '1.1rem', fontWeight: 100 }}>Altura: </p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 300 }} className="ml-4">Unión</p>
                        </MContainer>
                    </MContainer>
                    <MContainer className={`m-2`} direction="horizontal">
                        <div className="bordeado-azul-pildora pen">
                            <p className="m-1 color-azul bold ta-center m0 .pen">Descargar CV</p>
                        </div>
                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                        <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="" /> </span>
                        <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="" /> </span>
                        <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_youtube_blue.svg" alt="" /> </span>
                        <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="" /> </span>
                        <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_insta_blue.svg" alt="" /> </span>
                        <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_imbd_blue.svg" alt="" /> </span>
                    </MContainer>
                </MContainer>
            </Grid>
            <Grid item xs={12}>

                <MContainer direction="vertical" styles={{ marginTop: 40 }}>
                    <Typography sx={{ color: '#069CB1' }} fontWeight={600}>Acerca de</Typography>

                    <Typography>
                        Descripción agregada por el talento contado un poco más sobre el O sobre ella y algo unico sobre su experiencia o talento.<br />
                        Descripción agregada por el talento contado un poco más sobre el O sobre ella y algo unico sobre su experiencia o talento.
                    </Typography>

                    <MContainer direction="horizontal" styles={{ alignItems: 'center', marginTop: 20 }}>
                        <Image
                            src="/assets/img/iconos/icon_estrella_dorada.svg"
                            width={20}
                            height={20}
                            alt="estrella"
                        />
                        <Typography sx={{ color: '#069CB1', marginLeft: 1 }} fontWeight={600}>
                            Créditos destacados
                        </Typography>
                    </MContainer>

                    <MTable
                        backgroundColorData="#EBEBEB"
                        data={[
                            {
                                tipo_video: 'Corto Talent Corner',
                                rol: 'Protagonista',
                                nombre: 'Bernardo Gómez',
                                anio: '2020',
                                accion: 'Reproducir'
                            },
                            {
                                tipo_video: 'Corto Talent Corner',
                                rol: 'Protagonista',
                                nombre: 'Bernardo Gómez',
                                anio: '2020',
                                accion: 'Reproducir'
                            }
                        ]}
                    />

                </MContainer>
            </Grid>
        </Grid>
    )
}
