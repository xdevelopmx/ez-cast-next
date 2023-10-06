import React, {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  CSSProperties,
  useContext,
} from "react";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import { Alert, Button, IconButton } from "@mui/material";
//import classes from './DragNDrop.module.css';
import MotionDiv from "../../layout/MotionDiv";
import { type Archivo } from "~/server/api/root";
import { Tag } from "../Tag";
import { Close } from "@mui/icons-material";
import { MTooltip } from "../MTooltip";
import { MContainer } from "~/components/layout/MContainer";
import { FileManager } from "~/utils/file-manager";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

//const fileTypes = ["JPG", "PNG", "GIF", "PDF"];

interface Props {
  id: string;
  multiple_files?: boolean;
  files: Archivo[];
  label?: ReactNode;
  tooltip?: {
    color: "blue" | "orange";
    text: string;
    placement:
      | "top-start"
      | "top"
      | "top-end"
      | "left-start"
      | "left"
      | "left-end"
      | "right-start"
      | "right"
      | "right-end"
      | "bottom-start"
      | "bottom"
      | "bottom-end";
  };
  filetypes: string[];
  max_files?: number;
  max_file_size?: number;
  hide_selected?: boolean;
  assign_selected_files_height?: boolean;
  onChange: (files: File[]) => void;
  download_url?: string;
  onDownloadUrlRemove?: (url: string) => void;
  text_label_download?: string;
  maxWidth?: string | number;
  height?: string | number;

  text_button?: string;
  noIconLabel?: boolean;

  mainIcon?: ReactNode;

  styleContainerDrag?: CSSProperties;
  styleBoxBtnUpload?: CSSProperties;
  textoArrastrarArchivos?: ReactNode;
  hasNoIconInButton?: boolean;
  stylesButton?: CSSProperties;
}

function DragNDrop(props: Props) {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const [files, setFiles] = useState<Map<string, File>>(new Map());
  const [error, setError] = useState<{
    type: "MAX_FILES_REACHED" | "MAX_SIZE_REACHED" | "FILE_ALREADY_ADDED";
    message: string;
  } | null>(null);
  const hide_error_time_ref = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  useEffect(() => {
    if (hide_error_time_ref.current) {
      clearTimeout(hide_error_time_ref.current);
    }
    hide_error_time_ref.current = setTimeout(() => {
      setError(null);
    }, 2500);
  }, [error]);

  useEffect(() => {
    files.clear();
    if (props.files) {
      console.log(props.files);
      props.files.forEach((f) => {
        try {
          files.set(`${f.file.name}-${f.file.size}-${f.file.type}`, f.file);
        } catch (e) {
          console.error(e);
        }
      });
      setFiles(new Map(files));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.files]);

  const handleChange = async (selected_files: File[]) => {
    const max_files = props.max_files ? props.max_files : 1;
    const current_files_size = files.size + selected_files.length;
    if (current_files_size <= max_files) {
      setError(null);
      const all_files = Array.from(files.values());
      const dont_have_repeated = await FileManager.checkFilesRepeatedInArray(
        all_files.concat(Array.from(selected_files))
      );
      if (!dont_have_repeated) {
        setError({
          type: "FILE_ALREADY_ADDED",
          message: textos["FILES_ERRORS_FILE_ALREADY_EXISTS"]
            ? textos["FILES_ERRORS_FILE_ALREADY_EXISTS"]
            : "Texto No Definido",
        });
        return false;
      }
      Object.entries(selected_files).every((f) => {
        const file_size = Math.round(f[1].size / 1024);
        if (props.max_file_size && file_size > props.max_file_size) {
          const max_size = props.max_file_size;
          setError({
            type: "MAX_SIZE_REACHED",
            message: textos["FILES_ERRORS_FILE_TOO_BIG"]
              ? textos["FILES_ERRORS_FILE_TOO_BIG"].replace(
                  "[SIZE]",
                  `${max_size ? max_size : 0}`
                )
              : "Texto No Definido",
          });
          return false;
        }
        files.set(`${f[1].name}-${f[1].size}-${f[1].type}`, f[1]);
        setFiles(new Map(files));
      });
      props.onChange(Array.from(files.values()));
    } else {
      setError({
        type: "MAX_FILES_REACHED",
        message: textos["FILES_ERRORS_MAX_FILES_REACHED"]
          ? textos["FILES_ERRORS_MAX_FILES_REACHED"].replace(
              "[MAX_FILES]",
              `${max_files}`
            )
          : "Texto No Definido",
      });
    }
    // reiniciamos el input de archivos ya que lo estamos manejando con estado y se quita para permitir el caso donde el usuario elimine un archivo y quiera
    // volver a seleccionarlo

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const child = document.querySelectorAll(`.${props.id}`)[0]?.children[0];
    if (child) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      child.value = null;
    }
  };
  const handleRemove = (id: string) => {
    files.delete(id);
    if (error && error.type === "MAX_FILES_REACHED") {
      if (files.size <= (props.max_files ? props.max_files : 1)) {
        setError(null);
      }
    }
    setFiles(new Map(files));
    props.onChange(Array.from(files.values()));
  };
  return (
    <MotionDiv
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: props.maxWidth || 300,
      }}
      show={true}
      animation="fade"
    >
      <>
        <FileUploader
          classes={`root ${props.id}`}
          multiple
          handleChange={handleChange}
          name="file"
          types={props.filetypes}
        >
          <div className="form-group">
            <MotionDiv show={error != null} animation="fade">
              <Alert icon={false} variant="filled" color="error">
                {error ? error.message : ""}
              </Alert>
            </MotionDiv>
            <div className="d-flex mb-2 align-items-center">
              {props.label && (
                <>
                  {!props.noIconLabel && (
                    <Image
                      width={18}
                      height={18}
                      src="/assets/img/iconos/ico_pdf_blue.svg"
                      alt="icono"
                    />
                  )}
                  {typeof props.label === "string" ? (
                    <p className="ml-2 mb-0">{props.label}</p>
                  ) : (
                    <div className="ml-2 mb-0">{props.label}</div>
                  )}
                </>
              )}
              {props.tooltip && (
                <MTooltip
                  text={props.tooltip.text}
                  color={props.tooltip.color}
                  placement={props.tooltip.placement}
                />
              )}
            </div>
            <div className="btn_talent_upload" style={props.styleContainerDrag}>
              <div
                className="box_btn_upload"
                style={{
                  display: "flex",
                  flexFlow: "column wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  height: props.height,
                  ...props.styleBoxBtnUpload,
                }}
              >
                {/* <p className="mb-1">{`Acepta ${props.filetypes.join(', ')}`}</p> */}

                {props.mainIcon}

                <div
                  className="btn btn-intro"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3px 10px",

                    ...props.stylesButton,
                  }}
                >
                  {!props.hasNoIconInButton && (
                    <Image
                      width={14}
                      height={14}
                      src="/assets/img/iconos/cruz_blue.svg"
                      alt="icono"
                      className="mr-2"
                    />
                  )}
                  <span>
                    {props.text_button ||
                      `${
                        textos["subir"] ? textos["subir"] : "Texto No Definido"
                      } ${
                        textos["archivo"]
                          ? textos["archivo"]
                          : "Texto No Definido"
                      }(s)`}
                  </span>
                </div>
                {!props.textoArrastrarArchivos ? (
                  <p className="mb-1 txt_arrastrar">
                    {`${
                      textos["arrastrar_archivos"]
                        ? textos["arrastrar_archivos"]
                        : "Texto No Definido"
                    } ${
                      props.max_files
                        ? "(Max. " +
                          props.max_files.toString() +
                          " " +
                          textos["archivo"] +
                          "s)"
                        : ""
                    }`}
                  </p>
                ) : (
                  props.textoArrastrarArchivos
                )}
              </div>
            </div>
          </div>
        </FileUploader>
        {props.download_url && (
          <MContainer
            direction="horizontal"
            justify="space-between"
            styles={{ width: "100%" }}
          >
            {props.text_label_download?.length !== 0 && (
              <div>
                <Button
                  size="small"
                  className="font-weight-bold color_a"
                  onClick={() => {
                    window.open(props.download_url);
                  }}
                  variant="text"
                  sx={{
                    textTransform: "capitalize",
                    textDecoration: "underline",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {props.text_label_download ||
                    `${
                      textos["descargar"]
                        ? textos["descargar"]
                        : "Texto No Definido"
                    } ${
                      textos["archivo"]
                        ? textos["archivo"]
                        : "Texto No Definido"
                    }`}
                </Button>
                {props.onDownloadUrlRemove && (
                  <IconButton
                    aria-label="eliminar archivo"
                    size="small"
                    onClick={() => {
                      if (props.onDownloadUrlRemove && props.download_url) {
                        props.onDownloadUrlRemove(props.download_url);
                      }
                    }}
                  >
                    <Close style={{ color: "#069cb1" }} />
                  </IconButton>
                )}
              </div>
            )}
          </MContainer>
        )}
        <div
          style={
            !props.hide_selected && props.assign_selected_files_height
              ? { height: props.max_files ? props.max_files * 24 : 24 }
              : {}
          }
        >
          {!props.hide_selected &&
            files.size > 0 &&
            Array.from(files).map((value: [string, File]) => {
              return (
                <Tag
                  styles={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "auto",
                    maxWidth: "100%",
                  }}
                  key={value[1].name}
                  text={value[1].name}
                  onRemove={() => {
                    handleRemove(
                      `${value[1].name}-${value[1].size}-${value[1].type}`
                    );
                  }}
                />
              );
            })}
        </div>
      </>
    </MotionDiv>
  );
}

export default DragNDrop;
