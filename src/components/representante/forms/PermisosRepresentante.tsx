import { Grid } from '@mui/material'
import React from 'react'
import { MCheckboxGroup } from '~/components/shared';

export const PermisosRepresentante = () => {
    return (
        <Grid container>
            <Grid xs={12}>
                <MCheckboxGroup
                    direction='vertical'
                    title="¿Quién puede aceptar solicitudes?"
                    onChange={(e, i) => {
                        /* const nsfw = tipos_nsfw.data?.filter((_, index) => index === i)[0];
                        if (nsfw) {
                            onFormChange({
                                nsfw: {
                                    ...state.nsfw,
                                    ids: (state.nsfw.ids.includes(nsfw.id)) ?
                                        state.nsfw.ids.filter(n => n !== nsfw.id) :
                                        state.nsfw.ids.concat([nsfw.id])
                                }
                            })
                        }
                        console.log('change'); */
                    }}
                    id="quien-puede-aceptar-solicitudes-select"
                    labelStyle={{ marginBottom: 0, width: '45%' }}
                    options={/* (tipos_nsfw.data) ? tipos_nsfw.data.map(n => n.es) : */
                        ['Talentos', 'Representante']
                    }
                    values={/* (tipos_nsfw.data) ? tipos_nsfw.data.map(g => {
                        return state.nsfw.ids.includes(g.id);
                    }) : */ [false, false]}
                />
            </Grid>
            <Grid xs={12} mt={4}>
                <MCheckboxGroup
                    direction='vertical'
                    title="¿Quién puede editar perfil de talento?"
                    onChange={(e, i) => {
                        /* const nsfw = tipos_nsfw.data?.filter((_, index) => index === i)[0];
                        if (nsfw) {
                            onFormChange({
                                nsfw: {
                                    ...state.nsfw,
                                    ids: (state.nsfw.ids.includes(nsfw.id)) ?
                                        state.nsfw.ids.filter(n => n !== nsfw.id) :
                                        state.nsfw.ids.concat([nsfw.id])
                                }
                            })
                        }
                        console.log('change'); */
                    }}
                    id="quien-puede-aceptar-solicitudes-select"
                    labelStyle={{ marginBottom: 0, width: '45%' }}
                    options={/* (tipos_nsfw.data) ? tipos_nsfw.data.map(n => n.es) : */
                        ['Talentos', 'Representante']
                    }
                    values={/* (tipos_nsfw.data) ? tipos_nsfw.data.map(g => {
                        return state.nsfw.ids.includes(g.id);
                    }) : */ [false, false]}
                />
            </Grid>
        </Grid>
    )
}
