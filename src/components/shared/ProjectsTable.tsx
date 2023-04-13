import { Box, Button, Divider, Grid, Typography } from "@mui/material"
import { MSelect } from "./MSelect/MSelect"
import { FormGroup } from "./FormGroup"
import { useState } from "react"
import { MCheckboxGroup } from "./MCheckboxGroup"
import { api } from "~/utils/api"
import { ProjectPreview } from "./ProjectPreview"
import Image from 'next/image'


export const ProjectsTable = () => {

    const [searchInput, setSearchInput] = useState('')
    const [autorellenar, setAutorellenar] = useState([false])

    const estados = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const uniones = api.catalogos.getUniones.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const tipos_roles = api.catalogos.getTiposRoles.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const tipos_proyectos = api.catalogos.getTipoProyectos.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const generos_rol = api.catalogos.getGeneros.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const apariencias_etnicas = api.catalogos.getAparienciasEtnicas.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const preferencias_pago = api.catalogos.getTiposCompensacionesNoMonetarias.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })


    const loading = estados.isFetching || uniones.isFetching || tipos_roles.isFetching || tipos_proyectos.isFetching || generos_rol.isFetching || apariencias_etnicas.isFetching || preferencias_pago.isFetching

    return (
        <Grid container mt={4}>
            <Grid item container xs={12}>
                <Grid xs={2}>
                    <Typography fontWeight={600} sx={{ color: '#069cb1', fontSize: '1.1rem' }}>Filtros</Typography>
                </Grid>
                <Grid xs={4}>
                    <Typography fontWeight={600} sx={{ color: '#069cb1', fontSize: '1.1rem', textAlign: 'center' }}>
                        12 de 25 resultados totales
                    </Typography>
                </Grid>
                <Grid xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography fontWeight={600} sx={{ color: '#069cb1', fontSize: '1.1rem' }}>
                        Ver 25 resultados por página
                        <Typography fontWeight={600} component={'span'} sx={{ paddingLeft: '40px' }}>
                            Pagina 1 de 1
                        </Typography>
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ borderColor: '#069cb1', borderWidth: 1 }} />
            </Grid>

            <Grid item container xs={12} sx={{ backgroundColor: '#EBEBEB', padding: '10px 20px' }} mt={4}>
                <Grid item container xs={12}>
                    <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography>Buscar:</Typography>
                            <MSelect
                                id="filtro-rol-proyecto-todos"
                                options={[
                                    { value: '1', label: 'Todos' },
                                    { value: '2', label: 'Por Tol' },
                                    { value: '3', label: 'Por proyecto' },
                                ]}
                                styleRoot={{ width: '100px' }}
                                style={{ width: '100%' }}
                                value={'0'}
                                onChange={(e) => {
                                    /* onFormChange({
                                        id_sindicato: parseInt(e.target.value)
                                    }) */
                                }}
                                label=''
                            />
                            <FormGroup
                                className={'form-input-md'}
                                type="search"
                                rootStyle={{ margin: 0, width: '130px' }}
                                style={{ border: 'none', width: '100%' }}
                                value={searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value)
                                }}
                            />
                            <MCheckboxGroup
                                onChange={(e, i) => {
                                    setAutorellenar(s => s.map((_, index) => index === i ? e : false))
                                }}
                                direction='vertical'
                                id="talento-debera-incluir-rol"
                                options={['Auto-rellenar basado en perfil']}
                                labelStyle={{ fontWeight: '400', fontSize: '1.1rem', margin: 0 }}
                                values={autorellenar}//[(state) ? state.mostrar_anio_en_perfil : false]}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography sx={{ color: '#069cb1' }}>Eliminar filtros</Typography>
                            <Button
                                sx={{
                                    backgroundColor: '#069cb1',
                                    borderRadius: '2rem',
                                    color: '#fff',
                                    textTransform: 'none',
                                    padding: '0px 35px',

                                    '&:hover': {
                                        backgroundColor: '#069cb1'
                                    }
                                }}>
                                Filtros
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container xs={12} mt={2} gap={1}>
                    <MSelect
                        id="ubicacion-select"
                        loading={loading}
                        options={estados.data?.map(e => ({
                            label: e.es,
                            value: `${e.id}`
                        })) || []}
                        styleRoot={{ width: '130px' }}
                        style={{ width: '100%' }}
                        value={'0'}
                        onChange={(e) => {
                            /* onFormChange({
                                id_sindicato: parseInt(e.target.value)
                            }) */
                        }}
                    />
                    <MSelect
                        id="union-select"
                        loading={loading}
                        options={uniones.data?.map(u => ({
                            label: u.es,
                            value: `${u.id}`
                        })) || []}
                        styleRoot={{ width: '130px' }}
                        style={{ width: '100%' }}
                        value={'0'}
                        onChange={(e) => {
                            /* onFormChange({
                                id_sindicato: parseInt(e.target.value)
                            }) */
                        }}
                    />

                    <MSelect
                        id="tipos-roles-select"
                        loading={loading}
                        options={tipos_roles.data?.map(tr => ({
                            label: tr.es,
                            value: `${tr.id}`
                        })) || []}
                        styleRoot={{ width: '130px' }}
                        style={{ width: '100%' }}
                        value={'0'}
                        onChange={(e) => {
                            /* onFormChange({
                                id_sindicato: parseInt(e.target.value)
                            }) */
                        }}
                    />

                    <MSelect
                        id="tipos-proyectos-select"
                        loading={loading}
                        options={tipos_proyectos.data?.map(tp => ({
                            label: tp.es,
                            value: `${tp.id}`
                        })) || []}
                        styleRoot={{ width: '130px' }}
                        style={{ width: '100%' }}
                        value={'0'}
                        onChange={(e) => {
                            /* onFormChange({
                                id_sindicato: parseInt(e.target.value)
                            }) */
                        }}
                    />

                    <MSelect
                        id="generos-select"
                        loading={loading}
                        options={generos_rol.data?.map(g => ({
                            label: g.es,
                            value: `${g.id}`
                        })) || []}
                        styleRoot={{ width: '130px' }}
                        style={{ width: '100%' }}
                        value={'0'}
                        onChange={(e) => {
                            /* onFormChange({
                                id_sindicato: parseInt(e.target.value)
                            }) */
                        }}
                    />

                    <MSelect
                        id="apariencias-etnicas-select"
                        loading={loading}
                        options={preferencias_pago.data?.map(g => ({
                            label: g.es,
                            value: `${g.id}`
                        })) || []}
                        styleRoot={{ width: '130px' }}
                        style={{ width: '100%' }}
                        value={'0'}
                        onChange={(e) => {
                            /* onFormChange({
                                id_sindicato: parseInt(e.target.value)
                            }) */
                        }}
                    />
                </Grid>

                <Grid xs={12}>

                </Grid>
            </Grid>

            <Grid xs={12} container gap={2} mt={4}>
                {
                    Array.from({ length: 2 }).map((_, i) => (
                        <ProjectPreview key={i} />
                    ))
                }
            </Grid>

            <Grid xs={12} mt={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button sx={{ textTransform: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Image src="/assets/img/iconos/arow_l_blue.svg" width={15} height={15} alt="" />
                            <Typography fontWeight={600}>Página previa</Typography>
                        </Box>
                    </Button>

                    <Typography sx={{ color: '#069cb1' }} fontWeight={600} >1 de 1</Typography>

                    <Button sx={{ textTransform: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography fontWeight={600}>Siguiente página</Typography>
                            <Image src="/assets/img/iconos/arow_r_blue.svg" width={15} height={15} alt="" />
                        </Box>
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
