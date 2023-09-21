import { type FC, useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import useScrolled from "~/hooks/useScrolled";
import { Alerts } from "./Alerts";
import { useRouter } from "next/router";

import estilos from "./Header.module.css";
import AppContext from "~/context/app";
import { IconButton } from "@mui/material";
import { useSession } from "next-auth/react";

interface Props {
  tieneFondoBlanco?: boolean;
  disabletieneFondoBlanco?: boolean;
  menuSiempreBlanco?: boolean;

  menuAzul?: boolean;
}

export const Header: FC<Props> = ({
  tieneFondoBlanco,
  disabletieneFondoBlanco = false,
  menuSiempreBlanco = false,
  menuAzul = false,
}) => {
  const ctx = useContext(AppContext);
  const [esBlanco, setEsBlanco] = useState(
    menuSiempreBlanco ? menuSiempreBlanco : tieneFondoBlanco
  );
  const estaArriba = useScrolled();
  const router = useRouter();

  const { update } = useSession();

  const isInLogin = router.pathname.includes("/login");

  useEffect(() => {
    if (!menuSiempreBlanco) {
      setEsBlanco(tieneFondoBlanco);
    }
  }, [tieneFondoBlanco, menuSiempreBlanco]);

  useEffect(() => {
    if (menuAzul) {
      return;
    }
    if (!menuSiempreBlanco) {
      if (!disabletieneFondoBlanco) {
        setEsBlanco(estaArriba);
      }
    }
  }, [estaArriba, disabletieneFondoBlanco, menuSiempreBlanco, menuAzul]);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          esBlanco ? "navbar-light" : "navbar-dark"
        } p-4 ${isInLogin ? "py-10" : ""}`}
        style={
          menuAzul
            ? {
                backgroundColor: "#069cb1",
              }
            : {}
        }
      >
        <Link
          href="/"
          className="navbar-brand w-sm-50"
          style={{ margin: "0 0 0 80px" }}
        >
          {(menuAzul || !esBlanco) && (
            <motion.img
              src="/assets/img/logo_blanco.svg"
              className={`d-inline-block align-top ${
                isInLogin ? "w-120" : "w-100"
              } `}
              alt=""
            />
          )}
          {esBlanco && (
            <motion.img
              src="/assets/img/logo_color.png"
              className={`d-inline-block align-top ${
                isInLogin ? "w-120" : "w-100"
              } `}
              alt=""
            />
          )}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse"
          id="navbarText"
          style={{
            marginRight: "30px",
          }}
        >
          <ul className="navbar-nav ml-auto">
            <li
              className={`nav-item ${router.pathname === "/" ? "active" : ""}`}
            >
              {/*eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
              <Link className={`nav-link ${estilos.naranja}`} href="/">
                INICIO <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li
              className={`nav-item ml-lg-3 mr-lg-3 ${
                router.pathname === "/login" ? "active" : ""
              }`}
            >
              {/*eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
              <Link className={`nav-link ${estilos.azul}`} href="/login">
                EZ-CAST
              </Link>
            </li>
            <li
              className={`nav-item ml-lg-3 mr-lg-3 ${
                router.pathname === "/store" ? "active" : ""
              }`}
            >
              {/*eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
              <Link className={`nav-link  d-flex ${estilos.naranja}`} href="/">
                {esBlanco ? (
                  <motion.img
                    className="mx-1"
                    src="/assets/img/iconos/store_icon.svg"
                    alt="icono"
                  />
                ) : (
                  <motion.img
                    className="mx-1"
                    src="/assets/img/iconos/store_icon_white.svg"
                    alt="icono"
                  />
                )}
                ONLINE STORE
              </Link>
            </li>
            <li className="nav-item ml-lg-3 mr-lg-3 d-flex leng_box">
              <IconButton
                onClick={() => {
                  update({ lang: "es" })
                    .then(() => {
                      ctx.setLang("es");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <motion.img
                  className={`${ctx.lang === "es" ? "active" : ""}`}
                  src="/assets/img/b_mex.png"
                  alt="icono"
                  style={{
                    margin: 0,
                  }}
                />
              </IconButton>
              <IconButton
                onClick={() => {
                  update({ lang: "en" })
                    .then(() => {
                      ctx.setLang("en");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <motion.img
                  className={`${ctx.lang === "en" ? "active" : ""}`}
                  src="/assets/img/b_eua.png"
                  alt="icono"
                  style={{
                    margin: 0,
                  }}
                />
              </IconButton>
            </li>
          </ul>
        </div>

        <Alerts />
      </nav>
    </>
  );
};
