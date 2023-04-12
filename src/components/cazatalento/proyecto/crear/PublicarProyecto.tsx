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
                    files={[]}
                    filetypes={['png', 'jpg', 'jpeg', 'mp4']}
                    maxWidth={400}
                    height={100}
                    onChange={(files: File[]) => {
                        const files_converted = Promise.all(files.map(async (f) => {
                            const base64 = await FileManagerFront.convertFileToBase64(f);
                            return { base64: base64, name: f.name, file: f };
                        }));
                        files_converted.then((files_conv) => {
                            const file = files_conv[0];
                            if (file) {
                                onFormChange({
                                    files: {
                                        ...state.files,
                                        foto_portada: { base64: file.base64, name: file.file.name, type: file.file.type }
                                    }    
                                })
                            }
                            // onFormChange({ files: { ...state.files, carta_responsiva: files_conv[0] } })
                        }).catch((err) => {
                            console.log(err);
                            //onFormChange({ files: { ...state.files, carta_responsiva: undefined } })
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
