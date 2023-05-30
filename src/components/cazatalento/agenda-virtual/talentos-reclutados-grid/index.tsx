import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FormGroup, MSelect } from '~/components/shared'
import { TalentoReclutadoCard } from '../talento-reclutado-card'
import Constants from '~/constants'
import { api } from '~/utils/api'

export const TalentosReclutadosGrid = (props: {id_proyecto: number}) => {

    const roles = api.roles.getAllCompleteByProyecto.useQuery(props.id_proyecto, {
		refetchOnWindowFocus: false
	})

    const [estado_aplicacion_rol, setEstadoAplicacionRol] = useState(Constants.ESTADOS_APLICACION_ROL.AUDICION.toString());

    const [selected_rol, setSelectedRol] = useState(0);

    useEffect(() => {
        if (roles.data) {
            const rol = roles.data[0];
            if (rol) {
                setSelectedRol(rol.id);
            }
        }
    }, [roles.data]);

    console.log(roles.data);

    return (
        <Grid xs={12}>
            <Grid container xs={12} sx={{
                backgroundColor: '#069cb1',
                padding: '20px',
                alignItems: 'center',
            }}>
                <Grid xs={8}>
                    <Typography fontWeight={600} sx={{ color: '#fff', fontSize: '1.4rem' }}>
                        Talentos reclutados
                    </Typography>
                </Grid>
                <Grid container xs={4}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Typography sx={{ color: '#fff', fontSize: '1.1rem' }}>
                            Vista:
                        </Typography>

                        <Image src="/assets/img/iconos/vista_cuadros.png" width={20} height={20} alt="" />

                        <Image src="/assets/img/iconos/vista_columnas.png" width={20} height={20} alt="" />
                    </Box>

                </Grid>
            </Grid>
            <Grid xs={12}>
                <Grid xs={12} sx={{
                    padding: '10px 30px 5px 30px',
                    borderLeft: '3px solid #EBEBEB',
                    borderRight: '3px solid #EBEBEB',
                }}>
                    <Grid xs={12}>
                        <MSelect
                            id="posicion-contenido-select"
                            labelStyle={{ fontWeight: 600 }}
                            labelClassName={'form-input-label'}
                            label='Rol'
                            options={(roles.data) ? roles.data.map(r => { return { label: r.nombre, value: r.id.toString()}}) : []}
                            value={selected_rol.toString()}
                            className={'form-input-md'}
                            disable_default_option
                            onChange={(e) => {
                                setSelectedRol(parseInt(e.target.value));
                            }}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <Box>
                            <Typography>
                                Ver:
                            </Typography>
                            <MSelect
                                id="posicion-contenido-select"
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                options={[{ value: Constants.ESTADOS_APLICACION_ROL.AUDICION.toString(), label: 'Audicion' }, { value: Constants.ESTADOS_APLICACION_ROL.CALLBACK.toString(), label: 'Callback' }]}
                                value={estado_aplicacion_rol}
                                className={'form-input-md'}
                                onChange={(e) => {
                                    setEstadoAplicacionRol(e.target.value)
                                }}
                                disable_default_option
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Grid xs={12} sx={{ backgroundColor: '#EBEBEB', padding: '5px 30px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>
                            Filtrar por:
                        </Typography>
                        <MSelect
                            id="posicion-contenido-select"
                            labelStyle={{ fontWeight: 600 }}
                            options={[{ value: 'top', label: 'Arriba' }, { value: 'bottom', label: 'Abajo' }, { value: 'left', label: 'Izquierda' }, { value: 'Right', label: 'Derecha' }]}
                            value={''}
                            className={'form-input-md'}
                            onChange={(e) => {
                                /* setBanner(prev => {
                                    return {
                                        ...prev,
                                        position: e.target.value
                                    }
                                }) */
                            }}
                        />
                    </Box>
                </Grid>

                <Grid container xs={12} gap={2} maxHeight={700} overflow={'auto'} sx={{
                    justifyContent: 'center',
                    borderLeft: '3px solid #EBEBEB',
                    borderRight: '3px solid #EBEBEB',
                    borderBottom: '3px solid #EBEBEB',
                    padding: '30px 0'
                }}>
                    {roles.data &&
                        roles.data.map((rol, i) => {
                            if (rol.id === selected_rol) {
                                return rol.aplicaciones_por_talento.map((aplicacion, j) => {
                                    const profile = aplicacion.talento.media.filter(m => m.media.identificador.match('foto-perfil-talento'))[0];
                                    return (
                                        <Grid key={i} xs={5}>
                                            <TalentoReclutadoCard 
                                                profile_url={(profile) ? profile.media.url : '/assets/img/no-image.png'}
                                                nombre={`${aplicacion.talento.nombre} ${aplicacion.talento.apellido}`}
                                                union={'ND'}
                                            />
                                        </Grid>
                                    )
                                })
                            }
                        })
                    }
                </Grid>

                
            </Grid>
        </Grid>
    )
}
