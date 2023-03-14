import React from 'react'
import { motion } from 'framer-motion'

export const Header = () => {
	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-dark p-4 ">
				<a className="navbar-brand ml-lg-5 w-sm-50" href="#">
					<motion.img src="assets/img/logo_blanco.svg" className="d-inline-block align-top w-100" alt="" />
				</a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarText">
					<ul className="navbar-nav ml-auto">
						<li className="nav-item active">
							<a className="nav-link" href="./">INICIO <span className="sr-only">(current)</span></a>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<a className="nav-link" href="/login">EZ-CAST</a>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<a className="nav-link" href="login_treehouse.html">TREEHOUSE</a>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<a className="nav-link" href="login_talentplus.html">TALENT+</a>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<a className="nav-link" href="#">EXTRAS</a>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3">
							<a className="nav-link  d-flex" href="#">
								<motion.img className="n-light mx-1" src='assets/img/iconos/store_icon_white.svg' alt="icono" />
								<motion.img className="n-dark mx-1" src="assets/img/iconos/store_icon_white.svg" alt="icono" />
								ONLINE STORE
							</a>
						</li>
						<li className="nav-item ml-lg-3 mr-lg-3 d-flex leng_box">
							<motion.img className="active" src='assets/img/b_mex.png' alt="icono" />
							<motion.img src="assets/img/b_eua.png" alt="icono" />
						</li>
					</ul>
				</div>

			</nav>
		</>
	)
}
