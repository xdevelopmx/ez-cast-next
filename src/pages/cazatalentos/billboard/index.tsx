import { type GetServerSideProps } from "next";
import { Divider, Grid, Typography } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import { Alertas, MSelect, MainLayout, MenuLateral } from "~/components";
import { PerfilTable } from "~/components/cazatalento/billboard/PerfilTable";
import { MContainer } from "~/components/layout/MContainer";
import { api } from "~/utils/api";
import { getSession } from "next-auth/react";
import { type User } from "next-auth";
import { useEffect, useState } from "react";
import type {
    Roles, CatalogoTiposRoles, FiltrosDemoPorRoles, GenerosPorRoles, CatalogoGeneros,
    AparenciasEtnicasPorRoles, CatalogoAparenciasEtnicas
} from '@prisma/client'

type DashBoardCazaTalentosPageProps = {
    user: User,
    id_proyecto: number
}

export interface RolCompleto extends Roles {
    tipo_rol?: CatalogoTiposRoles;
    filtros_demograficos?: FiltrosDemoPorRoles
    & {
        generos?: (GenerosPorRoles
            & { genero?: CatalogoGeneros })[]
    }
    & { aparencias_etnicas?: (AparenciasEtnicasPorRoles & { aparencia_etnica: CatalogoAparenciasEtnicas })[] };

}

const BillboardPage: NextPage<DashBoardCazaTalentosPageProps> = ({ user, id_proyecto }) => {

    const [selected_proyecto, setSelectedProyecto] = useState<number>(id_proyecto);
    const [selected_rol, setSelectedRol] = useState<number>(0);

    const proyectos = api.proyectos.getAllByIdCazatalentos.useQuery({ id: parseInt(user.id) }, {
        refetchOnWindowFocus: false
    });

    const roles_by_proyecto = api.roles.getAllByProyecto.useQuery(selected_proyecto, {
        refetchOnWindowFocus: false
    });

	useEffect(() => {
		if (roles_by_proyecto.data && roles_by_proyecto.data.length > 0) {
			const first_rol = roles_by_proyecto.data[0];
			setSelectedRol((first_rol) ? first_rol.id : 0);
		}
	}, [roles_by_proyecto.data]);

	const rol = api.roles.getCompleteById.useQuery(selected_rol, {
		refetchOnWindowFocus: false
	});



    //const [proyectoSeleccionado, setProyectoSeleccionado] = useState('0')
    //const [idProyectoSeleccionado, setIdProyectoSeleccionado] = useState(id_proyecto)
    //const [rolSeleccionado, setRolSeleccionado] = useState('0');

    

    //const roles = api.roles.getAllCompleteByProyecto.useQuery(idProyectoSeleccionado, {
    //    refetchOnWindowFocus: false
    //});

    /*
    useEffect(() => {
        if (!proyectos.data) return;
        if (proyectos.data.length === 0) return;
        setProyectoSeleccionado(`${proyectos.data[0]?.id || '0'}` || '0')
        setIdProyectoSeleccionado(proyectos.data[0]?.id || 0)
    }, [proyectos.data])

    useEffect(() => {
        if (proyectoSeleccionado === '0') return;
        if (!proyectos.data) return;
        const idProyecto = proyectos.data.find(p => p.id === parseInt(proyectoSeleccionado))?.id || 0
        if (!idProyecto) return;
        setIdProyectoSeleccionado(idProyecto)
    }, [proyectoSeleccionado, proyectos.data])
    */
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
                                    <Typography fontWeight={800} sx={{ color: '#069cb1', fontSize: '2rem' }}>Billboard</Typography>
                                    <MContainer direction="horizontal">
                                        <MSelect
                                            id="nombre-proyecto-select"
                                            disabled={id_proyecto > 0}
                                            loading={proyectos.isFetching}
                                            options={proyectos.data?.map(p => ({
                                                value: `${p.id}`,
                                                label: p.nombre,
                                            })) || []}
                                            className={'form-input-md'}
                                            value={selected_proyecto.toString()}
                                            onChange={(e) => {
                                                setSelectedProyecto(parseInt(e.target.value))
                                            }}
                                            label=''
                                        />
                                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                        <MSelect
                                            id="nombre-personaje-select"
                                            loading={roles_by_proyecto.isFetching}
                                            options={roles_by_proyecto.data?.map(r => ({
                                                label: r.nombre,
                                                value: `${r.id}`,
                                            })) || []}
                                            className={'form-input-md'}
                                            value={selected_rol.toString()}
                                            onChange={(e) => {
                                                setSelectedRol(parseInt(e.target.value))
                                            }}
                                            label=''
                                        />
                                    </MContainer>
                                    <Divider style={{ borderWidth: 1, marginTop: '10px' }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <PerfilTable
                                        rol={roles_by_proyecto.data?.find(r => r.id === selected_rol) as unknown as RolCompleto}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    let id_proyecto = 0;
    if (context.query) {
        id_proyecto = parseInt(context.query['id-proyecto'] as string);
    }
    if (session && session.user) {
        return {
            props: {
                user: session.user,
                id_proyecto: id_proyecto
            }
        }
    }
    return {
        redirect: {
            destination: '/',
            permanent: true,
        },
    }
}

export default BillboardPage