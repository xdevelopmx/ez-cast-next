import { Grid } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, MSelect, SectionTitle } from '~/components'
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { ProyectoForm } from '~/pages/cazatalentos/proyecto';
import { FileManagerFront } from '~/utils/file-manager-front';

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: (string | number) }) => void;
}

export const DetallesAdicionales: FC<Props> = ({ state, onFormChange }) => {
    return (
        <Grid mb={4} container>
            <Grid item xs={12}>
                <SectionTitle title='Paso 4' subtitle='Detalles adicionales' subtitleSx={{ml: 4, color: '#4ab7c6'}} onClickButton={() => { 
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    //router.push('/talento/editar-perfil?step=3')  
                }} />
            </Grid>
            <Grid item xs={5} mt={8}>
                <FormGroup
                    type={'text-area'}
                    className={'form-input-md'}
                    style={{width: '100%'}}
                    labelStyle={{ fontWeight: 400, width: '100%' }}
                    labelClassName={'form-input-label'}
                    value={state.sinopsis}
                    onChange={(e) => { 
                        onFormChange({ 
                            sinopsis: e.target.value
                        }) 
                    }}
                    label='Sinopsis*'
                />
            </Grid>
            <Grid item xs={4} mt={3} marginLeft={16}>
                <DragNDrop
                    id='id-drag-n-drop-archivo'
                    
                    label='Agregar Archivo (Guión, Storyboard o Contrato)'
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
            </Grid>
            <Grid item xs={5} mt={8}>
                <FormGroup
                    type={'text-area'}
                    className={'form-input-md'}
                    style={{width: '100%'}}
                    labelStyle={{ fontWeight: 400, width: '100%' }}
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
