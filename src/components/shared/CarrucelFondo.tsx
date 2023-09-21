import { type ReactNode, type FC } from "react";
import { motion } from "framer-motion";

interface Props {
  children?: ReactNode;
}

export const CarrucelFondo: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="login_ezcast">
        <div className="slideshow slider_login">
          <motion.img
            src="/assets/img/login/ezcast-imagen1-slideshow.jpg"
            className="active"
            alt=""
          />
        </div>
        {children}
      </div>
    </>
  );
};
