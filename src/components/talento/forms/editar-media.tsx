import { useContext, type FC } from 'react'
import Image from 'next/image';
import { Grid, Typography } from '@mui/material';
import { MContainer } from '~/components/layout/MContainer';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { type Archivo } from '~/server/api/root';
import { FileManager } from '~/utils/file-manager';
import { DraggableContainer } from '~/components/shared/DraggableList/DraggableContainer';
import { type TalentoFormMedios } from '~/pages/talento/editar-perfil';
import { MTooltip } from '~/components/shared/MTooltip';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

interface Props {
    state: TalentoFormMedios,
    onFormChange: (input: { [id: string]: (string | number | number[] | Archivo[]) }) => void;
}

export const EditarMediaTalento: FC<Props> = ({ onFormChange, state }) => {
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    return (
        <Grid container justifyContent={'space-between'} spacing={2} mb={8}>
            <Grid item xs={12} md={7}>
                <MContainer direction='vertical'>
                    <MContainer direction='horizontal' styles={{ gap: 10, marginBottom: 5, alignItems: 'center' }}>
                        <span className={'badge'}> <Image width={24} height={24} src="/assets/img/iconos/icono_camara_cart_blue.svg" alt="" /> </span>
                        <Typography fontWeight={700} fontSize={'1.1rem'} variant="body1" component="p">
                            {textos['foto'] ? textos['foto'] : 'Texto No Definido'}s
                        </Typography>
                        <Typography fontWeight={300} fontSize={'1.1rem'} variant="body2" component="p">
                            (Headshots)
                        </Typography>
                        <Typography style={{ marginTop: 4 }} fontWeight={400} fontSize={'.8rem'} variant="body1" component="p">
                            JPG {textos['o'] ? textos['o'] : 'Texto No Definido'} PNG
                        </Typography>
                        <MTooltip text={textos['media_fotos_tooltip'] ? textos['media_fotos_tooltip'] : 'Texto No Definido'} sx={{width: '10px!important'}} color='orange' placement='right' />
                    </MContainer>
                    <Typography sx={{ color: '#069CB1', margin: '25px 5px 5px 0px' }}>{textos['elegir_foto_perfil'] ? textos['elegir_foto_perfil'] : 'Texto No Definido'}</Typography>
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

                                    <div style={{ border: i === 0 ? '1px solid #069CB1' : 'none', padding: '10px' }}>
                                        <Image
                                            style={{ objectFit: 'cover' }}

                                            alt={`Imagen ${foto.name}`}
                                            key={foto.name}
                                            width={80}
                                            height={110}
                                            src={foto.base64}
                                        />
                                    </div>

                            }
                        })}
                    />
                    <DragNDrop
                        id='id-drag-n-drop-fotos'
                        filetypes={['PNG', 'JPG', 'JPEG']}
                        max_files={5}
                        maxWidth={'80%'}
                        files={state.fotos}
                        height={'130px'}
                        max_file_size={5120}
                        hide_selected
                        text_button={`${textos['agregar'] ? textos['agregar'] : 'Texto No Definido'} ${textos['foto'] ? textos['foto'] : 'Texto No Definido'}`}
                        onChange={(files: File[]) => {
                            const files_converted = Promise.all(files.map(async (f) => {
                                const base64 = await FileManager.convertFileToBase64(f);
                                const file_on_state = state.fotos.filter(foto => FileManager.compareBase64Strings(base64, foto.base64));
                                if (file_on_state.length > 0) {
                                    return { base64: base64, name: f.name, file: f, id: file_on_state[0]?.id, url: file_on_state[0]?.url };
                                } else {
                                    return { base64: base64, name: f.name, file: f };
                                }
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
            <Grid item xs={12} md={5}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MContainer direction='vertical'>
                            <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                                <span className={'badge'}> <Image width={22} height={19} src="/assets/img/iconos/web_cam_blue.png" alt="" /> </span>
                                <Typography fontWeight={700} fontSize={'1.1rem'} variant="body1" component="p">
                                    Videos
                                </Typography>
                                <Typography fontWeight={300} fontSize={'1.1rem'} variant="body2" component="p">
                                    (Reel)
                                </Typography>
                                <Typography style={{ marginTop: 4 }} fontWeight={400} fontSize={'.8rem'} variant="body1" component="p">
                                    MP4 {textos['o'] ? textos['o'] : 'Texto No Definido'} MOV
                                </Typography>
                                <MTooltip
                                    text={
                                        <>
                                            <Typography fontSize={14} fontWeight={600}>{textos['media_videos_tooltip_titulo'] ? textos['media_videos_tooltip_titulo'] : 'Texto No Definido'}</Typography>
                                            <Typography fontSize={14} fontWeight={400}>
                                                {textos['media_videos_tooltip_body'] ? textos['media_videos_tooltip_body'] : 'Texto No Definido'}
                                            </Typography>
                                        </>
                                    }
                                    color='orange'
                                    placement='top'
                                />
                            </MContainer>
                            <DragNDrop
                                id='id-drag-n-drop-videos'
                                files={state.videos}
                                filetypes={['MP4', 'MOV']}
                                max_files={3}
                                max_file_size={5120}
                                assign_selected_files_height
                                text_button={`${textos['agregar'] ? textos['agregar'] : 'Texto No Definido'} ${textos['video'] ? textos['video'] : 'Texto No Definido'}`}
                                onChange={(files: File[]) => {
                                    const files_converted = Promise.all(files.map(async (f) => {
                                        const base64 = await FileManager.convertFileToBase64(f);
                                        const file_on_state = state.fotos.filter(foto => FileManager.compareBase64Strings(base64, foto.base64));
                                        if (file_on_state.length > 0) {
                                            return { base64: base64, name: f.name, file: f, id: file_on_state[0]?.id };
                                        } else {
                                            return { base64: base64, name: f.name, file: f };
                                        }
                                    }));
                                    files_converted.then((files_conv) => {
                                        console.log(files_conv)
                                        onFormChange({ 
                                            videos: files_conv 
                                        });
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
                            <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                                <span className={'badge'}> <Image width={24} height={24} src="/assets/img/iconos/micro_web_blue.svg" alt="" /> </span>
                                <Typography fontWeight={700} fontSize={'1.1rem'} variant="body1" component="p">
                                    Audios
                                </Typography>
                                <Typography style={{ marginTop: 4 }} fontWeight={400} fontSize={'.8rem'} variant="body1" component="p">
                                    MP3 {textos['o'] ? textos['o'] : 'Texto No Definido'} WAV
                                </Typography>
                                <MTooltip text={textos['media_audios_tooltip'] ? textos['media_audios_tooltip'] : 'Texto No Definido'} color='orange' placement='right' />
                            </MContainer>
                            <DragNDrop
                                id='id-drag-n-drop-audios'
                                files={state.audios}
                                filetypes={['MP3', 'WAV']}
                                max_files={3}
                                max_file_size={5120}
                                assign_selected_files_height
                                text_button={`${textos['agregar'] ? textos['agregar'] : 'Texto No Definido'} ${textos['audio'] ? textos['audio'] : 'Texto No Definido'}`}
                                onChange={(files: File[]) => {
                                    const files_converted = Promise.all(files.map(async (f) => {
                                        const base64 = await FileManager.convertFileToBase64(f);
                                        const file_on_state = state.fotos.filter(foto => FileManager.compareBase64Strings(base64, foto.base64));
                                        if (file_on_state.length > 0) {
                                            return { base64: base64, name: f.name, file: f, id: file_on_state[0]?.id };
                                        } else {
                                            return { base64: base64, name: f.name, file: f };
                                        }
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
