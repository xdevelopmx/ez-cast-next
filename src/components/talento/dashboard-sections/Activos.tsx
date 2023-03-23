import { Grid, Typography } from '@mui/material'
import { MContainer } from '~/components/layout/MContainer';
import { SectionTitle } from '~/components/shared';
import { MTable } from '~/components/shared/MTable/MTable';

export const Activos = () => {
    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Activos' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
                <MTable
                    style={{ marginTop: 20 }}
                    backgroundColorData='#EBEBEB'
                    data={[
                        {
                            tipo_activo: <Typography sx={{ color: '#4ab7c6' }} fontWeight={600}>Mascota</Typography>,
                            mascota: <Typography fontWeight={600}>Perro</Typography>,
                            razas: <MContainer direction='horizontal' styles={{ gap: 20 }}>
                                <Typography>Maltese</Typography>
                                <Typography>Chico</Typography>
                            </MContainer>
                        }
                    ]}
                />

                <MTable
                    style={{ marginTop: 20 }}
                    backgroundColorData='#EBEBEB'
                    data={[
                        {
                            tipo_activo: <Typography sx={{ color: '#4ab7c6' }} fontWeight={600}>Vehículo</Typography>,
                            mascota: <Typography fontWeight={600}>Automóvil</Typography>,
                            razas: <MContainer direction='horizontal' styles={{ gap: 20 }}>
                                <Typography>Jeep</Typography>
                                <Typography>Wrangler</Typography>
                                <Typography>Verde</Typography>
                                <Typography>1960</Typography>
                            </MContainer>
                        }
                    ]}
                />

                <MTable
                    style={{ marginTop: 20 }}
                    backgroundColorData='#EBEBEB'
                    data={[
                        {
                            tipo_activo: <Typography sx={{ color: '#4ab7c6' }} fontWeight={600}>Props</Typography>,
                            mascota: <Typography fontWeight={600}>Arco y flecha</Typography>,
                            razas: <MContainer direction='horizontal' styles={{ gap: 20 }}>
                                <Typography>Pequeña descripción</Typography>
                            </MContainer>
                        }
                    ]}
                />
            </Grid>
        </Grid>
    )
}
