import React, { useState } from "react";

import { motion } from "framer-motion";
import MotionDiv from "../layout/MotionDiv";
import { Box } from "@mui/material";
import { ConversacionesPreview } from "../shared/ConversacionesPreview";
import { CalendarPreview } from "../shared/CalendarPreview";
import { api } from "~/utils/api";

export const Flotantes = () => {
  const [show_conversaciones, setShowConversaciones] = useState(false);
  const [show_calendar, setShowCalendar] = useState(false);
  const mensajes_no_vistos = api.mensajes.getCountMensajesNoVistos.useQuery();

  return (
    <Box position={"relative"}>
      <div className="fixed_items">
        <div className="container_chat_blue mb-3">

          <div className="image_chat container_calendar_blue"
            style={{ marginBottom: 15 }}
          >
            <motion.img
              src="/assets/img/iconos/EZ_Claqueta.svg"
              className="claqueta_black rounded"
              width={55}
            />
          </div>

          <div
            className="image_chat"

            onClick={() => {
              setShowConversaciones((prev) => !prev);
            }}
          >

            {mensajes_no_vistos.data
              ? mensajes_no_vistos.data > 0 && (
                <span className="count_msn active">
                  {mensajes_no_vistos.data}
                </span>
              )
              : null}
            <motion.img
              src="/assets/img/iconos/ico_chat_blue.svg"
              width={55}
              height={55}
              alt="icon"
            />
          </div>
          <MotionDiv
            show={show_conversaciones}
            style={{ position: "absolute", right: 76, bottom: 65 }}
            animation={"down-to-up"}
          >
            <ConversacionesPreview
              width={"470px"}
              onClose={() => setShowConversaciones(false)}
            />
          </MotionDiv>
          <div className="container_calendar_blue" style={{ marginTop: 10 }}>
            <div
              className="image_calendar"
              onClick={() => {
                setShowCalendar((prev) => !prev);
              }}
            >
              <motion.img
                src="/assets/img/iconos/ico_calendar_blue.svg"
                width={55}
                height={55}
                alt="icon"
              />
            </div>
            <MotionDiv
              show={show_calendar}
              style={{ position: "absolute", right: 76, bottom: 0 }}
              animation={"down-to-up"}
            >
              <CalendarPreview
                width={340}
                onClose={() => setShowCalendar(false)}
              />
            </MotionDiv>
          </div>
        </div>
      </div>
    </Box>
  );
};

export const FlotantesSinMensajes = () => {
  const [show_calendar, setShowCalendar] = useState(false);;

  return (
    <Box position={"relative"}>
      <div className="fixed_items">
        <div className="container_chat_blue mb-3">
          <div className="container_calendar_blue" style={{ marginTop: 10 }}>
            <div
              className="image_calendar"
              onClick={() => {
                setShowCalendar((prev) => !prev);
              }}
            >
              <motion.img
                src="/assets/img/iconos/ico_calendar_blue.svg"
                width={55}
                height={55}
                alt="icon"
              />
            </div>
            <MotionDiv
              show={show_calendar}
              style={{ position: "absolute", right: 76, bottom: 0 }}
              animation={"down-to-up"}
            >
              <CalendarPreview
                width={340}
                onClose={() => setShowCalendar(false)}
              />
            </MotionDiv>
          </div>
        </div>
      </div>
    </Box>
  );
};
