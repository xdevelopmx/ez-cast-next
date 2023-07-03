import { Grid, type SxProps, Typography } from '@mui/material'
import React from 'react'
import { MCheckboxGroup } from '../shared'

const estilos_link: SxProps = {
    textDecoration: 'underline'
}

export const AceptarTerminos = () => {


    return (
        <div className="row ml-lg-5 mt-lg-4 jc-c">
            <Grid item xs={12} sx={{width: '100%'}}>
                <Grid>
                    <a href='' target='_blank'>
                        <Typography sx={estilos_link}>
                            Leer término y condiciones
                        </Typography>
                    </a>
                </Grid>
                <Grid>
                    <MCheckboxGroup
                        direction='vertical'
                        onChange={(e, i) => {
                            /* const genero = generos.data?.filter((_, index) => index === i)[0];
                            if (genero) {
                                onFormChange({
                                    generos:
                                        (state.generos.includes(genero.id)) ?
                                            state.generos.filter(e => e !== genero.id) :
                                            state.generos.concat([genero.id])
                                })
                            } */
                        }}
                        id={'id-terminos-condiciones'}
                        //labelStyle={{ marginBottom: 0, width: '32%' }}
                        options={['Acepto términos y condiciones']}
                        values={/* (generos.data) ? generos.data.map(g => {
                                return state.generos.includes(g.id);
                            }) : */ [false]}
                    />
                </Grid>
            </Grid>

        </div>
    )
}
