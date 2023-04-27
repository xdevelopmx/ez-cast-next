import { CheckBox } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Divider, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Image from 'next/image';
import { useState } from "react";
import { Alertas, MainLayout, MenuLateral, FormGroup, MRadioGroup, Tag, AddButton, MSelect, ModalLocacion } from "~/components";
import { MTooltip } from "~/components/shared/MTooltip";
import { api } from "~/utils/api";

type tipos_locacion = 'PRESENCIAL' | 'VIRTUAL';
type tipos_audicion = 'AUDICION' | 'CALLBACK';

const NuevoHorarioAgendaVirtual = () => {

    const [showModal, setShowModal] = useState(false)

    const [tipoAudicion, setTipoAudicion] = useState<tipos_audicion>('AUDICION')
    const [tipoLocacion, setTipoLocacion] = useState<tipos_locacion>('PRESENCIAL')

    const usos_horarios = api.catalogos.getUsosDeHorario.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <>
            <Head>
                <title>Cazatalentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true}>
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                    <div className="seccion_container col" style={{ paddingTop: 0 }}>
                        <br /><br />
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <Alertas />
                            </div>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid container item columns={12}>
                                        <Grid item md={1} textAlign={'center'}>
                                            <Image src="/assets/img/iconos/agenda.svg" width={50} height={50} style={{ margin: '15px 0 0 0', filter: 'invert(43%) sepia(92%) saturate(431%) hue-rotate(140deg) brightness(97%) contrast(101%)' }} alt="" />
                                        </Grid>
                                        <Grid item md={11}>
                                            <Typography fontWeight={800} sx={{ color: '#069cb1', fontSize: '2rem' }}>Agenda Virtual</Typography>
                                            <Typography fontWeight={600} sx={{ color: '#000', fontSize: '`.7rem' }}>La organización es la base de un buen proyecto, ¡Comencemos!</Typography>
                                        </Grid>

                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} sx={{ padding: '5px 10px', margin: '45px 0 4px', border: '1px solid #069cb1', borderRadius: '10px' }}>
                                    <Grid container item xs={12} sx={{ padding: '5px 10px', margin: '4px 0', borderRadius: '10px' }} columns={18}>
                                        <Grid xs={12}>
                                            <ButtonGroup sx={{ mt: 2, mb: 0 }} variant="contained" aria-label="outlined primary button group">
                                                <Button
                                                    onClick={() => { setTipoAudicion('AUDICION') }}
                                                    variant={tipoAudicion === 'AUDICION' ? 'contained' : 'outlined'}
                                                >
                                                    Audición
                                                </Button>
                                                <Button
                                                    onClick={() => { setTipoAudicion('CALLBACK') }}
                                                    variant={tipoAudicion === 'CALLBACK' ? 'contained' : 'outlined'}
                                                >
                                                    Callback
                                                </Button>
                                            </ButtonGroup>
                                        </Grid>
                                        <Grid xs={12} mt={4}>
                                            <FormGroup
                                                className={'form-input-md'}
                                                labelClassName={'form-input-label'}
                                                labelStyle={{ fontWeight: 600 }}
                                                label='Nombre de horario'

                                                tooltip={
                                                    <MTooltip
                                                        color="blue"
                                                        text="Nombre de horario para diferenciarlo de tus otros horarios."
                                                        placement="right"
                                                    />
                                                }
                                            />
                                            <p style={{ color: '#069cb1' }}>
                                                Para tu control interno. No será visto por talento o representantes.
                                            </p>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid container item xs={12} sx={{ padding: '5px 10px', margin: '4px 0' }}>
                                        <Grid xs={3}>
                                            <MRadioGroup
                                                label='Fecha audición'
                                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                                style={{ gap: 0 }}
                                                id="rango-de-fechas-radio"
                                                options={['Rango de fechas', 'Individuales']}
                                                value={'Rango de fechas'}
                                                direction='horizontal'
                                                onChange={(e) => {
                                                    /* setBanner(prev => {
                                                        return {
                                                            ...prev,
                                                            isButton: e.target.value === 'Si'
                                                        }
                                                    }) */
                                                }}
                                            />
                                        </Grid>

                                        <Grid xs={9} mt={4}>
                                            <Grid container xs={12}>
                                                <Grid xs={4}>
                                                    <FormGroup
                                                        type="date"
                                                        labelClassName={'form-input-label'}
                                                        labelStyle={{ fontWeight: 400 }}
                                                    />
                                                </Grid>
                                                <Grid xs={1}>

                                                </Grid>
                                                <Grid xs={4}>
                                                    <FormGroup
                                                        type="date"
                                                        labelClassName={'form-input-label'}
                                                        labelStyle={{ fontWeight: 400 }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid xs={12}>
                                                {
                                                    Array.from({ length: 1 }).map((_, i) => (
                                                        <Tag key={i}
                                                            text="23/09/21-31/09/21"
                                                            onRemove={() => console.log('click')}
                                                        />
                                                    ))
                                                }
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                    <Grid xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid container xs={12}>
                                        <Grid xs={7}>
                                            <Grid xs={12}>
                                                <Typography fontWeight={600}>
                                                    Locación
                                                </Typography>
                                            </Grid>
                                            <Grid xs={12}>
                                                <ButtonGroup sx={{ mt: 2, mb: 0 }} variant="contained" aria-label="outlined primary button group">
                                                    <Button
                                                        onClick={() => { setTipoLocacion('PRESENCIAL') }}
                                                        variant={tipoLocacion === 'PRESENCIAL' ? 'contained' : 'outlined'}
                                                    >
                                                        Presencial
                                                    </Button>
                                                    <Button
                                                        onClick={() => { setTipoLocacion('VIRTUAL') }}
                                                        variant={tipoLocacion === 'VIRTUAL' ? 'contained' : 'outlined'}
                                                    >
                                                        Virtual
                                                    </Button>
                                                </ButtonGroup>
                                            </Grid>
                                            <Grid xs={12}>
                                                <Typography sx={{ color: '#069cb1' }}>
                                                    Locaciones guardadas
                                                </Typography>
                                            </Grid>
                                            <Grid xs={12}>
                                                {
                                                    Array.from({ length: 2 }).map((_, i) => (
                                                        <Grid key={i} container xs={12} sx={{ alignItems: 'center' }}>
                                                            <Grid xs={1}>
                                                                <CheckBox />
                                                            </Grid>
                                                            <Grid xs={7}>
                                                                <Typography>
                                                                    Direction 457 Col. Centro, CDMX
                                                                </Typography>
                                                            </Grid>
                                                            <Grid xs={2}>
                                                                <Button sx={{ textTransform: 'none' }}>
                                                                    <Typography sx={{ color: '#069cb1', textDecoration: 'underline' }}>
                                                                        Editar
                                                                    </Typography>
                                                                </Button>
                                                            </Grid>
                                                            <Grid xs={2}>
                                                                <Button sx={{ textTransform: 'none' }}>
                                                                    <Typography sx={{ color: '#069cb1', textDecoration: 'underline' }}>
                                                                        Borrar
                                                                    </Typography>
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                            <Grid xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <AddButton
                                                        aStyles={{ margin: 0, borderRadius: '2rem' }}
                                                        text="Agregar locación"
                                                        onClick={() => { setShowModal(true) }}
                                                    />

                                                    <MTooltip
                                                        color="blue"
                                                        text="pendiente."
                                                        placement="right"
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Grid xs={1}></Grid>
                                        <Grid xs={3}>
                                            <Grid xs={12}>
                                                <FormGroup
                                                    type={'text-area'}
                                                    className={'form-input-md'}
                                                    style={{ width: '100%' }}
                                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                                    labelClassName={'form-input-label'}
                                                    value={''}
                                                    onChange={(e) => {
                                                        /* onFormChange({
                                                            sinopsis: e.target.value
                                                        }) */
                                                    }}
                                                    label='Notas sobre locación'
                                                />
                                            </Grid>
                                            <Grid>
                                                <MSelect
                                                    id="sindicato-select"
                                                    loading={usos_horarios.isFetching}
                                                    options={
                                                        (usos_horarios.data)
                                                            ? usos_horarios.data.map(s => { return { value: s.id.toString(), label: s.es } })
                                                            : []
                                                    }
                                                    className={'form-input-md'}
                                                    value={''}
                                                    onChange={(e) => {
                                                        /* onFormChange({
                                                            id_uso_horario: parseInt(e.target.value)
                                                        }) */
                                                    }}
                                                    label='Uso horario*'
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid container xs={12} sx={{ flexDirection: 'column', alignItems: 'center' }} mt={4}>
                                            <Button
                                                sx={{
                                                    textTransform: 'none',
                                                    backgroundColor: '#069cb1',
                                                    color: '#fff',
                                                    borderRadius: '2rem',
                                                    '&:hover': {
                                                        backgroundColor: '#06adc3',
                                                    }
                                                }}>
                                                <Typography>
                                                    Guardar y personalizar horario
                                                </Typography>
                                            </Button>

                                            <Button
                                                sx={{
                                                    textTransform: 'none',
                                                }}>
                                                <Typography sx={{ color: '#06adc3', textDecoration: 'underline' }}>
                                                    Cancelar
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>

                <ModalLocacion
                    isOpen={showModal}
                    setIsOpen={setShowModal}
                />
            </MainLayout>
        </>

    )
}

export default NuevoHorarioAgendaVirtual