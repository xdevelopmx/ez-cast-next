import { useRef, useState, type FC, useContext } from "react";
import Image from "next/image";
import { MContainer } from "../layout/MContainer";
import { IconButton, Typography } from "@mui/material";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface Props {
  name: string;
  url: string;
}

export const AudioBar: FC<Props> = ({ name, url }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const audio_player = useRef<HTMLAudioElement | null>(null);
  const [action_selected, setActionSelected] = useState<
    "PLAY" | "STOP" | "PAUSE" | ""
  >("");
  return (
    <MContainer
      direction="horizontal"
      justify="space-between"
      styles={{
        backgroundColor: "#EBEBEB",
        padding: 5,
        margin: 5,
        width: "100%",
        alignItems: "center",
      }}
    >
      <MContainer
        direction="horizontal"
        styles={{ alignItems: "center", gap: 10 }}
      >
        <IconButton
          onClick={() => {
            if (audio_player.current) {
              setActionSelected("PLAY");
              void audio_player.current.play();
            }
          }}
        >
          <Image
            style={{
              marginLeft: 5,
              cursor: "pointer",
              filter:
                action_selected === "PLAY"
                  ? "brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)"
                  : "",
            }}
            src="/assets/img/iconos/play.svg"
            width={20}
            height={20}
            alt=""
          />
        </IconButton>
        <IconButton
          onClick={() => {
            if (audio_player.current) {
              setActionSelected("PAUSE");
              void audio_player.current.pause();
            }
          }}
        >
          <Image
            style={{
              marginLeft: 5,
              cursor: "pointer",
              filter:
                action_selected === "PAUSE"
                  ? "brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)"
                  : "",
            }}
            src="/assets/img/iconos/pausa.svg"
            width={20}
            height={20}
            alt=""
          />
        </IconButton>
        <IconButton
          onClick={() => {
            if (audio_player.current) {
              setActionSelected("STOP");
              audio_player.current.currentTime = 0;
              audio_player.current.pause();
            }
          }}
        >
          <Image
            style={{
              marginLeft: 5,
              cursor: "pointer",
              filter:
                action_selected === "STOP"
                  ? "brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)"
                  : "",
            }}
            src="/assets/img/iconos/stop.svg"
            width={20}
            height={20}
            alt=""
          />
        </IconButton>
        <Typography style={{ paddingLeft: 10 }}>{name}</Typography>
      </MContainer>
      <audio ref={audio_player}>
        <source src={url} type="audio/mpeg" />
      </audio>
      <Typography
        onClick={() => {
          window.open(url);
        }}
        sx={{
          color: "#069CB1",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        {textos["descargar"]}
      </Typography>
    </MContainer>
  );
};
