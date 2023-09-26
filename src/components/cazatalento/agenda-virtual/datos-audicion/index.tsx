import { Button, Divider, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router';
import React, { useContext } from 'react'
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

export const DatosAudicion = (props: {uso_horario: string, id_horario: number, nota: string}) => {
    const router = useRouter();
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    return (
        <Grid container xs={12} mt={2}>

            <Grid xs={4}>
                <Typography fontWeight={600} sx={{ color: '#069cb1', }}>
                    {textos['nota_adicional']}
                </Typography>
                <Typography fontWeight={500}>
                    {props.nota}
                </Typography>
            </Grid>
            <Grid xs={7}>
                <Typography fontWeight={600} sx={{ color: '#069cb1', }}>
                    {textos['timezone']}
                </Typography>
                <Typography fontWeight={500}>
                    {props.uso_horario}
                </Typography>
                
            </Grid>
            <Grid xs={1}>
                <Button onClick={() => { void router.push(`/cazatalentos/agenda-virtual/crear?id_horario=${props.id_horario}`); }} sx={{ textTransform: 'none', textDecoration: 'underline', color: '#069cb1' }}>
                    <Typography>
                        {textos['editar']}
                    </Typography>
                </Button>
            </Grid>

            <Grid xs={12}>
                <Divider />
            </Grid>

        </Grid>
    )
}
