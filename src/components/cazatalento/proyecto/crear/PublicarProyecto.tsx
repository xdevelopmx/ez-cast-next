import { Grid, Typography } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, MCheckboxGroup, MRadioGroup, MSelect, SectionTitle } from '~/components'
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { type ProyectoForm } from '~/pages/cazatalentos/proyecto';
import { FileManager } from '~/utils/file-manager';
import { FileManagerFront } from '~/utils/file-manager-front';

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const PublicarProyecto: FC<Props> = ({ state, onFormChange }) => {
    console.log('STATEEE PROYECTO', state);
    return (
        <Grid container>
            <Grid item xs={12}>
                <SectionTitle
                    title='Paso 6'
                    subtitle='Publicar en Bilboard de Talentos'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                />
            </Grid>
            <Grid item mt={4} xs={12}>
                <DragNDrop
                    id='id-drag-n-drop-archivo'
                    noIconLabel={true}
                    label={<Typography fontWeight={600}>Agregar una foto de portada para tu proyecto</Typography>}
                    text_label_download='Descargar foto'
                    max_file_size={5120}
                    download_url={state.files.foto_portada?.url}
                    onDownloadUrlRemove={(url) => {
                        console.log(url);
                        /*
                        if (url === state.files.urls.carta_responsiva) {
                                onFormChange({ 
                                    files: { 
                                        ...state.files, 
                                        urls: {
                                            ...state.files.urls,
                                            carta_responsiva: undefined
                                        }
                                    } 
                                })
                            }
                        }}
                        */
                    }}
                    files={(state.files.foto_portada) ? [state.files.foto_portada] : []}
                    filetypes={['png', 'jpg', 'jpeg']}
                    maxWidth={400}
                    height={100}
                    onChange={(files: File[]) => {
                        const files_converted = Promise.all(files.map(async (f) => {
                            const base64 = await FileManagerFront.convertFileToBase64(f);
                            return { base64: base64, name: f.name, file: f };
                        }));
                        files_converted.then((files_conv) => {
                            console.log(files_conv)
                            onFormChange({ files: { 
                                ...state.files, 
                                foto_portada: files_conv[0], 
                                touched: {
                                    ...state.files.touched,
                                    foto_portada: true
                                }
                            } })
                        }).catch((err) => {
                            console.log(err);
                            onFormChange({ files: { ...state.files, foto_portada: undefined } })
                        });
                    }}
                />
            </Grid>
            <Grid item xs={12} mt={4}>
                <MRadioGroup
                    label='¿Deseas compartir el proyecto en formato poster mantenerlo oculto y solo poner la casa productora?'
                    labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                    style={{ gap: 0 }}
                    id="quieres-compartir"
                    options={['Compartir nombre de proyecto', 'Solo compartir casa productora']}
                    value={state.compartir_nombre ? 'Compartir nombre de proyecto' : 'Solo compartir casa productora'}
                    direction='vertical'
                    onChange={(e) => {
                        onFormChange({
                            compartir_nombre: (e.target.value === 'Compartir nombre de proyecto')
                        })
                    }}
                />
            </Grid>
        </Grid>
    )
}
