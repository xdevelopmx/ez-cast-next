import { Grid, Typography } from "@mui/material"
import { type FC } from "react";
import { FormGroup, MRadioGroup, MSelect, SectionTitle } from "~/components/shared"
import { MTooltip } from "~/components/shared/MTooltip"
import { type RolForm } from "~/pages/cazatalentos/roles/agregar-rol";
import { api } from '~/utils/api';

interface Props {
    state: RolForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
    onSaveChanges: (...args: unknown[]) => unknown;
}

export const InformacionGeneralRol: FC<Props> = ({ state, onFormChange, onSaveChanges }) => {

    const tipos_roles = api.catalogos.getTiposRoles.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <SectionTitle 
                    title='Paso 1' 
                    subtitle='Información General'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                    textButton="Guardar y terminar más tarde"
                    onClickButton={onSaveChanges}
                />
            </Grid>
            <Grid item xs={12} mt={8}>
                <FormGroup
                    //error={state.nombre.length < 2 ? 'El nombre es demasiado corto' : undefined}
                    show_error_message
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.informacion_general.nombre}
                    onChange={(e) => {
                        onFormChange({
                            nombre: e.target.value
                        })
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
                    value={state.informacion_general.rol_principal_secundario}
                    direction='vertical'
                    onChange={(e) => {
                        onFormChange({
                            rol_principal_secundario: e.target.value
                        })
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <MSelect
                    id="tipo-rol-select"
                    loading={tipos_roles.isFetching}
                    options={
                        (tipos_roles.data)
                            ? tipos_roles.data.map(s => { return { value: s.id.toString(), label: s.es } })
                            : []
                    }
                    value={`${state.informacion_general.id_tipo_rol}`}
                    className={'form-input-md'}
                    onChange={(e) => {
                        onFormChange({
                            id_tipo_rol: parseInt(e.target.value)
                        })
                    }}
                    label='Tipo de rol*'
                />
            </Grid>
        </Grid>
    )
}
