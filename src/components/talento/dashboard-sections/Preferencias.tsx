import { Button, Divider, Grid, Link, Skeleton, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { SectionTitle } from "~/components/shared";
import { MTable } from "~/components/shared/MTable/MTable";
import { api } from "~/utils/api";
import { useMemo } from "react";

export const Preferencias = (props: {id_talento: number}) => {

    const preferencias = api.talentos.getPreferenciasRolByIdTalento.useQuery({id: props.id_talento});
    const loading = preferencias.isFetching;
    const data = useMemo(() => {
        if (preferencias.data) {
            return preferencias.data;
        }
        return null;
    }, [preferencias.data]);

    const locaciones: {principal: string, adicionales: string} | null = useMemo(() => {
        if (data) {
            const principal = data.locaciones.filter(l => l.es_principal)[0];
            const adicionales = data.locaciones.filter(l => !l.es_principal);
            const result: {principal: string, adicionales: string} = {principal: 'N/D', adicionales: 'N/A'};
            if (principal) {
                result.principal = principal.estado_republica.es;
            }
            if (adicionales.length > 0) {
                result.adicionales = adicionales.map(a => a.estado_republica.es).join(', ');
            }
            return result;
        }
        return null;
    }, [data]);

    const interes_tipo_proyectos: {pagado: boolean, no_pagado: boolean} | null = useMemo(() => {
        if (data) {
            const pagado = data.interes_en_proyectos.filter(i => i.intereses_en_proyectos.es.toUpperCase() === 'PAGADO')[0];
            const no_pagado = data.interes_en_proyectos.filter(i => i.intereses_en_proyectos.es.toUpperCase() !== 'PAGADO')[0];
            return {pagado: pagado != null, no_pagado: no_pagado != null};
        }
        return null;
    }, [data]);

    const documentos: string | null = useMemo(() => {
        if (data) {
            if (data.documentos.length === 0) {
                return 'N/A';
            }
            return data.documentos.map(d => {
                if (d.id_documento === 99) {
                    return d.descripcion;
                }
                return d.documento.es;
            }).join(', ');
        }
        return null;
    }, [data]);

    const disponibilidades: string | null = useMemo(() => {
        if (data) {
            if (data.disponibilidades.length === 0) {
                return 'N/A';
            }
            return data.disponibilidades.map(d => d.disponibilidad.es).join(', ');
        }
        return null;
    }, [data]);

    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Preferencia de roles' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
            
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Tipo de trabajo</Typography>
                    <Typography fontSize={'1rem'} ml={8} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data && data.tipos_de_trabajo.length > 0) ? data.tipos_de_trabajo.map(t => t.tipos_de_trabajo.es).join(', ') : 'N/A' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Trabajo de Extra</Typography>
                    <Typography fontSize={'1rem'} ml={8} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data) ? (data.interesado_en_trabajos_de_extra) ? 'Si' : 'No' : 'N/A' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Locación de Trabajo</Typography>
                    <MContainer direction="vertical">
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={500} mr={16}>Principal</Typography>
                            <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (locaciones) ? locaciones.principal : 'N/A' }</Typography>
                        </MContainer>
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={500} mr={16}>Adicionales</Typography>
                            <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (locaciones) ? locaciones.adicionales : 'N/A' }</Typography>
                        </MContainer>
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Interés en proyectos</Typography>
                    <MContainer direction="vertical">
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={500} mr={16}>Pagado</Typography>
                            <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (interes_tipo_proyectos) ? (interes_tipo_proyectos.pagado) ? 'Si' : 'No' : 'N/A' }</Typography>
                        </MContainer>
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={500} mr={16}>No pagado</Typography>
                            <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (interes_tipo_proyectos) ? (interes_tipo_proyectos.no_pagado) ? 'Si' : 'No' : 'N/A' }</Typography>
                        </MContainer>
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Representante?</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data && data.nombre_agente) ? data.nombre_agente : 'N/A' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Documentos</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (documentos) ? documentos : 'N/A' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '100%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Disponibilidad para</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (disponibilidades) ? disponibilidades : 'N/A' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Otras profesiones</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data && data.otras_profesiones.length > 0) ? data.otras_profesiones.map(o => o.descripcion).join(', ') : 'N/A' }</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}> Meses de embarazo</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton width={150} /> : (data && data.meses_embarazo) ? `${data.meses_embarazo} Meses` : 'N/A' }</Typography>
                </MContainer>
                <Divider className="my-2" />
            </Grid>
        </Grid>
    )
}
