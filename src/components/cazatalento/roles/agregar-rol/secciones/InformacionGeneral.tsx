import { Grid, Typography } from "@mui/material"
import { FormGroup, MRadioGroup, MSelect, SectionTitle } from "~/components/shared"
import { MTooltip } from "~/components/shared/MTooltip"
import { api } from '~/utils/api';

export const InformacionGeneralRol = () => {

    const tipos_roles = api.catalogos.getTiposRoles.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 1' subtitle='Información General'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item xs={12} mt={8}>
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
                    tooltip={
                        <MTooltip
                            color="blue"
                            placement="right"
                            text={
                                <>
                                    <Typography fontSize={14} fontWeight={600}>¿Tu rol tiene nombre?</Typography>
                                    <Typography fontSize={14}>
                                        Ingresa el nombre del personaje
                                        si lo tiene; si no, puedes quedarte
                                        con “Actor” o “Modelo”.
                                    </Typography>
                                </>
                            }
                        />
                    }
                    label='Nombre de rol*'
                />
            </Grid>
            <Grid item xs={12} mt={4}>
                <MRadioGroup
                    label='¿Este es un rol principal o rol extra?*'
                    labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                    style={{ gap: 0 }}
                    id="rol-principal-o-extra"
                    options={['Principal', 'Extra']}
                    value={/* state.compartir_nombre */ 'Principal' ? 'Principal' : 'Extra'}
                    direction='vertical'
                    onChange={(e) => {
                        /* onFormChange({
                            compartir_nombre: (e.target.value === 'Compartir nombre de proyecto')
                        }) */
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <MSelect
                    id="tipo-rol-select"
                    loading={tipos_roles.isFetching}
                    options={(tipos_roles.data) ? tipos_roles.data.map(s => { return { value: s.id.toString(), label: s.es } }) : []}
                    value={/* state.id_tipo.toString() */ ''}
                    className={'form-input-md'}
                    onChange={(e) => {
                        /* onFormChange({
                            id_tipo: parseInt(e.target.value)
                        }) */
                    }}
                    label='Tipo de rol*'
                />
            </Grid>
        </Grid>
    )
}
