import { type NextPage } from "next";
import Image from 'next/image';
import Head from "next/head";
import { motion } from 'framer-motion'

import { Alertas, Destacados, Flotantes, ListadoProductos, MainLayout, MenuLateral } from "~/components";
import { OptionsGroup } from "~/components/shared/OptionsGroup";
import { MContainer } from "~/components/layout/MContainer";
import { Button, Grid, Link, Typography } from "@mui/material";
import { MTable } from "~/components/shared/MTable/MTable";
import { Activos, Creditos, FiltrosApariencias, Habilidades, Media, Preferencias } from "~/components/talento";
import { InfoGeneral } from "~/components/talento/dashboard-sections/InfoGeneral";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const DashBoardTalentosPage: NextPage = () => {
	const session = useSession();

	const scrollToSection = (sectionId: string) => {
		const section = document.getElementById(sectionId);
		section?.scrollIntoView({ behavior: 'smooth' });
	};

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
						<div className="container_box_header">
							<div className="d-flex justify-content-end align-items-start py-2">
								<Alertas />
							</div>
							<div className="d-flex">
								<motion.img src="/assets/img/iconos/icono_head_chat.png" alt="icono" />
								<p className="h4 font-weight-bold mb-0 ml-2"><b>Iván Rodriguez</b></p>
							</div>
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
								<InfoGeneral id_talento={(session && session.data && session.data.user) ? parseInt(session.data.user.id) : 0} />
							</MContainer>

							<Media />

							<Creditos id_talento={(session && session.data && session.data.user) ? parseInt(session.data.user.id) : 0} />

							<Habilidades id_talento={(session && session.data && session.data.user) ? parseInt(session.data.user.id) : 0} />

							<Activos id_talento={(session && session.data && session.data.user) ? parseInt(session.data.user.id) : 0} />
							<FiltrosApariencias id_talento={(session && session.data && session.data.user) ? parseInt(session.data.user.id) : 0} />
							<Preferencias id_talento={(session && session.data && session.data.user) ? parseInt(session.data.user.id) : 0} />
						</div>
					</div>
				</div>
			</MainLayout>
			<Flotantes />
		</>
	);
};

export default DashBoardTalentosPage;