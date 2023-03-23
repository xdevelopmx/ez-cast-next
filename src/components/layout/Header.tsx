import { type FC, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';
import useScrolled from '~/hooks/useScrolled';
import { Alerts } from './Alerts';

interface Props {
	tieneFondoBlanco?: boolean;
	disabletieneFondoBlanco?: boolean;
	menuSiempreBlanco?: boolean;
}

export const Header: FC<Props> = ({ tieneFondoBlanco, disabletieneFondoBlanco = false, menuSiempreBlanco = false }) => {

	const [esBlanco, setEsBlanco] = useState(menuSiempreBlanco? menuSiempreBlanco: tieneFondoBlanco)

	const estaArriba = useScrolled()

	useEffect(() => {
		if (!menuSiempreBlanco) {
			setEsBlanco(tieneFondoBlanco)
		}
	}, [tieneFondoBlanco, menuSiempreBlanco])	

	useEffect(() => {
		if (!menuSiempreBlanco) {
			if (!disabletieneFondoBlanco) {
				setEsBlanco(estaArriba)
			}	
		}
	}, [estaArriba, disabletieneFondoBlanco, menuSiempreBlanco])


	return (
		<>
		
			<nav className={`navbar navbar-expand-lg ${esBlanco ? 'navbar-light' : 'navbar-dark'} p-4`}>
				<Link href="/" className="navbar-brand ml-lg-5 w-sm-50">
					{!esBlanco && <motion.img src="/assets/img/logo_blanco.svg" className="d-inline-block align-top w-100" alt="" />}
					{esBlanco && <motion.img src="/assets/img/logo_color.svg" className={`d-inline-block align-top w-100`} alt="" />}
				</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarText">
					<ul className="navbar-nav ml-auto">
						<li className="nav-item active">
							<Link className="nav-link" href="/">INICIO <span className="sr-only">(current)</span></Link>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<Link className="nav-link" href="/login">EZ-CAST</Link>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<Link className="nav-link" href="/">TREEHOUSE</Link>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<Link className="nav-link" href="/">TALENT+</Link>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<Link className="nav-link" href="/">EXTRAS</Link>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<Link className="nav-link  d-flex" href="/">
								<motion.img className="n-light mx-1" src='/assets/img/iconos/store_icon_white.svg' alt="icono" />
								<motion.img className="n-dark mx-1" src="/assets/img/iconos/store_icon_white.svg" alt="icono" />
								ONLINE STORE
							</Link>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3 d-flex leng_box">
							<motion.img className="active" src='/assets/img/b_mex.png' alt="icono" />
							<motion.img src="/assets/img/b_eua.png" alt="icono" />
						</li>
					</ul>
				</div>

				<Alerts/>
			</nav>
		</>

	)
}
