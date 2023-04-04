import Image from 'next/image'
import { Grid, Typography } from "@mui/material"
import { FormGroup, MCheckboxGroup, SectionTitle } from "~/components/shared"
import DragNDrop from "~/components/shared/DragNDrop/DragNDrop"


export const SelfTapeRol = () => {
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
                        /** */
                    }}
                    direction='horizontal'
                    id="pedir-self-tape"
                    options={['Pedir Self-Tape']}
                    label=''
                    labelStyle={{ fontWeight: 400, fontSize: '1.1rem' }}
                    values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                />
            </Grid>
            <Grid item xs={6} mt={2}>
                <FormGroup
                    type={'text-area'}
                    className={'form-input-md'}
                    style={{ width: '80%' }}
                    labelStyle={{ fontWeight: 600, width: '100%', marginTop: 10 }}
                    labelClassName={'form-input-label'}
                    value={''}
                    onChange={(e) => {
                        /* onFormChange({
                            sinopsis: e.target.value
                        }) */
                    }}
                    label='Indicaciones'
                />
            </Grid>
            <Grid item xs={6} mt={2}>
                <DragNDrop
                    id='id-drag-n-drop-foto-referencia'
                    noIconLabel={true}
                    label={<Typography fontWeight={600}>Líneas</Typography>}
                    text_label_download='Descargar foto'
                    files={[]}
                    filetypes={['JPG', 'PNG', 'GIF']}
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
    )
}
