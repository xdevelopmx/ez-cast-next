import { Grid, Typography } from '@mui/material'
import { MContainer } from '~/components/layout/MContainer';
import { SectionTitle } from '~/components/shared';

export const Activos = () => {
    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Activos' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
                <MContainer className="my-2 p-3" direction="horizontal" justify='space-between' styles={{ backgroundColor: '#ededed '}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Vehiculo</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Actuación, modelado</Typography>  
                </MContainer>

                <MContainer className="my-2 p-3" direction="horizontal" justify='space-between' styles={{backgroundColor: '#ededed '}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Vehiculo</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Actuación, modelado</Typography>  
                </MContainer>                
            </Grid>
        </Grid>
    )
}
