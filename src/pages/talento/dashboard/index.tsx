import { type NextPage } from "next";
import Image from 'next/image';
import Head from "next/head";
import { motion } from 'framer-motion'
import styles from './index.module.css';

import { Alertas, Destacados, Flotantes, ListadoProductos, MainLayout, MenuLateral } from "~/components";
import { OptionsGroup } from "~/components/shared/OptionsGroup";
import { MContainer } from "~/components/layout/MContainer";
import { Button, Grid, Link, Typography } from "@mui/material";
import { MTable } from "~/components/shared/MTable/MTable";
import { Activos, Creditos, FiltrosApariencias, Habilidades, Media, Preferencias } from "~/components/talento";
import { InfoGeneral } from "~/components/talento/dashboard-sections/InfoGeneral";
import { api } from "~/utils/api";

const DashBoardTalentosPage: NextPage = () => {

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
									id="opciones-usuario"
									onOptionClick={(id: string, label: string) => {
										console.log(id, label);
									}}
									labels={['Informacion basica', 'Media', 'Creditos', 'Habilidades', 'Medidas', 'Activos', 'Preferencia de roles']}
								/>
								<InfoGeneral/>
							</MContainer>
							
							<Media />

							<Creditos />

							<Habilidades />

							<Activos />
							<FiltrosApariencias/>
							<Preferencias/>
						</div>
					</div>
				</div>
			</MainLayout>
			<Flotantes />
		</>
	);
};

export default DashBoardTalentosPage;