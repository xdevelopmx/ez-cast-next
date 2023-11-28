import { useRouter } from "next/router";
import {
  CSSProperties,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { Alert, Button, Grid, Typography } from "@mui/material"; 
import { Alertas, Flotantes, MainLayout, MenuLateral } from "~/components";
import {
  DescripcionDelRol,
  InformacionGeneralRol,
} from "~/components/cazatalento/roles";
import { CompensacionRol } from "~/components/cazatalento/roles/agregar-rol/secciones/CompensacionRol";
import { FiltrosDemograficosRol } from "~/components/cazatalento/roles/agregar-rol/secciones/FiltrosDemograficosRol";
import { InformacionCastingRol } from "~/components/cazatalento/roles/agregar-rol/secciones/InformacionCastingRol";
import { InformacionFilmacionRol } from "~/components/cazatalento/roles/agregar-rol/secciones/InformacionFilmacionRol";
import { RequisitosRol } from "~/components/cazatalento/roles/agregar-rol/secciones/RequisitosRol";
import { SelfTapeRol } from "~/components/cazatalento/roles/agregar-rol/secciones/SelfTapeRol";
import { api, parseErrorBody } from "~/utils/api";
import useNotify from "~/hooks/useNotify";
import { NewRol } from "~/server/api/routers/roles";
import { conversorFecha } from "~/utils/conversor-fecha";
import { MContainer } from "~/components/layout/MContainer";
import Constants from "~/constants";
import { getSession } from "next-auth/react";
import { TipoUsuario } from "~/enums";
import { Archivo } from "~/server/api/root";
import { Media } from "@prisma/client";
import { FileManager } from "~/utils/file-manager";
import { User } from "next-auth";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { ResourceAlert } from "~/components/shared/ResourceAlert";

export type RolInformacionGeneralForm = {
  nombre: string;
  id_tipo_rol: number;
  id_proyecto: number;
  rol_principal_secundario: string;
  tipo_trabajo: number[];
};

export type RolCompensacionForm = {
  compensacion: {
    datos_adicionales: string;
    suma_total_compensaciones_no_monetarias?: number;
  };
  sueldo?: {
    cantidad_sueldo: number;
    periodo_sueldo: string;
  };
  compensaciones_no_monetarias: {
    id_compensacion: number;
    descripcion_compensacion: string;
  }[];
  //extras para el formulario
  se_pagara_sueldo: "Sí" | "No";
  se_otorgaran_compensaciones: "Sí" | "No";
  descripcion_otra_compensacion: string;
};

export type FiltrosDemograficosRolForm = {
  generos: number[];
  apariencias_etnias: number[];
  animal?: {
    id: number;
    descripcion: string;
    tamanio: string;
  };
  rango_edad_inicio: number;
  rango_edad_fin: number;
  rango_edad_en_meses: boolean;
  id_pais: number;

  //extras
  genero_del_rol: "No especificado" | "Género especificado";
  apariencia_etnica_del_rol: "No especificado" | "Especificado";
  es_mascota: boolean;
};

export type DescripcionDelRolForm = {
  tiene_nsfw:
  | "Desnudos/Situaciones Sexuales"
  | "No hay desnudos y/o situaciones sexuales";
  descripcion: string;
  detalles_adicionales: string;
  habilidades: number[];
  especificacion_habilidad: string;
  nsfw: {
    ids: number[];
    descripcion: string;
  };
  id_color_cabello: number;
  id_color_ojos: number;
  files: {
    lineas?: Archivo;
    foto_referencia?: Archivo;
    media: {
      lineas?: Media;
      foto_referencia?: Media;
    };
    touched: {
      lineas: boolean;
      foto_referencia: boolean;
    };
  };
};

export type CastingsRolForm = {
  id_estado_republica: number;
  tipo_fecha_selected: "Rango de fechas" | "Individuales";
  fechas: { inicio: Date; fin?: Date }[];
};

export type FilmacionesRolForm = {
  id_estado_republica: number;
  tipo_fecha_selected: "Rango de fechas" | "Individuales";
  fechas: { inicio: Date; fin?: Date }[];
};

export type RequisitosRolForm = {
  fecha_presentacion: string;
  id_uso_horario: number;
  info_trabajo: string;
  id_idioma: number;
  medios_multimedia_a_incluir: number[];
  id_estado_donde_aceptan_solicitudes: number;
};

export type SelftapeRolForm = {
  pedir_selftape: boolean;
  indicaciones: string;
  files: {
    lineas?: Archivo;
    media: {
      lineas?: Media;
    };
    touched: {
      lineas: boolean;
    };
  };
};

export type RolForm = {
  id_rol: number;
  id_proyecto: number;
  informacion_general: RolInformacionGeneralForm;
  compensacion: RolCompensacionForm;
  filtros_demograficos: FiltrosDemograficosRolForm;
  descripcion_rol: DescripcionDelRolForm;
  castings: CastingsRolForm;
  filmaciones: FilmacionesRolForm;
  requisitos: RequisitosRolForm;
  selftape: SelftapeRolForm;
};

const initialState: RolForm = {
  id_rol: 0,
  id_proyecto: 0,
  informacion_general: {
    nombre: "",
    id_tipo_rol: 0,
    id_proyecto: 0,
    rol_principal_secundario: "Principal",
    tipo_trabajo: [],
  },
  compensacion: {
    compensacion: {
      datos_adicionales: "",
      suma_total_compensaciones_no_monetarias: 0,
    },
    sueldo: {
      cantidad_sueldo: 0,
      periodo_sueldo: "Diario",
    },
    compensaciones_no_monetarias: [],
    //extras para el formulario
    se_pagara_sueldo: "No",
    se_otorgaran_compensaciones: "No",
    descripcion_otra_compensacion: "",
  },
  filtros_demograficos: {
    generos: [],
    apariencias_etnias: [],
    rango_edad_inicio: 1,
    rango_edad_fin: 18,
    rango_edad_en_meses: false,
    id_pais: 0,

    //extras
    genero_del_rol: "No especificado",
    apariencia_etnica_del_rol: "No especificado",
    es_mascota: false,
  },
  descripcion_rol: {
    tiene_nsfw: "No hay desnudos y/o situaciones sexuales",
    descripcion: "",
    detalles_adicionales: "",
    habilidades: [],
    especificacion_habilidad: "",
    nsfw: {
      ids: [],
      descripcion: "",
    },
    id_color_cabello: 0,
    id_color_ojos: 0,
    files: {
      lineas: undefined,
      foto_referencia: undefined,
      media: {
        lineas: undefined,
        foto_referencia: undefined,
      },
      touched: {
        lineas: false,
        foto_referencia: false,
      },
    },
  },
  castings: {
    id_estado_republica: 0,
    tipo_fecha_selected: "Rango de fechas",
    fechas: [],
  },
  filmaciones: {
    id_estado_republica: 0,
    tipo_fecha_selected: "Rango de fechas",
    fechas: [],
  },
  requisitos: {
    fecha_presentacion: "",
    id_uso_horario: 0,
    info_trabajo: "",
    id_idioma: 0,
    medios_multimedia_a_incluir: [],
    id_estado_donde_aceptan_solicitudes: 0,
  },
  selftape: {
    pedir_selftape: false,
    indicaciones: "",
    files: {
      media: {},
      touched: {
        lineas: false,
      },
    },
  },
};

const reducerRol = (
  state: RolForm,
  action: { type: string; value: { [key: string]: unknown } }
) => {
  switch (action.type) {
    case "update-form":
      return { ...state, ...action.value };
    case "update-info-gral": {
      return {
        ...state,
        informacion_general: { ...state.informacion_general, ...action.value },
      } as RolForm;
    }
    case "update-compensacion": {
      return {
        ...state,
        compensacion: { ...state.compensacion, ...action.value },
      } as RolForm;
    }
    case "update-filtros-demograficos": {
      return {
        ...state,
        filtros_demograficos: {
          ...state.filtros_demograficos,
          ...action.value,
        },
      } as RolForm;
    }
    case "update-descripcion-rol": {
      return {
        ...state,
        descripcion_rol: { ...state.descripcion_rol, ...action.value },
      } as RolForm;
    }
    case "update-castings-rol": {
      return {
        ...state,
        castings: { ...state.castings, ...action.value },
      } as RolForm;
    }
    case "update-filmaciones-rol": {
      return {
        ...state,
        filmaciones: { ...state.filmaciones, ...action.value },
      } as RolForm;
    }
    case "update-requisitos-rol": {
      return {
        ...state,
        requisitos: { ...state.requisitos, ...action.value },
      } as RolForm;
    }
    case "update-selftape-rol": {
      return {
        ...state,
        selftape: { ...state.selftape, ...action.value },
      } as RolForm;
    }
    case "reset": {
      return initialState;
    }
    default:
      return { ...state };
  }
};

const AgregarRolPage: NextPage<{ user: User }> = ({ user }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const router = useRouter();

  const [on_save_action, setOnSaveAction] = useState<
    "redirect-to-proyectos" | "reset-form" | null
  >(null);
  const [state, dispatch] = useReducer(reducerRol, initialState);
  const { notify } = useNotify();

  useEffect(() => {
    const id_proyecto = router.query["id-proyecto"];
    const id_rol = router.query["id-rol"];
    dispatch({
      type: "update-form",
      value: {
        id_proyecto: id_proyecto ? parseInt(id_proyecto as string) : 0,
        id_rol: id_rol ? parseInt(id_rol as string) : 0,
      },
    });
  }, [router.query]);

  const rol = api.roles.getCompleteById.useQuery(state.id_rol, {
    refetchOnWindowFocus: false,
  });

  const initDescripcionFiles = async () => {
    const files: {
      lineas?: Archivo;
      foto_referencia?: Archivo;
    } = {};
    if (state.descripcion_rol.files.media.lineas) {
      const file = await FileManager.convertUrlToFile(
        state.descripcion_rol.files.media.lineas.url,
        state.descripcion_rol.files.media.lineas.nombre,
        state.descripcion_rol.files.media.lineas.type
      );
      if (file) {
        const base_64 = await FileManager.convertFileToBase64(file);
        files.lineas = {
          id: state.descripcion_rol.files.media.lineas.id,
          base64: base_64,
          name: state.descripcion_rol.files.media.lineas.nombre,
          file: file,
          url: state.descripcion_rol.files.media.lineas.url,
        };
      }
    }
    if (state.descripcion_rol.files.media.foto_referencia) {
      const file = await FileManager.convertUrlToFile(
        state.descripcion_rol.files.media.foto_referencia.url,
        state.descripcion_rol.files.media.foto_referencia.nombre,
        state.descripcion_rol.files.media.foto_referencia.type
      );
      if (file) {
        const base_64 = await FileManager.convertFileToBase64(file);
        files.foto_referencia = {
          id: state.descripcion_rol.files.media.foto_referencia.id,
          base64: base_64,
          name: state.descripcion_rol.files.media.foto_referencia.nombre,
          file: file,
          url: state.descripcion_rol.files.media.foto_referencia.url,
        };
      }
    }
    dispatch({
      type: "update-descripcion-rol",
      value: {
        files: {
          media: {
            lineas: undefined,
            foto_referencia: undefined,
          },
          lineas: files.lineas,
          foto_referencia: files.foto_referencia,
          touched: {
            lineas: false,
            foto_referencia: false,
          },
        },
      },
    });
  };

  const initSelftapeFiles = async () => {
    const files: {
      lineas?: Archivo;
    } = {};
    if (state.selftape.files.media.lineas) {
      const file = await FileManager.convertUrlToFile(
        state.selftape.files.media.lineas.url,
        state.selftape.files.media.lineas.nombre,
        state.selftape.files.media.lineas.type
      );
      if (file) {
        const base_64 = await FileManager.convertFileToBase64(file);
        files.lineas = {
          id: state.selftape.files.media.lineas.id,
          base64: base_64,
          name: state.selftape.files.media.lineas.nombre,
          file: file,
          url: state.selftape.files.media.lineas.url,
        };
      }
    }
    dispatch({
      type: "update-selftape-rol",
      value: {
        files: {
          media: {
            lineas: undefined,
          },
          lineas: files.lineas,
          touched: {
            lineas: false,
          },
        },
      },
    });
  };

  useEffect(() => {
    if (
      state.descripcion_rol.files.media.foto_referencia ||
      state.descripcion_rol.files.media.lineas
    ) {
      void initDescripcionFiles();
    }
  }, [state.descripcion_rol.files.media]);

  useEffect(() => {
    if (state.selftape.files.media.lineas) {
      void initSelftapeFiles();
    }
  }, [state.selftape.files.media]);

  useEffect(() => {
    if (rol.data) {
      const compensaciones = rol.data.compensaciones;
      const sueldo = compensaciones ? compensaciones.sueldo : null;
      const compensaciones_no_monetarias = compensaciones
        ? compensaciones.compensaciones_no_monetarias
        : [];
      const otra_compensacion = compensaciones_no_monetarias.filter(
        (c) => c.id_compensacion === 99
      )[0];
      const filtros_demo = rol.data.filtros_demograficos;
      const animal = filtros_demo ? filtros_demo.animal : null;

      const fecha_requisitos = rol.data.requisitos
        ? conversorFecha(rol.data.requisitos.presentacion_solicitud)
        : "";

      dispatch({
        type: "update-form",
        value: {
          informacion_general: {
            nombre: rol.data.nombre,
            id_tipo_rol: rol.data.id_tipo_rol,
            id_proyecto: rol.data.id_proyecto,
            rol_principal_secundario:
              rol.data.tipo_rol.tipo.toUpperCase() === "PRINCIPAL"
                ? "Principal"
                : "Extra",
            tipo_trabajo: rol.data.tipo_trabajos
              ? rol.data.tipo_trabajos.map((t) => t.id_tipo_trabajo)
              : [],
          },
          compensacion: {
            compensacion: {
              datos_adicionales: compensaciones
                ? compensaciones.datos_adicionales
                : "",
              suma_total_compensaciones_no_monetarias: compensaciones
                ? compensaciones.suma_total_compensaciones_no_monetarias
                : 0,
            },
            sueldo: {
              cantidad_sueldo: sueldo ? sueldo.cantidad : 0,
              periodo_sueldo: sueldo
                ? `${sueldo.periodo.substring(0, 1)}${sueldo.periodo
                  .substring(1, sueldo.periodo.length)
                  .toLowerCase()}`
                : `${textos["diario"]}`,
            },
            compensaciones_no_monetarias: compensaciones_no_monetarias.map(
              (c) => {
                return {
                  id_compensacion: c.id_compensacion,
                  descripcion_compensacion: c.descripcion_compensacion,
                };
              }
            ),

            //extras para el formulario
            se_pagara_sueldo: rol.data.compensaciones?.sueldo ? `${textos['si']}` : `${textos['no']}`,
            se_otorgaran_compensaciones:
              compensaciones_no_monetarias.length > 0 ? `${textos['si']}` : `${textos['no']}`,
            descripcion_otra_compensacion: otra_compensacion
              ? otra_compensacion.descripcion_compensacion
              : "",
          },
          filtros_demograficos: {
            generos: filtros_demo
              ? filtros_demo.generos.map((g) => g.id_genero)
              : [],
            apariencias_etnias: filtros_demo
              ? filtros_demo.aparencias_etnicas.map(
                (a) => a.id_aparencia_etnica
              )
              : [],
            animal: {
              id: animal ? animal.id_animal : 0,
              descripcion: animal ? animal.descripcion : "",
              tamanio: animal ? animal.tamanio : "",
            },
            rango_edad_inicio: filtros_demo
              ? filtros_demo.rango_edad_inicio
              : 1,
            rango_edad_fin: filtros_demo ? filtros_demo.rango_edad_fin : 18,
            rango_edad_en_meses: filtros_demo
              ? filtros_demo.rango_edad_en_meses
              : false,
            id_pais: filtros_demo ? filtros_demo.id_pais : 0,

            //extras
            genero_del_rol:
              filtros_demo && filtros_demo.generos.length > 0
                ? `${textos['genero_especificado']}`
                : `${textos['no_especificado']}`,
            apariencia_etnica_del_rol:
              filtros_demo && filtros_demo.aparencias_etnicas.length > 0
                ? `${textos['especificado']}`
                : `${textos['no_especificado']}`,
            es_mascota: animal != null,
          },
          descripcion_rol: {
            tiene_nsfw:
              rol.data && rol.data.nsfw
                ? `${textos['desnudos_o_situaciones_sexuales']}`
                : `${textos['no_hay_desnudos']}`,
            descripcion: rol.data ? rol.data.descripcion : "",
            detalles_adicionales: rol.data ? rol.data.detalles_adicionales : "",
            habilidades:
              rol.data && rol.data.habilidades
                ? rol.data.habilidades.habilidades_seleccionadas.map(
                  (h) => h.id_habilidad
                )
                : [],
            especificacion_habilidad:
              rol.data && rol.data.habilidades
                ? rol.data.habilidades.especificacion
                : "",
            nsfw: {
              ids:
                rol.data && rol.data.nsfw
                  ? rol.data.nsfw.nsfw_seleccionados.map((n) => n.id_nsfw)
                  : [],
              descripcion:
                rol.data && rol.data.nsfw ? rol.data.nsfw.descripcion : "",
            },
            id_color_cabello: rol.data.id_color_cabello
              ? rol.data.id_color_cabello
              : 0,
            id_color_ojos: rol.data.id_color_ojos ? rol.data.id_color_ojos : 0,
            files: {
              media: {
                lineas: rol.data.lineas,
                foto_referencia: rol.data.foto_referencia,
              },
            },
          },
          castings: {
            id_estado_republica:
              rol.data.casting && rol.data.casting.length > 0
                ? rol.data.casting[0]?.id_estado_republica
                : 0,
            tipo_fecha_selected: `${textos['rango_fechas']}`,
            fechas: rol.data.casting
              ? rol.data.casting.map((c) => {
                return {
                  inicio: c.fecha_inicio,
                  fin: c.fecha_fin,
                };
              })
              : [],
          },
          filmaciones: {
            id_estado_republica:
              rol.data.filmaciones && rol.data.filmaciones.length > 0
                ? rol.data.filmaciones[0]?.id_estado_republica
                : 0,
            tipo_fecha_selected: `${textos['rango_fechas']}`,
            fechas: rol.data.filmaciones
              ? rol.data.filmaciones.map((c) => {
                return {
                  inicio: c.fecha_inicio,
                  fin: c.fecha_fin,
                };
              })
              : [],
          },
          requisitos: {
            fecha_presentacion: rol.data.requisitos ? fecha_requisitos : "",
            id_uso_horario: rol.data.requisitos
              ? rol.data.requisitos.id_uso_horario
              : 0,
            info_trabajo: rol.data.requisitos
              ? rol.data.requisitos.informacion
              : "",
            id_idioma: rol.data.requisitos ? rol.data.requisitos.id_idioma : 0,
            medios_multimedia_a_incluir: rol.data.requisitos
              ? rol.data.requisitos.medios_multimedia.map(
                (m) => m.id_medio_multimedia
              )
              : [],
            id_estado_donde_aceptan_solicitudes: rol.data.requisitos
              ? rol.data.requisitos.id_estado_republica
              : 0,
          },
          selftape: {
            indicaciones: rol.data.selftape
              ? rol.data.selftape.indicaciones
              : "",
            pedir_selftape: rol.data.selftape
              ? rol.data.selftape.pedir_selftape
              : false,
            files: {
              media: {
                lineas: rol.data.selftape?.lineas,
              },
            },
          },
        },
      });
      //void initDescripcionFiles();
    }
  }, [rol.data, textos]);

  const form_validate = useMemo(() => {
    const form: { data: NewRol; complete: boolean; error: null | string } = {
      data: {
        id_rol: state.id_rol,
        info_gral: {
          nombre: "",
          id_tipo_rol: 0,
          id_proyecto: 0,
          tipo_trabajo: [],
        },
        compensaciones: {
          compensacion: {
            datos_adicionales: "",
          },
        },
        filtros_demograficos: {
          rango_edad_inicio: 0,
          rango_edad_fin: 0,
          rango_edad_en_meses: false,
          id_pais: 0,
        },
        descripcion_rol: {
          descripcion: "",
          habilidades: [],
          especificacion_habilidad: "",
          id_color_cabello: 0,
          id_color_ojos: 0,
        },
        casting: {
          id_estado_republica: 0,
          fechas: [],
        },
        filmaciones: {
          id_estado_republica: 0,
          fechas: [],
        },
        requisitos: {
          fecha_presentacion: "",
          id_uso_horario: 0,
          info_trabajo: "",
          id_idioma: 0,
          medios_multimedia_a_incluir: [],
          id_estado_donde_aceptan_solicitudes: 0,
        },
        selftape: {
          indicaciones: "",
          pedir_selftape: false,
        },
      },
      complete: false,
      error: null,
    };
    if (
      !state.informacion_general.nombre ||
      state.informacion_general.nombre.length < 2
    ) {
      return { ...form, error: `${textos['nombre_rol_invalido']}` };
    }
    if (state.informacion_general.id_tipo_rol < 1) {
      return { ...form, error: `${textos['tipo_rol_invalido']}` };
    }
    if (state.informacion_general.tipo_trabajo.length === 0) {
      return { ...form, error: `${textos['tipo_trabajo_invalido']}` };
    }
    form.data.info_gral = {
      nombre: state.informacion_general.nombre,
      id_tipo_rol: state.informacion_general.id_tipo_rol,
      id_proyecto: state.id_proyecto,
      tipo_trabajo: state.informacion_general.tipo_trabajo,
    };

    if (state.compensacion.se_pagara_sueldo === `${textos['si']}`) {
      if (
        state.compensacion.sueldo &&
        state.compensacion.sueldo.cantidad_sueldo <= 0
      ) {
        return { ...form, error: `${textos['cantidad_sueldo_invalido']}` };
      }

      form.data.compensaciones = {
        ...form.data.compensaciones,
        sueldo: {
          cantidad_sueldo: state.compensacion.sueldo
            ? parseFloat(`${state.compensacion.sueldo.cantidad_sueldo}`)
            : 0,
          periodo_sueldo: state.compensacion.sueldo
            ? state.compensacion.sueldo.periodo_sueldo
            : "",
        },
      };
    }

    if (state.compensacion.se_otorgaran_compensaciones === `${textos['si']}`) {
      if (
        state.compensacion.compensaciones_no_monetarias &&
        state.compensacion.compensaciones_no_monetarias.length === 0
      ) {
        return {
          ...form,
          error: `${textos['compensaciones_invalidas']}`,
        };
      }

      form.data.compensaciones = {
        ...form.data.compensaciones,
        compensaciones_no_monetarias:
          state.compensacion.compensaciones_no_monetarias,
      };
    }

    form.data.compensaciones = {
      ...form.data.compensaciones,
      compensacion: {
        datos_adicionales: state.compensacion.compensacion.datos_adicionales,
        suma_total_compensaciones_no_monetarias: state.compensacion.compensacion
          .suma_total_compensaciones_no_monetarias
          ? parseFloat(
            state.compensacion.compensacion.suma_total_compensaciones_no_monetarias.toString()
          )
          : 0,
      },
    };

    if (state.filtros_demograficos.genero_del_rol === `${textos['genero_especificado']}`) {
      if (state.filtros_demograficos.generos.length === 0) {
        return {
          ...form,
          filtros_demograficos: undefined,
          error: `${textos['generos_invalidos']}`,
        };
      }
      form.data.filtros_demograficos = {
        ...form.data.filtros_demograficos,
        generos: state.filtros_demograficos.generos,
      };
    }

    if (
      state.filtros_demograficos.apariencia_etnica_del_rol === `${textos['especificado']}`
    ) {
      if (state.filtros_demograficos.apariencias_etnias.length === 0) {
        return { ...form, error: `${textos['etnias_invalidas']}` };
      }

      form.data.filtros_demograficos = {
        ...form.data.filtros_demograficos,
        apariencias_etnias: state.filtros_demograficos.apariencias_etnias,
      };
    }

    // if (state.filtros_demograficos.es_mascota) {
    //   if (state.filtros_demograficos.animal) {
    //     if (
    //       state.filtros_demograficos.animal.id <= 0 ||
    //       (
    //         state &&
    //         state.filtros_demograficos &&
    //         state.filtros_demograficos.animal &&
    //         state.filtros_demograficos.animal.tamanio &&
    //         state.filtros_demograficos.animal.tamanio.length === 0) &&
    //         (
    //           state &&
    //           state.filtros_demograficos &&
    //           state.filtros_demograficos.animal &&
    //           state.filtros_demograficos.animal.descripcion &&
    //           state.filtros_demograficos.animal.descripcion.length === 0)
    //     ) {
    //       return { ...form, error: `${textos['animal_invalido']}` };
    //     }
    //   } else {
    //     return { ...form, error: `${textos['animal_invalido']}` };
    //   }
    //   console.log("estadodescripcion",state.filtros_demograficos?.animal);
    //   form.data.filtros_demograficos = {
    //     ...form.data.filtros_demograficos,
    //     animal: state.filtros_demograficos.animal,
    //   };
    // }

    if (state.filtros_demograficos.es_mascota) {
      if (state.filtros_demograficos.animal) {
        const { animal } = state.filtros_demograficos;
        if (
          animal.id <= 0
        ) {
          return { ...form, error: `${textos['animal_invalido_tipo']}` };
        }
        // if (
        //   !(animal.descripcion && animal.descripcion.length)
        // ) {
        //   return { ...form, error: `${textos['animal_invalido_descripcion']}` };
        // }
        if (
          !(animal.tamanio && animal.tamanio.length)
        ) {
          return { ...form, error: `${textos['animal_invalido_tamanio']}` };
        }

        form.data.filtros_demograficos = {
          ...form.data.filtros_demograficos,
          animal,
        };
      } else {
        return { ...form, error: `${textos['animal_invalido']}` };
      }
    }

    //mejorando validacion de mascota 
    // if (state.filtros_demograficos.es_mascota && state.filtros_demograficos.animal) {
    //   const { animal } = state.filtros_demograficos;

    //   if (animal.id <= 0 || !(animal.tamanio && animal.tamanio.length) || !animal.descripcion) {
    //     return { ...form, error: `${textos['animal_invalido']}` };
    //   }

    //   form.data.filtros_demograficos = {
    //     ...form.data.filtros_demograficos,
    //     animal,
    //   };
    // } else {
    //   return { ...form, error: `${textos['animal_invalido']}` };
    // }

    if (state.filtros_demograficos.id_pais <= 0) {
      return { ...form, error: `${textos['nacionalidad_invalida']}` };
    }

    form.data.filtros_demograficos = {
      ...form.data.filtros_demograficos,
      rango_edad_inicio: state.filtros_demograficos.rango_edad_inicio,
      rango_edad_fin: state.filtros_demograficos.rango_edad_fin,
      rango_edad_en_meses: state.filtros_demograficos.rango_edad_en_meses,
      id_pais: state.filtros_demograficos.id_pais,
    };

    if (
      !state.descripcion_rol.descripcion ||
      state.descripcion_rol.descripcion.length <= 0
    ) {
      return { ...form, error: `${textos['descripcion_rol_invalida']}` };
    }

    if (state.descripcion_rol.id_color_cabello <= 0) {
      return { ...form, error: `${textos['color_cabello_rol_invalido']}` };
    }

    if (state.descripcion_rol.id_color_ojos <= 0) {
      return { ...form, error: `${textos['color_ojos_rol_invalido']}` };
    }

    form.data.descripcion_rol = {
      ...form.data.descripcion_rol,
      descripcion: state.descripcion_rol.descripcion,
      detalles_adicionales:
        state.descripcion_rol.detalles_adicionales &&
          state.descripcion_rol.detalles_adicionales.length > 0
          ? state.descripcion_rol.detalles_adicionales
          : "",
      habilidades: state.descripcion_rol.habilidades,
      especificacion_habilidad: state.descripcion_rol.especificacion_habilidad,
      id_color_cabello: state.descripcion_rol.id_color_cabello,
      id_color_ojos: state.descripcion_rol.id_color_ojos,
    };

    if (state.descripcion_rol.tiene_nsfw === `${textos['desnudos_o_situaciones_sexuales']}`) {
      if (state.descripcion_rol.nsfw.ids.length === 0) {
        return {
          ...form,
          error: `${textos['nsfw_rol_invalido']}`,
        };
      }
      if (state.descripcion_rol.nsfw.descripcion.length === 0) {
        return {
          ...form,
          error: `${textos['detalles_nsfw_rol_invalido']}`,
        };
      }

      form.data.descripcion_rol = {
        ...form.data.descripcion_rol,
        nsfw: state.descripcion_rol.nsfw,
      };
    }

    if (state.castings.fechas.length === 0) {
      return {
        ...form,
        error: `${textos['fecha_castings_rol_invalida']}`,
      };
    }

    if (state.castings.id_estado_republica <= 0) {
      return {
        ...form,
        error: `${textos['estado_castings_rol_invalido']}`,
      };
    }

    form.data.casting = {
      ...form.data.casting,
      id_estado_republica: state.castings.id_estado_republica,
      fechas: state.castings.fechas,
    };

    if (state.filmaciones.fechas.length === 0) {
      return {
        ...form,
        error: `${textos['fecha_filmaciones_rol_invalida']}`,
      };
    }

    if (state.filmaciones.id_estado_republica <= 0) {
      return {
        ...form,
        error: `${textos['estado_filmacion_rol_invalido']}`,
      };
    }

    form.data.filmaciones = {
      ...form.data.filmaciones,
      id_estado_republica: state.filmaciones.id_estado_republica,
      fechas: state.filmaciones.fechas,
    };

    if (state.requisitos.fecha_presentacion === "") {
      return {
        ...form,
        error: `${textos['fecha_presentacion_rol_invalida']}`,
      };
    }

    if (state.requisitos.info_trabajo.length === 0) {
      return {
        ...form,
        error: `${textos['info_trabajo_rol_invalida']}`,
      };
    }

    if (state.requisitos.medios_multimedia_a_incluir.length === 0) {
      return {
        ...form,
        error: `${textos['medios_multimedia_rol_invalidos']}`,
      };
    }

    if (state.requisitos.id_uso_horario <= 0) {
      return { ...form, error: `${textos['uso_horario_rol_invalido']}` };
    }

    if (state.requisitos.id_idioma <= 0) {
      return { ...form, error: `${textos['idioma_rol_invalido']}` };
    }

    if (state.requisitos.id_estado_donde_aceptan_solicitudes <= 0) {
      return {
        ...form,
        error: `${textos['estado_donde_aceptan_solicitudes_invalido']}`,
      };
    }

    form.data.requisitos = {
      fecha_presentacion: state.requisitos.fecha_presentacion,
      id_uso_horario: state.requisitos.id_uso_horario,
      info_trabajo: state.requisitos.info_trabajo,
      id_idioma: state.requisitos.id_idioma,
      medios_multimedia_a_incluir: state.requisitos.medios_multimedia_a_incluir,
      id_estado_donde_aceptan_solicitudes:
        state.requisitos.id_estado_donde_aceptan_solicitudes,
    };

    form.data.selftape = {
      ...form.data.selftape,
      indicaciones: state.selftape.indicaciones,
      pedir_selftape: state.selftape.pedir_selftape,
    };
    form.complete =
      state.informacion_general.nombre.length > 1 &&
      state.informacion_general.id_tipo_rol > 0 &&
      state.filtros_demograficos.rango_edad_inicio > 0 &&
      state.filtros_demograficos.rango_edad_fin > 0 &&
      state.filtros_demograficos.id_pais > 0 &&
      state.descripcion_rol.descripcion.length > 0 &&
      state.castings.id_estado_republica > 0 &&
      state.castings.fechas.length > 0 &&
      state.filmaciones.id_estado_republica > 0 &&
      state.filmaciones.fechas.length > 0 &&
      state.requisitos.fecha_presentacion !== "" &&
      state.requisitos.id_uso_horario > 0 &&
      state.requisitos.id_idioma > 0 &&
      state.requisitos.medios_multimedia_a_incluir.length > 0 &&
      state.requisitos.id_estado_donde_aceptan_solicitudes > 0 &&
      state.requisitos.info_trabajo.length > 0;
    return form;
  }, [state, textos]);

  const updateRolFiles = api.roles.saveRolFiles.useMutation({
    onSuccess: (data) => {
      if (on_save_action) {
        switch (on_save_action) {
          case "redirect-to-proyectos": {
            void router.push("/cazatalentos/dashboard");
            break;
          }
          case "reset-form": {
            dispatch({ type: "reset", value: {} });
            window.scroll({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
            break;
          }
        }
      }
      notify("success", `${textos['se_guardo_rol_con_exito']}`);
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const saveRol = api.roles.saveRol.useMutation({
    async onSuccess(data) {
      const files: {
        lineas: Media | null;
        foto_referencia: Media | null;
        lineas_selftape: Media | null;
      } = { lineas: null, foto_referencia: null, lineas_selftape: null };
      const files_to_be_saved: {
        path: string;
        name: string;
        file: File;
        base64: string;
      }[] = [];
      const time = new Date().getTime();
      if (state.descripcion_rol.files.lineas) {
        if (state.descripcion_rol.files.touched.lineas) {
          files_to_be_saved.push({
            path: `cazatalentos/${user.id}/roles/${data.id}/lineas`,
            name: `${state.descripcion_rol.files.lineas.file.name}-${time}`,
            file: state.descripcion_rol.files.lineas.file,
            base64: state.descripcion_rol.files.lineas.base64,
          });
        } else {
          files.lineas = {
            id: state.descripcion_rol.files.lineas?.id
              ? state.descripcion_rol.files.lineas.id
              : 0,
            nombre: state.descripcion_rol.files.lineas?.name,
            type: state.descripcion_rol.files.lineas?.file.type
              ? state.descripcion_rol.files.lineas.file.type
              : "",
            url: state.descripcion_rol.files.lineas.url
              ? state.descripcion_rol.files.lineas.url
              : "",
            clave: `cazatalentos/${user.id}/roles/${data.id}/lineas/${state.descripcion_rol.files.lineas.name}-${time}`,
            referencia: `ARCHIVOS-ROL-${data.id}`,
            identificador: `lineas-rol-${data.id}`,
            public: true,
          };
        }
      }
      if (state.descripcion_rol.files.foto_referencia) {
        if (state.descripcion_rol.files.touched.foto_referencia) {
          files_to_be_saved.push({
            path: `cazatalentos/${user.id}/roles/${data.id}/foto-referencia`,
            name: `${state.descripcion_rol.files.foto_referencia.file.name}-${time}`,
            file: state.descripcion_rol.files.foto_referencia.file,
            base64: state.descripcion_rol.files.foto_referencia.base64,
          });
        } else {
          files.foto_referencia = {
            id: state.descripcion_rol.files.foto_referencia?.id
              ? state.descripcion_rol.files.foto_referencia.id
              : 0,
            nombre: state.descripcion_rol.files.foto_referencia.name,
            type: state.descripcion_rol.files.foto_referencia?.file.type
              ? state.descripcion_rol.files.foto_referencia.file.type
              : "",
            url: state.descripcion_rol.files.foto_referencia.url
              ? state.descripcion_rol.files.foto_referencia.url
              : "",
            clave: `cazatalentos/${user.id}/roles/${data.id}/foto-referencia/${state.descripcion_rol.files.foto_referencia.name}-${time}`,
            referencia: `ARCHIVOS-ROL-${data.id}`,
            identificador: `foto-referencia-rol-${data.id}`,
            public: true,
          };
        }
      }
      if (state.selftape.files.lineas) {
        if (state.selftape.files.touched.lineas) {
          files_to_be_saved.push({
            path: `cazatalentos/${user.id}/roles/${data.id}/lineas-selftape`,
            name: `${state.selftape.files.lineas.file.name}-${time}`,
            file: state.selftape.files.lineas.file,
            base64: state.selftape.files.lineas.base64,
          });
        } else {
          files.lineas_selftape = {
            id: state.selftape.files.lineas?.id
              ? state.selftape.files.lineas.id
              : 0,
            nombre: state.selftape.files.lineas?.name,
            type: state.selftape.files.lineas?.file.type
              ? state.selftape.files.lineas.file.type
              : "",
            url: state.selftape.files.lineas.url
              ? state.selftape.files.lineas.url
              : "",
            clave: `cazatalentos/${user.id}/roles/${data.id}/lineas-selftape/${state.selftape.files.lineas.name}-${time}`,
            referencia: `ARCHIVOS-ROL-${data.id}`,
            identificador: `lineas-selftape-rol-${data.id}`,
            public: true,
          };
        }
      }
      const urls_saved = await FileManager.saveFiles(files_to_be_saved);
      if (urls_saved.length > 0) {
        urls_saved.forEach((res, j) => {
          Object.entries(res).forEach((e) => {
            const url = e[1].url;
            if (url) {
              if (
                e[0] ===
                `${state.descripcion_rol.files.lineas?.file.name}-${time}`
              ) {
                const arch = state.descripcion_rol.files.lineas;
                files.lineas = {
                  id: 0,
                  nombre: arch ? arch.file.name : "",
                  type: arch?.file.type ? arch.file.type : "",
                  url: url,
                  clave: `cazatalentos/${user.id}/roles/${data.id}/lineas/${e[0]}`,
                  referencia: `ARCHIVOS-ROL-${data.id}`,
                  identificador: `lineas-rol-${data.id}`,
                  public: true,
                };
              }
              if (
                e[0] ===
                `${state.descripcion_rol.files.foto_referencia?.file.name}-${time}`
              ) {
                const foto = state.descripcion_rol.files.foto_referencia;
                files.foto_referencia = {
                  id: 0,
                  nombre: foto ? foto.file.name : "",
                  type: foto?.file.type ? foto.file.type : "",
                  url: url,
                  clave: `cazatalentos/${user.id}/roles/${data.id}/foto-referencia/${e[0]}`,
                  referencia: `ARCHIVOS-ROL-${data.id}`,
                  identificador: `foto-referencia-rol-${data.id}`,
                  public: true,
                };
              }
              if (
                e[0] === `${state.selftape.files.lineas?.file.name}-${time}`
              ) {
                const lineas = state.selftape.files.lineas;
                files.lineas_selftape = {
                  id: 0,
                  nombre: lineas ? lineas.file.name : "",
                  type: lineas?.file.type ? lineas.file.type : "",
                  url: url,
                  clave: `cazatalentos/${user.id}/roles/${data.id}/lineas-selftape/${e[0]}`,
                  referencia: `ARCHIVOS-ROL-${data.id}`,
                  identificador: `lineas-selftape-rol-${data.id}`,
                  public: true,
                };
              }
            }
          });
        });
      }
      updateRolFiles.mutate({
        id_rol: data.id,
        ...files,
      });
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const info_gral = useMemo(() => {
    return (
      <InformacionGeneralRol
        fetching={rol.isFetching}
        state={state.informacion_general}
        onFormChange={(input) => {
          dispatch({ type: "update-info-gral", value: input });
        }}
      />
    );
  }, [state.informacion_general, rol.isFetching]);

  const compensacion = useMemo(() => {
    return (
      <CompensacionRol
        fetching={rol.isFetching}
        state={state.compensacion}
        onFormChange={(input) => {
          dispatch({ type: "update-compensacion", value: input });
        }}
      />
    );
  }, [state.compensacion, rol.isFetching]);

  const filtros_demograficos = useMemo(() => {
    return (
      <FiltrosDemograficosRol
        fetching={rol.isFetching}
        state={state.filtros_demograficos}
        onFormChange={(input) => {
          dispatch({ type: "update-filtros-demograficos", value: input });
        }}
      />
    );
  }, [state.filtros_demograficos, rol.isFetching]);

  const descripcion_rol = useMemo(() => {
    return (
      <DescripcionDelRol
        fetching={rol.isFetching}
        state={state.descripcion_rol}
        onFormChange={(input) => {
          dispatch({ type: "update-descripcion-rol", value: input });
        }}
      />
    );
  }, [state.descripcion_rol, rol.isFetching]);

  const info_casting = useMemo(() => {
    return (
      <InformacionCastingRol
        fetching={rol.isFetching}
        state={state.castings}
        onFormChange={(input) => {
          dispatch({ type: "update-castings-rol", value: input });
        }}
      />
    );
  }, [state.castings, rol.isFetching]);

  const info_filmaciones = useMemo(() => {
    return (
      <InformacionFilmacionRol
        fetching={rol.isFetching}
        state={state.filmaciones}
        onFormChange={(input) => {
          dispatch({ type: "update-filmaciones-rol", value: input });
        }}
      />
    );
  }, [state.filmaciones, rol.isFetching]);

  const requisitos = useMemo(() => {
    return (
      <RequisitosRol
        fetching={rol.isFetching}
        state={state.requisitos}
        onFormChange={(input) => {
          console.log(input);
          dispatch({ type: "update-requisitos-rol", value: input });
        }}
      />
    );
  }, [state.requisitos, rol.isFetching]);

  const selftape = useMemo(() => {
    return (
      <SelfTapeRol
        fetching={rol.isFetching}
        state={state.selftape}
        onFormChange={(input) => {
          dispatch({ type: "update-selftape-rol", value: input });
        }}
      />
    );
  }, [state.selftape, rol.isFetching]);

  useEffect(() => {
    console.log("que hay en form_validate", form_validate);
    console.log("que hay en form_validate.complete", form_validate.complete);
  }, [form_validate]);

  return (
    <>
      <Head>
        <title>DashBoard ~ Cazatalentos | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true}>
        <div className="d-flex wrapper_ezc">
          <MenuLateral />
          <Grid container xs={12} sx={{ padding: "0rem 8.5rem 5rem 8.5rem", position: 'relative' }}>
            <Grid item xs={12}>
              <div className="container_box_header">
                <div className="d-flex justify-content-end align-items-start py-2">
                  <Alertas />
                </div>
              </div>
              <div
                className="d-flex"
                style={{ marginBottom: 64, alignItems: "center" }}
              >
                <motion.img
                  style={{ width: 35 }}
                  src="/assets/img/iconos/EZ_Rol_N.svg"
                  alt="icono"
                />
                <div>
                  <p
                    style={{ marginLeft: 20 }}
                    className="color_a h4 font-weight-bold mb-0"
                  >
                    <b>{`${textos[state.id_rol > 0 ? "editar" : "agregar"]} ${textos["rol"]}`}</b>
                  </p>
                </div>
              </div>
              {info_gral}
              {compensacion}
              {filtros_demograficos}
              {descripcion_rol}
              {info_casting}
              {info_filmaciones}
              {requisitos}
              {selftape}
              <div className="row mt-lg-4">
                {!form_validate.complete && (
                  <MContainer
                    direction="vertical"
                    styles={{ width: "100%", alignContent: "center" }}
                  >
                    <Alert icon={false} severity="warning">
                      <Typography
                        style={{ textAlign: "center", width: "inherit" }}
                      >
                        {`${textos["llenar_campos_obligatorios"]}`}*{" "}
                        <Typography
                          style={{ textAlign: "center", width: "inherit" }}
                        >
                          {form_validate.error}

                        </Typography>
                      </Typography>
                    </Alert>
                  </MContainer>
                )}

                <div className="col d-flex justify-content-center">
                  <div className="mr-3">
                    {form_validate.complete && (
                      <button
                        onClick={() => {
                          console.log('informacion a guardar', form_validate.data);
                          if (
                            state.informacion_general.nombre.length > 1 &&
                            state.informacion_general.id_tipo_rol > 0
                          ) {
                            if (!form_validate.error) {
                              setOnSaveAction("redirect-to-proyectos");
                              saveRol.mutate({
                                ...form_validate.data,
                                info_gral: {
                                  ...form_validate.data.info_gral,
                                  id_proyecto: state.id_proyecto
                                },
                                compensaciones: form_validate.data.compensaciones
                              });
                            } else {
                              notify("warning", form_validate.error);
                            }
                          } else {
                            notify(
                              "warning",
                              `${textos['ingresa_nombre_y_tipo_de_rol']}`
                            );
                          }
                        }}
                        className="btn btn-intro btn-price btn_out_line mb-2"
                        type="button"
                      >
                        <Typography>
                          {`${form_validate.complete
                            ? `${textos["guardar_e_ir_a_proyectos"]}`
                            : `${textos['llenar_campos']}`
                            }`}{" "}
                        </Typography>
                      </button>
                    )}
                  </div>
                  {form_validate.complete && state.id_rol === 0 && (
                    <div>
                      <button
                        onClick={() => {
                          if (
                            state.informacion_general.nombre.length > 1 &&
                            state.informacion_general.id_tipo_rol > 0
                          ) {
                            setOnSaveAction("reset-form");

                            saveRol.mutate({
                              ...form_validate.data,
                              info_gral: {
                                ...form_validate.data.info_gral,
                                id_proyecto: state.id_proyecto
                              },
                              compensaciones: form_validate.data.compensaciones
                            });
                          } else {
                            notify(
                              "warning",
                              `${textos['ingresa_nombre_y_tipo_de_rol']}`
                            );
                          }
                        }}
                        className="btn btn-intro btn-price mb-2"
                        type="button"
                      >
                        <Typography>{`${textos["guardar_y_crear_otro_rol"]}`}</Typography>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </MainLayout>
      <ResourceAlert
        busy={updateRolFiles.isLoading || saveRol.isLoading}
      />
      <Flotantes />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user) {
    if (session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
      return {
        props: {
          user: session.user,
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

export default AgregarRolPage;
