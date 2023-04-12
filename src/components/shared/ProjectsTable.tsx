import { Box, Divider, Grid, Typography } from "@mui/material"


export const ProjectsTable = () => {
    return (
        <Grid container mt={4}>
            <Grid container xs={12}>
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
            <Grid xs={12}>
                <Divider sx={{ borderColor: '#069cb1', borderWidth: 1 }} />
            </Grid>
        </Grid>
    )
}
