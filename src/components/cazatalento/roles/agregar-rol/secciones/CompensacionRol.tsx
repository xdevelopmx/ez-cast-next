import { Grid } from '@mui/material'
import { MContainer } from '~/components/layout/MContainer'
import { FormGroup, MCheckboxGroup, MRadioGroup, SectionTitle } from '~/components/shared'
import { MTooltip } from '~/components/shared/MTooltip'

export const CompensacionRol = () => {
    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 2' subtitle='Compensación'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid container item xs={12} mt={4}>
                <Grid item xs={3}>
                    <MRadioGroup
                        label='¿Se pagará un sueldo?'
                        labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                        style={{ gap: 0 }}
                        id="se-pagara-sueldo"
                        options={['Sí', 'No']}
                        value={/* state.compartir_nombre */ 'Sí' ? 'Sí' : 'No'}
                        direction='vertical'
                        onChange={(e) => {
                            /* onFormChange({
                                compartir_nombre: (e.target.value === 'Compartir nombre de proyecto')
                            }) */
                        }}
                    />
                </Grid>
                <Grid item xs={9}>
                    <MContainer direction='horizontal' styles={{ gap: 30 }}>
                        <FormGroup
                            //error={state.nombre.length < 2 ? 'El nombre es demasiado corto' : undefined}
                            show_error_message
                            className={'form-input-md'}
                            labelStyle={{ fontWeight: 600 }}
                            labelClassName={'form-input-label'}
                            //value={state.nombre}
                            value={''}
                            onChange={(e) => {
                                /* onFormChange({
                                    nombre: e.target.value
                                }) */
                            }}
                            label='¿Cuánto?'
                        />

                        <MRadioGroup
                            label='Selecciona una'
                            labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                            style={{ gap: 0 }}
                            id="cada-cuanto-sueldo"
                            options={['Diario', 'Mensual', 'Semanal', 'Por Proyecto']}
                            value={/* state.compartir_nombre */ 'Diario' ? 'Diario' : 'Mensual'}
                            direction='horizontal'
                            onChange={(e) => {
                                /* onFormChange({
                                    compartir_nombre: (e.target.value === 'Compartir nombre de proyecto')
                                }) */
                            }}
                        />
                    </MContainer>
                </Grid>
            </Grid>
            <Grid container item xs={12} mt={2}>
                <Grid item xs={3}>
                    <MRadioGroup
                        label='¿Se otorgarán compensaciones?'
                        labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                        style={{ gap: 0 }}
                        id="se-pagara-sueldo"
                        options={['Sí', 'No']}
                        value={/* state.compartir_nombre */ 'Sí' ? 'Sí' : 'No'}
                        direction='vertical'
                        onChange={(e) => {
                            /* onFormChange({
                                compartir_nombre: (e.target.value === 'Compartir nombre de proyecto')
                            }) */
                        }}
                    />
                </Grid>
                <Grid item xs={9}>
                    <MCheckboxGroup
                        title='¿Qué compensación no monetaria recibirá el talento?'
                        onChange={(e) => {
                            /* onFormChange({ has_vehiculos: e }) */
                        }}
                        direction='horizontal'
                        id="tipos-compensaciones-no-monetarias"
                        labelClassName={'label-black-lg'}
                        options={[
                            'Agradecimientos', 'Comidas', 'Crédito en pantalla', 'Copia del proyecto', 'Hospedaje',
                            'Kit Covid', 'Seguridad', 'Transporte', 'Otro'
                        ]}

                        label='¿Qué compensación no monetaria recibirá el talento?'
                        labelStyle={{ fontWeight: '400', fontSize: '1.1rem', width: '45%' }}
                        values={[false, false, false, false, false, false, false, false, false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                </Grid>
            </Grid>

            <Grid item xs={12} mt={2}>
                <FormGroup
                    //error={state.nombre.length < 2 ? 'El nombre es demasiado corto' : undefined}
                    show_error_message
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    //value={state.nombre}
                    value={''}
                    onChange={(e) => {
                        /* onFormChange({
                            nombre: e.target.value
                        }) */
                    }}
                    label='Suma de las compensaciones'
                    tooltip={
                        <MTooltip
                            color='orange'
                            text="Prueba"
                            placement='right'
                        />
                    }
                />
            </Grid>

            <Grid item xs={12} mt={2}>
                <FormGroup
                    type={'text-area'}
                    className={'form-input-md'}
                    style={{ width: 300 }}
                    labelStyle={{ fontWeight: 600, width: '100%' }}
                    labelClassName={'form-input-label'}
                    value={''}
                    onChange={(e) => {
                        /* onFormChange({
                            sinopsis: e.target.value
                        }) */
                    }}
                    label='Datos adicionales'
                />
            </Grid>
        </Grid>
    )
}
