import { Button, Divider, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router';
import React from 'react'

export const DatosAudicion = (props: {uso_horario: string, id_horario: number, nota: string}) => {
    const router = useRouter();
    return (
        <Grid container xs={12} mt={2}>

            <Grid xs={4}>
                <Typography fontWeight={600} sx={{ color: '#069cb1', }}>
                    Nota adicional
                </Typography>
                <Typography fontWeight={500}>
                    {props.nota}
                </Typography>
            </Grid>
            <Grid xs={7}>
                <Typography fontWeight={600} sx={{ color: '#069cb1', }}>
                    Uso horario
                </Typography>
                <Typography fontWeight={500}>
                    {props.uso_horario}
                </Typography>
                
            </Grid>
            <Grid xs={1}>
                <Button onClick={() => { void router.push(`/cazatalentos/agenda-virtual/crear?id_horario=${props.id_horario}`); }} sx={{ textTransform: 'none', textDecoration: 'underline', color: '#069cb1' }}>
                    <Typography>
                        Editar
                    </Typography>
                </Button>
            </Grid>

            <Grid xs={12}>
                <Divider />
            </Grid>

        </Grid>
    )
}
