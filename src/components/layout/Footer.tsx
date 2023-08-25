import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";


export const Footer = () => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  return (
    <footer className="p-3 p-lg-5">
      <div className="row justify-content-between">
        <div className="col-md-4">
          <div className="row">
            <div className="col-md-6" style={{ padding: "0 0 0 30px" }}>
              <p className="font-weight-bold">{textos["inicio"]?? ""}</p>
              <p style={{ margin: 0 }}>
                <a href="./" className="footer_link">
                  EZ-Cast
                </a>
              </p>
              <p style={{ margin: 0 }}>
                <a href="#" className="footer_link">
                  Online Store
                </a>
              </p>
            </div>
            <div className="col-md-6">
              <p className="font-weight-bold">{textos["ayuda"]?? ""}</p>
              <p style={{ margin: 0 }}>
                <a href="./intro" className="footer_link">
                {textos["tutoriales"]?? ""}
                </a>
              </p>
              <p style={{ margin: 0 }}>
                <a href="./ayuda-ezcast" className="footer_link">
                {textos["preguntas"]?? ""}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 text-right align-self-end">
          <p className="m-0">© Talent Corner, 2023</p>
          <div>
            <a
              href="#"
              className="footer_link"
              style={{
                display: "block !important",
              }}
            >
              {textos["pyp"]?? ""}
            </a>
          </div>
          <a href="#" className="footer_link d-inline-block">
          {textos["tyc"]?? ""}
          </a>
        </div>
      </div>
    </footer>
  );
};
