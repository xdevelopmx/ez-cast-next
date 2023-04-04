import { Grid } from '@mui/material'
import { FormGroup, MCheckboxGroup, MSelect, SectionTitle } from '~/components/shared'
import { api } from '~/utils/api';

export const RequisitosRol = () => {

    const usos_horarios = api.catalogos.getUsosDeHorario.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 7' subtitle='Requisitos'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item container xs={6} mt={4}>
                <Grid item xs={12}>
                    <FormGroup
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={''}
                        onChange={(e) => {
                            console.log('change');
                        }}
                        label='Presentación de solicitud'
                    />
                </Grid>
                <Grid item xs={12}>
                    <MSelect
                        id="sindicato-select"
                        loading={usos_horarios.isFetching}
                        options={
                            (usos_horarios.data)
                                ? usos_horarios.data.map(s => { return { value: s.id.toString(), label: s.es } })
                                : []
                        }
                        className={'form-input-md'}
                        value={/* state.id_sindicato.toString() */'0'}
                        onChange={(e) => {
                            /* onFormChange({
                                id_sindicato: parseInt(e.target.value)
                            }) */
                        }}
                        label='Huso horario'
                    />
                </Grid>
                <Grid item xs={12}>
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
                        label='Información/notas del trabajo'
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormGroup
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={''}
                        onChange={(e) => {
                            console.log('change');
                        }}
                        label='Añadir Idioma'
                    />
                </Grid>
            </Grid>

            <Grid item xs={6} mt={4}>
                <Grid item xs={6}>
                    <MCheckboxGroup
                        title='El talento deberá incluir:'
                        onChange={(e, i) => {
                            //if (tipo_compensacion) {
                            /* onFormChange({
                                tipos_compensaciones_no_monetarias_interesado_en_interpretar:
                                    (state.tipos_compensaciones_no_monetarias_interesado_en_interpretar.includes(apariencia.id)) ?
                                        state.tipos_compensaciones_no_monetarias_interesado_en_interpretar.filter(e => e !== apariencia.id) :
                                        state.tipos_compensaciones_no_monetarias_interesado_en_interpretar.concat([apariencia.id])
                            }) */
                            //}
                        }}
                        direction='vertical'
                        id="talento-debera-incluir-rol"
                        options={['Foto', 'Video', 'Audio']}
                        label='¿Qué compensación no monetaria recibirá el talento?'
                        labelStyle={{ fontWeight: '400', fontSize: '1.1rem' }}
                        values={[false, false, false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                </Grid>
                <Grid item xs={6}>
                    <MSelect
                        id="sindicato-select"
                        options={
                            (estados_republica.data)
                                ? estados_republica.data.map(e => { return { value: e.id.toString(), label: e.es } })
                                : []}
                        style={{ width: 200 }}
                        value={/* state.id_estado_republica.toString() */ '0'}
                        onChange={(e) => {
                            /* onFormChange({
                                id_estado_republica: parseInt(e.target.value)
                            }) */
                        }}
                        label='Aceptando aplicaciones desde'
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}
