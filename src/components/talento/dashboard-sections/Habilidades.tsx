import { Grid, Skeleton, Typography } from "@mui/material"
import { MContainer } from "~/components/layout/MContainer";
import { SectionTitle } from "~/components/shared";
import { api } from '~/utils/api';
import { useMemo } from 'react';
import MotionDiv from "~/components/layout/MotionDiv";
import { useRouter } from "next/router";

export const Habilidades = (props: {id_talento: number, read_only: boolean}) => {
    const router = useRouter();

    const habilidades = api.talentos.getHabilidadesByIdTalento.useQuery({id: props.id_talento}, {
        refetchOnWindowFocus: false,
    });
    const loading = habilidades.isFetching;
    const data = useMemo(() => {
        if (habilidades.data) {
            console.log('habilidades_data', habilidades.data)
            return habilidades.data;
        }
        return null;
    }, [habilidades.data]);

    const habilidades_map = useMemo(() => {
        if (data) {
            const h_map: Map<string, string[]> = new Map();

            data.forEach(entry => {
                if (h_map.has(entry.habilidad.es)) {
                    const arr = h_map.get(entry.habilidad.es);
                    if (arr) {
                        h_map.set(entry.habilidad.es, arr.concat([entry.habilidad_especifica.es]));
                    }
                } else {
                    h_map.set(entry.habilidad.es, [entry.habilidad_especifica.es]);
                }
            })
            return h_map;
        }
        return null;
    }, [data])

    return (
        <Grid id="habilidades" container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Habilidades' onClickButton={(!props.read_only) ? () => { 
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    router.push(`/talento/editar-perfil?step=4&id_talento=${props.id_talento}`)  
                 } : undefined} />
            </Grid>

            <Grid item xs={12}>

                {!loading && habilidades.data?.length === 0 &&
                    <Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>No haz capturado aun ninguna habilidad</Typography>
                }
                        
                <MotionDiv show={loading} animation={'fade'}>
                    <>
                        {Array.from({ length: 4 }).map((n, i) => { 
                            return <MContainer key={i} direction="vertical">
                                <Skeleton className="my-2 sm-skeleton"  variant="rectangular" />
                                <MContainer direction="horizontal">
                                    {Array.from({ length: 4 }).map((m, j) => { 
                                        return  <Skeleton key={j} className="my-2 p-3" variant="rectangular" width={150}  sx={{ marginRight: 16, padding: '0px 30px', borderRadius: 10, border: '2px solid #069cb1' }} />
                                    })}
                                </MContainer>
                            </MContainer>
                        })}
                    </>
                </MotionDiv>
                <MotionDiv show={!loading} animation={'fade'}>
                    <>
                        {habilidades_map && Array.from(habilidades_map).map((entry, i) => {
                            return (
                                <MContainer key={i} direction="vertical" styles={{ marginTop: 20 }}>
                                    <Typography sx={{ color: '#069cb1' }} fontWeight={600}>
                                        {entry[0]}
                                    </Typography>
                                    <MContainer direction="horizontal" styles={{ gap: 10 }}>
                                        {entry[1].map((he, j) => {
                                            return (
                                                <Typography
                                                    key={j}
                                                    sx={{ textAlign: 'center', width: 200, padding: '0px 30px', borderRadius: '8px!important', border: '2px solid #069cb1' }}
                                                >
                                                    {he}
                                                </Typography>
                                            )
                                        })}
                                    </MContainer>
                                </MContainer>
                            )
                        })}
                    </>
                </MotionDiv>
                
            </Grid>
        </Grid>
    )
}
