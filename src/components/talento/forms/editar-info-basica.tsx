import { type FC } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image';
import { FormGroup } from '~/components';
import { MContainer } from '~/components/layout/MContainer';
import { Grid, TextField, Typography } from '@mui/material';
import { MRadioGroup } from '~/components/shared/MRadioGroup';
import classes from './talento-forms.module.css';
import { MSelect } from '~/components/shared/MSelect';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { type TalentoFormInfoBasica } from '~/pages/talento/editar-perfil';

interface Props {
    state?: TalentoFormInfoBasica,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EditarInfoBasicaTalento: FC<Props> = ({ onFormChange, state }) => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={5}>
                <FormGroup className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} label='Nombre*' />
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
                <FormGroup className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} label='Unión' />
            </Grid>
            <Grid item xs={12} md={2}>
               <FormGroup 
                className={classes['form-input-md']} 
                labelClassName={classes['form-input-label']} 
                value={(state) ? state.nombre : ''} 
                onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} 
                label='Ubicación*' 
                icon={<span className="badge"><Image width={24} height={24} src="/assets/img/iconos/cart_location_blue.svg" alt="" /> </span>}
            />
            </Grid>
            <Grid item xs={12} className='my-5' md={12}>
                <MContainer direction='horizontal'>
                    <MSelect 
                        id="edad-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 100 }} 
                        value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Edad*' 
                    />
                    <MRadioGroup style={{ marginLeft: 128 }} id="eres-mayor-de-edad" options={['si', 'no']} labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} label='¿Eres menor de edad?' />
                </MContainer>
            </Grid>
            <Grid item xs={12} className='my-1' md={6}>
                <MContainer direction='vertical'>
                    <Typography className='my-2' fontWeight={700} variant="body1" component="p">
                        Datos de representante o tutor legal*
                    </Typography>
                    <MContainer direction='horizontal'>
                        <FormGroup className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} label='Nombre*' />
                        <FormGroup className={classes['form-input-md']} rootStyle={{ marginLeft: 64 }} labelClassName={classes['form-input-label']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} label='Correo electrónico*' />
                    </MContainer>
                    <MContainer direction='horizontal'>
                        <FormGroup className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} label='Agencia' />
                        <FormGroup className={classes['form-input-md']} rootStyle={{ marginLeft: 64 }} labelClassName={classes['form-input-label']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} label='Teléfono*' />
                    </MContainer>
                </MContainer>
            </Grid>
            <Grid item xs={12} className='my-2' md={6}>
                <DragNDrop
                    id='id-drag-n-drop-carta-responsiva'
                    label='Carta'
                    files={[]}
                    filetypes={['pdf', 'doc', 'docx']}
                    onChange={(files: File[]) => {
                        console.log(files);
                    }}
                />
            </Grid>
            <Grid item xs={12} className='my-4' md={8}>
                <MContainer direction='vertical'>
                    <MContainer className='mt-2' styles={{ width: '100%', alignmentBaseline: 'baseline' }} direction='horizontal'>
                        <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icono_regla_blue.svg" alt="" /> </span>
                        <Typography style={{ marginTop: 8, alignmentBaseline: 'baseline' }} fontWeight={700} variant="body1" component="p">
                            Medidas*
                        </Typography>
                    </MContainer>
                    <MContainer className='mt-2' styles={{ width: '60%' }} direction='horizontal'>
                        <MContainer className='mt-2' styles={{ width: '30%' }} direction='horizontal'>
                            <p>Peso</p>
                            <FormGroup style={{ marginLeft: 8, width: 64 }} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                            <Typography className='ml-2' fontWeight={700} variant="body1" component="p">
                                KG
                            </Typography>
                        </MContainer>
                        <MContainer className='mt-2 mb-4' styles={{ width: '30%' }} direction='horizontal'>
                            <p>Altura</p>
                            <FormGroup style={{ marginLeft: 8, width: 64 }} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                            <Typography className='ml-2' fontWeight={700} variant="body1" component="p">
                                CM
                            </Typography>
                        </MContainer>
                    </MContainer>
                    <p>Más adelante, puedes agregar medidas para vestuario en la vista final de tu perfil</p>
                </MContainer>
            </Grid>
            <Grid item xs={12} className='my-4' md={6}>
                <MContainer className='mt-2 mb-4' styles={{ width: '25%' }} direction='vertical'>
                    <Typography fontWeight={700} variant="body1" component="p">
                        Acerca de
                    </Typography>
                    <FormGroup type="text-area" style={{ width: 450}} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                </MContainer>
            </Grid>
            <Grid item xs={12} className='mt-4' md={4}>
                <DragNDrop
                    id='id-drag-n-drop-cv'
                    label='CV'
                    files={[]}
                    max_files={4}
                    filetypes={['PDF', 'DOC', 'DOCX']}
                    onChange={(files: File[]) => {
                        console.log(files);
                    }}
                />
            </Grid>
            <Grid item xs={12}  md={12}>
                <MContainer className='mt-2 mb-4' styles={{ width: '50%' }} direction='vertical'>
                    <MContainer className='my-2' styles={{ width: '50%' }} direction='horizontal'>
                        <span className={'badge'}> <Image className='mr-2' width={24} height={24} src="/assets/img/iconos/icono_web_site_blue.svg" alt="" /> </span>
                        <Typography lineHeight={2} fontWeight={700} variant="body1" component="p">
                            Página web
                        </Typography>
                    </MContainer>
                    <FormGroup className={classes['form-input-md']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                </MContainer>
            </Grid>
            <Grid item xs={12}>
                <Typography lineHeight={2} fontWeight={700} variant="body1" component="p">
                    Link a redes sociales:
                </Typography>
            </Grid>
            <Grid item xs={4} className='my-4' md={2}>
                <MContainer className='mt-2 mb-4' styles={{ maxWidth: 150 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Vimeo<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="" /> </span>
                    <FormGroup className={classes['form-input-sm']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                </MContainer>
            </Grid>
            <Grid item xs={4} className='my-4' md={2}>
                <MContainer className='mt-2 mb-4' styles={{ maxWidth: 150 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Instagram<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_insta_blue.svg" alt="" /> </span>
                    <FormGroup className={classes['form-input-sm']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                </MContainer>
            </Grid>
            <Grid item xs={4} className='my-4' md={2}>
                <MContainer className='mt-2 mb-4' styles={{ maxWidth: 150 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Youtube<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_youtube_blue.svg" alt="" /> </span>
                    <FormGroup className={classes['form-input-sm']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                </MContainer>
            </Grid>
            <Grid item xs={4} className='my-4' md={2}>
                <MContainer className='mt-2 mb-4' styles={{ maxWidth: 150 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Twitter<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="" /> </span>
                    <FormGroup className={classes['form-input-sm']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                </MContainer>
            </Grid>
            <Grid item xs={4} className='my-4' md={2}>
                <MContainer className='mt-2 mb-4' styles={{ maxWidth: 150 }} direction='vertical'>
                    <span className={classes['link-input-label']}> IMDB<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_imbd_blue.svg" alt="" /> </span>
                    <FormGroup className={classes['form-input-sm']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                </MContainer>
            </Grid>
            <Grid item xs={4} className='my-4' md={2}>
                <MContainer className='mt-2 mb-4' styles={{ maxWidth: 150 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Linkedin<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="" /> </span>
                    <FormGroup className={classes['form-input-sm']} value={(state) ? state.nombre : ''} onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }} />
                </MContainer>
            </Grid>
            
            
        </Grid>
    )
}
