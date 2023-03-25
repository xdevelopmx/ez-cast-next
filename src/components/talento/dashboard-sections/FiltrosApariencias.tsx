import { Button, Divider, Grid, Link, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import Image from 'next/image';
import { SectionTitle } from "~/components/shared";
import { MTable } from "~/components/shared/MTable/MTable";

export const FiltrosApariencias = () => {
    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Apariencia' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
            
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Rango de edad a interpretar</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Actuación, modelado</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Genero</Typography>
                    <MContainer direction="vertical">
                        <MContainer className="mb-2" direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} mr={8} fontWeight={500}>Talento interesado en interpretar</Typography>
                            <Typography fontSize={'1rem'} fontWeight={300}>Si</Typography>  
                        </MContainer>
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={500}>Adicionalmente se identifica como</Typography>
                            <Typography fontSize={'1rem'} fontWeight={300}>Si</Typography>  
                        </MContainer>
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Apariencia étnica</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si</Typography>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between'>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Color de Cabello</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si</Typography>  
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Dispuesto cambiar de color?</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between'>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Estilo de Cabello</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si</Typography>  
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Dispuesto a cortar?</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between'>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Vello Facial</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si</Typography>  
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>¿Dispuesto a crecer o afeitar?</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Color de ojos</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Si asodoasd adsoadsj</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Tatuajes</Typography>
                    <MContainer direction="vertical">
                        <Typography fontSize={'1.2rem'} fontWeight={400}>Sindicato</Typography>  
                        <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                        <Divider className="my-2"/>
                        <Typography fontSize={'1.2rem'} fontWeight={400}>Sindicato</Typography>  
                        <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                        <Divider className="my-2"/>
                        <Typography fontSize={'1.2rem'} fontWeight={400}>Sindicato</Typography>  
                        <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Piercings</Typography>
                    <MContainer direction="vertical">
                        <Typography fontSize={'1.2rem'} fontWeight={400}>Sindicato</Typography>  
                        <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                        <Divider className="my-2"/>
                        <Typography fontSize={'1.2rem'} fontWeight={400}>Sindicato</Typography>  
                        <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                        <Divider className="my-2"/>
                        <Typography fontSize={'1.2rem'} fontWeight={400}>Sindicato</Typography>  
                        <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Gemelo o trillizo</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                </MContainer>
                <Divider className="my-2" />
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Atributos o condiciones únicas</Typography>
                    <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                </MContainer>
                <Divider className="my-2" />
                
            </Grid>
            <Grid my={8} item xs={12}>
                <SectionTitle title='Medidas' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
                <MContainer className="my-4" direction="horizontal" justify='space-between' styles={{maxWidth: '75%'}}>
                    <Typography fontSize={'1.4rem'} sx={{ color: '#4ab7c6' }} fontWeight={600}>Generales</Typography>
                    <MContainer direction="vertical">
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={400} mr={8}>Cadera (cm)</Typography>  
                            <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                        </MContainer>
                        <Divider className="my-2"/>
                        <MContainer direction="horizontal" justify='space-between'>
                            <Typography fontSize={'1.2rem'} fontWeight={400} mr={8}>Entrepierna (cm)</Typography>  
                            <Typography fontSize={'1rem'} fontWeight={400}>Sindicato</Typography>  
                        </MContainer>
                        <Divider className="my-2"/>
                         
                    </MContainer>
                </MContainer>
                <Divider className="my-2" />
                
                
            </Grid>
        </Grid>
    )
}
