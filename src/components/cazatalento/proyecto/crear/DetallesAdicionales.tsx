import { Grid, Typography } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, SectionTitle } from '~/components'
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { MTooltip } from '~/components/shared/MTooltip';
import { type ProyectoForm } from '~/pages/cazatalentos/proyecto';
import { FileManagerFront } from '~/utils/file-manager-front';

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: (string | number) }) => void;
}

export const DetallesAdicionales: FC<Props> = ({ state, onFormChange }) => {
    return (
        <Grid mb={4} container>
            <Grid item xs={12}>
                <SectionTitle
                    title='Paso 4'
                    subtitle='Detalles adicionales'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                />
            </Grid>
            <Grid item xs={5} mt={8}>
                <FormGroup
                    type={'text-area'}
                    className={'form-input-md'}
                    style={{ width: '100%' }}
                    labelStyle={{ fontWeight: 600, width: '100%' }}
                    labelClassName={'form-input-label'}
                    value={state.sinopsis}
                    tooltip={
                        <MTooltip
                            color='blue'
                            text={
                                <>
                                    <Typography fontSize={14} fontWeight={600}>¿De qué trata tu proyecto?</Typography>
                                    <Typography fontSize={14}>
                                        Sé lo mas descriptivo posible para
                                        que el talento se entusiasme con la
                                        posibilidad de trabajar y unirse a tu
                                        proyecto.
                                    </Typography>
                                </>
                            }
                            placement='right'
                        />
                    }
                    onChange={(e) => {
                        onFormChange({
                            sinopsis: e.target.value
                        })
                    }}
                    label='Sinopsis*'
                />
            </Grid>
            <Grid item xs={4} mt={3} marginLeft={16}>
                <div style={{ marginTop: 40 }}>
                    <DragNDrop
                        id='id-drag-n-drop-archivo'
                        noIconLabel={true}
                        label={
                            <>
                                <Typography fontWeight={600}>Agregar Archivo</Typography>
                                <Typography fontSize={14} fontWeight={600}>(Guión, Storyboard o Contrato)</Typography>
                            </>
                        }
                        text_label_download='Descargar carta responsiva'
                        files={[]}
                        filetypes={['pdf', 'doc', 'docx']}
                        height={100}
                        onChange={(files: File[]) => {
                            const files_converted = Promise.all(files.map(async (f) => {
                                const base64 = await FileManagerFront.convertFileToBase64(f);
                                return { base64: base64, name: f.name, file: f };
                            }));
                            files_converted.then((files_conv) => {
                                console.log(files_conv)
                                // onFormChange({ files: { ...state.files, carta_responsiva: files_conv[0] } })
                            }).catch((err) => {
                                console.log(err);
                                //onFormChange({ files: { ...state.files, carta_responsiva: undefined } })
                            });
                        }}
                    />
                </div>
            </Grid>
            <Grid item xs={5} mt={8}>
                <FormGroup
                    type={'text-area'}
                    className={'form-input-md'}
                    style={{ width: '100%' }}
                    labelStyle={{ fontWeight: 600, width: '100%' }}
                    labelClassName={'form-input-label'}
                    value={state.detalles_adicionales}
                    onChange={(e) => {
                        onFormChange({
                            detalles_adicionales: e.target.value
                        })
                    }}
                    label='Detalles adicionales del proyecto'
                />
            </Grid>

        </Grid>
    )
}