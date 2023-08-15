import { Button, Divider, Grid, Link, Skeleton, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { SectionTitle } from "~/components/shared";
import { MTable } from "~/components/shared/MTable/MTable";
import { api } from "~/utils/api";
import { useContext, useMemo } from "react";
import { useRouter } from "next/router";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

export const Preferencias = (props: {id_talento: number, read_only: boolean}) => {
    const ctx = useContext(AppContext);
  	const textos = useLang(ctx.lang);
    
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
                return (ctx.lang === 'es') ? d.documento.es : d.documento.en;
            }).join(', ');
        }
        return null;
    }, [data, ctx.lang]);

    const disponibilidades: string | null = useMemo(() => {
        if (data) {
            if (data.disponibilidades.length === 0) {
                return 'N/A';
            }
            return data.disponibilidades.map(d => (ctx.lang === 'es') ? d.disponibilidad.es : d.disponibilidad.en).join(', ');
        }
        return null;
    }, [data, ctx.lang]);

    return (
        <Grid id="preferencia-de-roles" container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle titleSx={{ fontSize: "26px", }} dividerSx={{ borderTop: "2px solid #069cb1" }} title={textos['preferencias_roles'] ? `${textos['preferencias_roles']}` : 'Texto No definido'} textButton={textos['editar'] ? textos['editar'] : 'Texto No definido'} onClickButton={(!props.read_only) ? () => { 
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    router.push(`/talento/editar-perfil?step=6&id_talento=${props.id_talento}`)  
                 } : undefined} />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['tipo_de_trabajo'] ? `${textos['tipo_de_trabajo']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.tipos_de_trabajo.length > 0) ? data.tipos_de_trabajo.map(t => (ctx.lang === 'es') ? t.tipos_de_trabajo.es : t.tipos_de_trabajo.en).join(', ') : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['trabajo_de_extra'] ? `${textos['trabajo_de_extra']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data) ? (data.interesado_en_trabajos_de_extra) ? 'Si' : 'No' : 'N/A' }</Typography>    
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['locacion_de_trabajo_principal'] ? `${textos['locacion_de_trabajo_principal']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (locaciones) ? locaciones.principal : 'N/A' }</Typography>  
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['locaciones_de_trabajo_adicionales'] ? `${textos['locaciones_de_trabajo_adicionales']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (locaciones) ? locaciones.adicionales : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['interes_en_proyectos_pagados'] ? `${textos['interes_en_proyectos_pagados']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (interes_tipo_proyectos) ? (interes_tipo_proyectos.pagado) ? 'Si' : 'No' : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['interes_en_proyectos_no_pagados'] ? `${textos['interes_en_proyectos_no_pagados']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (interes_tipo_proyectos) ? (interes_tipo_proyectos.no_pagado) ? 'Si' : 'No' : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>¿{textos['representante'] ? `${textos['representante']} :` : 'Texto No definido'}?</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.nombre_agente) ? 'Si' : 'No' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['nombre_de_representante'] ? `${textos['nombre_de_representante']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.nombre_agente) ? data.nombre_agente : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['documentos'] ? `${textos['documentos']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (documentos) ? documentos : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['disponibilidad_para'] ? `${textos['disponibilidad_para']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (disponibilidades) ? disponibilidades : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['otras_profesiones'] ? `${textos['otras_profesiones']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.otras_profesiones.length > 0) ? data.otras_profesiones.map(o => o.descripcion).join(', ') : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={6} mt={4}>
                <Typography fontSize={'1.4rem'} sx={{ color: '#069cb1' }} fontWeight={600}>{textos['meses_de_embarazo'] ? `${textos['meses_de_embarazo']} :` : 'Texto No definido'}</Typography>
            </Grid>
            <Grid item alignItems={'self-start'} xs={6} mt={4}>
                <Typography fontSize={'1rem'} fontWeight={400} variant="body1">{loading ? <Skeleton className="md-skeleton" /> : (data && data.meses_embarazo) ? `${data.meses_embarazo} ${textos['meses']}` : 'N/A' }</Typography>
            </Grid>
            <Grid item my={2} xs={12}>
                <Divider />
            </Grid>
        </Grid>
    )
}
