import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image';
import React from 'react'
import { FormGroup } from '~/components/shared';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { ValidacionRepresentante } from '~/pages/representante/editar-perfil';
import { FileManager } from '~/utils/file-manager';

export const ValidacionRepresentanteView = (props: {
    state: ValidacionRepresentante,
    representante_fetching: boolean,
    onFormChange: (input: { [id: string]: unknown }) => void;
}) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <DragNDrop
                    id='id-drag-n-drop-archivo'
                    noIconLabel={true}
                    label={
                        <Typography fontWeight={600}>
                            Copia/Doc Licencia de Agencia de Talento
                        </Typography>
                    }
                    download_url={props.state.files.urls.licencia}
                    onDownloadUrlRemove={(url: string) => {
                        if (url === props.state.files.urls.licencia) {
                            props.onFormChange({
                                files: {
                                    ...props.state.files,
                                    urls: {
                                        ...props.state.files.urls,
                                        licencia: undefined
                                    }
                                }
                            })
                        }
                    }}
                    text_label_download='Descargar archivo'
                    files={(props.state.files && props.state.files.licencia) ? [props.state.files.licencia] : []}
                    filetypes={['pdf', 'doc', 'docx', 'mp4']}
                    height={100}
                    onChange={(files: File[]) => {
                        const files_converted = Promise.all(files.map(async (f) => {
                            const base64 = await FileManager.convertFileToBase64(f);
                            return { base64: base64, name: f.name, file: f };
                        }));
                        files_converted.then((files_conv) => {
                            props.onFormChange({ files: { ...props.state.files, licencia: files_conv[0] } })
                        }).catch((err) => {
                            console.log(err);
                            props.onFormChange({ files: { ...props.state.files, licencia: undefined } })
                        });
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography fontWeight={600}>
                    Número de Clientes con su nombre
                    <Typography sx={{ color: '#069cb1', paddingLeft: '5px' }} component={'span'}>
                        (Esta información no se verá reflejada en el perfil)
                    </Typography>
                </Typography>
                <FormGroup
                    //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                    //show_error_message
                    type='number'
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={(props.state.numero_clientes) ? props.state.numero_clientes.toString() : ''}
                    style={{
                        marginTop: '10px',
                        width: '100px'
                    }}
                    onChange={(e) => {
                        props.onFormChange({
                            numero_clientes: parseInt(e.target.value)
                        })
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <Typography fontWeight={600}>
                    IMDb Pro link
                    <Typography sx={{ color: '#069cb1', paddingLeft: '5px' }} component={'span'}>
                        (opcional)
                    </Typography>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: '10px' }}>
                    <Image src="/assets/img/iconos/icono_web_site_blue.svg" width={30} height={30} alt="" />
                    <FormGroup
                        //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                        //show_error_message
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={(props.state.IMDB_pro_link) ? props.state.IMDB_pro_link :  ''}
                        rootStyle={{
                            margin: 0
                        }}
                        onChange={(e) => {
                            props.onFormChange({
                                IMDB_pro_link: e.target.value
                            })
                        }}
                    />
                </Box>
            </Grid>

            <Grid item xs={12} mt={4}>
                <Typography>
                    Adicionalmente, hacer mención de 2 directores de casting en tu región, de preferencia que usen el servicio Talent Corner,
                    para validar tu cuenta.”
                </Typography>
            </Grid>

            {props.state.directores_casting.map((d, i) => {
                return (
                    <Grid item xs={12} mt={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormGroup
                                //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                                //show_error_message
                                className={'form-input-md'}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                value={d.nombre}
                                rootStyle={{
                                    margin: 0,
                                    maxWidth: '22%'
                                }}
                                onChange={(e) => {
                                    props.onFormChange({
                                        directores_casting: props.state.directores_casting.map((dir, j) => { 
                                            if (i === j) {
                                                return {...dir, nombre: e.target.value};
                                            }
                                            return dir;
                                        })
                                    })
                                }}
                                style={{width: '100%'}}
                                label='Nombre'
                            />
                            <FormGroup
                                //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                                //show_error_message
                                className={'form-input-md'}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                value={d.apellido}
                                rootStyle={{
                                    margin: 0,
                                    maxWidth: '22%'
                                }}
                                onChange={(e) => {
                                    props.onFormChange({
                                        directores_casting: props.state.directores_casting.map((d, j) => { 
                                            if (i === j) {
                                                return {...d, apellido: e.target.value};
                                            }
                                            return d;
                                        })
                                    })
                                }}
                                style={{width: '100%'}}
                                label='Apellido'
                            />
                            <FormGroup
                                //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                                //show_error_message
                                type='email'
                                className={'form-input-md'}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                value={d.correo_electronico}
                                rootStyle={{
                                    margin: 0,
                                    maxWidth: '22%'
                                }}
                                onChange={(e) => {
                                    props.onFormChange({
                                        directores_casting: props.state.directores_casting.map((d, j) => { 
                                            if (i === j) {
                                                return {...d, correo_electronico: e.target.value};
                                            }
                                            return d;
                                        })
                                    })
                                }}
                                style={{width: '100%'}}
                                label='Correo Electrónico'
                            />
                            <FormGroup
                                //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                                //show_error_message
                                type='number'
                                className={'form-input-md'}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                value={d.telefono}
                                rootStyle={{
                                    margin: 0,
                                    maxWidth: '22%'
                                }}
                                style={{width: '100%'}}
                                onChange={(e) => {
                                    props.onFormChange({
                                        directores_casting: props.state.directores_casting.map((d, j) => { 
                                            if (i === j) {
                                                return {...d, telefono: e.target.value};
                                            }
                                            return d;
                                        })
                                    })
                                }}
                                label='Teléfono'
                            />
                        </Box>
                    </Grid>
                )
            })}
        </Grid>
    )
}
