import { Grid, Skeleton, Typography } from '@mui/material'
import { MContainer } from '~/components/layout/MContainer';
import { SectionTitle } from '~/components/shared';
import { api } from '~/utils/api';
import { useMemo } from 'react';

export const Activos = (props: {id_talento: number}) => {
    const activos = api.talentos.getActivosByIdTalento.useQuery({id: props.id_talento});
    const loading = activos.isFetching;
    const data = useMemo(() => {
        if (activos.data) {
            console.log('activos_data', activos.data)
            return activos.data;
        }
        return null;
    }, [activos.data]);

    const activos_arr = useMemo(() => {
        if (data) {
            const arrays: {
                mascotas: {tipo: string, raza: string, tamanio: string }[],
                vehiculos: {tipo: string, marca: string, modelo: string, color: string, anio: string}[],
                vestuarios: {tipo: string, tipo_especifico: string, descripcion: string}[],
                props: {tipo: string, descripcion: string }[],
                equipos_deportivos: {tipo: string, descripcion: string }[]
            } = {
                mascotas: data.mascotas.map((m) => {
                    if (m.tipo_mascota) {
                            if (m.id_tipo_mascota === 5 && m.raza_mascota) {
                            return {tipo: m.tipo_mascota.es, raza: m.raza_mascota.es, tamanio: m.tamanio }
                        }
                        return {tipo: m.tipo_mascota.es, raza: 'N/A', tamanio: m.tamanio }
                    }
                    return {tipo: 'N/D', raza: 'N/D', tamanio: 'N/D'};
                }),
                vehiculos: data.vehiculos.map((v) => {
                    if (v.tipo_vehiculo) {
                        return {tipo: v.tipo_vehiculo.es, marca: v.marca, modelo: v.modelo, color: v.color, anio: `${v.anio}`};
                    }
                    return {tipo:'N/D', marca: 'N/D', modelo: 'N/D', color: 'N/D', anio: 'N/D'};
                }),
                vestuarios: data.vestuario.map((v) => {
                    if (v.tipo_vestuario_especifico && v.tipo_vestuario_especifico.tipo_vestuario) {
                        return {tipo: v.tipo_vestuario_especifico.tipo_vestuario.es, tipo_especifico: v.tipo_vestuario_especifico.es, descripcion: v.descripcion } 
                    }
                    return {tipo: 'Otro', tipo_especifico: 'N/A', descripcion: v.descripcion }
                }),
                props: data.props.map((p) => {
                    if (p.tipo_props) {
                        return {tipo: p.tipo_props.es, descripcion: p.descripcion }
                    }
                    return {tipo: 'N/D', descripcion: 'N/D'}
                }),
                equipos_deportivos: data.equipo_deportivo.map((e) => {
                    if (e.tipo_equipo_deportivo) {
                        return {tipo: e.tipo_equipo_deportivo.es, descripcion: e.descripcion }
                    }
                    return {tipo: 'N/D', descripcion: 'N/D'}
                })
                
            }
            return arrays;
        }
        return null;
    }, [data]);

    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Activos' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
                {loading &&
                    Array.from({ length: 4 }).map((n, i) => { return <Skeleton className="my-2 p-3" key={i} variant="rectangular"  height={72} />})
                }
                {!loading && activos_arr && 
                    activos_arr.mascotas.map((m, i) => {
                        return (
                            <MContainer key={i} className="my-2 p-3" direction="horizontal" justify='space-between' styles={{ backgroundColor: '#ededed '}}>
                                <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Mascota</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{m.tipo}</Typography>  
                                <Typography fontSize={'1rem'} fontWeight={400}>{m.raza}</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{m.tamanio}</Typography>
                            </MContainer>
                        )
                    })
                }        
                {!loading && activos_arr && 
                    activos_arr.vehiculos.map((v, i) => {
                        return (
                            <MContainer key={i} className="my-2 p-3" direction="horizontal" justify='space-between' styles={{ backgroundColor: '#ededed '}}>
                                <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Vehículo</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{v.tipo}</Typography>  
                                <Typography fontSize={'1rem'} fontWeight={400}>{v.marca}</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{v.modelo}</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{v.color}</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{v.anio}</Typography>
                            </MContainer>
                        )
                    })
                }      
                {!loading && activos_arr && 
                    activos_arr.vestuarios.map((v, i) => {
                        return (
                            <MContainer key={i} className="my-2 p-3" direction="horizontal" justify='space-between' styles={{ backgroundColor: '#ededed '}}>
                                <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Vestuario</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{v.tipo}</Typography>  
                                <Typography fontSize={'1rem'} fontWeight={400}>{v.tipo_especifico}</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{v.descripcion}</Typography>
                            </MContainer>
                        )
                    })
                }      

                {!loading && activos_arr && 
                    activos_arr.props.map((p, i) => {
                        return (
                            <MContainer key={i} className="my-2 p-3" direction="horizontal" justify='space-between' styles={{ backgroundColor: '#ededed '}}>
                                <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Prop</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{p.tipo}</Typography>  
                                <Typography fontSize={'1rem'} fontWeight={400}>{p.descripcion}</Typography>
                            </MContainer>
                        )
                    })
                }   

                {!loading && activos_arr && 
                    activos_arr.equipos_deportivos.map((e, i) => {
                        return (
                            <MContainer key={i} className="my-2 p-3" direction="horizontal" justify='space-between' styles={{ backgroundColor: '#ededed '}}>
                                <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Equipo Deportivo</Typography>
                                <Typography fontSize={'1rem'} fontWeight={400}>{e.tipo}</Typography>  
                                <Typography fontSize={'1rem'} fontWeight={400}>{e.descripcion}</Typography>
                            </MContainer>
                        )
                    })
                }     
            </Grid>
        </Grid>
    )
}
