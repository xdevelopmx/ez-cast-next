import { type FC } from 'react'
import Image from 'next/image';
import { Grid, Typography } from '@mui/material';
import { MContainer } from '~/components/layout/MContainer';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { type Archivo } from '~/server/api/root';
import classes from './talento-forms.module.css';
import { FileManagerFront } from '~/utils/file-manager-front';
import { DraggableContainer } from '~/components/shared/DraggableList/DraggableContainer';
import { type TalentoFormMedios } from '~/pages/talento/editar-perfil';

interface Props {
    state: TalentoFormMedios,
    onFormChange: (input: { [id: string]: (string | number | number[] | Archivo[]) }) => void;
}

export const EditarMediaTalento: FC<Props> = ({ onFormChange, state }) => {
    console.log(state);
    return (
        <Grid container justifyContent={'space-between'} spacing={2} mb={8}>
            <Grid item xs={12} md={8}>
                <MContainer direction='vertical'>
                    <MContainer direction='horizontal' styles={{ gap: 10 }}>
                        <span className={'badge'}> <Image width={24} height={24} src="/assets/img/iconos/icono_camara_cart_blue.svg" alt="" /> </span>
                        <Typography fontWeight={700} fontSize={'1.3rem'} variant="body1" component="p">
                            Fotos
                        </Typography>
                        <Typography fontWeight={300} fontSize={'1.3rem'} variant="body2" component="p">
                            (Headshots)
                        </Typography>
                        <Typography style={{ marginTop: 4 }} fontWeight={400} fontSize={'.9rem'} variant="body1" component="p">
                            JPG o PNG
                        </Typography>
                        <div className="contToolTip" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<b>Asegúrate de seleccionar el tipo de proyecto adecuado para ti.</b><br/>Ten en cuenta que una vez que selecciones un tipo de proyecto y lo hayas creado, no podrás cambiarlo.
                            Para obtener más orientación, consulta nuestra documentación de ayuda y tutoriales.<br>">?</div>
                    </MContainer>
                    <DraggableContainer
                        width={600}
                        direction={'horizontal'}       
                        onElementsUpdate={(elements_order: number[]) => {
                            const fotos: Archivo[] = [];
                            elements_order.forEach((id) => {
                                const element = state.fotos[id];
                                if (element) {
                                    fotos.push(element);
                                }
                            });
                            onFormChange({ fotos: fotos });
                        }}
                        elements={state.fotos.map((foto, i) => {
                            return {
                                id: i,
                                content:
                                    (i === 0) ?
                                        <>
                                            <p className={classes['link-input-label']} style={{ margin: 0, textAlign: 'center' }}>Foto de perfil</p>
                                            <Image
                                                style={{ margin: 8 }}
                                                className={classes['border-element-selected']}
                                                alt={`Imagen ${foto.name}`}
                                                key={foto.name}
                                                width={128}
                                                height={156}
                                                src={foto.base64}
                                            />
                                        </>
                                        :
                                        <Image
                                            style={{ margin: 8, marginTop: 32 }}
                                            className={classes['border-element']}
                                            alt={`Imagen ${foto.name}`}
                                            key={foto.name}
                                            width={128}
                                            height={156}
                                            src={foto.base64}
                                        />

                            }
                        })}
                    />
                    <DragNDrop
                        id='id-drag-n-drop-fotos'
                        filetypes={['PNG', 'JPG']}
                        max_files={5}
                        maxWidth={'80%'}
                        files={state.fotos}
                        height={'130px'}
                        hide_selected
                        text_button='Añadir foto'
                        onChange={(files: File[]) => {
                            const files_converted = Promise.all(files.map(async (f) => {
                                const base64 = await FileManagerFront.convertFileToBase64(f);
                                return { base64: base64, name: f.name, file: f };
                            }));
                            files_converted.then((files_conv) => {
                                onFormChange({ fotos: files_conv });
                            }).catch((err) => {
                                console.log(err);
                                onFormChange({ fotos: [] });
                            });
                        }}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MContainer direction='vertical'>
                            <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                                <span className={'badge'}> <Image width={24} height={20} src="/assets/img/iconos/web_cam_blue.png" alt="" /> </span>
                                <Typography fontWeight={700} fontSize={'1.3rem'} variant="body1" component="p">
                                    Videos
                                </Typography>
                                <Typography fontWeight={300} fontSize={'1.3rem'} variant="body2" component="p">
                                    (Reel)
                                </Typography>
                                <Typography style={{ marginTop: 4 }} fontWeight={400} fontSize={'.9rem'} variant="body1" component="p">
                                    MP4 o MOV
                                </Typography>
                                <div className="contToolTip" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<b>Asegúrate de seleccionar el tipo de proyecto adecuado para ti.</b><br/>Ten en cuenta que una vez que selecciones un tipo de proyecto y lo hayas creado, no podrás cambiarlo.
                                Para obtener más orientación, consulta nuestra documentación de ayuda y tutoriales.<br>">?</div>
                            </MContainer>
                            <DragNDrop
                                id='id-drag-n-drop-videos'
                                files={state.videos}
                                filetypes={['MP4', 'MOV']}
                                max_files={3}
                                assign_selected_files_height
                                text_button='Añadir Video'
                                onChange={(files: File[]) => {
                                    const files_converted = Promise.all(files.map(async (f) => {
                                        const base64 = await FileManagerFront.convertFileToBase64(f);
                                        return { base64: base64, name: f.name, file: f };
                                    }));
                                    files_converted.then((files_conv) => {
                                        console.log(files_conv)
                                        onFormChange({ videos: files_conv });
                                    }).catch((err) => {
                                        console.log(err);
                                        onFormChange({ videos: [] });
                                    });
                                }}
                            />
                        </MContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <MContainer direction='vertical'>
                            <MContainer direction='horizontal' styles={{ gap: 10 }}>
                                <span className={'badge'}> <Image width={24} height={24} src="/assets/img/iconos/micro_web_blue.svg" alt="" /> </span>
                                <Typography fontWeight={700} fontSize={'1.3rem'} variant="body1" component="p">
                                    Audios
                                </Typography>
                                <Typography style={{ marginTop: 4 }} fontWeight={400} fontSize={'.9rem'} variant="body1" component="p">
                                    MP3 o WAV
                                </Typography>
                                <div className="contToolTip" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<b>Asegúrate de seleccionar el tipo de proyecto adecuado para ti.</b><br/>Ten en cuenta que una vez que selecciones un tipo de proyecto y lo hayas creado, no podrás cambiarlo.
                                Para obtener más orientación, consulta nuestra documentación de ayuda y tutoriales.<br>">?</div>
                            </MContainer>
                            <DragNDrop
                                id='id-drag-n-drop-audios'
                                files={state.audios}
                                filetypes={['MP3', 'WAV']}
                                max_files={3}
                                assign_selected_files_height
                                text_button='Añadir Audio Clip'
                                onChange={(files: File[]) => {
                                    const files_converted = Promise.all(files.map(async (f) => {
                                        const base64 = await FileManagerFront.convertFileToBase64(f);
                                        return { base64: base64, name: f.name, file: f };
                                    }));
                                    files_converted.then((files_conv) => {
                                        onFormChange({ audios: files_conv });
                                    }).catch((err) => {
                                        console.log(err);
                                        onFormChange({ audios: [] });
                                    });
                                }}
                            />
                        </MContainer>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
