import { Button, Grid, Link, Skeleton, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { MTable } from "~/components/shared/MTable/MTable";
import { api } from '~/utils/api';
import { useMemo } from 'react';

export const InfoGeneral = (props: {id_talento: number}) => {
    const info = api.talentos.getInfoBasicaByIdTalento.useQuery({id: props.id_talento});
    const creditos = api.talentos.getCreditosByIdTalento.useQuery({id: props.id_talento});

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
                        <Typography fontSize={'0.9rem'} fontWeight={300} variant="body1" className="ml-2">{loading ? <Skeleton width={150} /> : (data && data.info_basica && data.info_basica.union) ? (data.info_basica.union.id_union === 99) ? data.info_basica.union.descripcion : data.info_basica.union.union.es : 'N/A' }</Typography>
                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                        <p style={{ fontSize: '1.1rem', fontWeight: 100 }}><span className="badge"><Image width={16} height={16} src="/assets/img/iconos/chair_dir_blue.svg" alt="" /> </span> Ubicación </p>
                        <Typography fontSize={'0.9rem'} fontWeight={300} variant="body1" className="ml-2">{loading ? <Skeleton width={150} /> : (data && data.info_basica) ? data.info_basica.estado_republica.es : 'N/A' }</Typography>
                    </MContainer>

                    <MContainer className={`m-1`} direction="horizontal">
                        <p style={{ fontSize: '1.1rem', fontWeight: 100 }}><span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icono_web_site_blue.svg" alt="" /> </span> Pagina Web </p>
                        <Typography fontSize={'0.9rem'} fontWeight={300} variant="body1" className="ml-2">{loading ? <Skeleton width={150} /> : (redes_sociales['pagina_web']) ? redes_sociales['pagina_web'] : 'N/A' }</Typography>
                    </MContainer>
                    <MContainer className={`m-1`} direction='vertical'>
                        <p style={{ fontSize: '1.1rem', fontWeight: 100 }}><span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icono_regla_blue.svg" alt="" /> </span> Medidas </p>
                        <MContainer direction="horizontal">
                            <p style={{ fontSize: '1.1rem', fontWeight: 100 }}>Peso: </p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 300 }} className="ml-4">{(data && data.info_basica) ? data.info_basica.peso : 'N/A'}</p>
                        </MContainer>
                        <MContainer direction="horizontal">
                            <p style={{ fontSize: '1.1rem', fontWeight: 100 }}>Altura: </p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 300 }} className="ml-4">{(data && data.info_basica) ? data.info_basica.altura : 'N/A'}</p>
                        </MContainer>
                    </MContainer>
                    <MContainer className={`m-2`} direction="horizontal">
                        <div className="bordeado-azul-pildora pen">
                            <p className="m-1 color-azul bold ta-center m0 .pen">Descargar CV</p>
                        </div>
                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                        <>
                            {redes_sociales['vimeo'] != null &&
                                <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['twitter'] &&
                                <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['youtube'] &&
                                <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_youtube_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['linkedin'] &&
                                <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['instagram'] &&
                                <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_insta_blue.svg" alt="" /> </span>
                            }
                            {redes_sociales['imdb'] &&
                                <span className="badge"><Image width={16} height={16} src="/assets/img/iconos/icon_imbd_blue.svg" alt="" /> </span>
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
