import { type NextPage } from "next";
import Head from "next/head";

import { MainLayout } from "~/components";
import { MStepper } from "~/components/shared/MStepper";
import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import {
	EditarActivosTalento,
	EditarCreditosTalento,
	EditarFiltrosAparenciasTalento,
	EditarInfoBasicaTalento,
	EditarMediaTalento,
	EditarPreferenciaRolYCompensacionTalento,
} from "~/components/talento";
import { type NewMedia, type Archivo } from "~/server/api/root";
import EditarHabilidadesTalento from "~/components/talento/forms/editar-habilidades";
import { getSession } from "next-auth/react";
import { type GetServerSideProps } from "next/types";
import { api, parseErrorBody } from "~/utils/api";
import { Typography } from "@mui/material";
import useNotify from "~/hooks/useNotify";
import { MTooltip } from "~/components/shared/MTooltip";
import { useRouter } from "next/router";
import { FileManager } from "~/utils/file-manager";
import type { CreditoTalento, Media } from "@prisma/client";
import { TipoUsuario } from "~/enums";
import Constants from "~/constants";
import { prisma } from "~/server/db";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { ResourceAlert } from "~/components/shared/ResourceAlert";

export type TalentoFormInfoGral = {
	nombre: string;
	union: {
		id: number;
		descripcion: string;
	};
	id_estado_republica: number;
	edad: number;
	es_menor_de_edad: string;
	peso: number;
	altura: number;
	biografia: string;
	representante?: {
		nombre: string;
		email: string;
		agencia: string;
		telefono: string;
	};
	files: {
		carta_responsiva?: Archivo;
		cv?: Archivo;
		urls: {
			carta_responsiva?: string;
			cv?: string;
		};
	};
	redes_sociales: { [nombre: string]: string };
};

export type TalentoFormMedios = {
	fotos: Archivo[];
	fotos_order: string;
	videos: Archivo[];
	audios: Archivo[];
};

export type TalentoFormCreditos = {
	mostrar_anio_en_perfil: boolean;
	tipo_proyecto: number;
	titulo: string;
	rol: string;
	director: string;
	anio: number;
	creditos: {
		id: number;
		id_catalogo_proyecto: number;
		titulo: string;
		rol: string;
		director: string;
		anio: number;
		destacado: boolean;
		id_clip_media?: number;
		clip?: File;
		touched?: boolean;
		media?: Media;
	}[];
};

export type TalentoFormHabilidades = {
	habilidades_seleccionadas: Map<number, number[]>;
};

export type TalentoFormActivos = {
	has_vehiculos: boolean;
	has_mascotas: boolean;
	has_vestuario: boolean;
	has_props: boolean;
	has_equipo_deportivo: boolean;
	vehiculo: {
		tipo: string;
		id_tipo_vehiculo: number;
		marca: string;
		modelo: string;
		color: string;
		anio: number;
	};
	vehiculos:
	| {
		tipo: string;
		id_tipo_vehiculo: number;
		marca: string;
		modelo: string;
		color: string;
		anio: number;
	}[]
	| null;
	mascota: {
		tipo: string;
		id_tipo_mascota: number;
		tipo_raza: string;
		id_raza: number;
		tamanio: string;
	};
	mascotas:
	| {
		tipo: string;
		id_tipo_mascota: number;
		tipo_raza: string;
		id_raza: number;
		tamanio: string;
	}[]
	| null;
	vestuario: {
		tipo: string;
		id_tipo: number;
		tipo_especifico: string;
		id_tipo_vestuario_especifico: number;
		descripcion: string;
	};
	vestuarios:
	| {
		tipo: string;
		id_tipo: number;
		tipo_especifico: string;
		id_tipo_vestuario_especifico: number;
		descripcion: string;
	}[]
	| null;
	prop: {
		tipo: string;
		id_tipo_props: number;
		descripcion: string;
	};
	props:
	| {
		tipo: string;
		id_tipo_props: number;
		descripcion: string;
	}[]
	| null;
	equipo_deportivo: {
		tipo: string;
		id_tipo_equipo_deportivo: number;
		descripcion: string;
	};
	equipos_deportivos:
	| {
		tipo: string;
		id_tipo_equipo_deportivo: number;
		descripcion: string;
	}[]
	| null;
};

type documento = {
	id_documento: number;
	descripcion: string;
};

type locacion = {
	es_principal: boolean;
	id_estado_republica: number;
};

export type TalentoFormPreferencias = {
	preferencias: {
		interesado_en_trabajos_de_extra: boolean;
		nombre_agente: string;
		contacto_agente: string;
		meses_embarazo: number;
	};

	tipo_trabajo: number[];
	interes_en_proyectos: number[];
	id_estado_principal: number;
	locaciones: locacion[];

	documentos: documento[];

	disponibilidad: number[];
	otras_profesiones: string[];
};

export type FiltrosAparienciaForm = {
	has_tatoos: boolean;
	id_tipo_tatuaje: number;
	descripcion_tatoo: string;
	has_piercings: boolean;
	id_tipo_piercing: number;
	descripcion_piercing: string;
	has_hermanos: boolean;
	tipo_hermano_selected: string;
	descripcion_otra_particularidad?: string;
	apariencia: {
		id_pais: number;
		rango_inicial_edad: number;
		rango_final_edad: number;
		id_genero: number;
		id_apariencia_etnica: number;
		id_color_cabello: number;
		disposicion_cambio_color_cabello: boolean;
		id_estilo_cabello: number;
		disposicion_corte_cabello: boolean;
		id_vello_facial: number;
		disposicion_afeitar_o_crecer_vello_facial: boolean;
		id_color_ojos: number;
	};
	generos_interesado_en_interpretar: number[];
	tatuajes: {
		id_tipo_tatuaje: number;
		descripcion: string;
	}[];
	piercings: {
		id_tipo_piercing: number;
		descripcion: string;
	}[];
	hermanos?: {
		id_tipo_hermanos: number;
		descripcion: string;
	};
	particularidades: {
		id_particularidad: number;
		descripcion: string;
	}[];
};

type TalentoForm = {
	info_gral: TalentoFormInfoGral;
	medios: TalentoFormMedios;
	creditos: TalentoFormCreditos;
	habilidades: TalentoFormHabilidades;
	activos: TalentoFormActivos;
	preferencias: TalentoFormPreferencias;
	filtros_apariencia: FiltrosAparienciaForm;
	step_active: number;
	next_step: number;
};

const initialState: TalentoForm = {
	step_active: 1,
	next_step: 1,
	info_gral: {
		nombre: "",
		union: {
			id: 0,
			descripcion: "",
		},
		id_estado_republica: 0,
		es_menor_de_edad: "No",
		edad: 18,
		peso: 75,
		altura: 170,
		biografia: "",
		redes_sociales: {},
		files: {
			urls: {},
		},
	},
	medios: {
		fotos: [],
		videos: [],
		audios: [],
		fotos_order: "",
	},
	creditos: {
		mostrar_anio_en_perfil: false,
		tipo_proyecto: 0,
		titulo: "",
		rol: "PRINCIPAL",
		director: "",
		anio: new Date().getFullYear(),
		creditos: [],
	},
	habilidades: {
		habilidades_seleccionadas: new Map(),
	},
	activos: {
		has_vehiculos: false,
		has_mascotas: false,
		has_vestuario: false,
		has_props: false,
		has_equipo_deportivo: false,
		vehiculo: {
			tipo: "",
			id_tipo_vehiculo: 0,
			marca: "",
			modelo: "",
			color: "",
			anio: new Date().getFullYear(),
		},
		vehiculos: null,
		mascota: {
			tipo: "",
			id_raza: 0,
			id_tipo_mascota: 0,
			tipo_raza: "",
			tamanio: "Chico",
		},
		mascotas: null,
		vestuario: {
			id_tipo: 0,
			id_tipo_vestuario_especifico: 0,
			tipo: "",
			tipo_especifico: "",
			descripcion: "",
		},
		vestuarios: null,
		prop: {
			id_tipo_props: 0,
			tipo: "",
			descripcion: "",
		},
		props: null,
		equipo_deportivo: {
			id_tipo_equipo_deportivo: 0,
			tipo: "",
			descripcion: "",
		},
		equipos_deportivos: null,
	},
	preferencias: {
		preferencias: {
			interesado_en_trabajos_de_extra: false,
			nombre_agente: "",
			contacto_agente: "",
			meses_embarazo: 0,
		},
		tipo_trabajo: [],
		interes_en_proyectos: [],
		documentos: [],
		locaciones: [],
		id_estado_principal: 0,
		disponibilidad: [],
		otras_profesiones: [],
	},
	filtros_apariencia: {
		has_tatoos: false,
		id_tipo_tatuaje: 0,
		descripcion_tatoo: "",
		has_piercings: false,
		id_tipo_piercing: 0,
		descripcion_piercing: "",
		has_hermanos: false,
		tipo_hermano_selected: "",
		apariencia: {
			id_pais: 0,
			rango_inicial_edad: 18,
			rango_final_edad: 50,
			id_genero: 0,
			id_apariencia_etnica: 0,
			id_color_cabello: 0,
			disposicion_cambio_color_cabello: false,
			id_estilo_cabello: 0,
			disposicion_corte_cabello: false,
			id_vello_facial: 0,
			disposicion_afeitar_o_crecer_vello_facial: false,
			id_color_ojos: 0,
		},
		generos_interesado_en_interpretar: [],
		tatuajes: [],
		piercings: [],
		particularidades: [],
	},
};

function reducer(
	state: TalentoForm,
	action: { type: string; value: { [key: string]: unknown } }
) {
	switch (action.type) {
		case "update-form": {
			return { ...state, ...action.value };
		}
		case "update-info-gral": {
			return {
				...state,
				info_gral: { ...state.info_gral, ...action.value },
			} as TalentoForm;
		}
		case "update-medios": {
			return {
				...state,
				medios: { ...state.medios, ...action.value },
			} as TalentoForm;
		}
		case "update-creditos": {
			return {
				...state,
				creditos: { ...state.creditos, ...action.value },
			} as TalentoForm;
		}
		case "update-habilidades": {
			return {
				...state,
				habilidades: { ...state.habilidades, ...action.value },
			} as TalentoForm;
		}
		case "update-activos": {
			return {
				...state,
				activos: { ...state.activos, ...action.value },
			} as TalentoForm;
		}
		case "update-preferencia-rol": {
			return {
				...state,
				preferencias: { ...state.preferencias, ...action.value },
			} as TalentoForm;
		}
		case "update-filtros-apariencia": {
			return {
				...state,
				filtros_apariencia: { ...state.filtros_apariencia, ...action.value },
			} as TalentoForm;
		}
		case "reset-fields-credits": {
			return {
				...state,
				creditos: initialState.creditos,
			} as TalentoForm;
		}
	}
	return { ...state };
}

type EditarTalentoPageProps = {
	id_talento: number;
	step: number;
};

const EditarTalentoPage: NextPage<EditarTalentoPageProps> = ({
	id_talento,
}) => {
	const [save_type, setSaveType] = useState<
		"save_and_finish_later" | "save" | "save_and_finish" | undefined
	>();
	const [busy, setBusy] = useState(false);
	const ctx = useContext(AppContext);
	const textos = useLang(ctx.lang);
	const router = useRouter();
	const [state, dispatch] = useReducer(reducer, {
		...initialState,
		step_active: router.query["step"]
			? parseInt(router.query["step"] as string)
			: 1,
	});
	const { notify } = useNotify();

	const talento = api.talentos.getCompleteById.useQuery(
		{ id: id_talento },
		{
			refetchOnMount: true,
			refetchOnWindowFocus: false,
		}
	);

	const saveInfoGralMedia = api.talentos.saveInfoGralMedia.useMutation({
		onSuccess(input) {
			console.log(input);
			saveInfoGral.mutate({
				id_talento: id_talento,
				...state.info_gral,
				redes_sociales: Array.from(
					Object.entries(state.info_gral.redes_sociales)
				).map((e) => {
					return { nombre: e[0], url: e[1] };
				}),
				media: { ...input },
			});
		},
		onError: (error) => {
			notify("error", parseErrorBody(error.message));
		},
	});

	const saveInfoGral = api.talentos.saveInfoGral.useMutation({
		onSuccess(_) {
			notify("success", `${textos["success_save_info_gral"] ?? "éxito"}`);
			if (
				save_type === "save_and_finish_later" ||
				save_type === "save_and_finish"
			) {
				router.replace("/talento/dashboard");
			} else {
				dispatch({
					type: "update-form",
					value: { step_active: state.next_step },
				});
				void talento.refetch();
			}
			setSaveType(undefined);
		},
		onError: (error) => {
			notify("error", parseErrorBody(error.message));
		},
	});

	const saveMedios = api.talentos.saveMedios.useMutation({
		onSuccess(_) {
			notify("success", `${textos["success_save_medios"] ?? "éxito"}`);
			console.log(save_type);
			if (
				save_type === "save_and_finish_later" ||
				save_type === "save_and_finish"
			) {
				router.replace("/talento/dashboard");
			} else {
				dispatch({
					type: "update-form",
					value: { step_active: state.next_step },
				});
				void talento.refetch();
			}
			setSaveType(undefined);
		},
		onError: (error) => {
			notify("error", parseErrorBody(error.message));
		},
	});

	const saveCreditos = api.talentos.saveCreditos.useMutation({
		onSuccess(_) {
			notify("success", `${textos["success_save_creditos"] ?? "éxito"}`);
			if (
				save_type === "save_and_finish_later" ||
				save_type === "save_and_finish"
			) {
				router.replace("/talento/dashboard");
			} else {
				dispatch({
					type: "update-form",
					value: { step_active: state.next_step },
				});
				void talento.refetch();
			}
			setSaveType(undefined);
		},
		onError: (error) => {
			notify("error", parseErrorBody(error.message));
		},
	});

	const saveHabilidades = api.talentos.saveHabilidades.useMutation({
		onSuccess(_) {
			notify("success", `${textos["success_save_habilidades"] ?? "éxito"}`);
			if (
				save_type === "save_and_finish_later" ||
				save_type === "save_and_finish"
			) {
				router.replace("/talento/dashboard");
			} else {
				dispatch({
					type: "update-form",
					value: { step_active: state.next_step },
				});
				void talento.refetch();
			}
			setSaveType(undefined);
		},
		onError: (error) => {
			notify("error", parseErrorBody(error.message));
		},
	});

	const saveActivos = api.talentos.saveActivos.useMutation({
		onSuccess(_) {
			notify("success", `${textos["success_save_activos"] ?? "éxito"}`);
			if (
				save_type === "save_and_finish_later" ||
				save_type === "save_and_finish"
			) {
				router.replace("/talento/dashboard");
			} else {
				dispatch({
					type: "update-form",
					value: { step_active: state.next_step },
				});
				void talento.refetch();
			}
			setSaveType(undefined);
		},
		onError: (error) => {
			notify("error", parseErrorBody(error.message));
		},
	});

	const savePreferencias = api.talentos.savePreferencias.useMutation({
		onSuccess(_) {
			notify("success", `${textos["success_save_preferencias"] ?? "éxito"}`);
			if (
				save_type === "save_and_finish_later" ||
				save_type === "save_and_finish"
			) {
				router.replace("/talento/dashboard");
			} else {
				dispatch({
					type: "update-form",
					value: { step_active: state.next_step },
				});
				void talento.refetch();
			}
			setSaveType(undefined);
		},
		onError: (error) => {
			notify("error", parseErrorBody(error.message));
		},
	});

	const saveFiltrosApariencias =
		api.talentos.saveFiltrosApariencias.useMutation({
			onSuccess(_) {
				notify("success", `${textos["success_save_filtros"] ?? "éxito"}`);
				console.log('entro aqui');
				console.log(save_type);
				if (
					save_type === "save_and_finish_later" ||
					save_type === "save_and_finish"
				) {
					console.log('entro aqui')
					const timeout = setTimeout(() => {
						router.replace("/talento/dashboard");
						clearTimeout(timeout);
					}, 1000);
				} else {
					dispatch({
						type: "update-form",
						value: { step_active: state.next_step },
					});
					void talento.refetch();
				}
			},
			onError: (error) => {
				notify("error", parseErrorBody(error.message));
			},
		});

	const handleInfoGral = async () => {
		setBusy(true);
		const urls: { cv: string | null; carta: string | null } = {
			cv: null,
			carta: null,
		};
		const to_be_saved: {
			path: string;
			name: string;
			file: File;
			base64: string;
		}[] = [];
		const time = new Date().getTime();
		if (state.info_gral.files.cv) {
			to_be_saved.push({
				path: `talentos/${id_talento}/cv`,
				name: `cv-${time}`,
				file: state.info_gral.files.cv.file,
				base64: state.info_gral.files.cv.base64,
			});
		}
		if (state.info_gral.files.carta_responsiva) {
			to_be_saved.push({
				path: `talentos/${id_talento}/carta-responsiva`,
				name: `carta-${time}`,
				file: state.info_gral.files.carta_responsiva.file,
				base64: state.info_gral.files.carta_responsiva.base64,
			});
		}
		if (to_be_saved.length > 0) {
			const urls_saved = await FileManager.saveFiles(to_be_saved);
			if (urls_saved) {
				urls_saved.forEach((u) => {
					const cv = u[`cv-${time}`];
					if (cv) {
						urls.cv = cv.url;
					}
					const carta = u[`carta-${time}`];
					if (carta) {
						urls.carta = carta.url;
					}
				});
			}
		}
		setBusy(false);
		saveInfoGralMedia.mutate({
			id_talento: id_talento,
			cv_url: state.info_gral.files.urls.cv,
			cv:
				!state.info_gral.files.cv || !urls.cv
					? null
					: {
						nombre: "cv",
						type: state.info_gral.files.cv.file.type,
						url: urls.cv,
						clave: `talentos/${id_talento}/cv/cv-${time}`,
						referencia: `talento-info-gral`,
						identificador: `talento-cv`,
					},
			carta_responsiva_url: state.info_gral.files.urls.carta_responsiva,
			carta_responsiva:
				!state.info_gral.files.carta_responsiva || !urls.carta
					? null
					: {
						nombre: "carta",
						type: state.info_gral.files.carta_responsiva.file.type,
						url: urls.carta,
						clave: `talentos/${id_talento}/carta-responsiva/carta-${time}`,
						referencia: `talento-info-gral`,
						identificador: `talento-carta-responsiva`,
					},
		});
	};

	const initMediaFiles = async (
		foto_perfil: Media | undefined,
		fotos: Media[],
		audios: Media[],
		videos: Media[]
	) => {
		const fotos_talento: Archivo[] = [];
		if (foto_perfil) {
			const foto_file = await FileManager.convertUrlToFile(
				foto_perfil.url,
				foto_perfil.nombre,
				foto_perfil.type
			);
			let f_foto_base_64 = '';
			if (foto_file) {
				f_foto_base_64 = await FileManager.convertFileToBase64(foto_file);
				fotos_talento.push({
					id: foto_perfil.id,
					base64: f_foto_base_64,
					name: foto_perfil.nombre,
					file: foto_file,
					url: foto_perfil.url,
				});
			}
		}
		const fotos_perfil = await Promise.all(
			fotos.map(async (f) => {
				const f_file = await FileManager.convertUrlToFile(
					f.url,
					f.nombre,
					f.type
				);
				let f_base_64 = '';
				if (f_file) {
					f_base_64 = await FileManager.convertFileToBase64(f_file);
				}
				return {
					id: f.id,
					base64: f_base_64,
					name: f.nombre,
					file: f_file,
					url: f.url,
				};
			})
		);
		const audios_perfil = await Promise.all(
			audios.map(async (f) => {
				const f_file = await FileManager.convertUrlToFile(
					f.url,
					f.nombre,
					f.type
				);
				let f_base_64 = '';
				if (f_file) {
					f_base_64 = await FileManager.convertFileToBase64(f_file);
				}
				return {
					id: f.id,
					base64: f_base_64,
					name: f.nombre,
					file: f_file,
					url: f.url,
				};
			})
		);
		const videos_perfil = await Promise.all(
			videos.map(async (f) => {
				const f_file = await FileManager.convertUrlToFile(
					f.url,
					f.nombre,
					f.type
				);
				let f_base_64: string = '';
				if (f_file) {
					f_base_64 = await FileManager.convertFileToBase64(f_file);
				}
				return {
					id: f.id,
					base64: f_base_64,
					name: f.nombre,
					file: f_file,
					url: f.url,
				};
			})
		);

		const fotos_perfil_without_nulls: Archivo[] = [];
		fotos_perfil.forEach(f => {
			if (f.file) {
				fotos_perfil_without_nulls.push({ ...f, file: f.file });
			}
		});
		dispatch({
			type: "update-medios",
			value: {
				...state.medios,
				fotos: fotos_talento.concat(fotos_perfil_without_nulls),
				fotos_order: fotos_talento
					.concat(fotos_perfil_without_nulls)
					.map((f) => f.id)
					.join("-"),
				audios: audios_perfil,
				videos: videos_perfil,
			},
		});
	};
	const initCreditosFiles = async (
		mostrar_anio_perfil: boolean,
		creditos: (CreditoTalento & { media: Media | null })[]
	) => {
		const creditos_with_file = await Promise.all(
			creditos.map(async (credito) => {
				if (credito.media) {
					const file = await FileManager.convertUrlToFile(
						credito.media.url,
						credito.media.nombre,
						credito.media.type
					);
					return {
						...credito,
						clip: file,
						touched: false,
					};
				}
				return { ...credito, touched: false };
			})
		);

		dispatch({
			type: "update-creditos",
			value: {
				mostrar_anio_en_perfil: mostrar_anio_perfil,
				creditos: creditos_with_file,
			},
		});
	};
	const handleMedia = async () => {
		setBusy(true);
		const media: {
			fotos: NewMedia[] | null;
			videos: NewMedia[] | null;
			audios: NewMedia[] | null;
		} = { fotos: [], videos: [], audios: [] };
		const fotos_changed_order =
			state.medios.fotos.map((f) => f.id).join("-") !==
			state.medios.fotos_order;
		const no_fotos_added =
			state.medios.fotos.filter((v) => v.url != null).length ===
			state.medios.fotos.length;
		const time = new Date().getTime();
		if (
			(fotos_changed_order || !no_fotos_added) &&
			state.medios.fotos.length > 0
		) {
			const urls_saved = await FileManager.saveFiles(
				state.medios.fotos.map((f) => {
					return {
						path: `talentos/${id_talento}/fotos-perfil`,
						name: `${f.name}-${time}`,
						file: f.file,
						base64: f.base64,
					};
				})
			);
			if (urls_saved.length > 0) {
				urls_saved.forEach((res, j) => {
					Object.entries(res).forEach((e) => {
						const url = e[1].url;
						const type = state.medios.fotos[j]?.file.type;
						const id = state.medios.fotos[j]?.id;
						const original_name = state.medios.fotos[j]?.file.name;
						if (url) {
							if (media.fotos) {
								media.fotos.push({
									id: id ? id : 0,
									nombre: original_name ? original_name : "",
									type: type ? type : "",
									url: url ? url : "",
									clave: `talentos/${id_talento}/fotos-perfil/${e[0]}`,
									referencia: `FOTOS-PERFIL-TALENTO-${id_talento}`,
									identificador: `foto-${j === 0 ? "perfil" : j.toString()
										}-talento-${id_talento}`,
								});
							}
						} else {
							const msg = original_name
								? textos["error_upload_image_with_name"]?.replace(
									"[N1]",
									original_name
								)
								: textos["error_upload_image"];
							notify("error", `${msg ?? ""}`);
						}
					});
				});
			}
		}
		if (state.medios.fotos.length === 0) {
			media.fotos = null;
		}

		if (
			state.medios.videos.filter((v) => v.url != null).length !==
			state.medios.videos.length &&
			state.medios.videos.length > 0
		) {
			const urls_saved = await FileManager.saveFiles(
				state.medios.videos
					.filter((f) => f.id == null)
					.map((f, i) => {
						return {
							path: `talentos/${id_talento}/videos`,
							name: `${f.name}-${time}`,
							file: f.file,
							base64: f.base64,
						};
					})
			);
			if (urls_saved.length > 0) {
				urls_saved.forEach((res, j) => {
					Object.entries(res).forEach((e, i) => {
						const url = e[1].url;
						const type = state.medios.videos[j]?.file.type;
						const id = state.medios.videos[j]?.id;
						const original_name = state.medios.videos[j]?.file.name;
						if (url) {
							if (media.videos) {
								media.videos.push({
									id: id ? id : 0,
									nombre: original_name ? original_name : "",
									type: type ? type : "",
									url: url ? url : "",
									clave: `talentos/${id_talento}/videos/${e[0]}`,
									referencia: `VIDEOS-TALENTO-${id_talento}`,
									identificador: `video-${j + 1}`,
								});
							}
						} else {
							const msg = original_name
								? textos["error_upload_video_with_name"]?.replace(
									"[N1]",
									original_name
								)
								: textos["error_upload_video"];
							notify("error", `${msg ?? ""}`);
						}
					});
				});
			}
		}

		if (state.medios.videos.length === 0) {
			media.videos = null;
		}

		if (
			state.medios.audios.filter((v) => v.url != null).length !==
			state.medios.audios.length &&
			state.medios.audios.length > 0
		) {
			const urls_saved = await FileManager.saveFiles(
				state.medios.audios
					.filter((f) => f.id == null)
					.map((f, i) => {
						return {
							path: `talentos/${id_talento}/audios`,
							name: `${f.name}-${time}`,
							file: f.file,
							base64: f.base64,
						};
					})
			);
			if (urls_saved.length > 0) {
				urls_saved.forEach((res, j) => {
					Object.entries(res).forEach((e) => {
						const url = e[1].url;
						const type = state.medios.audios[j]?.file.type;
						const id = state.medios.audios[j]?.id;
						const original_name = state.medios.audios[j]?.file.name;
						if (url) {
							if (media.audios) {
								media.audios.push({
									id: id ? id : 0,
									nombre: original_name ? original_name : "",
									type: type ? type : "",
									url: url ? url : "",
									clave: `talentos/${id_talento}/audios/${e[0]}`,
									referencia: `AUDIOS-TALENTO-${id_talento}`,
									identificador: `audio-${j + 1}`,
								});
							}
						} else {
							const msg = original_name
								? textos["error_upload_audio_with_name"]?.replace(
									"[N1]",
									original_name
								)
								: textos["error_upload_audio"];
							notify("error", `${msg ?? ""}`);
						}
					});
				});
			}
		}

		if (state.medios.audios.length === 0) {
			media.audios = null;
		}
		setBusy(false);
		saveMedios.mutate({
			id_talento: id_talento,
			fotos: media.fotos,
			videos: media.videos,
			audios: media.audios,
		});
	};

	const handleCreditos = async () => {
		setBusy(true);
		const time = new Date().getTime();
		const creditos = await Promise.all(
			state.creditos.creditos.map(async (credito, i) => {
				if (credito.clip && credito.touched) {
					const base_64 = await FileManager.convertFileToBase64(credito.clip);
					const urls_saved = await FileManager.saveFiles([
						{
							path: `talentos/${id_talento}/creditos`,
							name: `${credito.clip.name.includes("clip") ? "" : "clip-"}${credito.clip.name
								}-${time}`,
							file: credito.clip,
							base64: base_64,
						},
					]);
					const type = credito.clip.type;
					const id = credito.id_clip_media;
					const original_name = credito.clip.name;

					if (urls_saved.length > 0) {
						urls_saved.forEach((res, j) => {
							Object.entries(res).forEach((e) => {
								const url = e[1].url;
								if (url) {
									credito.media = {
										id: id ? id : 0,
										nombre: e[0].replace(`-${time}`, ""),
										type: type ? type : "",
										url: url ? url : "",
										clave: `talentos/${id_talento}/creditos/${e[0]}`,
										referencia: `CREDITOS-TALENTO-${id_talento}`,
										identificador: `${original_name.includes("clip") ? "" : "clip-"
											}${original_name}`,
										public: true,
									};
								} else {
									const msg = original_name
										? textos["error_upload_credito_with_name"]?.replace(
											"[N1]",
											original_name
										)
										: textos["error_upload_credito"];
									notify("error", `${msg ?? ""}`);
								}
							});
						});
					}
				}
				return { ...credito };
			})
		);
		setBusy(false);
		saveCreditos.mutate({
			id_talento: id_talento,
			mostrar_anio_en_perfil: state.creditos.mostrar_anio_en_perfil,
			creditos: creditos,
		});
	};

	useEffect(() => {
		if (talento.data) {
			const redes_sociales: { [nombre: string]: string } = {};
			if (talento.data && talento.data.redes_sociales) {
				talento.data.redes_sociales.forEach((red) => {
					redes_sociales[red.nombre] = red.url;
				});
			}
			console.log(talento.data, "talento data");
			if (talento.data.info_basica) {
				dispatch({
					type: "update-info-gral",
					value: {
						nombre: talento.data.nombre,
						union: {
							id: talento.data.info_basica.union?.id_union,
							descripcion: talento.data.info_basica.union?.descripcion,
						},
						id_estado_republica: talento.data.info_basica.id_estado_republica,
						edad: talento.data.info_basica.edad,
						es_menor_de_edad:
							talento.data.info_basica.edad >= 18
								? textos["no"]
									? textos["no"]
									: "Texto No Definido"
								: textos["si"]
									? textos["si"]
									: "Texto No Definido",
						peso: talento.data.info_basica.peso,
						altura: talento.data.info_basica.altura,
						biografia: talento.data.info_basica.biografia,
						representante: !talento.data.representante
							? null
							: {
								nombre: talento.data.representante.nombre,
								email: talento.data.representante.email,
								agencia: talento.data.representante.agencia,
								telefono: talento.data.representante.telefono,
							},
						redes_sociales: redes_sociales,
						files: {
							carta_responsiva: null,
							cv: null,
							urls: {
								carta_responsiva: talento.data.representante?.media?.url,
								cv: talento.data.info_basica.media?.url,
							},
						},
					},
				});
			}

			if (talento.data.media) {
				const foto_perfil = talento.data.media.filter((m) =>
					m.media.identificador.includes("foto-perfil")
				)[0];
				const fotos = talento.data.media
					.filter(
						(m) =>
							m.media.type.includes("image") &&
							!m.media.identificador.includes("foto-perfil")
					)
					.map((a) => a.media);
				const audios = talento.data.media
					.filter((m) => m.media.type.includes("audio"))
					.map((a) => a.media);
				const videos = talento.data.media
					.filter(
						(m) =>
							m.media.type.includes("video") &&
							m.media.referencia.startsWith("VIDEOS-TALENTO")
					)
					.map((a) => a.media);
				void initMediaFiles(
					foto_perfil ? foto_perfil.media : undefined,
					fotos,
					audios,
					videos
				);
			}

			if (talento.data.creditos) {
				void initCreditosFiles(
					talento.data.creditos.mostrar_anio_perfil,
					talento.data.creditos.creditos
				);
			}

			const habilidades = new Map<number, number[]>();

			if (talento.data && talento.data.habilidades) {
				talento.data.habilidades.forEach((habilidad) => {
					if (habilidades.has(habilidad.id_habilidad)) {
						const habilidades_especificas = habilidades.get(
							habilidad.id_habilidad
						);
						if (habilidades_especificas) {
							habilidades_especificas.push(habilidad.id_habilidad_especifica);
							habilidades.set(habilidad.id_habilidad, habilidades_especificas);
						}
					} else {
						habilidades.set(habilidad.id_habilidad, [
							habilidad.id_habilidad_especifica,
						]);
					}
				});
			}

			dispatch({
				type: "update-habilidades",
				value: {
					habilidades_seleccionadas: habilidades,
				},
			});

			if (talento.data && talento.data.activos) {
				dispatch({
					type: "update-activos",
					value: {
						vehiculos: talento.data.activos.vehiculos
							? talento.data.activos.vehiculos.map((vehiculo) => {
								return {
									tipo:
										ctx.lang === "es"
											? vehiculo.tipo_vehiculo?.es
											: vehiculo.tipo_vehiculo?.en,
									id_tipo_vehiculo: vehiculo.id_tipo_vehiculo,
									marca: vehiculo.marca,
									modelo: vehiculo.modelo,
									color: vehiculo.color,
									anio: vehiculo.anio,
								};
							})
							: [],
						mascotas: talento.data.activos.mascotas
							? talento.data.activos.mascotas.map((mascota) => {
								return {
									tipo:
										ctx.lang === "es"
											? mascota.tipo_mascota?.es
											: mascota.tipo_mascota?.en,
									id_tipo_mascota: mascota.tipo_mascota?.id,
									tipo_raza:
										ctx.lang === "es"
											? mascota.raza_mascota?.es
											: mascota.raza_mascota?.en,
									id_raza: mascota.id_raza,
									tamanio: mascota.tamanio,
								};
							})
							: [],
						vestuarios: talento.data.activos.vestuario
							? talento.data.activos.vestuario.map((vestuario) => {
								return {
									tipo:
										ctx.lang === "es"
											? vestuario.tipo_vestuario_especifico?.tipo_vestuario.es
											: vestuario.tipo_vestuario_especifico?.en,
									id_tipo:
										vestuario.tipo_vestuario_especifico?.id_tipo_vestuario,
									tipo_especifico:
										ctx.lang === "es"
											? vestuario.tipo_vestuario_especifico?.es
											: vestuario.tipo_vestuario_especifico?.en,
									id_tipo_vestuario_especifico:
										vestuario.id_tipo_vestuario_especifico,
									descripcion: vestuario.descripcion,
								};
							})
							: [],
						props: talento.data.activos.props
							? talento.data.activos.props.map((prop) => {
								return {
									tipo:
										ctx.lang === "es"
											? prop.tipo_props?.es
											: prop.tipo_props?.en,
									id_tipo_props: prop.id_tipo_props,
									descripcion: prop.descripcion,
								};
							})
							: [],
						equipos_deportivos: talento.data.activos.equipo_deportivo
							? talento.data.activos.equipo_deportivo.map((ed) => {
								return {
									tipo:
										ctx.lang === "es"
											? ed.tipo_equipo_deportivo?.es
											: ed.tipo_equipo_deportivo?.en,
									id_tipo_equipo_deportivo: ed.id_tipo_equipo_deportivo,
									descripcion: ed.descripcion,
								};
							})
							: [],
					},
				});
			} else {
				dispatch({
					type: "update-activos",
					value: {
						vehiculos: [],
						mascotas: [],
						vestuarios: [],
						props: [],
						equipos_deportivos: [],
					},
				});
			}

			if (talento.data && talento.data.preferencias) {
				const preferencias = talento.data.preferencias;
				const id_estado_principal = preferencias.locaciones.filter(
					(l) => l.es_principal
				)[0];
				dispatch({
					type: "update-preferencia-rol",
					value: {
						preferencias: {
							interesado_en_trabajos_de_extra:
								preferencias.interesado_en_trabajos_de_extra || false,
							nombre_agente: preferencias.nombre_agente || "",
							contacto_agente: preferencias.contacto_agente || "",
							meses_embarazo: preferencias.meses_embarazo || 0,
						},
						tipo_trabajo: preferencias.tipos_de_trabajo.map(
							(tipo) => tipo.id_tipo_de_trabajo
						),
						interes_en_proyectos: preferencias.interes_en_proyectos.map(
							(interes) => interes.id_interes_en_proyecto
						),
						documentos: preferencias.documentos.map((documento) => ({
							id_documento: documento.id_documento,
							descripcion: documento.descripcion,
						})),
						id_estado_principal: id_estado_principal
							? id_estado_principal.id_estado_republica
							: 0,
						locaciones: preferencias.locaciones.map((locacion) => ({
							es_principal: locacion.es_principal,
							id_estado_republica: locacion.id_estado_republica,
						})),
						disponibilidad: preferencias.disponibilidades.map(
							(disponibilidad) => disponibilidad.id_disponibilidad
						),
						otras_profesiones: preferencias.otras_profesiones.map(
							(profesion) => profesion.descripcion
						),
					},
				});
			}

			if (talento.data && talento.data.filtros_aparencias) {
				const hermanos_option_default = talento.data.filtros_aparencias.hermanos
					? talento.data.filtros_aparencias.hermanos.id_tipo_hermanos === 99
						? textos["otro"]
							? textos["otro"]
							: "Texto No Definido"
						: talento.data.filtros_aparencias.hermanos.descripcion
					: "";
				let field_other_particularidad = "";
				if (
					talento.data.filtros_aparencias.particularidades.some(
						(e) => e.id_particularidad === 99
					)
				) {
					const particularidad_filtered =
						talento.data.filtros_aparencias.particularidades.filter(
							(e) => e.id_particularidad === 99
						)[0];
					if (particularidad_filtered) {
						field_other_particularidad = particularidad_filtered.descripcion;
					}
				}
				dispatch({
					type: "update-filtros-apariencia",
					value: {
						has_tatoos: talento.data.filtros_aparencias.tatuajes.length > 0,
						id_tipo_tatuaje: 0,
						descripcion_tatoo: "",
						has_piercings: talento.data.filtros_aparencias.piercings.length > 0,
						id_tipo_piercing: 0,
						descripcion_piercing: "",
						has_hermanos: talento.data.filtros_aparencias.hermanos !== null,
						descripcion_otra_particularidad: field_other_particularidad,
						tipo_hermano_selected: hermanos_option_default,
						apariencia: {
							id_pais: talento.data.filtros_aparencias.id_pais,
							rango_inicial_edad:
								talento.data.filtros_aparencias.rango_inicial_edad,
							rango_final_edad:
								talento.data.filtros_aparencias.rango_final_edad,
							id_genero: talento.data.filtros_aparencias.id_genero,
							id_apariencia_etnica:
								talento.data.filtros_aparencias.id_apariencia_etnica,
							id_color_cabello:
								talento.data.filtros_aparencias.id_color_cabello,
							disposicion_cambio_color_cabello:
								talento.data.filtros_aparencias
									.disposicion_cambio_color_cabello,
							id_estilo_cabello:
								talento.data.filtros_aparencias.id_estilo_cabello,
							disposicion_corte_cabello:
								talento.data.filtros_aparencias.disposicion_corte_cabello,
							id_vello_facial: talento.data.filtros_aparencias.id_vello_facial,
							disposicion_afeitar_o_crecer_vello_facial:
								talento.data.filtros_aparencias
									.disposicion_afeitar_o_crecer_vello_facial,
							id_color_ojos: talento.data.filtros_aparencias.id_color_ojos,
						},
						generos_interesado_en_interpretar:
							talento.data.filtros_aparencias.generos_interesados_en_interpretar.map(
								(e) => e.id_genero
							),
						tatuajes: talento.data.filtros_aparencias.tatuajes,
						piercings: talento.data.filtros_aparencias.piercings,
						hermanos: talento.data.filtros_aparencias.hermanos
							? { ...talento.data.filtros_aparencias.hermanos }
							: undefined,
						particularidades: talento.data.filtros_aparencias.particularidades,
					},
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [talento.data, textos]);

	const editar_info_basica_talento = useMemo(() => {
		return (
			<EditarInfoBasicaTalento
				state={state.info_gral}
				talento_fetching={talento.isFetching}
				onFormChange={(input) => {
					dispatch({ type: "update-info-gral", value: input });
				}}
			/>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.info_gral, talento.isFetching]);

	const editar_media_talento = useMemo(() => {
		return (
			<EditarMediaTalento
				loading={talento.isFetching}
				state={state.medios}
				onFormChange={(input) => {
					dispatch({ type: "update-medios", value: input });
				}}
			/>
		);
	}, [state.medios, talento.isFetching]);

	const editar_creditos_talento = useMemo(() => {
		return (
			<EditarCreditosTalento
				state={state.creditos}
				onFormChange={(input) => {
					dispatch({ type: "update-creditos", value: input });
				}}
				handleCreditos={handleCreditos}
				resetCredits={() =>
					dispatch({
						type: "reset-fields-credits",
						value: {},
					})
				}
			/>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.creditos]);

	const editar_habilidades_talento = useMemo(() => {
		return (
			<EditarHabilidadesTalento
				state={state.habilidades}
				onFormChange={(input) => {
					dispatch({ type: "update-habilidades", value: input });
				}}
			/>
		);
	}, [state.habilidades]);

	const editar_activos_talento = useMemo(() => {
		return (
			<EditarActivosTalento
				state={state.activos}
				onFormChange={(input) => {
					dispatch({ type: "update-activos", value: input });
				}}
			/>
		);
	}, [state.activos]);

	const editar_preferencias_rol_y_compensacion_talento = useMemo(() => {
		return (
			<EditarPreferenciaRolYCompensacionTalento
				state={state.preferencias}
				onFormChange={(input) => {
					dispatch({ type: "update-preferencia-rol", value: input });
				}}
			/>
		);
	}, [state.preferencias]);

	const editar_filtros_apariencias_talento = useMemo(() => {
		return (
			<EditarFiltrosAparenciasTalento
				state={state.filtros_apariencia}
				onFormChange={(input) => {
					dispatch({ type: "update-filtros-apariencia", value: input });
				}}
			/>
		);
	}, [state.filtros_apariencia]);

	const handleStepChange = (step: number) => {
		switch (step) {
			case 1: {
				void handleInfoGral();
				break;
			}

			case 2: {
				void handleMedia();
				break;
			}

			case 3: {
				void handleCreditos();
				break;
			}

			case 4: {
				const ids: {
					id_habilidad_especifica: number;
					id_habilidad: number;
				}[] = [];
				state.habilidades.habilidades_seleccionadas.forEach((value, key) => {
					value.forEach((id) => {
						ids.push({
							id_habilidad_especifica: id,
							id_habilidad: key,
						});
					});
				});
				saveHabilidades.mutate({
					id_talento: id_talento,
					ids_habilidades: ids,
				});
				break;
			}

			case 5: {
				saveActivos.mutate({
					id_talento: id_talento,
					vehiculos: state.activos.vehiculos ? state.activos.vehiculos : [],
					mascotas: state.activos.mascotas ? state.activos.mascotas : [],
					vestuarios: state.activos.vestuarios ? state.activos.vestuarios : [],
					props: state.activos.props ? state.activos.props : [],
					equipos_deportivos: state.activos.equipos_deportivos
						? state.activos.equipos_deportivos
						: [],
				});
				break;
			}
			case 6: {
				savePreferencias.mutate({
					id_talento: id_talento,
					preferencias: state.preferencias.preferencias,
					tipos_trabajo: state.preferencias.tipo_trabajo,
					interes_en_proyectos: state.preferencias.interes_en_proyectos,
					locaciones: state.preferencias.locaciones,
					documentos: state.preferencias.documentos,
					disponibilidad: state.preferencias.disponibilidad,
					otras_profesiones: state.preferencias.otras_profesiones,
				});
				break;
			}
			case 7: {
				saveFiltrosApariencias.mutate({
					id_talento: id_talento,
					...state.filtros_apariencia,
					hermanos: {
						id_tipo_hermanos: state.filtros_apariencia.hermanos
							? state.filtros_apariencia.hermanos.id_tipo_hermanos
							: 0,
						descripcion:
							state.filtros_apariencia.hermanos &&
								state.filtros_apariencia.hermanos.id_tipo_hermanos === 99
								? state.filtros_apariencia.hermanos.descripcion
								: state.filtros_apariencia.tipo_hermano_selected,
					},
				});
				break;
			}
		}
	};

	useEffect(() => {
		if (save_type) {
			switch (save_type) {
				case "save":
					handleStepChange(state.step_active);
					break;
				case "save_and_finish":
					handleStepChange(7);
					break;
				case "save_and_finish_later":
					handleStepChange(state.step_active);
					break;
			}
		}
	}, [save_type]);

	useEffect(() => {
		window.scroll({
			top: 0,
			behavior: 'smooth'
		})
	}, [state.step_active]);

	return (
		<>
			<Head>
				<title>DashBoard ~ Talentos | Talent Corner</title>
				<meta name="description" content="Talent Corner" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<MainLayout
				style={{
					padding: 32,
					backgroundColor: "#f2f2f2",
					marginTop: 48,
					minHeight: "100vh",
				}}
				menuSiempreBlanco={true}
			>
				<div
					style={{
						minHeight: [1].includes(state.step_active)
							? "calc(100vh - 76px)"
							: "100%",
						padding: "50px 0 50px",
					}}
				>
					<div
						style={{
							width: "75%",
							margin: "0 auto",
							backgroundColor: "white",
							border: "2px",
							borderStyle: "solid",
							borderColor: "#4ab7c6",
							padding: "48px 96px",
							borderRadius: "8px",
						}}
					>
						<MStepper
							disabled={talento.isFetching}
							onStepChange={(step: number) => {
								console.log("step", step);
								setSaveType("save");
								dispatch({ type: "update-form", value: { next_step: step } });
							}}
							onFinish={() => {
								console.log("entro aqui");
								setSaveType("save_and_finish");
							}}
							current_step={state.step_active}
							onStepSave={(step: number) => {
								console.log("entro aqui");
								setSaveType("save_and_finish_later");
								//handleStepChange(step);
							}}
							step_titles={{
								1: textos["info_basica"]
									? textos["info_basica"]
									: "Texto No Definido",
								2: textos["media"] ? textos["media"] : "Texto No Definido",
								3: `${textos["credito"] ? textos["credito"] : "Texto No Definido"
									}s`,
								4: textos["habilidades"]
									? textos["habilidades"]
									: "Texto No Definido",
								5: textos["activos"] ? textos["activos"] : "Texto No Definido",
								6: textos["step6_title"]
									? textos["step6_title"]
									: "Texto No Definido",
								7: textos["step7_title"]
									? textos["step7_title"]
									: "Texto No Definido",
							}}
							tooltips={{
								4: (
									<MTooltip
										text={
											textos["habilidades_tooltip"]
												? textos["habilidades_tooltip"]
												: "Texto No Definido"
										}
										color="orange"
										placement="right"
									/>
								),
								5: (
									<MTooltip
										text={
											<>
												<Typography fontSize={"12px"} fontWeight={800}>
													{textos["activos_title_tooltip_title"]
														? textos["activos_title_tooltip_title"]
														: "Texto No Definido"}
												</Typography>
												<Typography fontSize={"12px"} fontWeight={400}>
													{textos["activos_title_tooltip_body"]
														? textos["activos_title_tooltip_body"]
														: "Texto No Definido"}
												</Typography>
											</>
										}
										color="orange"
										placement="right"
									/>
								),
								6: (
									<MTooltip
										text={
											textos["preferencias_rol_tooltip"]
												? textos["preferencias_rol_tooltip"]
												: "Texto No Definido"
										}
										color="orange"
										placement="top"
									/>
								),
							}}
							styleSpanH3PasoTitulo={{
								fontWeight: 400,
							}}
							stylesNumeroPaso={{
								fontWeight: 700,
							}}
						>
							{editar_info_basica_talento}
							{editar_media_talento}
							{editar_creditos_talento}
							{editar_habilidades_talento}
							{editar_activos_talento}
							{editar_preferencias_rol_y_compensacion_talento}
							{editar_filtros_apariencias_talento}
						</MStepper>
					</div>
				</div>
			</MainLayout>
			<ResourceAlert
				busy={
					talento.isFetching ||
					busy ||
					saveInfoGralMedia.isLoading ||
					saveInfoGral.isLoading ||
					saveMedios.isLoading ||
					saveCreditos.isLoading ||
					saveHabilidades.isLoading ||
					saveActivos.isLoading ||
					saveFiltrosApariencias.isLoading ||
					savePreferencias.isLoading
				}
			/>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (session && session.user && session.user.tipo_usuario) {
		if (
			[TipoUsuario.TALENTO, TipoUsuario.REPRESENTANTE].includes(
				session.user.tipo_usuario
			)
		) {
			const { step } = context.query;
			const { id_talento } = context.query;
			let talento_id = id_talento ? parseInt(id_talento as string) : 0;
			if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
				talento_id = parseInt(session.user.id);
			}
			let can_edit = true;
			const rep = await prisma.talentosRepresentados.findFirst({
				where: {
					id_talento: talento_id,
				},
				include: {
					representante: {
						include: {
							permisos: true,
						},
					},
				},
			});
			if (rep) {
				if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
					can_edit = Boolean(
						rep.representante.permisos?.puede_editar_perfil_talento
					);
				}
				if (session.user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
					can_edit = Boolean(
						rep.representante.permisos?.puede_editar_perfil_representante
					);
				}
			}
			if (can_edit) {
				return {
					props: {
						id_talento: talento_id,
						step: step ? step : 1,
					},
				};
			}
			return {
				redirect: {
					destination: `/error?cause=${Constants.PAGE_ERRORS.NO_EDIT_PERMISSIONS}`,
					permanent: true,
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

export default EditarTalentoPage;
