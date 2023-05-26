import { type FC, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';
import useScrolled from '~/hooks/useScrolled';
import { Alerts } from './Alerts';
import { useRouter } from 'next/router';

import estilos from './Header.module.css'

interface Props {
	tieneFondoBlanco?: boolean;
	disabletieneFondoBlanco?: boolean;
	menuSiempreBlanco?: boolean;

	menuAzul?: boolean;
}

export const Header: FC<Props> = ({
	tieneFondoBlanco, disabletieneFondoBlanco = false, menuSiempreBlanco = false, menuAzul = false
}) => {

	const [esBlanco, setEsBlanco] = useState(menuSiempreBlanco ? menuSiempreBlanco : tieneFondoBlanco)
	const estaArriba = useScrolled()
	const router = useRouter()

	useEffect(() => {
		if (!menuSiempreBlanco) {
			setEsBlanco(tieneFondoBlanco)
		}
	}, [tieneFondoBlanco, menuSiempreBlanco])

	useEffect(() => {
		if (menuAzul) {
			return;
		}
		if (!menuSiempreBlanco) {
			if (!disabletieneFondoBlanco) {
				setEsBlanco(estaArriba)
			}
		}
	}, [estaArriba, disabletieneFondoBlanco, menuSiempreBlanco, menuAzul])

	return (
		<>
			<nav
				className={`navbar navbar-expand-lg ${esBlanco ? 'navbar-light' : 'navbar-dark'} p-4`}
				style={menuAzul ? {
					backgroundColor: '#069cb1'
				} : {}}>
				<Link href="/" className="navbar-brand ml-lg-5 w-sm-50" style={{ marginRight: 0 }}>
					{(menuAzul || !esBlanco) &&
						<motion.img
							src="/assets/img/logo_blanco.svg"
							className="d-inline-block align-top w-100"
							alt="" />
					}
					{esBlanco &&
						<motion.img
							src="/assets/img/logo_color.svg"
							className={`d-inline-block align-top w-100`}
							alt="" />
					}
				</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarText"
					style={{
						marginRight: '30px'
					}}>
					<ul className="navbar-nav ml-auto">
						<li className={`nav-item ${router.pathname === '/' ? 'active' : ''}`}>
							{/*eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
							<Link className={`nav-link ${estilos.naranja}`} href="/">
								INICIO <span className="sr-only">(current)</span>
							</Link>
						</li>
						<li className={`nav-item ml-lg-3 mr-lg-3 ${router.pathname === '/login' ? 'active' : ''}`}>
							{/*eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
							<Link className={`nav-link ${estilos.azul}`} href="/login">EZ-CAST</Link>
						</li>
						{/* <li className="nav-item ml-lg-3 mr-lg-3">
							<Link className="nav-link" href="/">TREEHOUSE</Link>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<Link className="nav-link" href="/">TALENT+</Link>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<Link className="nav-link" href="/">EXTRAS</Link>
						</li> */}
						<li className={`nav-item ml-lg-3 mr-lg-3 ${router.pathname === '/store' ? 'active' : ''}`}>
							{/*eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
							<Link className={`nav-link  d-flex ${estilos.naranja}`} href="/">
								{
									esBlanco
										? <motion.img className="mx-1" src="/assets/img/iconos/store_icon.svg" alt="icono" />
										: <motion.img className="mx-1" src='/assets/img/iconos/store_icon_white.svg' alt="icono" />
								}
								ONLINE STORE
							</Link>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3 d-flex leng_box">
							<motion.img className="active" src='/assets/img/b_mex.png' alt="icono" />
							<motion.img src="/assets/img/b_eua.png" alt="icono" />
						</li>
					</ul>
				</div>

				<Alerts />
			</nav>
		</>

	)
}
