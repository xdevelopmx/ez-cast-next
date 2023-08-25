import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { Alertas, FormGroup, MainLayout, MenuLateral } from "~/components";
import { useContext, useEffect, useRef, useState } from "react";
import { api, parseErrorBody } from "~/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import ConfirmationDialog from "~/components/shared/ConfirmationDialog";
import useNotify from "~/hooks/useNotify";
import { MTooltip } from "~/components/shared/MTooltip";
import { TipoUsuario } from "~/enums";
import { getSession } from "next-auth/react";
import type { GetServerSideProps, NextPage } from "next";
import Constants from "~/constants";
import type { User } from "next-auth";
import { Circle } from "@mui/icons-material";
import { FileManager } from "~/utils/file-manager";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { useCountDown } from "~/hooks/useCountDown";
import { ResourceAlert } from '~/components/shared/ResourceAlert';

type SelftapeTalentoPageProps = {
  user: User;
  id_talento: number;
};

/* async function getDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  console.log(devices);
}
 */

const AnimatedBox = motion(Box);

const SelftapeTalentoPage: NextPage<SelftapeTalentoPageProps> = ({
  //user,
  id_talento,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const { count, setStartCountDown, startCountDown } = useCountDown(5);

  console.log(startCountDown);

  const router = useRouter();

    const selftapes = api.talentos.getSelftapesByIdTalento.useQuery({id: id_talento}, {
        refetchOnWindowFocus: false
    });

    const [busy, setBusy] = useState(false);

  const { notify } = useNotify();

  const [has_permissions, setPermissions] = useState<{
    camera: boolean;
    microphone: boolean;
  }>({ camera: false, microphone: false });

  const video_player = useRef<HTMLVideoElement | null>(null);

  const media_recorder = useRef<MediaRecorder | null>(null);

  const [recorded_url, setRecordedUrl] = useState("");

  const [blob, setBlob] = useState<BlobPart[]>([]);

  const [recording, setRecording] = useState(false);

  const _navigator = typeof window !== "undefined" ? navigator : null;
  
  const microphone_permisson = "microphone" as PermissionName;

  const camera_permisson = "camera" as PermissionName;
  
  useEffect(() => {
    if (_navigator) {
      //@ts-ignore
      _navigator.permissions
        .query({ name: microphone_permisson })
        .then((permissionObj) => {
          setPermissions((prev) => ({
            ...prev,
            microphone: permissionObj.state === "granted",
          }));
          permissionObj.onchange = () => {
            setPermissions((prev) => ({
              ...prev,
              microphone: permissionObj.state === "granted",
            }));
          };
        })
        .catch(() => {
          setPermissions((prev) => ({ ...prev, microphone: false }));
        });

      //@ts-ignore
      _navigator.permissions
        .query({ name: camera_permisson })
        .then((permissionObj) => {
          setPermissions((prev) => ({
            ...prev,
            camera: permissionObj.state === "granted",
          }));
          permissionObj.onchange = () => {
            setPermissions((prev) => ({
              ...prev,
              camera: permissionObj.state === "granted",
            }));
          };
        })
        .catch(() => {
          setPermissions((prev) => ({ ...prev, camera: false }));
        });
    }
  }, [_navigator]);

  useEffect(() => {
    if (recording) {
      if (
        !media_recorder.current ||
        media_recorder.current.state !== "recording"
      ) {
        if (
          "mediaDevices" in navigator &&
          "getUserMedia" in navigator.mediaDevices
        ) {
          const mediaDevices = navigator.mediaDevices;
          // Accessing the user camera and video.
          mediaDevices
            .getUserMedia({
              video: true,
              audio: true,
            })
            .then((stream) => {
              if (video_player.current) {
                video_player.current.srcObject = stream;
                media_recorder.current = new MediaRecorder(stream, {
                  mimeType: 'video/mp4',
                  //mimeType: "video/webm;codecs=vp9,opus",
                });

                media_recorder.current.ondataavailable = (ev) => {
                  blob.push(ev.data);
                  setBlob(blob.map((b) => b));
                };

                media_recorder.current.onstop = () => {
                  // create local object URL from the recorded video blobs
                  const video_local = URL.createObjectURL(
                    //new Blob(blob, { type: "video/webm" })
                    new Blob(blob, { type: "video/mp4" })
                  );
                  setRecordedUrl(video_local);
                  stream.getTracks().forEach(function (track) {
                    track.stop();
                  });
                };

                video_player.current.addEventListener("loadedmetadata", () => {
                  if (video_player.current) {
                    void video_player.current.play();
                    if (media_recorder.current?.state !== "recording") {
                      media_recorder.current?.start(1000);
                    }
                  }
                });
              }
            })
            .catch(alert);
        }
      }
    } else {
      if (media_recorder.current) {
        media_recorder.current.stop();
        media_recorder.current = null;
        video_player.current = null;
      }
      if (blob.length > 0) {
        setBlob([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording, video_player.current, media_recorder.current, blob]);

  const [confirmation_dialog, setConfirmationDialog] = useState<{
    opened: boolean;
    title: string;
    content: JSX.Element;
    action: "PREVIEW" | "CALLBACK";
    data: Map<string, unknown>;
  }>({
    opened: false,
    title: "",
    content: <></>,
    action: "PREVIEW",
    data: new Map(),
  });

  const [lineas, setLineas] = useState("");

  const [delay] = useState(-1);

  const textBoxRef = useRef<HTMLDivElement>(null);

  const [highlighted_text, sethighlightedText] = useState(0);

  const interval_time_ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const formated_lineas = lineas.split("\n").filter((l) => l.trim().length > 0);

  useEffect(() => {
    if (delay >= 0) {
      if (interval_time_ref.current) {
        clearInterval(interval_time_ref.current);
        interval_time_ref.current = null;
      }
      interval_time_ref.current = setInterval(() => {
        if (formated_lineas.length > highlighted_text + 1) {
          sethighlightedText((prev) => prev + 1);
        }
      }, 5000 - delay * 15);
    }
    return () => {
      if (interval_time_ref.current) {
        clearInterval(interval_time_ref.current);
        interval_time_ref.current = null;
      }
    };
  }, [delay, highlighted_text, formated_lineas]);

  useEffect(() => {
    if (textBoxRef.current) {
      const el_text = textBoxRef.current.getElementsByClassName(
        `selected-text-${highlighted_text}`
      )[0];
      if (el_text) {
        el_text.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }
    }
  }, [highlighted_text, textBoxRef]);

  useEffect(() => {
    if (recorded_url) {
      const params = new Map<string, unknown>();
      params.set("public", true);
      setConfirmationDialog({
        action: "PREVIEW",
        data: params,
        opened: true,
        title: `¿${textos["deseas_guardar"] ?? ""}?`,
        content: (
          <Box>
            <Typography style={{ fontWeight: 800, paddingBottom: 20 }}>
              ({textos["guardar_dialog_subtitle"]})
            </Typography>
            <video controls style={{ width: "100%" }} src={recorded_url}>
              Lo sentimos tu navegador no soporta videos.
            </video>
            <Box my={2}>
              <div style={{ display: "flex", gap: 10 }}>
                <label
                  style={{ fontWeight: 600 }}
                  className={"form-input-label"}
                  htmlFor={"nombre-input"}
                >
                  {textos["guardar_Como"]}*
                </label>
                <TextField
                  size="small"
                  sx={{ fieldset: { borderRadius: "50px!important" } }}
                  id="nombre-input"
                  type="text"
                  onChange={(e) => {
                    params.set("nombre", e.target.value);
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      onChange={() => {
                        const _public = params.get("public") as boolean;
                        params.set("public", !_public);
                      }}
                      defaultChecked
                    />
                  }
                  label={textos["publico"]}
                />
              </div>
              <Typography style={{ color: "#069CB1" }}>
                {textos["visible_cazatalento"]}
              </Typography>
            </Box>
          </Box>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorded_url]);

  useEffect(() => {
    if (startCountDown !== null && !startCountDown) {
      setRecording(true);
    }
  }, [startCountDown]);

  const saveSelftapeMedia = api.talentos.saveSelftape.useMutation({
    async onSuccess() {
      notify("success", `${textos["success_save_selftape_media"] ?? ""}`);
      await selftapes.refetch();
      setConfirmationDialog((prev) => {
        return { ...prev, opened: false };
      });
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const can_record = selftapes.data && selftapes.data.length < 6;
  return (
    <>
      <Head>
        <title>Talentos | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true}>
        <AnimatePresence>
          <div className="d-flex wrapper_ezc">
            <MenuLateral />
            <div className="seccion_container col" style={{ paddingTop: 0 }}>
              <br />
              <br />
              <div className="container_box_header">
                <div className="d-flex justify-content-end align-items-start py-2">
                  <Alertas />
                </div>
                <Box p={8}>
                  <Box display={"flex"} flexDirection={"row"} gap={2}>
                    <Image
                      src="/assets/img/iconos/icono-selftape.svg"
                      width={32}
                      height={32}
                      alt=""
                    />
                    <Typography style={{ fontSize: 30, fontWeight: 800 }}>
                      Self-tape
                    </Typography>
                  </Box>
                  <Typography>{textos["title_text"]}</Typography>
                  <Typography style={{ fontWeight: 800, fontSize: 20 }}>
                    {textos["ventaja"]}
                  </Typography>
                  {selftapes.data && selftapes.data.length > 0 && (
                    <Alert
                      variant="filled"
                      severity={!can_record ? "warning" : "info"}
                      sx={{ maxWidth: "85%", height: 72, my: 2 }}
                    >
                      {!can_record
                        ? textos["max_selftapes_reached"]
                        : `${(textos["current_count_selftape"] ?? "")?.replace(
                            "[COUNT]",
                            `${selftapes.data?.length}`
                          )}`}
                      <Button
                        onClick={() => {
                          void router.push("/talento/media-bank");
                        }}
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ ml: 2 }}
                      >
                        {textos["ir_media_bank"]}
                      </Button>
                    </Alert>
                  )}
                  <Box
                    sx={{ backgroundColor: recording ? "lightgray" : "" }}
                    width={"85%"}
                    height={"55vh"}
                    border={"solid"}
                    borderColor={"#069cb1"}
                    position={"relative"}
                    style={{ border: "3px solid #069cb1", borderRadius: 10 }}
                  >
                    {!has_permissions.camera && (
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        alignContent={"center"}
                        alignItems={"center"}
                        position={"absolute"}
                        left={"calc(50% - 200px)"}
                        top={"calc(50% - 60px)"}
                        width={400}
                        height={120}
                      >
                        <Image
                          src="/assets/img/iconos/agenda.svg"
                          width={32}
                          height={32}
                          alt=""
                        />
                        <Typography>!{textos["atencion"]}!</Typography>
                        <Typography textAlign={"center"}>
                          {textos["no_camera"]}.
                        </Typography>
                        <Button
                          onClick={() => {
                            setRecording(() => true);
                          }}
                          size="small"
                        >
                          {textos["activar"]}
                        </Button>
                      </Box>
                    )}
                    {has_permissions.camera && (
                      <>
                        {can_record && !recording && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%,-50%)",
                              textAlign: "center",
                            }}
                          >
                            {!startCountDown && count > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  src="/assets/img/iconos/web_cam_blue.png"
                                  style={{
                                    textAlign: "center",
                                    paddingBottom: 10,
                                  }}
                                  width={52}
                                  height={39}
                                  alt=""
                                />
                                <Button
                                  style={{
                                    borderRadius: "50px",
                                    width: "170px",
                                    backgroundColor: "#069CB1",
                                    color: "#fff",
                                    textTransform: "none",
                                  }}
                                  onClick={() => {
                                    //setRecording((prev) => !prev);
                                    setStartCountDown(true);
                                  }}
                                  size="small"
                                >
                                  {textos["record_selftape"]}
                                </Button>
                              </Box>
                            ) : (
                              <h1
                                style={{
                                  display: "grid",
                                  placeContent: "center",
                                  color: "#fff",
                                  backgroundColor: "#069CB1",
                                  width: "70px",
                                  aspectRatio: "1/1",
                                  borderRadius: "50%",
                                  fontSize: "3rem",
                                  fontWeight: 800,
                                }}
                              >
                                {count}
                              </h1>
                            )}
                          </Box>
                        )}
                        {!can_record && (
                          <Box
                            position={"absolute"}
                            left={"calc(50% - 100px)"}
                            top={"calc(50% - 8px)"}
                            width={600}
                            height={16}
                          >
                            <Image
                              src="/assets/img/iconos/agenda.svg"
                              width={32}
                              height={32}
                              alt=""
                            />
                            <Typography variant="subtitle2">
                              No puedes grabar mas selftapes
                            </Typography>
                          </Box>
                        )}
                        {recording && (
                          <AnimatedBox
                            key={
                              recording
                                ? "recording-active"
                                : "recording-disable"
                            }
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            position={"relative"}
                            overflow={"hidden"}
                            height={"100%"}
                          >
                            <video
                              ref={video_player}
                              controls
                              style={{
                                width: "100%",
                                position: "absolute",
                                top: 0,
                              }}
                            >
                              Lo sentimos tu navegador no soporta videos.
                            </video>

                            <Box position={"relative"}>
                              <Box
                                onClick={() => {
                                  setRecording((prev) => !prev);
                                }}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                }}
                              >
                                <Box
                                  sx={{ cursor: "pointer" }}
                                  display={"flex"}
                                  flexDirection={"row"}
                                  mt={2}
                                >
                                  <Circle
                                    style={{
                                      color: "tomato",
                                      width: 16,
                                      height: 16,
                                      marginTop: 8,
                                    }}
                                  />
                                  <Typography color={"white"} ml={1} mr={4}>
                                    {textos["recording"]}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  position: "relative",
                                  top: 56,
                                  width: "90%",
                                }}
                                ref={textBoxRef}
                                maxHeight={150}
                                overflow={"hidden"}
                                p={4}
                              >
                                {formated_lineas.map((l, i) => {
                                  return (
                                    <p
                                      key={`${i}${l}`}
                                      className={`selected-text-${i}`}
                                      style={{
                                        fontSize: "1.3rem",
                                        textAlign: "center",
                                        padding: 0,
                                        margin: 0,
                                        backgroundColor:
                                          highlighted_text === i
                                            ? "rgba(6, 156, 177, 0.5)"
                                            : "",
                                        color: "white",
                                      }}
                                    >
                                      {l} [{i}]
                                    </p>
                                  );
                                })}
                              </Box>
                              <Box
                                display={"flex"}
                                flexDirection={"column"}
                                sx={{ position: "absolute", top: 32, right: 0 }}
                                p={4}
                              >
                                <IconButton
                                  onClick={() => {
                                    if (highlighted_text - 1 >= 0) {
                                      sethighlightedText((prev) => prev - 1);
                                    }
                                  }}
                                >
                                  <Image
                                    src={`/assets/img/iconos/arrow_u_white.svg`}
                                    width={20}
                                    height={20}
                                    alt=""
                                  />
                                </IconButton>
                                <IconButton
                                  sx={{
                                    marginTop: 1,
                                  }}
                                  onClick={() => {
                                    if (
                                      formated_lineas.length >
                                      highlighted_text + 1
                                    ) {
                                      sethighlightedText((prev) => prev + 1);
                                    }
                                  }}
                                >
                                  <Image
                                    src={`/assets/img/iconos/arrow_d_white.svg`}
                                    width={20}
                                    height={20}
                                    alt=""
                                  />
                                </IconButton>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                position: "absolute",
                                bottom: "20px",
                                left: "50%",
                                transform: "translate(-50%,0)",
                                cursor: "pointer",
                              }}
                              onClick={() => setRecording(false)}
                            >
                              <Image
                                src={"/assets/img/iconos/stop-recording.svg"}
                                width={25}
                                height={25}
                                alt="stop-icon"
                                style={{
                                  filter:
                                    "invert(100%) sepia(4%) saturate(835%) hue-rotate(259deg) brightness(114%) contrast(100%)",
                                }}
                              />
                              <Typography sx={{ color: "#fff" }}>
                                Da click para terminar la grabación
                              </Typography>
                            </Box>
                          </AnimatedBox>
                        )}
                      </>
                    )}
                  </Box>

                  <Grid container p={2}>
                    <Grid item xs={6}>
                      <FormGroup
                        type={"text-area"}
                        className={"form-input-md"}
                        rows={5}
                        style={{ width: "90%" }}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={"form-input-label"}
                        value={lineas}
                        icon={{
                          element: (
                            <Image
                              src={"/assets/img/iconos/mas_azul.svg"}
                              width={16}
                              height={16}
                              alt=""
                            />
                          ),
                          position: "start",
                        }}
                        onChange={(e) => {
                          setLineas(e.target.value);
                        }}
                        label={textos["lineas_self"]}
                        tooltip={
                          <MTooltip
                            color="blue"
                            placement="right-start"
                            text={
                              <>
                                <Typography fontWeight={600}>
                                  Editar líneas
                                </Typography>
                                <br />
                                <Typography>
                                  Ut condimentum eleifend Leo nec ultricies.
                                </Typography>
                              </>
                            }
                          />
                        }
                        propsTextArea={{
                          sx: {
                            "& fieldset": {
                              borderWidth: "2px",
                            },
                          },
                        }}
                      />
                    </Grid>
                    {/*
                                        
                                            <Grid item xs={6}>
                                                <Box>
                                                    <Box display={'flex'} flexDirection={'row'} gap={2}>
                                                        <Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt=""/>
                                                        <Typography>Self-tape</Typography>
                                                        <MRadioGroup
                                                            id="quieres-agregar-descanso"
                                                            options={['Automático', 'Manual']}
                                                            value={'Manual'}
                                                            direction='horizontal'
                                                            onChange={(e) => {
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box display={'flex'} flexDirection={'row'} gap={2}>
                                                        <Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt=""/>
                                                        <Typography>Velocidad</Typography>
                                                        <Slider
                                                            aria-label="Always visible"
                                                            defaultValue={0}
                                                            step={10}
                                                            value={delay}
                                                            onChange={(e, v) => {
                                                                setDelay(v as number);
                                                            }}
                                                            marks={[
                                                                {
                                                                    value: 0,
                                                                    label: 'Mas Lento',
                                                                },
                                                                {
                                                                    value: 100,
                                                                    label: 'Mas Rapido',
                                                                },
                                                            ]}
                                                            valueLabelDisplay="on"
                                                        />
                                                    </Box>

                                                </Box>
                                            </Grid>
                                        */}
                                    </Grid>
                                    
                                </Box>
                            </div>
                        </div>
                    </div>
                </AnimatePresence>
                <ConfirmationDialog
                    opened={confirmation_dialog.opened}
                    onOptionSelected={async (confirmed: boolean) => {
                        if (confirmed) {
                            switch (confirmation_dialog.action) {
                                case 'PREVIEW': {
                                    const id = confirmation_dialog.data.get('id');
                                    const input_name = (confirmation_dialog.data.has('nombre')) ? confirmation_dialog.data.get('nombre') as string : '';
                                    const is_public = (confirmation_dialog.data.has('public')) ? confirmation_dialog.data.get('public') as boolean : true;
                                    //const file = await FileManager.convertUrlToFile(recorded_url, 'selftape', 'video/webm');
                                    const file = await FileManager.convertUrlToFile(recorded_url, 'selftape', 'video/mp4');
                                    const link = document.createElement('a');
                                    link.href = recorded_url;
                                    link.setAttribute('download', `selftape.mp4`);
                                    //link.setAttribute('download', `selftape.webm`);
                                    document.body.appendChild(link);
                                    link.click();
                                    if (link && link.parentNode) {
                                        link.parentNode.removeChild(link);
                                    }
                                    const base_64 = await FileManager.convertFileToBase64(file);
                                    const date = new Date();
                                    const name = `selftape-${date.toLocaleDateString('es-mx').replaceAll('/', '-')}-${date.toLocaleTimeString('es-mx')}`;
                                    const urls_saved = await FileManager.saveFiles([{path: `talentos/${id_talento}/videos`, name: name, file: file, base64: base_64}]);
                                    if (urls_saved.length > 0) {
                                        urls_saved.forEach((res, j) => {
                                            Object.entries(res).forEach((e, i) => {
                                                const url = e[1].url;  
                                                if (url) {
                                                    saveSelftapeMedia.mutate({
                                                        id_talento: id_talento,
                                                        selftape: {
                                                            nombre: (input_name.length > 0) ? input_name : name,
                                                            //type: 'video/webm',
                                                            type: 'video/mp4',
                                                            url: (url) ? url : '',
                                                            clave: `talentos/${id_talento}/videos/${name}`,
                                                            referencia: `VIDEOS-SELFTAPE-TALENTO-${id_talento}`,
                                                            identificador: `video-selftape-${name}`,
                                                            public: is_public
                                                        }
                                                    })
                                                } else {
                                                    const msg = (name) ? textos['error_didnt_upload_with_name']?.replace('[N1]', name) : textos['error_didnt_upload'];
                                                    notify('error', `${msg} - ${e[1].error}`);
                                                }
                                            })
                                        });
                                    }
                                    setBusy(false);
                                    break;
                                }
                            }
                        }
                        setConfirmationDialog({ ...confirmation_dialog, opened: false });
                    }}
                    title={confirmation_dialog.title}
                    content={confirmation_dialog.content}
                    propsDialogActions={{
                        style: {
                            justifyContent: "center",
                        },
                    }}
                />
            </MainLayout>
        </>

    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user && session.user.tipo_usuario) {
    if (
      [TipoUsuario.TALENTO, TipoUsuario.REPRESENTANTE].includes(
        session.user.tipo_usuario
      )
    ) {
      const { id_talento } = context.query;
      const talento_id =
        session.user.tipo_usuario === TipoUsuario.TALENTO
          ? session.user.id
          : (id_talento as string);
      return {
        props: {
          user: session.user,
          id_talento: parseInt(talento_id),
        },
      };
    }
    return {
      redirect: {
        destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
        permanent: true,
      },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
};

export default SelftapeTalentoPage;
