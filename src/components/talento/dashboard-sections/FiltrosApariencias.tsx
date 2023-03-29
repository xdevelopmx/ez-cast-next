import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Link, Skeleton, TextField, Typography } from "@mui/material";
import { useMemo, useState } from 'react';
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { SectionTitle } from "~/components/shared";
import { MTable } from "~/components/shared/MTable/MTable";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import MotionDiv from "~/components/layout/MotionDiv";
import { MedidasDialog } from "../dialogs/MedidasDialog";

export const FiltrosApariencias = (props: {id_talento: number}) => {
    const router = useRouter();
    const [dialog, setDialog] = useState<{opened: boolean, data: Map<string, unknown>}>({opened: true, data: new Map()})
    
    const filtros = api.talentos.getFiltrosAparienciaByIdTalento.useQuery({id: props.id_talento}, {
        refetchOnWindowFocus: false,
    });

    const medidas = api.talentos.getMedidasByIdTalento.useQuery(props.id_talento, {
        refetchOnWindowFocus: false,
    });

    const loading = filtros.isFetching;
    const data = useMemo(() => {
        if (filtros.data) {
            console.log('filtros_data', filtros.data)
            return filtros.data;
        }
        return null;
    }, [filtros.data]);


    const medidas_grouped = useMemo(() => {
        if (medidas.data) {
            const _medidas = [
                {
                    parent: 'Generales', 
                    childrens: [
                        {name: 'Cadera (cm)', value: medidas.data.general_cadera},
                        {name: 'Entrepierna (cm)', value: medidas.data.general_entrepiernas},
                        {name: 'Guantes', value: medidas.data.general_guantes},
                        {name: 'Sombrero', value: medidas.data.general_sombrero},
                    ]
                },
                {
                    parent: 'Hombre', 
                    childrens: [
                        {name: 'Pecho (cm)', value: medidas.data.hombre_pecho},
                        {name: 'Cuello (cm)', value: medidas.data.hombre_cuello},
                        {name: 'Mangas (largo cm)', value: medidas.data.hombre_mangas},
                        {name: 'Saco', value: medidas.data.hombre_saco},
                        {name: 'Playera', value: medidas.data.hombre_playera},
                        {name: 'Calzado (cm)', value: medidas.data.hombre_calzado},
                    ]
                },
                {
                    parent: 'Mujer', 
                    childrens: [
                        {name: 'Vestido', value: medidas.data.mujer_vestido},
                        {name: 'Busto (cm)', value: medidas.data.mujer_busto},
                        {name: 'Copa', value: medidas.data.mujer_copa},
                        {name: 'Cadera (cm)', value: medidas.data.mujer_cadera},
                        {name: 'Playera', value: medidas.data.mujer_playera},
                        {name: 'Pants (cm)', value: medidas.data.mujer_pants},
                        {name: 'Calzado (cm)', value: medidas.data.mujer_calzado},
                    ]
                },
                {
                    parent: 'Niño', 
                    childrens: [
                        {name: 'Niño 4-18 años', value: medidas.data.nino_4_18_anios},
                        {name: 'Niña 4-18 años', value: medidas.data.nina_4_18_anios},
                        {name: 'Toddler (bebé)', value: medidas.data.toddler},
                        {name: 'Bebé (meses)', value: medidas.data.bebe_meses},
                        {name: 'Calzado Niños', value: medidas.data.calzado_ninos},
                    ]
                }
            ]
            return _medidas.filter((entry) => {
                return entry.childrens.filter(child => (child.value))
            })
        }
        return null;
    }, [medidas.data]);

    const tatuajes = useMemo(() => {
        if (data) {
            
            if (data.tatuajes.length > 0) {
                return data.tatuajes.map((t, i) => {
                    const _divider = (i < data.tatuajes.length - 1) ? <Divider className="my-2"/> : null;
                    return (
                        <div key={i}>
                            <Typography fontSize={'1.2rem'} fontWeight={400}>{t.tipo_tatuaje.es}</Typography>  
                            <Typography fontSize={'1rem'} fontWeight={400}>{t.descripcion}</Typography>  
                            {_divider}
                        </div>
                    )
                })
            } else {
                return <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{'N/A' }</Typography>;
            }
        }
        return null;
    }, [data]);

    const piercings = useMemo(() => {
        if (data) {
            
            if (data.piercings.length > 0) {
                return data.piercings.map((t, i) => {
                    const _divider = (i < data.piercings.length - 1) ? <Divider className="my-2"/> : null;
                    return (
                        <div key={i}>
                            <Typography fontSize={'1.2rem'} fontWeight={400}>{t.piercing.es}</Typography>  
                            <Typography fontSize={'1rem'} fontWeight={400}>{t.descripcion}</Typography>  
                            {_divider}
                        </div>
                    )
                })
            } else {
                return <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{'N/A' }</Typography>;
            }
        }
        return null;
    }, [data]);

    return (
        <>
            <Grid container sx={{ mt: 10 }}>
                <Grid item xs={12}>
                    <SectionTitle title='Apariencia' onClickButton={() => { 
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        router.push('/talento/editar-perfil?step=7')  
                    }} />
                </Grid>
                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Rango de edad a interpretar</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? `${data.rango_inicial_edad} a ${data.rango_final_edad}` : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Se identifica como</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.genero) ? data.genero.es : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Interesado en interpretar</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.generos_interesados_en_interpretar.length > 0) ? data.generos_interesados_en_interpretar.map(g => g.genero.es).join(', ') : 'N/A' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Apariencia étnica</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.apariencia_etnica) ? data.apariencia_etnica.nombre : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Color de Cabello</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? data.color_cabello.es : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>


                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Dispuesto a cambiar de color de cabello?</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? (data.disposicion_cambio_color_cabello) ? 'Si' : 'No' : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Estilo de Cabello</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? data.estilo_cabello.es : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Dispuesto a cortar cabello?</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? (data.disposicion_corte_cabello) ? 'Si' : 'No' : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Vello Facial</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? data.vello_facial.es : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Dispuesto a crecer o afeitar vello facial?</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? (data.disposicion_afeitar_o_crecer_vello_facial) ? 'Si' : 'No' : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Color de ojos</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? data.color_ojos.es : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Tatuajes</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    {loading && <Skeleton className="md-skeleton" />}
                    {!loading && tatuajes}
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Piercings</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    {loading && <Skeleton className="md-skeleton" />}
                    {!loading && piercings}
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Gemelo o trillizo</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.hermanos) ? data.hermanos.descripcion : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Atributos o condiciones únicas</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.particularidades.length > 0) ? data.particularidades.map(p => {
                            if (p.id_particularidad === 99) {
                                return p.descripcion;
                            }
                            return p.particularidad.es;
                        }).join(', ') 
                        : 
                        'N/A' }
                    </Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>
                <Grid my={8} item xs={12}>
                    <SectionTitle title='Medidas' onClickButton={() => { 
                        setDialog(prev => { return { ...prev, opened: true }})
                     }} />
                </Grid>
                
                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Cadera (cm)</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.hermanos) ? data.hermanos.descripcion : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={4} mt={4}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Entrepierna (cm)</Typography>
                </Grid>
                <Grid item alignItems={'self-start'} xs={8} mt={4}>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.hermanos) ? data.hermanos.descripcion : 'N/D' }</Typography>
                </Grid>
                <Grid item my={2} xs={12}>
                    <Divider />
                </Grid>
                
            </Grid>
            <MedidasDialog 
                id_talento={props.id_talento}
                onClose={(changed: boolean) => {
                    if (changed) {
                        void medidas.refetch();
                    } 
                    setDialog(prev => { return { ...prev, opened: false } }) 
                }}
                opened={dialog.opened}
            />
        </>
    )
}