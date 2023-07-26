import { Grid, type SxProps, Typography } from '@mui/material'
import React, { FC } from 'react'
import { MCheckboxGroup } from '../shared'
import { CreateUserForm } from '~/pages/registro';

const estilos_link: SxProps = {
    textDecoration: 'underline'
}

interface Props {
    state: CreateUserForm,
    onFormChange: (input: {[id: string]: unknown}) => void;
}

export const AceptarTerminos: FC<Props> = ({state, onFormChange}) => {


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
                                
                            } */
                            onFormChange({
                                terms_and_conditions_accepted: e
                            })
                        }}
                        id={'id-terminos-condiciones'}
                        //labelStyle={{ marginBottom: 0, width: '32%' }}
                        options={['Acepto términos y condiciones']}
                        values={[state.terms_and_conditions_accepted]}
                    />
                </Grid>
            </Grid>

        </div>
    )
}
