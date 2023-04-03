import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import { api } from '~/utils/api';
import { FormGroup, MCheckboxGroup, MRadioGroup, MSelect, SectionTitle } from '~/components/shared'
import { MTooltip } from '~/components/shared/MTooltip';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';

export const DescripcionDelRol = () => {

    const habilidades = api.catalogos.getHabilidades.useQuery({ include_subcategories: true }, {
        refetchOnWindowFocus: false
    })

    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 4' subtitle='Descripción del rol'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item container xs={12} mt={4}>
                <Grid item container xs={6}>
                    <Grid item xs={12}>
                        <FormGroup
                            type={'text-area'}
                            className={'form-input-md'}
                            style={{ width: '80%' }}
                            labelStyle={{ fontWeight: 600, width: '100%' }}
                            labelClassName={'form-input-label'}
                            value={''}
                            onChange={(e) => {
                                /* onFormChange({
                                    sinopsis: e.target.value
                                }) */
                            }}
                            label='Descripción del rol'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MSelect
                            id="sindicato-select"
                            loading={habilidades.isFetching}
                            options={(habilidades.data) ? habilidades.data.map(s => { return { value: s.id.toString(), label: s.es } }) : []}
                            className={'form-input-md'}
                            value={'0'}
                            onChange={(e) => {
                                /* onFormChange({
                                    id_sindicato: parseInt(e.target.value)
                                }) */
                            }}
                            label='Habilidades'
                            tooltip={
                                <MTooltip
                                    color="orange"
                                    placement='right'
                                    text="Agrega las habilidades recomendadas para este rol que consideres necesarias para que el talento lleve a cabo su trabajo."
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={12} mt={4}>
                        <DragNDrop
                            id='id-drag-n-drop-foto-referencia'
                            noIconLabel={true}
                            label={<Typography fontWeight={600}>Foto referencia:</Typography>}
                            text_label_download='Descargar foto'
                            files={[]}
                            filetypes={['JPG', 'PNG', 'GIF']}
                            text_button='Agregar foto'
                            tooltip={{ color: 'orange', placement: 'right', text: 'Te recomendamos agregar fotos para transmitir mejor lo que estás buscando.' }}
                            mainIcon={
                                <Image
                                    src={'/assets/img/iconos/cam_outline_blue.svg'}
                                    width={25}
                                    height={25}
                                    alt="cam-icon"
                                />
                            }
                            onChange={(files: File[]) => {
                                /* const files_converted = Promise.all(files.map(async (f) => {
                                    const base64 = await FileManagerFront.convertFileToBase64(f);
                                    return { base64: base64, name: f.name, file: f };
                                }));
                                files_converted.then((files_conv) => {
                                    console.log(files_conv)
                                    // onFormChange({ files: { ...state.files, carta_responsiva: files_conv[0] } })
                                }).catch((err) => {
                                    console.log(err);
                                    //onFormChange({ files: { ...state.files, carta_responsiva: undefined } })
                                }); */
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} mt={4}>
                        <DragNDrop
                            id='id-drag-n-drop-pdf-rol'
                            noIconLabel={true}
                            label={<Typography fontWeight={600}>Líneas:</Typography>}
                            text_label_download='Descargar PDF'
                            files={[]}
                            filetypes={['pdf', 'doc', 'docx']}
                            text_button='Agregar PDF'
                            mainIcon={
                                <Image
                                    src={'/assets/img/iconos/ico_pdf_blue.svg'}
                                    width={25}
                                    height={25}
                                    alt="cam-icon"
                                />
                            }
                            onChange={(files: File[]) => {
                                /* const files_converted = Promise.all(files.map(async (f) => {
                                    const base64 = await FileManagerFront.convertFileToBase64(f);
                                    return { base64: base64, name: f.name, file: f };
                                }));
                                files_converted.then((files_conv) => {
                                    console.log(files_conv)
                                    // onFormChange({ files: { ...state.files, carta_responsiva: files_conv[0] } })
                                }).catch((err) => {
                                    console.log(err);
                                    //onFormChange({ files: { ...state.files, carta_responsiva: undefined } })
                                }); */
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item container xs={6}>
                    <Grid item xs={12}>
                        <MRadioGroup
                            label='Desnudos/Situaciones Sexuales'
                            labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                            style={{ gap: 0 }}
                            styleRoot={{ marginTop: 1 }}
                            id="desnudos-situaciones-rol"
                            options={['Desnudos/Situaciones Sexuales', 'No hay desnudos y/o situaciones sexuales']}
                            value={'Desnudos/Situaciones Sexuales'}
                            direction='vertical'
                            onChange={(e) => {
                                /* onFormChange({
                                    compartir_nombre: (e.target.value === 'Compartir nombre de proyecto')
                                }) */
                            }}
                        />
                        <Box sx={{ padding: '0px 0px 0px 40px' }}>
                            <MCheckboxGroup
                                direction='vertical'
                                title="El rol involucra:"
                                onChange={(e, i) => {
                                    console.log('change');
                                }}
                                id="tipos-apariencias-rol"
                                labelStyle={{ marginBottom: 0, width: '45%' }}
                                options={['Desnudos', 'Situación sexual']}
                                values={/* (apariencias.data) ? apariencias.data.map(g => {
                                    return state.apariencias_interesado_en_interpretar.includes(g.id);
                                }) : */ [false]}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup
                            type={'text-area'}
                            className={'form-input-md'}
                            style={{ width: '80%' }}
                            labelStyle={{ fontWeight: 600, width: '100%' }}
                            labelClassName={'form-input-label'}
                            value={''}
                            onChange={(e) => {
                                /* onFormChange({
                                    sinopsis: e.target.value
                                }) */
                            }}
                            label='Descripción:'
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
