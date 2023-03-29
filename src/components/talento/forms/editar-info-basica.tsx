import { useMemo, type FC } from 'react'
import Image from 'next/image';
import { FormGroup } from '~/components';
import { MContainer } from '~/components/layout/MContainer';
import { Grid, Typography, useTheme } from '@mui/material';
import { MRadioGroup } from '~/components/shared/MRadioGroup';
import classes from './talento-forms.module.css';
import { MSelect } from '~/components/shared/MSelect';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { type TalentoFormInfoGral } from '~/pages/talento/editar-perfil';
import { FileManagerFront } from '~/utils/file-manager-front';
import { api } from '~/utils/api';
import MotionDiv from '~/components/layout/MotionDiv';

interface Props {
    state: TalentoFormInfoGral,
    talento_fetching: boolean,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

//const REDES_SOCIALES = ['pagina_web', 'vimeo', 'instagram', 'youtube', 'twitter', 'imdb', 'linkedin'];
//const URL_PATTERN = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const EMAIL_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const EditarInfoBasicaTalento: FC<Props> = ({ onFormChange, state, talento_fetching }) => {

    const theme = useTheme()

    const uniones = api.catalogos.getUniones.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const is_loading = uniones.isFetching || estados_republica.isFetching;

    const union_selected: { id: number, descripcion: string } = useMemo(() => {

        if (uniones.data) {
            if (state.union.id === 99) {
                // es opcion otro 
                return state.union;
            } else {
                const union_filtered = uniones.data.filter(u => u.id === state.union.id)[0];
                if (union_filtered) {
                    return { id: union_filtered.id, descripcion: union_filtered.es };
                }
            }
        }
        return { id: 0, descripcion: '' };
    }, [state.union, uniones.data]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
                <FormGroup
                    loading={talento_fetching}
                    className={classes['form-input-md']}
                    labelClassName={classes['form-input-label']}
                    value={(state) ? state.nombre : ''}
                    onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                    label='Nombre*'
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <MContainer direction='vertical'>
                    <MSelect
                        loading={is_loading}
                        id="union-select"
                        options={(uniones.isSuccess && uniones.data) ? uniones.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                        className={classes['form-input-md']}
                        value={union_selected.id.toString()}
                        onChange={(e) => {
                            const id = parseInt(e.target.value);
                            onFormChange({ union: { id: id } })
                        }}
                        label='Union*'
                    />
                    <MotionDiv show={union_selected.id === 99} animation='fade'>
                        <FormGroup
                            rootStyle={{ marginTop: 16 }}
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={union_selected.descripcion}
                            onChange={(e) => {
                                onFormChange({ union: { ...state.union, descripcion: e.currentTarget.value } })
                            }}
                            label='Nombre Unión'
                        />
                    </MotionDiv>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={4}>
                <MSelect
                    loading={is_loading}
                    id="ubicacion-select"
                    options={(estados_republica.isSuccess && estados_republica.data) ? estados_republica.data.map(e => { return { value: e.id.toString(), label: e.es } }) : []}
                    className={classes['form-input-md']}
                    value={(state) ? state.id_estado_republica.toString() : '0'}
                    onChange={(e) => { onFormChange({ id_estado_republica: parseInt(e.target.value) }) }}
                    label='Ubicacion*'
                    icon={<span className="badge"><Image width={24} height={24} src="/assets/img/iconos/cart_location_blue.svg" alt="" /> </span>}
                />
            </Grid>
            <Grid container item xs={12} className='mt-5 mb-3' md={12}>
                <Grid item xs={2}>

                    <MSelect
                        id="edad-select"
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return { value: (i + 1).toString(), label: (i + 1).toString() } })}
                        style={{ width: 100 }}
                        value={(state) ? state.edad.toString() : '0'}
                        onChange={(e) => {
                            onFormChange({ edad: parseInt(e.target.value), es_menor_de_edad: (parseInt(e.target.value) >= 18) ? 'No' : 'Sí' })
                        }}
                        label='Edad*'
                    />

                </Grid>
                <Grid item xs={9}>
                    <MRadioGroup
                        style={{ marginLeft: 128 }}
                        id="eres-mayor-de-edad"
                        options={['Sí', 'No']}
                        labelStyle={{ marginLeft: 112, fontWeight: 500, fontSize: '1.1rem', color: '#4ab7c6' }}
                        value={state.es_menor_de_edad}
                        onChange={(e) => {
                            onFormChange({ es_menor_de_edad: e.target.value , edad: (e.target.value === 'No') ? 18 : 17 }) 
                        }}
                        label='¿Eres menor de edad?'
                    />

                </Grid>

            </Grid>
            <Grid item xs={12} md={7} className='my-1'>
                <MotionDiv show={(state) ? state.edad < 18 : false} animation='fade'>
                    <MContainer direction='vertical'>
                        <Typography className='my-2' fontWeight={700} variant="body1" component="p">
                            Datos de representante o tutor legal*
                        </Typography>
                        <MContainer direction='horizontal' styles={{ gap: 40 }}>
                            <FormGroup
                                error={(() => {
                                    if (state.representante) {
                                        if (state.representante.nombre.length === 0) {
                                            return 'El nombre no debe estar vacio';
                                        } 
                                    }
                                    return undefined;
                                })()}
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                labelStyle={{ fontWeight: 400 }}
                                value={(state && state.representante) ? state.representante.nombre : ''}
                                onChange={(e) => { onFormChange({ representante: { ...state?.representante, nombre: e.currentTarget.value } }) }}
                                label='Nombre*'
                            />
                            <FormGroup
                                error={(() => {
                                    if (state.representante) {
                                        if (!EMAIL_PATTERN.test(state.representante.email)) {
                                            return 'El email es invalido';
                                        } 
                                    }
                                    return undefined;
                                })()}
                                className={classes['form-input-md']}
                                labelStyle={{ fontWeight: 400 }}
                                labelClassName={classes['form-input-label']}
                                value={(state && state.representante) ? state.representante.email : ''}
                                onChange={(e) => { onFormChange({ representante: { ...state?.representante, email: e.currentTarget.value } }) }}
                                label='Correo electrónico*'
                            />
                        </MContainer>
                        <MContainer direction='horizontal' styles={{ gap: 40 }}>
                            <FormGroup
                                className={classes['form-input-md']}
                                labelStyle={{ fontWeight: 400 }}
                                labelClassName={classes['form-input-label']}
                                value={(state && state.representante) ? state.representante.agencia : ''}
                                onChange={(e) => { onFormChange({ representante: { ...state?.representante, agencia: e.currentTarget.value } }) }}
                                label='Agencia'
                            />
                            <FormGroup
                                error={(() => {
                                    if (state.representante) {
                                        if (state.representante.telefono.length < 10 || state.representante.telefono.length > 12) {
                                            return 'El telefono es invalido';
                                        } 
                                    }
                                    return undefined;
                                })()}
                                className={classes['form-input-md']}
                                labelStyle={{ fontWeight: 400 }}
                                labelClassName={classes['form-input-label']}
                                value={(state && state.representante) ? state.representante.telefono : ''}
                                onChange={(e) => { onFormChange({ representante: { ...state?.representante, telefono: e.currentTarget.value } }) }}
                                label='Teléfono*'
                            />
                        </MContainer>
                    </MContainer>
                </MotionDiv>
            </Grid>
            <Grid item xs={12} md={5} className='my-2' >
                <MotionDiv show={(state) ? state.edad < 18 : false} animation='fade'>
                    <DragNDrop
                        id='id-drag-n-drop-carta-responsiva'
                        show_download_url={(state.files.urls.carta_responsiva) ? state.files.urls.carta_responsiva : undefined}
                        label='Carta Responsiva'
                        text_label_download='Descargar carta responsiva'
                        files={(state.files && state.files.carta_responsiva) ? [state.files.carta_responsiva] : []}
                        filetypes={['pdf', 'doc', 'docx']}
                        height={100}
                        onChange={(files: File[]) => {
                            const files_converted = Promise.all(files.map(async (f) => {
                                const base64 = await FileManagerFront.convertFileToBase64(f);
                                return { base64: base64, name: f.name, file: f };
                            }));
                            files_converted.then((files_conv) => {
                                console.log(files_conv)
                                onFormChange({ files: { ...state.files, carta_responsiva: files_conv[0] } })
                            }).catch((err) => {
                                console.log(err);
                                onFormChange({ files: { ...state.files, carta_responsiva: undefined } })
                            });
                        }}
                    />
                </MotionDiv>
            </Grid>
            <Grid item xs={12} className='my-4' md={8}>
                <MContainer direction='vertical'>
                    <MContainer className='mt-2' styles={{ width: '100%', alignmentBaseline: 'baseline' }} direction='horizontal'>
                        <span className="badge"><Image width={32} height={32} src="/assets/img/iconos/icono_regla_blue.svg" alt="" /> </span>
                        <Typography style={{ marginTop: 8, alignmentBaseline: 'baseline' }} fontWeight={700} variant="body1" component="p">
                            Medidas*
                        </Typography>
                    </MContainer>
                    <MContainer className='mt-2' styles={{ gap: 40 }} direction='horizontal'>
                        <MContainer className='mt-2' direction='horizontal' styles={{ gap: 10 }}>
                            <Typography sx={{ color: '#069CB1' }}>Peso</Typography>
                            <FormGroup
                                style={{ width: 64 }}
                                value={state.peso.toString()}
                                onChange={(e) => {
                                    onFormChange({ peso: parseInt(e.currentTarget.value) })
                                }}
                            />
                            <Typography variant="body1" component="p">
                                kg
                            </Typography>
                        </MContainer>
                        <MContainer className='mt-2 mb-4' direction='horizontal' styles={{ gap: 10 }}>
                            <Typography sx={{ color: '#069CB1' }}>Altura</Typography>
                            <FormGroup
                                style={{ width: 64 }}
                                value={state.altura.toString()}
                                onChange={(e) => {
                                    onFormChange({ altura: parseInt(e.currentTarget.value) })
                                }}
                            />
                            <Typography variant="body1" component="p">
                                cm
                            </Typography>
                        </MContainer>
                    </MContainer>
                    <Typography sx={{ color: '#069CB1' }}>Más adelante, puedes agregar medidas para vestuario en la vista final de tu perfil</Typography>
                </MContainer>
            </Grid>
            <Grid item xs={12} className='my-4' md={7}>
                <MContainer className='mt-2 mb-4' styles={{ width: '100%' }} direction='vertical'>
                    <Typography fontWeight={700} variant="body1" component="p" style={{marginBottom: 5}}>
                        Acerca de
                    </Typography>
                    <FormGroup
                        type="text-area"
                        style={{ width: '70%' }}
                        value={(state) ? state.biografia : ''}
                        onChange={(e) => {
                            onFormChange({ biografia: e.currentTarget.value })
                        }}
                    />
                </MContainer>
            </Grid>
            {/* <Grid item xs={12} md={1}></Grid> */}
            <Grid item xs={12} md={4} className='mt-4' justifyContent={'end'}>
                <DragNDrop
                    id='id-drag-n-drop-cv'
                    show_download_url={(state.files.urls.cv) ? state.files.urls.cv : undefined}
                    label='Subir CV'
                    height={100}
                    files={(state.files && state.files.cv) ? [state.files.cv] : []}
                    filetypes={['PDF', 'DOC', 'DOCX']}
                    onChange={(files: File[]) => {
                        const files_converted = Promise.all(files.map(async (f) => {
                            const base64 = await FileManagerFront.convertFileToBase64(f);
                            return { base64: base64, name: f.name, file: f };
                        }));
                        files_converted.then((files_conv) => {
                            onFormChange({ files: { ...state.files, cv: files_conv[0] } })
                        }).catch((err) => {
                            console.log(err);
                            onFormChange({ files: { ...state.files, cv: undefined } })
                        });
                    }}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <MContainer className='mt-2 mb-4' styles={{ width: '50%' }} direction='vertical'>
                    <MContainer className='my-2' styles={{ width: '50%' }} direction='horizontal'>
                        <span className={'badge'}> <Image className='mr-2' width={24} height={24} src="/assets/img/iconos/icono_web_site_blue.svg" alt="" /> </span>
                        <Typography lineHeight={2} fontWeight={700} variant="body1" component="p">
                            Página web
                        </Typography>
                    </MContainer>
                    <FormGroup
                        className={classes['form-input-md']}
                        value={(state.redes_sociales) ? state.redes_sociales.pagina_web : ''}
                        onChange={(e) => {
                            onFormChange({ redes_sociales: { ...state.redes_sociales, pagina_web: e.target.value } })
                        }}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={12}>
                <Typography lineHeight={2} fontWeight={700} variant="body1" component="p">
                    Link a redes sociales:
                </Typography>
            </Grid>
            <Grid item xs={4} md={2}>
                <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Vimeo<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="" /> </span>
                    <FormGroup
                        className={classes['form-input-sm']}
                        value={(state && state.redes_sociales) ? state.redes_sociales.vimeo : ''}
                        onChange={(e) => {
                            onFormChange({ redes_sociales: { ...state?.redes_sociales, vimeo: e.target.value } })
                        }}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={4} md={2}>
                <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Instagram<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_insta_blue.svg" alt="" /> </span>
                    <FormGroup
                        className={classes['form-input-sm']}
                        value={(state && state.redes_sociales) ? state.redes_sociales.instagram : ''}
                        onChange={(e) => {
                            onFormChange({ redes_sociales: { ...state?.redes_sociales, instagram: e.target.value } })
                        }}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={4} md={2}>
                <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Youtube<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_youtube_blue.svg" alt="" /> </span>
                    <FormGroup
                        className={classes['form-input-sm']}
                        value={(state && state.redes_sociales) ? state.redes_sociales.youtube : ''}
                        onChange={(e) => {
                            onFormChange({ redes_sociales: { ...state?.redes_sociales, youtube: e.target.value } })
                        }}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={4} md={2}>
                <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Twitter<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="" /> </span>
                    <FormGroup
                        className={classes['form-input-sm']}
                        value={(state && state.redes_sociales) ? state.redes_sociales.twitter : ''}
                        onChange={(e) => {
                            onFormChange({ redes_sociales: { ...state?.redes_sociales, twitter: e.target.value } })
                        }}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={4} md={2}>
                <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                    <span className={classes['link-input-label']}> IMDB<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_imbd_blue.svg" alt="" /> </span>
                    <FormGroup
                        className={classes['form-input-sm']}
                        value={(state && state.redes_sociales) ? state.redes_sociales.imdb : ''}
                        onChange={(e) => {
                            onFormChange({ redes_sociales: { ...state?.redes_sociales, imdb: e.target.value } })
                        }}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={4} md={2}>
                <MContainer className=' mb-4' styles={{ maxWidth: 150, gap: 10 }} direction='vertical'>
                    <span className={classes['link-input-label']}> Linkedin<Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="" /> </span>
                    <FormGroup
                        className={classes['form-input-sm']}
                        value={(state && state.redes_sociales) ? state.redes_sociales.linkedin : ''}
                        onChange={(e) => {
                            onFormChange({ redes_sociales: { ...state?.redes_sociales, linkedin: e.target.value } })
                        }}
                    />
                </MContainer>
            </Grid>


        </Grid>
    )
}
