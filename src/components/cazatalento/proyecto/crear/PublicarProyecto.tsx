import { Grid } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, MCheckboxGroup, MRadioGroup, MSelect, SectionTitle } from '~/components'
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { ProyectoForm } from '~/pages/cazatalentos/proyecto';
import { FileManagerFront } from '~/utils/file-manager-front';

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const PublicarProyecto: FC<Props> = ({ state, onFormChange }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <SectionTitle title='Paso 6' subtitle='Publicar en Bilboard de Talentos' subtitleSx={{ml: 4, color: '#4ab7c6'}} onClickButton={() => { 
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    //router.push('/talento/editar-perfil?step=3')  
                }} />
            </Grid>
            <Grid item mt={4} xs={12}>
                <DragNDrop
                    id='id-drag-n-drop-archivo'
                    
                    label='Agregar Archivo (Guión, Storyboard o Contrato)'
                    text_label_download='Descargar carta responsiva'
                    files={[]}
                    filetypes={['pdf', 'doc', 'docx']}
                    maxWidth={400}
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
            </Grid>
            <Grid item xs={12} mt={4}>
                <MRadioGroup
                    label='¿Deseas compartir el proyecto en formato poster mantenerlo oculto y solo poner la casa productora?'
                    labelStyle={{fontSize: '1.2rem'}}
                    style={{gap: 0}}
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
