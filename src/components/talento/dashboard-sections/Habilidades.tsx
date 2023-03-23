import { Grid, Typography } from "@mui/material"
import { MContainer } from "~/components/layout/MContainer";
import { SectionTitle } from "~/components/shared";


export const Habilidades = () => {
    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Habilidades' onClickButton={() => { console.log('click'); }} />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction="vertical" styles={{ marginTop: 20 }}>
                    <Typography sx={{ color: '#4ab7c6' }} fontWeight={600}>
                        Técnica de Actuación
                    </Typography>
                    <MContainer direction="horizontal" styles={{ gap: 10 }}>
                        <Typography
                            sx={{ padding: '5px 30px', borderRadius: 10, border: '2px solid #4ab7c6' }}
                        >
                            Brecht
                        </Typography>
                        <Typography
                            sx={{ padding: '5px 30px', borderRadius: 10, border: '2px solid #4ab7c6' }}
                        >
                            De Método
                        </Typography>
                    </MContainer>
                </MContainer>

                <MContainer direction="vertical" styles={{ marginTop: 20 }}>
                    <Typography sx={{ color: '#4ab7c6' }} fontWeight={600}>
                        Danza
                    </Typography>
                    <MContainer direction="horizontal" styles={{ gap: 10 }}>
                        <Typography
                            sx={{ padding: '5px 30px', borderRadius: 10, border: '2px solid #4ab7c6' }}
                        >
                            Ballet
                        </Typography>
                        <Typography
                            sx={{ padding: '5px 30px', borderRadius: 10, border: '2px solid #4ab7c6' }}
                        >
                            Contemporaneo
                        </Typography>
                        <Typography
                            sx={{ padding: '5px 30px', borderRadius: 10, border: '2px solid #4ab7c6' }}
                        >
                            Freestyle
                        </Typography>
                    </MContainer>
                </MContainer>

                <MContainer direction="vertical" styles={{ marginTop: 20 }}>
                    <Typography sx={{ color: '#4ab7c6' }} fontWeight={600}>
                        Dialectos/Idiomas
                    </Typography>
                    <MContainer direction="horizontal" styles={{ gap: 10 }}>
                        <Typography
                            sx={{ padding: '5px 30px', borderRadius: 10, border: '2px solid #4ab7c6' }}
                        >
                            Español (Argentino)
                        </Typography>
                        <Typography
                            sx={{ padding: '5px 30px', borderRadius: 10, border: '2px solid #4ab7c6' }}
                        >
                            Español (Castellano)
                        </Typography>
                    </MContainer>
                </MContainer>
            </Grid>
        </Grid>
    )
}
