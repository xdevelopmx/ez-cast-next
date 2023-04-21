import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image';
import React from 'react'
import { FormGroup } from '~/components/shared';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';

export const ValidacionRepresentante = () => {
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
                    //download_url={state.files.archivo?.url}
                    text_label_download='Descargar archivo'
                    files={/* (state.files.archivo) ? [state.files.archivo] : */[]}
                    filetypes={['pdf', 'doc', 'docx', 'mp4']}
                    height={100}
                    onChange={(files: File[]) => {
                        /* const files_converted = Promise.all(files.map(async (f) => {
                            const base64 = await FileManagerFront.convertFileToBase64(f);
                            return { base64: base64, name: f.name, file: f };
                        }));
                        files_converted.then((files_conv) => {
                            console.log(files_conv)
                            onFormChange({
                                files: {
                                    ...state.files,
                                    archivo: files_conv[0],
                                    touched: {
                                        ...state.files.touched,
                                        archivo: true
                                    }
                                }
                            })
                        }).catch((err) => {
                            console.log(err);
                            onFormChange({ files: { ...state.files, archivo: undefined } })
                        }); */
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
                    value={/* (state.director_casting) ? state.director_casting : */ ''}
                    style={{
                        marginTop: '10px',
                        width: '100px'
                    }}
                    onChange={(e) => {
                        /* onFormChange({
                            director_casting: e.target.value
                        }) */
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
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        rootStyle={{
                            margin: 0
                        }}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
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

            <Grid item xs={12} mt={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormGroup
                        //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                        //show_error_message
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        rootStyle={{
                            margin: 0,
                            maxWidth: '22%'
                        }}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
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
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        rootStyle={{
                            margin: 0,
                            maxWidth: '22%'
                        }}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
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
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        rootStyle={{
                            margin: 0,
                            maxWidth: '22%'
                        }}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
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
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        rootStyle={{
                            margin: 0,
                            maxWidth: '22%'
                        }}
                        style={{width: '100%'}}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
                        }}
                        label='Teléfono'
                    />
                </Box>
            </Grid>

            <Grid item xs={12} mt={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormGroup
                        //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                        //show_error_message
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        rootStyle={{
                            margin: 0,
                            maxWidth: '22%'
                        }}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
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
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        rootStyle={{
                            margin: 0,
                            maxWidth: '22%'
                        }}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
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
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        rootStyle={{
                            margin: 0,
                            maxWidth: '22%'
                        }}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
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
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        rootStyle={{
                            margin: 0,
                            maxWidth: '22%'
                        }}
                        style={{width: '100%'}}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
                        }}
                        label='Teléfono'
                    />
                </Box>
            </Grid>

        </Grid>
    )
}
