import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';
import React, { type Dispatch, type SetStateAction, type FC } from 'react'
import { FormGroup, MCheckboxGroup, MSelect } from '~/components/shared';
import { api } from '~/utils/api';

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalLocacion: FC<Props> = ({ isOpen, setIsOpen }) => {

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ padding: '30px 100px 30px 100px' }}>
                <Typography fontWeight={600} sx={{ fontSize: '1.4rem', color: '#069cb1' }}>
                    Añadir locación
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ padding: '0px 100px' }}>
                <Grid xs={12}>
                    <Grid xs={12}>
                        <FormGroup
                            labelClassName={'form-input-label'}
                            labelStyle={{ fontWeight: 600 }}
                            label='País'
                        />
                    </Grid>
                    <Grid xs={12}>
                        <FormGroup
                            labelClassName={'form-input-label'}
                            labelStyle={{ fontWeight: 600 }}
                            label='Dirección*'
                        />
                    </Grid>
                    <Grid xs={12}>
                        <FormGroup
                            labelClassName={'form-input-label'}
                            labelStyle={{ fontWeight: 600 }}
                            label='Dirección 2'
                        />
                    </Grid>
                    <Grid xs={12}>
                        <MSelect
                            id="sindicato-select"
                            options={(estados_republica.data) ? estados_republica.data.map(e => { return { value: e.id.toString(), label: e.es } }) : []}
                            styleRoot={{ width: '100%', marginBottom: '1rem' }}
                            style={{ width: '100%' }}
                            value={'0'}
                            onChange={(e) => {
                                /* onFormChange({
                                    id_estado_republica: parseInt(e.target.value)
                                }) */
                            }}
                            label='Estado/Provincia*'
                        />
                    </Grid>
                    <Grid xs={12}>
                        <FormGroup
                            labelClassName={'form-input-label'}
                            labelStyle={{ fontWeight: 600 }}
                            label='Código postal*'
                        />
                    </Grid>
                    <Grid xs={12}>
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
                            id="guardar-para-uso-futuro"
                            //labelStyle={{ marginBottom: 0, width: '32%' }}
                            options={['Guardar para uso futuro']}
                            values={/* (generos.data) ? generos.data.map(g => {
                                return state.generos.includes(g.id);
                            }) : */ [false]}
                        />
                    </Grid>
                    <Grid xs={12} sx={{ paddingBottom: '30px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button sx={{
                                borderRadius: '2rem',
                                backgroundColor: '#069cb1',
                                color: '#fff',
                                textTransform: 'none',
                                minWidth: '80%',
                                '&:hover': {
                                    backgroundColor: '#06acc2',
                                }
                            }}>
                                <Typography>
                                    Añadir locación
                                </Typography>
                            </Button>
                            <Button
                                sx={{
                                    color: '#069cb1',
                                    textTransform: 'none',
                                    textDecoration: 'underline'
                                }}
                                onClick={() => setIsOpen(false)}>
                                <Typography>
                                    Cancelar
                                </Typography>
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
