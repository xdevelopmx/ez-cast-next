import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import { api } from '~/utils/api';
import { FormGroup, MCheckboxGroup, MRadioGroup, MSelect, SectionTitle } from '~/components/shared'
import { MTooltip } from '~/components/shared/MTooltip';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { DescripcionDelRolForm } from '~/pages/cazatalentos/roles/agregar-rol';
import { FC, useContext, useReducer} from 'react';
import { FileManager } from '~/utils/file-manager';
import { MContainer } from '~/components/layout/MContainer';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

interface Props {
    fetching: boolean,
    state: DescripcionDelRolForm,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const DescripcionDelRol: FC<Props> = ({ state, onFormChange }) => {
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);  

    const habilidades = api.catalogos.getHabilidades.useQuery({ include_subcategories: false }, {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    const tipos_nsfw = api.catalogos.getTiposNSFW.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    const colores_cabello = api.catalogos.getColorCabello.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
    
    const colores_ojos = api.catalogos.getColorOjos.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title={`${textos['paso']} 4`} subtitle={`${textos['descripcion_rol']}`}
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item container xs={12} mt={4}>
                <Grid item container xs={12}>
                    <Grid item xs={4}>
                        <MRadioGroup
                            label={`${textos['desnudos_o_situaciones_sexuales']}*`}
                            labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                            style={{ gap: 0 }}
                            styleRoot={{ marginTop: 1 }}
                            id="desnudos-situaciones-rol"
                            options={[`${textos['desnudos_o_situaciones_sexuales']}`, `${textos['no_hay_desnudos']}`]}
                            value={state.tiene_nsfw}
                            direction='vertical'
                            onChange={(e) => {
                                onFormChange({
                                    tiene_nsfw: e.target.value
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ padding: '0px 0px 0px 10px', my: 4 }}>
                            <MCheckboxGroup
                                disabled={state.tiene_nsfw === `${textos['no_hay_desnudos']}`}
                                direction='vertical'
                                title={`${textos['rol_involucra']}:`}
                                onChange={(e, i) => {
                                    const nsfw = tipos_nsfw.data?.filter((_, index) => index === i)[0];
                                    if (nsfw) {
                                        onFormChange({
                                            nsfw: {
                                                ...state.nsfw, 
                                                ids: (state.nsfw.ids.includes(nsfw.id)) ?
                                                state.nsfw.ids.filter(n => n !== nsfw.id) :
                                                state.nsfw.ids.concat([nsfw.id])
                                            }
                                        })
                                    }
                                    console.log('change');
                                }}
                                id="tipos-apariencias-rol"
                                labelStyle={{ marginBottom: 0, width: '90%' }}
                                options={(tipos_nsfw.data) ? tipos_nsfw.data.map(n => ctx.lang === 'es' ? n.es : n.en) : []}
                                values={(tipos_nsfw.data) ? tipos_nsfw.data.map(g => {
                                    return state.nsfw.ids.includes(g.id);
                                }) : [false]}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <FormGroup
                            disabled={state.tiene_nsfw === `${textos['no_hay_desnudos']}`}
                            type={'text-area'}
                            className={'form-input-md'}
                            style={{ width: '80%' }}
                            labelStyle={{ fontWeight: 600, width: '100%' }}
                            labelClassName={'form-input-label'}
                            value={state.nsfw.descripcion}
                            onChange={(e) => {
                                onFormChange({
                                    nsfw: { ...state.nsfw, descripcion: e.target.value }
                                })
                            }}
                            label={`${textos['descripcion']}:`}
                        />
                    </Grid>
                    <Grid item xs={4} mb={5}>
                        <MContainer direction="vertical" styles={{gap: 2, marginBottom: 16}}>

                            <MSelect
                                id="tipo-cabello-select"
                                loading={colores_cabello.isFetching}
                                labelStyle={{ marginTop: 32, fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                label={`${textos['color_de_cabello']} *`}
                                options={
                                    (colores_cabello.data)
                                        ? colores_cabello.data.map(s => { return { value: s.id.toString(), label: ctx.lang === 'es' ? s.es : s.en } })
                                        : []
                                }
                                value={(state.id_color_cabello) ? state.id_color_cabello.toString() : '0'}
                                className={'form-input-md'}
                                onChange={(e) => {
                                    onFormChange({
                                        id_color_cabello: parseInt(e.target.value)
                                    })
                                }}
                            />
                            <MSelect
                                id="tipo-ojos-select"
                                loading={colores_ojos.isFetching}
                                labelStyle={{ marginTop: 32, fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                label={`${textos['color_de_ojos']}*`}
                                options={
                                    (colores_ojos.data)
                                        ? colores_ojos.data.map(s => { return { value: s.id.toString(), label: ctx.lang === 'es' ? s.es : s.en } })
                                        : []
                                }
                                value={(state.id_color_ojos) ? state.id_color_ojos.toString() : '0'}
                                className={'form-input-md'}
                                onChange={(e) => {
                                    onFormChange({
                                        id_color_ojos: parseInt(e.target.value)
                                    })
                                }}
                            />
                        </MContainer>
                    </Grid>
                    <Grid item xs={8}>
                        <FormGroup
                            type={'text-area'}
                            className={'form-input-md'}
                            style={{ width: '80%' }}
                            labelStyle={{ fontWeight: 600, width: '100%' }}
                            labelClassName={'form-input-label'}
                            value={state.descripcion}
                            onChange={(e) => {
                                onFormChange({
                                    descripcion: e.target.value
                                }) 
                            }}
                            label={`${textos['descripcion_rol']}*`}
                        />
                    </Grid>
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={12} mb={4}>
                        <MCheckboxGroup
                            textTooltip='Agrega las habilidades recomendadas para este rol que consideres necesarias para que el talento lleve a cabo su trabajo.'
                            title={`${textos['habilidades']}`}
                            onChange={(e, i) => {
                                const habilidad = habilidades.data?.filter((_, index) => index === i)[0];
                                if (habilidad) {
                                    onFormChange({
                                        habilidades:
                                        (state.habilidades.includes(habilidad.id)) ?
                                            state.habilidades.filter(h => h !== habilidad.id) :
                                            state.habilidades.concat([habilidad.id])

                                    })
                                }
                            }}
                            direction='horizontal'
                            id="habilidades-del-rol"
                            labelClassName={'label-black-lg'}
                            options={
                                (habilidades.data)
                                    ? habilidades.data.map(g => ctx.lang === 'es' ? g.es : g.en)
                                    : []
                            }
                            label='¿Qué compensación no monetaria recibirá el talento?'
                            labelStyle={{ fontWeight: '400', fontSize: '1.1rem', width: '45%' }}
                            values={
                                (habilidades.data)
                                    ? habilidades.data.map(g => (state.habilidades.includes(g.id)))
                                    : [false]
                            }
                        />
                        
                    </Grid>
                    <Grid item xs={12} mt={2}>
                        <FormGroup
                            disabled={state.habilidades.length === 0}
                            type={'text-area'}
                            className={'form-input-md'}
                            style={{ width: '80%' }}
                            labelStyle={{ fontWeight: 600, width: '100%' }}
                            labelClassName={'form-input-label'}
                            value={state.especificacion_habilidad}
                            onChange={(e) => {
                                onFormChange({
                                    especificacion_habilidad: e.target.value
                                })
                            }}
                            label={`${textos['especificaciones_habilidad']}`}
                        />
                    </Grid>
                    <Grid item xs={12} mt={4}>
                        <DragNDrop
                            id='id-drag-n-drop-foto-referencia'
                            noIconLabel={true}
                            label={<Typography fontWeight={600}>{`${textos['foto_referencia']}`}:</Typography>}
                            text_label_download={`${textos['descargar']} ${textos['foto']}`}
                            max_file_size={5120}
                            download_url={state.files.foto_referencia?.url}
                            files={(state.files.foto_referencia) ? [state.files.foto_referencia] : []}
                            filetypes={['JPG', 'PNG', 'GIF']}
                            text_button={`${textos['agregar']} ${textos['foto']}`}
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
                                const files_converted = Promise.all(files.map(async (f) => {
                                    const base64 = await FileManager.convertFileToBase64(f);
                                    return { base64: base64, name: f.name, file: f };
                                }));
                                files_converted.then((files_conv) => {
                                    console.log(files_conv)
                                    onFormChange({ files: { 
                                        ...state.files, 
                                        foto_referencia: files_conv[0],
                                        touched: {
                                            ...state.files.touched,
                                            foto_referencia: true
                                        } 
                                    } })
                                }).catch((err) => {
                                    console.log(err);
                                    onFormChange({ files: { ...state.files, archivo: undefined } })
                                });
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} mt={4}>
                        <DragNDrop
                            id='id-drag-n-drop-pdf-rol'
                            noIconLabel={true}
                            label={<Typography fontWeight={600}>{`${textos['lineas']}`}:</Typography>}
                            text_label_download={`${textos['descargar']} ${textos['lineas']}`}
                            max_file_size={5120}
                            download_url={state.files.lineas?.url}
                            files={(state.files.lineas) ? [state.files.lineas] : []}
                            filetypes={['pdf', 'doc', 'docx']}
                            text_button={`${textos['agregar']} PDF`}
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
                                            ...state.files.touched,
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
                <Grid item xs={6} mt={2}>
                        <FormGroup
                            type={'text-area'}
                            className={'form-input-md'}
                            style={{ width: '80%' }}
                            labelStyle={{ fontWeight: 600, width: '100%' }}
                            labelClassName={'form-input-label'}
                            value={state.detalles_adicionales}
                            onChange={(e) => {
                                onFormChange({
                                    detalles_adicionales: e.target.value
                                })
                            }}
                            label={`${textos['detalles_adicionales']}`}
                        />
                    </Grid>
            </Grid>
        </Grid>
    )
}
