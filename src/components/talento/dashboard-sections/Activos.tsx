import { Grid, Skeleton, Typography } from '@mui/material'
import { MContainer } from '~/components/layout/MContainer';
import { SectionTitle } from '~/components/shared';
import { api } from '~/utils/api';
import { useMemo } from 'react';
import { MTable } from '~/components/shared/MTable/MTable';
import { useRouter } from 'next/router';
import MotionDiv from '~/components/layout/MotionDiv';

export const Activos = (props: { id_talento: number, read_only: boolean }) => {
    const router = useRouter();

    const activos = api.talentos.getActivosByIdTalento.useQuery({ id: props.id_talento }, {
        refetchOnWindowFocus: false,
    });
    const loading = activos.isFetching;
    const data = useMemo(() => {
        if (activos.data) {
            console.log('activos_data', activos.data)
            return activos.data;
        }
        return null;
    }, [activos.data]);

    const activos_arr = useMemo(() => {
        let arrays: {
            mascotas: { tipo: string, raza: string, tamanio: string }[],
            vehiculos: { tipo: string, marca: string, modelo: string, color: string, anio: string }[],
            vestuarios: { tipo: string, tipo_especifico: string, descripcion: string }[],
            props: { tipo: string, descripcion: string }[],
            equipos_deportivos: { tipo: string, descripcion: string }[]
        } = {mascotas: [], vehiculos: [], vestuarios: [], props: [], equipos_deportivos: []};
        if (data) {
            arrays = {
                mascotas: data.mascotas.map((m) => {
                    if (m.tipo_mascota) {
                        if (m.id_tipo_mascota === 5 && m.raza_mascota) {
                            return { tipo: m.tipo_mascota.es, raza: m.raza_mascota.es, tamanio: m.tamanio }
                        }
                        return { tipo: m.tipo_mascota.es, raza: 'N/A', tamanio: m.tamanio }
                    }
                    return { tipo: 'N/D', raza: 'N/D', tamanio: 'N/D' };
                }),
                vehiculos: data.vehiculos.map((v) => {
                    if (v.tipo_vehiculo) {
                        return { tipo: v.tipo_vehiculo.es, marca: v.marca, modelo: v.modelo, color: v.color, anio: `${v.anio}` };
                    }
                    return { tipo: 'N/D', marca: 'N/D', modelo: 'N/D', color: 'N/D', anio: 'N/D' };
                }),
                vestuarios: data.vestuario.map((v) => {
                    if (v.tipo_vestuario_especifico && v.tipo_vestuario_especifico.tipo_vestuario) {
                        return { tipo: v.tipo_vestuario_especifico.tipo_vestuario.es, tipo_especifico: v.tipo_vestuario_especifico.es, descripcion: v.descripcion }
                    }
                    return { tipo: 'Otro', tipo_especifico: 'N/A', descripcion: v.descripcion }
                }),
                props: data.props.map((p) => {
                    if (p.tipo_props) {
                        return { tipo: p.tipo_props.es, descripcion: p.descripcion }
                    }
                    return { tipo: 'N/D', descripcion: 'N/D' }
                }),
                equipos_deportivos: data.equipo_deportivo.map((e) => {
                    if (e.tipo_equipo_deportivo) {
                        return { tipo: e.tipo_equipo_deportivo.es, descripcion: e.descripcion }
                    }
                    return { tipo: 'N/D', descripcion: 'N/D' }
                })

            }
            return arrays;
        }
        return arrays;
    }, [data]);

    return (
        <Grid id="activos" container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Activos' onClickButton={(!props.read_only) ? () => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    router.push('/talento/editar-perfil?step=5')
                } : undefined} />
            </Grid>
            <Grid item xs={12}>
                {loading && <Skeleton className={'md-skeleton'} />}
                {!loading && <Typography my={2} fontSize={30} sx={{ color: '#069cb1' }} fontWeight={900}>Mascotas</Typography>}
                <MTable
                    backgroundColorHeader='#069cb1'
                    styleHeaderRow={{ padding: '0px !important' }}
                    styleHeaderTableCell={{ padding: '5px !important' }}
                    columnsHeader={[
                        <Typography key={2} sx={{ color: '#fff', padding: 0 }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Tipo
                        </Typography>,
                        <Typography key={3} sx={{ color: '#fff', padding: 0 }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Raza
                        </Typography>,
                        <Typography key={4} sx={{ color: '#fff', padding: 0 }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Tamaño
                        </Typography>,
                    ]}
                    data={(!loading) ?
                        activos_arr.mascotas
                        :
                        Array.from({ length: 4 }).map((n, i) => {
                            return {
                                tipo: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                raza: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                tamanio: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />
                            }
                        })
                    }
                />
            </Grid>
            <Grid item xs={12} my={2}>
                {loading && <Skeleton className={'md-skeleton'} />}
                {!loading && <Typography my={2} fontSize={30} sx={{ color: '#069cb1' }} fontWeight={900}> Vehiculos</Typography>}
                <MTable
                    backgroundColorHeader='#069cb1'
                    styleHeaderTableCell={{ padding: '5px !important' }}
                    columnsHeader={[
                        <Typography key={2} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Tipo
                        </Typography>,
                        <Typography key={3} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Marca
                        </Typography>,
                        <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Modelo
                        </Typography>,
                        <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Color
                        </Typography>,
                        <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Año
                        </Typography>,
                    ]}
                    data={(!loading) ?
                        activos_arr.vehiculos
                        :
                        Array.from({ length: 4 }).map((n, i) => {
                            return {
                                tipo: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                marca: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                modelo: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                color: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                anio: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                            }
                        })
                    }
                />
            </Grid>
            <Grid item xs={12} my={2}>
                {loading && <Skeleton className={'md-skeleton'} />}
                {!loading && <Typography my={2} fontSize={30} sx={{ color: '#069cb1' }} fontWeight={900}>Vestuarios</Typography>}
                <MTable
                    backgroundColorHeader='#069cb1'
                    styleHeaderTableCell={{ padding: '5px !important' }}
                    columnsHeader={[
                        <Typography key={2} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Tipo
                        </Typography>,
                        <Typography key={3} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Tipo Especifico
                        </Typography>,
                        <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Descripcion
                        </Typography>,
                    ]}
                    data={(!loading) ?
                        activos_arr.vestuarios
                        :
                        Array.from({ length: 4 }).map((n, i) => {
                            return {
                                tipo: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                tipo_especifico: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                descripcion: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                            }
                        })
                    }
                />
            </Grid>
            <Grid item xs={12} my={2}>
                {loading && <Skeleton className={'md-skeleton'} />}
                {!loading && <Typography my={2} fontSize={30} sx={{ color: '#069cb1' }} fontWeight={900}>Props</Typography>}
                <MTable
                    backgroundColorHeader='#069cb1'
                    styleHeaderTableCell={{ padding: '5px !important' }}
                    columnsHeader={[
                        <Typography key={2} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Tipo
                        </Typography>,
                        <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Descripcion
                        </Typography>,
                    ]}
                    data={(!loading) ?
                        activos_arr.props
                        :
                        Array.from({ length: 4 }).map((n, i) => {
                            return {
                                tipo: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                descripcion: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                            }
                        })
                    }
                />
            </Grid>
            <Grid item xs={12} my={2}>
                {loading && <Skeleton className={'md-skeleton'} />}
                {!loading && <Typography my={2} fontSize={30} sx={{ color: '#069cb1' }} fontWeight={900}>Equipo Deportivo</Typography>}
                <MTable
                    backgroundColorHeader='#069cb1'
                    styleHeaderTableCell={{ padding: '5px !important' }}
                    columnsHeader={[
                        <Typography key={2} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Tipo
                        </Typography>,
                        <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Descripcion
                        </Typography>,
                    ]}
                    data={(!loading) ?
                        activos_arr.equipos_deportivos
                        :
                        Array.from({ length: 4 }).map((n, i) => {
                            return {
                                tipo: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                                descripcion: <Skeleton className="my-2 p-3" key={i} variant="rectangular" height={32} />,
                            }
                        })
                    }
                />
            </Grid>
        </Grid>
    )
}
