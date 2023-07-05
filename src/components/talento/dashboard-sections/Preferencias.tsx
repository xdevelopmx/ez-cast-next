import { Button, Divider, Grid, Link, Skeleton, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { SectionTitle } from "~/components/shared";
import { MTable } from "~/components/shared/MTable/MTable";
import { api } from "~/utils/api";
import { useMemo } from "react";
import { useRouter } from "next/router";

export const Preferencias = (props: {id_talento: number, read_only: boolean}) => {
    const router = useRouter();

    const preferencias = api.talentos.getPreferenciasRolByIdTalento.useQuery({id: props.id_talento}, {
        refetchOnWindowFocus: false,
    });
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
        <Grid id="preferencia-de-roles" container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Preferencia de roles' onClickButton={(!props.read_only) ? () => { 
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    router.push(`/talento/editar-perfil?step=6&id_talento=${props.id_talento}`)  
                 } : undefined} />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Tipo de trabajo</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.tipos_de_trabajo.length > 0) ? data.tipos_de_trabajo.map(t => t.tipos_de_trabajo.es).join(', ') : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Trabajo de Extra</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? (data.interesado_en_trabajos_de_extra) ? 'Si' : 'No' : 'N/A' }</Typography>    
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Locación de Trabajo Principal</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (locaciones) ? locaciones.principal : 'N/A' }</Typography>  
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Locaciónes de Trabajo Adicionales</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (locaciones) ? locaciones.adicionales : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Interés en proyectos pagados</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (interes_tipo_proyectos) ? (interes_tipo_proyectos.pagado) ? 'Si' : 'No' : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Interés en proyectos no pagados</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (interes_tipo_proyectos) ? (interes_tipo_proyectos.no_pagado) ? 'Si' : 'No' : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>¿Representante?</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.nombre_agente) ? 'Si' : 'No' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Nombre de Representante</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.nombre_agente) ? data.nombre_agente : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Documentos</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (documentos) ? documentos : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Disponibilidad para</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (disponibilidades) ? disponibilidades : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Otras profesiones</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.otras_profesiones.length > 0) ? data.otras_profesiones.map(o => o.descripcion).join(', ') : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>Meses de embarazo</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.meses_embarazo) ? `${data.meses_embarazo} Meses` : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
        </Grid>
    )
}
