import { Button, Divider, Grid, Link, Skeleton, Typography } from "@mui/material";
import { useMemo } from 'react';
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { SectionTitle } from "~/components/shared";
import { MTable } from "~/components/shared/MTable/MTable";
import { api } from "~/utils/api";

export const FiltrosApariencias = (props: {id_talento: number}) => {
    const filtros = api.talentos.getFiltrosAparienciaByIdTalento.useQuery({id: props.id_talento});
    const loading = filtros.isFetching;
    const data = useMemo(() => {
        if (filtros.data) {
            console.log('filtros_data', filtros.data)
            return filtros.data;
        }
        return null;
    }, [filtros.data]);


    const tatuajes = useMemo(() => {
        if (data) {
            
            if (data.tatuajes.length > 0) {
                return data.tatuajes.map((t, i) => {
                    return (
                        <div key={i}>
                            <Typography fontSize={'1.2rem'} fontWeight={400}>{t.tipo_tatuaje.es}</Typography>  
                            <Typography fontSize={'1rem'} fontWeight={400}>{t.descripcion}</Typography>  
                            <Divider className="my-2"/>
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
                    return (
                        <div key={i}>
                            <Typography fontSize={'1.2rem'} fontWeight={400}>{t.piercing.es}</Typography>  
                            <Typography fontSize={'1rem'} fontWeight={400}>{t.descripcion}</Typography>  
                            <Divider className="my-2"/>
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
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Apariencia' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
            
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Rango de edad a interpretar</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data) ? `${data.rango_inicial_edad} a ${data.rango_final_edad}` : 'N/D' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Genero</Typography>
                    <MContainer direction="vertical">
                        <MContainer className="mb-2" direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} mr={8} fontWeight={500}>Talento interesado en interpretar</Typography>
                            <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data && data.generos_interesados_en_interpretar.length > 0) ? data.generos_interesados_en_interpretar.map(g => g.genero.es).join(', ') : 'N/A' }</Typography>
                        </MContainer>
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={500}>Adicionalmente se identifica como</Typography>
                            <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data && data.genero) ? data.genero.es : 'N/D' }</Typography>
                        </MContainer>
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Apariencia étnica</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data && data.apariencia_etnica) ? data.apariencia_etnica.nombre : 'N/D' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between'>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Color de Cabello</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data) ? data.color_cabello.es : 'N/D' }</Typography>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Dispuesto cambiar de color?</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data) ? (data.disposicion_cambio_color_cabello) ? 'Si' : 'No' : 'N/D' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between'>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Estilo de Cabello</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data) ? data.estilo_cabello.es : 'N/D' }</Typography>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Dispuesto a cortar?</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data) ? (data.disposicion_corte_cabello) ? 'Si' : 'No' : 'N/D' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between'>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Vello Facial</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data) ? data.vello_facial.es : 'N/D' }</Typography>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Dispuesto a crecer o afeitar?</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data) ? (data.disposicion_afeitar_o_crecer_vello_facial) ? 'Si' : 'No' : 'N/D' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Color de ojos</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data) ? data.color_ojos.es : 'N/D' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Tatuajes</Typography>
                    <MContainer direction="vertical">
                        <>
                            {loading && <Skeleton width={150} />}
                            {tatuajes}
                        </>
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Piercings</Typography>
                    <MContainer direction="vertical">
                        <>
                            {loading && <Skeleton width={150} />}
                            {piercings}
                        </>
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Gemelo o trillizo</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data && data.hermanos) ? data.hermanos.descripcion : 'N/D' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Atributos o condiciones únicas</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data && data.particularidades.length > 0) ? data.particularidades.map(p => {
                            if (p.id_particularidad === 99) {
                                return p.descripcion;
                            }
                            return p.particularidad.es;
                        }).join(', ') 
                        : 
                        'N/A' }
                    </Typography>
                </MContainer>
                <Divider className="my-2" />
                
            </Grid>
            <Grid my={8} item xs={12}>
                <SectionTitle title='Medidas' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Generales</Typography>
                    <MContainer direction="vertical">
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={400} mr={8}>Cadera (cm)</Typography>  
                            <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                        </MContainer>
                        <Divider className="my-2"/>
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={400} mr={8}>Entrepierna (cm)</Typography>  
                            <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                        </MContainer>
                        <Divider className="my-2"/>
                         
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                
                
            </Grid>
        </Grid>
    )
}
