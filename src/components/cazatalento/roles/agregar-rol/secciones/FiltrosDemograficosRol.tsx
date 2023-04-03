import { Grid } from "@mui/material"
import { SectionTitle } from "~/components/shared"
import { Ranges } from "~/components/shared/Ranges"


export const FiltrosDemograficosRol = () => {
    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 3' subtitle='Filtros demográficos'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>

            <Grid item xs={12}>
                <Grid container item xs={12}>
                    <Grid item xs={6}>
                        <Ranges 
                            
                        />
                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
