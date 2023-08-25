import { motion } from "framer-motion";
import { type ComponentProps } from "react";
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";

interface Props extends ComponentProps<"div"> {
  messageProps?: ComponentProps<"p">;
}

export const Alertas = (props: Props) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const { messageProps = {}, ...propsDiv } = props;
  return (
    <div className="pt-4 container_alerts_header" {...propsDiv}>
      <div className="d-flex justify-content-end btn_alerts_header">
        <div className="box_alert_header mr-4">
          <motion.img src="/assets/img/iconos/bell_blue.svg" alt="" />
          <span className="count_msn active">2</span>
        </div>
        <p className="font-weight-bold h4 mr-5 mb-0 color_a" {...messageProps}>
        {textos['talertas']}
        </p>
      </div>
    </div>
  );
};
