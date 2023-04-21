import Image from 'next/image'
import { Grid, Typography } from "@mui/material"
import { FormGroup, MCheckboxGroup, SectionTitle } from "~/components/shared"
import DragNDrop from "~/components/shared/DragNDrop/DragNDrop"
import { SelftapeRolForm } from '~/pages/cazatalentos/roles/agregar-rol';
import { FC, useReducer } from 'react';
import { FileManager } from '~/utils/file-manager';

interface Props {
    state: SelftapeRolForm,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const SelfTapeRol: FC<Props> = ({ state, onFormChange }) => {

    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 8' subtitle='Self-Tape (opcional)'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item xs={12} mt={2}>
                <MCheckboxGroup
                    title=''
                    onChange={(e, i) => {
                        onFormChange({
                            pedir_selftape: e
                        })
                    }}
                    direction='horizontal'
                    id="pedir-self-tape"
                    options={['Pedir Self-Tape']}
                    label=''
                    labelStyle={{ fontWeight: 400, fontSize: '1.1rem' }}
                    values={[state.pedir_selftape]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                />
            </Grid>
            <Grid item xs={6} mt={2}>
                <FormGroup
                    type={'text-area'}
                    className={'form-input-md'}
                    style={{ width: '80%' }}
                    labelStyle={{ fontWeight: 600, width: '100%', marginTop: 10 }}
                    labelClassName={'form-input-label'}
                    value={state.indicaciones}
                    onChange={(e) => {
                        onFormChange({
                            indicaciones: e.target.value
                        })
                    }}
                    label='Indicaciones'
                />
            </Grid>
            <Grid item xs={6} mt={2}>
                <DragNDrop
                    id='id-drag-n-drop-foto-referencia'
                    noIconLabel={true}
                    label={<Typography fontWeight={600}>Líneas</Typography>}
                    text_label_download='Descargar lineas'
                    max_file_size={5120}
                    download_url={state.files.lineas?.url}
                    files={(state.files.lineas) ? [state.files.lineas] : []}
                    filetypes={['DOC', 'DOCX', 'PDF']}
                    text_button='Subir'
                    mainIcon={
                        <Image
                            src={'/assets/img/iconos/ico_pdf_blue.svg'}
                            width={25}
                            height={25}
                            alt="cam-icon"
                        />
                    }
                    onChange={(files: File[]) => {
                        const files_converted = Promise.all(files.map(async (f) => {
                            const base64 = await FileManager.convertFileToBase64(f);
                            return { base64: base64, name: f.name, file: f };
                        }));
                        files_converted.then((files_conv) => {
                            console.log(files_conv)
                            onFormChange({ files: { 
                                ...state.files, 
                                lineas: files_conv[0],
                                touched: {
                                    lineas: true
                                } 
                            } })
                        }).catch((err) => {
                            console.log(err);
                            onFormChange({ files: { ...state.files, archivo: undefined } })
                        });
                    }}
                />
            </Grid>
        </Grid>
    )
}
