import { Button, Grid, Link, Skeleton, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { MTable } from "~/components/shared/MTable/MTable";
import { api } from '~/utils/api';
import { useMemo } from 'react';
import { useRouter } from "next/router";

export const InfoGeneral = (props: {id_talento: number}) => {
    const info = api.talentos.getInfoBasicaByIdTalento.useQuery({id: props.id_talento}, {
        refetchOnWindowFocus: false,
    });
    const creditos = api.talentos.getCreditosByIdTalento.useQuery({id: props.id_talento}, {
        refetchOnWindowFocus: false,
    });
    const router = useRouter();

    const loading = info.isFetching || creditos.isFetching;
    const data = useMemo(() => {
        if (info.data) {
            console.log('info_data', info.data)
            return info.data;
        }
        return null;
    }, [info.data]);

    const redes_sociales = useMemo(() => {
        const result: {[red_social: string]: string} = {};
        if (data) {
            data.redes_sociales.forEach(red => {
                result[red.nombre] = red.url;
            })
        }
        return result;
    }, [data]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
                <Image width={400} height={456} src="/assets/img/no-image.png" alt="" /> 
            </Grid>
            <Grid item xs={12} md={7}>
                <MContainer className="ml-5 mt-4" direction="vertical">
                    <MContainer styles={{ alignItems: 'baseline' }} className={`m-1`} direction="horizontal">
                        <p style={{ fontSize: 32, fontWeight: 'bolder' }} className="bold">Información básica</p>
                        <Link href="/talento/editar-perfil" variant="button">
                            <Button onClick={() => { 
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                router.push('/talento/editar-perfil?step=1') 
                            }} size='small' className='ml-2 font-weight-bold color_a' variant="text">Editar</Button>
                        </Link>

                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                       <Typography fontSize={'1.2rem'} fontWeight={300} variant="body1" className="ml-2">{loading ? <Skeleton className="md-skeleton" /> : (data && data.info_basica && data.info_basica.union) ? (data.info_basica.union.id_union === 99) ? data.info_basica.union.descripcion : data.info_basica.union.union.es : 'N/A' }</Typography>
                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                        <p style={{ fontSize: '1.1rem', fontWeight: 100 }}><span className="badge"><Image width={32} height={32} src="/assets/img/iconos/cart_location_blue.svg" alt="" /> </span>  </p>
                        <Typography fontSize={'1.2rem'} fontWeight={300} variant="body1" className="ml-2 mt-2">{loading ? <Skeleton className="md-skeleton" /> : (data && data.info_basica) ? data.info_basica.estado_republica.es : 'N/A' }</Typography>
                    </MContainer>

                    <MContainer className={`m-1`} direction="horizontal">
                        <p style={{ fontSize: '1.1rem', fontWeight: 100 }}><span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icono_web_site_blue.svg" alt="" /> </span>  </p>
                        <Typography fontSize={'1.2rem'} fontWeight={300} variant="body1" className="ml-2 mt-2">{loading ? <Skeleton className="md-skeleton" /> : (redes_sociales['pagina_web']) ? redes_sociales['pagina_web'] : 'N/A' }</Typography>
                    </MContainer>
                    <MContainer className={`m-1`} direction='vertical' styles={{maxHeight: 100, width: 140}}>
                        <p className="color_a" style={{ margin: 0, padding: 0,fontSize: '1.3rem', fontWeight: 100 }}><span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icono_regla_blue.svg" alt="" /> </span> Medidas </p>
                        <MContainer styles={{height: 20}} direction="horizontal" justify="space-between">
                            <p className="color_a" style={{ fontSize: '1.2rem', fontWeight: 300 }}>Peso </p>
                            <p style={{ fontSize: '1.2rem', fontWeight: 500 }} className="ml-4">{(data && data.info_basica) ? `${data.info_basica.peso} kg` : 'N/A'}</p>
                        </MContainer>
                        <MContainer direction="horizontal" justify="space-between" styles={{maxHeight: 28}}>
                            <p className="color_a" style={{ fontSize: '1.2rem', fontWeight: 300 }}>Altura </p>
                            <p style={{ fontSize: '1.2rem', fontWeight: 500 }} className="ml-4">{(data && data.info_basica) ? `${data.info_basica.altura} m` : 'N/A'}</p>
                        </MContainer>
                    </MContainer>
                    <MContainer className="mt-2 mb-4" direction="horizontal">
                        <Button className="color_a" style={{
                            borderRadius: 16,
                            borderWidth: 3,
                            width: 200
                        }} variant="outlined">Descargar CV</Button>
                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                        <>
                            {redes_sociales['vimeo'] != null &&
                                <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['twitter'] &&
                                <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['youtube'] &&
                                <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_youtube_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['linkedin'] &&
                                <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['instagram'] &&
                                <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_insta_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['imdb'] &&
                                <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icon_imbd_blue.svg" alt="" /> </span>
                            }
                        </>
                    </MContainer>
                </MContainer>
            </Grid>
            <Grid item xs={12}>

                <MContainer direction="vertical" styles={{ marginTop: 40 }}>
                    <Typography sx={{ color: '#069CB1' }} fontWeight={600}>Acerca de</Typography>

                    <Typography>
                        {data?.info_basica?.biografia}
                    </Typography>
                    <>
                    
                        {creditos.data && creditos.data.creditos.filter(c => c.destacado).length > 0 &&
                            <>
                            
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
                                    data={(creditos.data) ? creditos.data.creditos.filter(c => c.destacado).map(c => {
                                        return {
                                            tipo_video: c.titulo,
                                            rol: c.rol,
                                            nombre: c.director,
                                            anio: c.anio,
                                            accion: 'Reproducir'
                                        }
                                    }) : []}
                                />
                            </>
                        }
                    </>

                </MContainer>
            </Grid>
        </Grid>
    )
}
