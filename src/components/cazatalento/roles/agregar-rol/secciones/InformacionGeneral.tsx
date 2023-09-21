import { Grid, Typography } from "@mui/material"
import { type FC, useReducer, useEffect, useContext } from "react";
import { MContainer } from "~/components/layout/MContainer";
import { FormGroup, MCheckboxGroup, MRadioGroup, MSelect, SectionTitle } from "~/components/shared"
import { MTooltip } from "~/components/shared/MTooltip"
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { type RolInformacionGeneralForm } from "~/pages/cazatalentos/roles/agregar-rol";
import { api } from '~/utils/api';


interface Props {
    fetching: boolean,
    state: RolInformacionGeneralForm,
    onFormChange: (input: { [id: string]: unknown }) => void;
    //onSaveChanges: (...args: unknown[]) => unknown;
}

export const InformacionGeneralRol: FC<Props> = ({ fetching, state, onFormChange }) => {

    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);

    const tipos_roles = api.catalogos.getTiposRoles.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const tipos_trabajo = api.catalogos.getTipoDeTrabajos.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <SectionTitle 
                    title={`${textos['paso']} 1`} 
                    subtitle={`${textos['info_gral']}`}
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                    //textButton="Guardar y terminar más tarde"
                    //onClickButton={onSaveChanges}
                />
            </Grid>
            <Grid item xs={12} mt={8}>
                <FormGroup
                    //error={state.nombre.length < 2 ? 'El nombre es demasiado corto' : undefined}
                    show_error_message
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.nombre}
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
                    label={`${textos['nombre_rol']}*`}
                />
            </Grid>
            <Grid item xs={12} md={6} mt={4}>
                <MContainer direction="vertical" styles={{gap: 8}}>

                    <MRadioGroup
                        label={`¿${textos['es_rol_principal_o_extra']}?*`}
                        labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                        style={{ gap: 0 }}
                        id="rol-principal-o-extra"
                        options={['Principal', 'Extra']}
                        value={state.rol_principal_secundario}
                        direction='vertical'
                        onChange={(e) => {
                            const tipo_rol = (!tipos_roles.data) ? null : tipos_roles.data.filter(tr => tr.tipo.toLowerCase() === e.target.value.toLowerCase())[0];
                            
                            onFormChange({
                                rol_principal_secundario: e.target.value,
                                id_tipo_rol: (e.target.value !== state.rol_principal_secundario) ? (tipo_rol) ? tipo_rol.id : 0 : state.id_tipo_rol
                            })
                        }}
                    />
                    <MSelect
                        id="tipo-rol-select"
                        loading={tipos_roles.isFetching}
                        options={
                            (tipos_roles.data)
                                ? tipos_roles.data.filter(tr => tr.tipo.toLowerCase() === state.rol_principal_secundario.toLowerCase()).map(s => { return { value: s.id.toString(), label: (ctx.lang === 'es') ? s.es : s.en } })
                                : []
                        }
                        value={`${state.id_tipo_rol}`}
                        className={'form-input-md'}
                        onChange={(e) => {
                            onFormChange({
                                id_tipo_rol: parseInt(e.target.value)
                            })
                        }}
                        label={`${textos['tipo_rol']}*`}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={12} md={6} mt={4}>
                <MCheckboxGroup
                    loading={fetching}
                    onAllOptionChecked={(checked) => {
                        onFormChange({
                            tipo_trabajo: (!checked) ? [] : tipos_trabajo.data ? tipos_trabajo.data.map((v) => v.id) : []
                        })
                    }}
                    direction='vertical'
                    title={`${textos['tipo_de_trabajo']}`}
                    onChange={(e, i) => {
                        if (tipos_trabajo.data) {
                            const tipo_trabajo = tipos_trabajo.data[i]
                            if (tipo_trabajo) {
                                let nuevosTipos = []
                                if (state.tipo_trabajo.includes(tipo_trabajo?.id)) {
                                    nuevosTipos = state.tipo_trabajo.filter((id) => id !== tipo_trabajo.id)
                                } else {
                                    nuevosTipos = [...state.tipo_trabajo, tipo_trabajo.id]
                                }
                                onFormChange({
                                    tipo_trabajo: nuevosTipos
                                })
                            }
                        }
                    }}
                    id="tipo-trabajo"
                    labelStyle={{ marginBottom: 0 }}
                    options={(tipos_trabajo.data) ? tipos_trabajo.data.map(t => ctx.lang === 'es' ? t.es : t.en) : []}
                    values={(tipos_trabajo.data) ? tipos_trabajo.data.map(v => state.tipo_trabajo.includes(v.id)) : [false]}
                />
            </Grid>
        </Grid>
    )
}
