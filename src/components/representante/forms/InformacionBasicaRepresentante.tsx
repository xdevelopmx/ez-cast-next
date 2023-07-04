import { Box, Divider, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { MContainer } from '~/components/layout/MContainer'
import { FormGroup, MSelect } from '~/components/shared'
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop'
import { MTooltip } from '~/components/shared/MTooltip'
import { InfoBasicaRepresentante } from '~/pages/representante/editar-perfil'
import { api } from '~/utils/api'
import { FileManager } from '~/utils/file-manager'

export const InformacionBasicaRepresentante = (props: {
    state: InfoBasicaRepresentante,
    representante_fetching: boolean,
    onFormChange: (input: { [id: string]: unknown }) => void;
}) => {

    const tipos_sindicatos = api.catalogos.getUniones.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    return (
        <Grid container>
            <Grid item container xs={12}>
                <Grid item container xs={12} gap={2}>
                    <FormGroup
                        //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                        //show_error_message
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={props.state.nombre}
                        onChange={(e) => {
                            props.onFormChange({
                                nombre: e.target.value
                            })
                        }}
                        label='Nombre'
                    />

                    <FormGroup
                        //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                        //show_error_message
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={props.state.apellido}
                        onChange={(e) => {
                            props.onFormChange({
                                apellido: e.target.value
                            })
                        }}
                        label='Apellido'
                    />
                </Grid>
                <Grid item container xs={12}>
                    <Box display={'flex'} flexDirection={'row'}>
                        <MSelect
                            id="sindicato-select"
                            loading={tipos_sindicatos.isFetching}
                            options={(tipos_sindicatos.data) ? tipos_sindicatos.data.map(s => { return { value: s.id.toString(), label: s.es } }) : []}
                            className={'form-input-md'}
                            value={props.state.sindicato.id.toString()}
                            onChange={(e) => {
                                props.onFormChange({
                                    sindicato: {
                                        id: parseInt(e.target.value)
                                    }
                                })
                            }}
                            label='Sindicato/Unión'
                        />
                        {props.state.sindicato.id === 99 &&
                            <FormGroup
                                //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                                //show_error_message
                                rootStyle={{marginLeft: 16}}
                                className={'form-input-md'}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                value={props.state.sindicato.descripcion}
                                onChange={(e) => {
                                    props.onFormChange({
                                        sindicato: {...props.state.sindicato, descripcion: e.target.value}
                                    })
                                }}
                                label='Otro'
                            />
                        }
                    </Box>
                </Grid>
                <Grid xs={12} mt={4}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item container xs={12} mt={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                            src="/assets/img/iconos/cart_location_blue.svg"
                            width={20}
                            height={20}
                            alt="icon" />
                        <Typography fontWeight={600} sx={{ fontSize: '1.1rem', color: '#069cb1' }}>Ubicación</Typography>
                    </Box>
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={3}>
                        <MSelect
                            id="sindicato-select"
                            options={
                                (estados_republica.data)
                                    ? estados_republica.data.map(e => { return { value: e.id.toString(), label: e.es } })
                                    : []
                            }
                            style={{ width: 200 }}
                            value={props.state.ubicacion.id_estado_republica.toString()}
                            onChange={(e) => {
                                props.onFormChange({
                                    ubicacion: {...props.state.ubicacion, id_estado_republica: parseInt(e.target.value)}
                                })
                            }}
                            label='Locación de proyecto*'
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <FormGroup
                            //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                            //show_error_message
                            labelStyle={{ fontWeight: 600 }}
                            labelClassName={'form-input-label'}
                            value={props.state.ubicacion.direccion}
                            onChange={(e) => {
                                props.onFormChange({
                                    ubicacion: {...props.state.ubicacion, direccion: e.target.value}
                                })
                            }}
                            label='Dirección'
                        />
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={3}>
                        <FormGroup
                            //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                            //show_error_message
                            type='number'
                            labelStyle={{ fontWeight: 600 }}
                            labelClassName={'form-input-label'}
                            value={props.state.ubicacion.cp.toString()}
                            onChange={(e) => {
                                props.onFormChange({
                                    ubicacion: {...props.state.ubicacion, cp: parseInt(e.target.value)}
                                })
                            }}
                            style={{
                                width: '100px'
                            }}
                            label='CP'
                        />
                    </Grid>
                </Grid>
                <Grid xs={12} mt={4}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={12} className='my-4' md={7}>
                    <MContainer className='mt-2 mb-4' styles={{ width: '100%' }} direction='vertical'>
                        <Typography fontWeight={700} variant="body1" component="p" style={{ marginBottom: 5 }}>
                            Acerca de
                            <MTooltip
                                text={
                                    <>
                                        <Typography fontSize={14} fontWeight={600}>Cuentanos sobre ti</Typography>
                                        <Typography fontSize={14} fontWeight={400}>
                                            Te recomendamos escribir un texto breve que describa tu formación profesional e intereses
                                        </Typography>
                                    </>
                                }
                                color='orange'
                                placement='right'
                            />
                        </Typography>
                        <FormGroup
                            type="text-area"
                            style={{ width: '70%' }}
                            value={props.state.biografia}
                            onChange={(e) => {
                                props.onFormChange({ biografia: e.currentTarget.value })
                            }}
                        />
                    </MContainer>
                </Grid>
                <Grid item xs={12} md={4} className='mt-4' justifyContent={'end'}>
                    <DragNDrop
                        id='id-drag-n-drop-cv'
                        label='Subir CV'
                        max_file_size={5120}
                        download_url={props.state.files.urls.cv}
                        onDownloadUrlRemove={(url: string) => {
                            if (url === props.state.files.urls.cv) {
                                props.onFormChange({
                                    files: {
                                        ...props.state.files,
                                        urls: {
                                            ...props.state.files.urls,
                                            cv: undefined
                                        }
                                    }
                                })
                            }
                        }}
                        tooltip={{ text: 'Recuerda añadir la versión más actualizada de tu currículum en formato PDF', color: 'orange', placement: 'top' }}
                        height={100}
                        files={(props.state.files && props.state.files.cv) ? [props.state.files.cv] : []}
                        filetypes={['PDF', 'DOC', 'DOCX']}
                        onChange={(files: File[]) => {
                            const files_converted = Promise.all(files.map(async (f) => {
                                const base64 = await FileManager.convertFileToBase64(f);
                                return { base64: base64, name: f.name, file: f };
                            }));
                            files_converted.then((files_conv) => {
                                props.onFormChange({ files: { ...props.state.files, cv: files_conv[0] } })
                            }).catch((err) => {
                                console.log(err);
                                props.onFormChange({ files: { ...props.state.files, cv: undefined } })
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <MContainer className='mt-2 mb-4' styles={{ width: '50%' }} direction='vertical'>
                        <MContainer className='my-2' styles={{ width: '50%' }} direction='horizontal'>
                            <span className={'badge'}> <Image className='mr-2' width={24} height={24} src="/assets/img/iconos/icono_web_site_blue.svg" alt="" /> </span>
                            <Typography lineHeight={2} fontWeight={700} variant="body1" component="p">
                                Página web
                            </Typography>
                            <MTooltip sx={{ mt: 1 }} text='Añade aquí el link de tu página web o portafolio que mejor represente tu trabajo, recuerda que este link será visible en tu perfil para los Cazatalentos.' color='orange' placement='right' />
                        </MContainer>
                        <FormGroup
                            className={'form-input-md'}
                            value={(props.state.redes_sociales) ? props.state.redes_sociales.pagina_web : ''}
                            onChange={(e) => {
                                props.onFormChange({ redes_sociales: { ...props.state.redes_sociales, pagina_web: e.target.value } })
                            }}
                        />
                    </MContainer>
                </Grid>
                <Grid item xs={12}>
                    <Typography lineHeight={2} fontWeight={700} variant="body1" component="p">
                        Link a redes sociales:
                    </Typography>
                </Grid>
                <Grid item xs={4} md={2}>
                    <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                        <span className={'link-input-label'}> Vimeo<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="" /> </span>
                        <FormGroup
                            className={'form-input-sm'}
                            value={(props.state && props.state.redes_sociales) ? props.state.redes_sociales.vimeo : ''}
                            onChange={(e) => {
                                props.onFormChange({ redes_sociales: { ...props.state?.redes_sociales, vimeo: e.target.value } })
                            }}
                        />
                    </MContainer>
                </Grid>
                <Grid item xs={4} md={2}>
                    <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                        <span className={'link-input-label'}> Instagram<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_insta_blue.svg" alt="" /> </span>
                        <FormGroup
                            className={'form-input-sm'}
                            value={(props.state && props.state.redes_sociales) ? props.state.redes_sociales.instagram : ''}
                            onChange={(e) => {
                                props.onFormChange({ redes_sociales: { ...props.state?.redes_sociales, instagram: e.target.value } })
                            }}
                        />
                    </MContainer>
                </Grid>
                <Grid item xs={4} md={2}>
                    <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                        <span className={'link-input-label'}> Youtube<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_youtube_blue.svg" alt="" /> </span>
                        <FormGroup
                            className={'form-input-sm'}
                            value={(props.state && props.state.redes_sociales) ? props.state.redes_sociales.youtube : ''}
                            onChange={(e) => {
                                props.onFormChange({ redes_sociales: { ...props.state?.redes_sociales, youtube: e.target.value } })
                            }}
                        />
                    </MContainer>
                </Grid>
                <Grid item xs={4} md={2}>
                    <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                        <span className={'link-input-label'}> Twitter<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="" /> </span>
                        <FormGroup
                            className={'form-input-sm'}
                            value={(props.state && props.state.redes_sociales) ? props.state.redes_sociales.twitter : ''}
                            onChange={(e) => {
                                props.onFormChange({ redes_sociales: { ...props.state?.redes_sociales, twitter: e.target.value } })
                            }}
                        />
                    </MContainer>
                </Grid>
                <Grid item xs={4} md={2}>
                    <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                        <span className={'link-input-label'}> IMDB<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_imbd_blue.svg" alt="" /> </span>
                        <FormGroup
                            className={'form-input-sm'}
                            value={(props.state && props.state.redes_sociales) ? props.state.redes_sociales.imdb : ''}
                            onChange={(e) => {
                                props.onFormChange({ redes_sociales: { ...props.state?.redes_sociales, imdb: e.target.value } })
                            }}
                        />
                    </MContainer>
                </Grid>
                <Grid item xs={4} md={2}>
                    <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                        <span className={'link-input-label'}> Linkedin<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="" /> </span>
                        <FormGroup
                            className={'form-input-sm'}
                            value={(props.state && props.state.redes_sociales) ? props.state.redes_sociales.linkedin : ''}
                            onChange={(e) => {
                                props.onFormChange({ redes_sociales: { ...props.state?.redes_sociales, linkedin: e.target.value } })
                            }}
                        />
                    </MContainer>
                </Grid>
            </Grid>
        </Grid>
    )
}
