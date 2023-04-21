import { type GetServerSideProps, type NextPage } from 'next'
import Head from 'next/head'
import { Alertas, MainLayout, MenuLateral } from '~/components'
import { motion } from 'framer-motion'
import { getSession, useSession } from 'next-auth/react'
import { TipoUsuario } from '~/enums'
import { type User, type Session } from 'next-auth'
import { Button, Divider, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MContainer } from '~/components/layout/MContainer'
import Link from 'next/link'
import MotionDiv from '~/components/layout/MotionDiv'

type DashboardRepresentante = {
    user: User;
}

const DashboardPage: NextPage<DashboardRepresentante> = ({ user }) => {

    const router = useRouter()
    console.log({ user });

    return (
        <>
            <Head>
                <title>Representante | Talent Corner</title>
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
                            <div className="d-flex">
                                <p className="color_a h4 font-weight-bold mb-0">
                                    <b>Bienvenido, {user?.name}</b>
                                </p>
                            </div>
                            <Grid container>
                                <Grid item xs={12} md={5} sx={{ paddingTop: 3 }}>
                                    <Typography fontWeight={900} sx={{ fontSize: '1.4rem' }}>{user?.name}</Typography>
                                    <div style={{ position: 'relative', width: 500, aspectRatio: '500/720', maxWidth: '100%' }}>
                                        <Image
                                            fill
                                            src={'/assets/img/no-user-image.png'}
                                            style={{ objectFit: 'cover', border: '1px solid #000' }}
                                            alt=""
                                        />
                                    </div>
                                    <Button sx={{ textTransform: 'none' }}>
                                        <Typography sx={{ color: '#069cb1', textDecoration: 'underline' }}>Cambiar foto de perfil</Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={7} sx={{ paddingTop: 8 }}>
                                    <MContainer className="ml-5" direction="vertical">
                                        <MContainer styles={{ alignItems: 'baseline' }} className={`m-1`} direction="horizontal">
                                            <p style={{ fontSize: 30, fontWeight: 900 }}>Información básica</p>
                                            <Button onClick={() => {
                                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                                router.push('/representante/editar-perfil?step=1')
                                            }} size='small' sx={{ textTransform: 'none', fontSize: '1.1rem' }}
                                                className='ml-2 color_a' variant="text">
                                                Editar
                                            </Button>

                                        </MContainer>
                                        <MContainer className={`m-1`} direction="horizontal">
                                            <Typography fontSize={'1.2rem'} fontWeight={300} variant="body1">{/* loading ? <Skeleton className="md-skeleton" /> : (data && data.info_basica && data.info_basica.union) ? (data.info_basica.union.id_union === 99) ? data.info_basica.union.descripcion : data.info_basica.union.union.es : */ 'N/A'}</Typography>
                                        </MContainer>
                                        <MContainer className={`m-1`} direction="horizontal" styles={{ alignItems: 'center' }}>
                                            <p style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem', fontWeight: 100, margin: 0 }}><span className="badge" ><Image width={32} height={32} src="/assets/img/iconos/cart_location_blue.svg" alt="" /> </span>  </p>
                                            <Typography fontSize={'1.2rem'} fontWeight={300} variant="body1">{/* loading ? <Skeleton className="md-skeleton" /> : (data && data.info_basica) ? data.info_basica.estado_republica.es : */ 'N/A'}</Typography>
                                        </MContainer>

                                        <MContainer className={`m-1`} direction="horizontal" styles={{ alignItems: 'center' }}>
                                            <p style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem', fontWeight: 100, margin: 0 }}><span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icono_web_site_blue.svg" alt="" /> </span>  </p>
                                            <Typography fontSize={'1.2rem'} fontWeight={300} variant="body1">{/* loading ? <Skeleton className="md-skeleton" /> : (redes_sociales['pagina_web']) ? redes_sociales['pagina_web'] : */ 'N/A'}</Typography>
                                        </MContainer>

                                        <MContainer className="mt-2 mb-4" direction="horizontal">
                                            <MotionDiv show={true} animation="fade">
                                                <Button
                                                    style={{
                                                        borderRadius: 16,
                                                        borderWidth: 3,
                                                        width: 200,
                                                        textTransform: 'none',
                                                        fontSize: '1.1rem',
                                                        color: '#000',
                                                        fontWeight: 600,
                                                    }}
                                                    onClick={() => {
                                                        /* if (data) {
                                                            window.open(data.info_basica?.media?.url)
                                                        } */
                                                    }}
                                                    variant="outlined"
                                                >
                                                    <Image style={{ marginRight: 10 }} width={20} height={20} src="/assets/img/iconos/documento.svg" alt="" />
                                                    Descargar CV
                                                </Button>
                                            </MotionDiv>
                                        </MContainer>
                                        <MContainer className={`m-1`} direction="horizontal">
                                            <>
                                                {/* redes_sociales['vimeo'] != null && */
                                                    <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="" /> </span>
                                                }
                                                {/* redes_sociales['twitter'] && */
                                                    <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="" /> </span>
                                                }
                                                {/* redes_sociales['youtube'] && */
                                                    <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_youtube_blue.svg" alt="" /> </span>
                                                }
                                                {/* redes_sociales['linkedin'] && */
                                                    <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="" /> </span>
                                                }
                                                {/* redes_sociales['instagram'] && */
                                                    <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_insta_blue.svg" alt="" /> </span>
                                                }
                                                {/* redes_sociales['imdb'] && */
                                                    <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_imbd_blue.svg" alt="" /> </span>
                                                }
                                            </>
                                        </MContainer>
                                    </MContainer>
                                </Grid>
                            </Grid>
                            <Grid container mt={4}>
                                <Grid xs={12}>
                                    <Typography fontWeight={900} sx={{ color: '#069cb1' }}>Acerca de</Typography>
                                    <Typography>
                                        Descripción agregada por el talento contado un poco más sobre el O sobre ella y algo unico sobre su experiencia o talento.
                                        Descripción agregada por el talento contado un poco más sobre el O sobre ella y algo unico sobre su experiencia o talento.
                                    </Typography>
                                </Grid>
                                <Grid xs={12} mt={4}>
                                    <Divider />
                                </Grid>
                                <Grid>
                                    <Typography fontWeight={900}>
                                        Representas
                                        <Typography
                                            fontWeight={900}
                                            component={'span'}
                                            sx={{ padding: '0px 5px', color: '#069cb1' }}>
                                            0
                                        </Typography>
                                        talentos
                                    </Typography>
                                    <Typography>Da click en el botón de Nuevo talento para comenzar a agregar talentos.</Typography>

                                    <Button
                                        className="btn btn-intro btn-price btn_out_line mb-2"
                                        startIcon={
                                            <Image
                                                src={`/assets/img/iconos/cruz_ye.svg`}
                                                height={16}
                                                width={16}
                                                alt={'agregar-rol'}
                                                className='filtro-blanco '
                                            />
                                        }
                                        sx={{
                                            padding: '8px 40px',
                                            marginTop: 0,
                                            marginRight: 10,
                                            fontWeight: 900,
                                            textTransform: 'none',
                                            color: '#000',
                                            backgroundColor: '#f9b233 !important',
                                        }}
                                    >
                                        Nuevo talento
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    /* if (session && session.user) {
        if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
            return {
                props: {
                    user: session.user,
                }
            }
        } 
         return {
            redirect: {
                destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
                permanent: true
            }
        } 
    } */
    /* return {
        redirect: {
            destination: '/',
            permanent: true,
        },
    } */
    return {
        props: {
            user: session?.user,
        }
    }
}

export default DashboardPage