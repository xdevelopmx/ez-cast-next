import { GetServerSideProps, type NextPage } from "next";
import Image from 'next/image';
import Head from "next/head";
import { motion } from 'framer-motion'

import { Alertas, Flotantes, FormGroup, MCheckboxGroup, MRadioGroup, MainLayout, MenuLateral } from "~/components";
import { OptionsGroup } from "~/components/shared/OptionsGroup";
import { MContainer } from "~/components/layout/MContainer";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Link, Skeleton, Typography } from "@mui/material";
import { MTable } from "~/components/shared/MTable/MTable";
import { Activos, Creditos, FiltrosApariencias, Habilidades, Media, Preferencias } from "~/components/talento";
import { InfoGeneral } from "~/components/talento/dashboard-sections/InfoGeneral";
import { api, parseErrorBody } from "~/utils/api";
import { getSession, useSession } from "next-auth/react";
import { TipoUsuario } from "~/enums";
import Constants from "~/constants";
import { User } from "next-auth/core/types";
import { useEffect, useMemo, useState } from "react";
import { Close, MessageOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import useNotify from "~/hooks/useNotify";
import MotionDiv from "~/components/layout/MotionDiv";
import { TalentoDashBoardSelect } from "~/components/cazatalento/talento/talento-dashboard-select";
import { TalentoDashBoardRepresentanteSection } from "~/components/representante/talento/TalentoDashBoardRepresentanteSection";

const DashBoardTalentosPage: NextPage<{ user: User, id_talento: number, id_rol: number, scroll_section: string, can_edit: boolean }> = (props) => {
	const session = useSession();
	const { notify } = useNotify();
	const scrollToSection = (sectionId: string) => {
		const section = document.getElementById(sectionId);
		section?.scrollIntoView({ behavior: 'smooth' });
	};

	const id_talento = useMemo(() => {
		if (props.id_talento > 0) {
			return props.id_talento;
		}
		if (session.data && session.data.user) {
			return parseInt(session.data.user.id);
		}
		return 0;
	}, [session.data, props]);


	const talento = api.talentos.getById.useQuery({ id: id_talento }, {
		refetchOnWindowFocus: false
	});


	useEffect(() => {
		if (talento.data) {
			scrollToSection(props.scroll_section);
		}
	}, [talento.data]);

	return (
		<>
			<Head>
				<title>DashBoard ~ Talentos | Talent Corner</title>
				<meta name="description" content="Talent Corner" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<MainLayout menuSiempreBlanco={true} >
				<div className="d-flex wrapper_ezc">
					<MenuLateral />
					<div className="seccion_container col">
						<br /><br />
						{props.id_talento > 0 && props.user.tipo_usuario === TipoUsuario.CAZATALENTOS &&
							<TalentoDashBoardSelect id_talento={props.id_talento} id_rol={props.id_rol}/>
						}
						<div className="container_box_header">
							<div className="d-flex justify-content-end align-items-start py-2">
								{props.id_talento === 0 &&
									<Alertas />
								}
							</div>
							<div className="d-flex">
								<motion.img src="/assets/img/iconos/icono_head_chat.png" alt="icono" />
								{talento.isFetching && <Skeleton style={{ marginLeft: 16 }} width={200} height={24} />}
								{!talento.isFetching && talento.data && <p className="h4 font-weight-bold mb-0 ml-2"><b>{talento.data.nombre} {talento.data.apellido}</b></p>}
							</div>
							{props.id_talento > 0 && props.user.tipo_usuario === TipoUsuario.REPRESENTANTE &&
								<TalentoDashBoardRepresentanteSection id_talento={props.id_talento} id_representante={parseInt(props.user.id)}/>
							}
							<br />
							<MContainer direction="vertical">
								<OptionsGroup
									styleContainer={{
										display: 'flex',
										justifyContent: 'space-between',
										marginBottom: 0,
									}}
									styleButton={{
										textTransform: 'none',
										fontSize: '1.1rem'
									}}
									id="opciones-usuario"
									onOptionClick={(id: string, label: string) => {
										const id_section = label.toLowerCase().replace(/\s+/g, "-");
										console.log(id_section);
										scrollToSection(id_section)
									}}
									labels={['Informacion basica', 'Media', 'Creditos', 'Habilidades', 'Medidas', 'Activos', 'Preferencia de roles']}
								/>
								<InfoGeneral id_talento={id_talento} read_only={!props.can_edit} />
							</MContainer>

							<Media id_talento={id_talento} read_only={!props.can_edit} />

							<Creditos id_talento={id_talento} read_only={!props.can_edit} />

							<Habilidades id_talento={id_talento} read_only={!props.can_edit} />

							<Activos id_talento={id_talento} read_only={!props.can_edit} />
							<FiltrosApariencias id_talento={id_talento} read_only={!props.can_edit} />
							<Preferencias id_talento={id_talento} read_only={!props.can_edit} />
						</div>
					</div>
				</div>
			</MainLayout>
			<Flotantes />
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (session && session.user && session.user.tipo_usuario) {
		if ([TipoUsuario.CAZATALENTOS, TipoUsuario.TALENTO, TipoUsuario.REPRESENTANTE].includes(session.user.tipo_usuario)) {
			const { id_talento } = context.query;
			const { scroll_section } = context.query;
			const { id_rol } = context.query;
			let can_edit = false;
			if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
				can_edit = true;
			}
			if (session.user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
				can_edit = true;
			}
			return {
				props: {
					user: session.user,
					id_talento: (id_talento) ? parseInt(id_talento as string) : 0,
					id_rol: (id_rol) ? parseInt(id_rol as string) : 0,
					scroll_section: (scroll_section) ? scroll_section as string : '',
					can_edit: can_edit
				}
			}
		}
		return {
			redirect: {
				destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
				permanent: true
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

export default DashBoardTalentosPage;