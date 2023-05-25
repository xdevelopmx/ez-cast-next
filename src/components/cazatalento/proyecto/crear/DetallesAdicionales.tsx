import { Grid, Typography } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, SectionTitle } from '~/components'
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { MTooltip } from '~/components/shared/MTooltip';
import { type ProyectoForm } from '~/pages/cazatalentos/proyecto';
import { FileManager } from '~/utils/file-manager';
import Image from 'next/image'

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
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
                <div style={{ marginTop: 20 }}>
                    <DragNDrop
                        id='id-drag-n-drop-archivo'
                        noIconLabel={true}
                        label={
                            <>
                                <Typography fontWeight={600}>Agregar Archivo</Typography>
                                <Typography fontSize={14} fontWeight={600}>(Guión, Storyboard o Contrato)</Typography>
                            </>
                        }
                        download_url={state.files.archivo?.url}
                        text_label_download='Descargar archivo'
                        files={(state.files.archivo) ? [state.files.archivo] : []}
                        filetypes={['pdf', 'doc', 'docx', 'mp4']}
                        //height={100}
                        onChange={(files: File[]) => {
                            const files_converted = Promise.all(files.map(async (f) => {
                                const base64 = await FileManager.convertFileToBase64(f);
                                return { base64: base64, name: f.name, file: f };
                            }));
                            files_converted.then((files_conv) => {
                                console.log(files_conv)
                                onFormChange({ files: { 
                                    ...state.files, 
                                    archivo: files_conv[0],
                                    touched: {
                                        ...state.files.touched,
                                        archivo: true
                                    } 
                                } })
                            }).catch((err) => {
                                console.log(err);
                                onFormChange({ files: { ...state.files, archivo: undefined } })
                            });
                        }}
                        styleContainerDrag={{
                            backgroundColor: '#fff',
                        }}
                        styleBoxBtnUpload={{
                            border: '1px solid #000',
                            borderRadius: '.5rem'
                        }}
                        mainIcon={
                            <Image src="/assets/img/iconos/ico_pdf_blue.svg" width={20} height={25} alt=""/>
                        }
                        textoArrastrarArchivos={
                            <Typography sx={{fontSize: '1rem'}}>PDF</Typography>
                        }
                        hasNoIconInButton={true}
                        text_button='Subir archivo'
                        stylesButton={{
                            backgroundColor: '#069cb1',
                            color: '#fff',
                            width: '150px',
                            maxWidth: '100%'
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
