import { Button, Divider, Grid, Link, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { SectionTitle } from "~/components/shared";
import { MTable } from "~/components/shared/MTable/MTable";

export const Preferencias = () => {
    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Preferencia de roles' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
            
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Mascota</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Actuación, modelado</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Trabajo de Extra</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Locación de Trabajo</Typography>
                    <MContainer direction="vertical">
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} mr={8} fontWeight={500}>Principal</Typography>
                            <Typography fontSize={'1rem'} fontWeight={300}>Si</Typography>  
                        </MContainer>
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={500}>Adicionales</Typography>
                            <Typography fontSize={'1rem'} fontWeight={300}>Si</Typography>  
                        </MContainer>
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Interés en proyectos</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Representante?</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si asodoasd adsoadsj</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Unión/Sindicato</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Documentos</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Disponibilidad para</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Otras profesiones</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Otras profesiones</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}> Meses de embarazo</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                </MContainer>
                <Divider className="my-2" />
            </Grid>
        </Grid>
    )
}
