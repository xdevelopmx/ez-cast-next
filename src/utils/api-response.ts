export default function ApiResponses(route: string, lang: string) {
    const API_RESPONSES_TEXTS: {[route: string]: {[lang: string]: {[key: string]: string}}} = {
        Alertas_getByUser: {
            en: {
                error: 'test error',
            },
            es: {
                error: 'prueba error',
            },
        },
        AgendaVirtualRouter_sendHorarios: {
            en: {
                message_talent_audition_text: 'You have been selected for the audition of project [N1] on [N2] at [N3] hours.',
                message_talent_callback_text: 'You have been selected for the callback of project [N1] on [N2] at [N3] hours.',
                message_headhunter_audition_text: `The talent scout <span style="color: white; font-weight: 800;">[N1] [N2]</span> has confirmed your <span style="color: white; font-weight: 800;">callback</span> on the day <span style="color: white; font-weight: 800;">[N3] at [N4] hours</span> for the role of <span style="color: white; font-weight: 800;">[N5]</span>. Please contact us via message to know the last-minute details for your casting.`,
                message_headhunter_callback_text: `<span style="color: white; font-weight: 800;">[N1] [N2]</span> has confirmed your <span style="color: white; font-weight: 800;">audition</span> on the day <span style="color: white; font-weight: 800;">[N3] at [N4] hours</span> for the role of <span style="color: white; font-weight: 800;">[N5]</span>. Please contact us via message to receive last-minute details for your casting`,
            },
            es: {
                message_talent_audition_text: 'Has sido seleccionado para la audicion del proyecto [N1] el [N2] en el horario de [N3].',
                message_talent_callback_text: 'Has sido seleccionado para el callback del proyecto [N1] el [N2] en el horario de [N3].',
                message_headhunter_audition_text: `El cazatalentos <span style="color: white; font-weight: 800;">[N1] [N2]</span> ha confirmado tu <span style="color: white; font-weight: 800;">callback</span>
                el día <span style="color: white; font-weight: 800;">[N3] a las [N4] horas”</span> para el rol de <span style="color: white; font-weight: 800;">[N5]</span>, 
                comunicate por mensaje para saber los detalles de último minuto para tu casting.`,
                message_headhunter_callback_text: `El cazatalentos <span style="color: white; font-weight: 800;">[N1] [N2]</span> ha confirmado tu <span style="color: white; font-weight: 800;">audición</span>
                el día <span style="color: white; font-weight: 800;">[N3] a las [N4] horas</span> para el rol de <span style="color: white; font-weight: 800;">[N5]</span>, 
                comunicate por mensaje para saber los detalles de último minuto para tu casting.`,
            },
        },
        AgendaVirtualRouter_getAllProyectosByCazatalentosWithHorarioAgenda: {
            en: {
                solo_cazatalentos: 'Only the headhunter role can access the projects.',
            },
            es: {
                solo_cazatalentos: 'Solo el rol de cazatalentos puede obtener los proyectos.',
            },
        },
        AgendaVirtualRouter_getAllHorarioAgendaByCazatalento: {
            en: {
                solo_cazatalentos: 'Only the headhunter role can access the projects.',
            },
            es: {
                solo_cazatalentos: 'Solo el rol de cazatalentos puede obtener los proyectos.',
            },
        },
        AgendaVirtualRouter_getHorarioAgendaById: {
            en: {
                solo_cazatalentos: 'Only the headhunter role can access the projects.',
            },
            es: {
                solo_cazatalentos: 'Solo el rol de cazatalentos puede obtener los proyectos.',
            },
        },
        AgendaVirtualRouter_deleteById: {
            en: {
                error_no_pudo_eliminar_horario: 'There was a problem trying to delete the schedule.',
                error_no_pudo_eliminar_ubicaciones: 'There was a problem trying to delete the schedule locations.',
                error_no_pudo_eliminar_fechas_horarios: 'There was a problem trying to delete the schedule dates.',
                error_no_pudo_eliminar_bloques: 'There was a problem trying to delete the schedule blocks.',
                solo_cazatalentos: 'Only the headhunter can delete schedules.',
            },
            es: {
                error_no_pudo_eliminar_horario: 'Ocurrio un problema al tratar de eliminar el horario.',
                error_no_pudo_eliminar_ubicaciones: 'Ocurrio un problema al tratar de eliminar las locaciones del horario.',
                error_no_pudo_eliminar_fechas_horarios: 'Ocurrio un problema al tratar de eliminar las fechas del horario.',
                error_no_pudo_eliminar_bloques: 'Ocurrio un problema al tratar de eliminar los bloques del horario.',
                solo_cazatalentos: 'Solo el rol de cazatalento puede eliminar horarios.',
            },
        },
        AgendaVirtualRouter_create: {
            en: {
                message_create: `We have some bad news <span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> has canceled the casting for <span style="color: white; font-weight: 800;">[N5]</span> on <span style="color: white; font-weight: 800;">[N6] at [N7] hours</span>.`,
                error_saved_fechas: 'There was a problem trying to save the dates.',
                error_ubicaciones: 'There was a problem trying to save the locations.',
                error_solo_cazatalentos: 'Only the talent scout role can create schedules.'
            },
            es: {
                message_create: `Tenemos una mala noticia <span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> ha cancelado el
                casting de <span style="color: white; font-weight: 800;">[N5]</span> para <span style="color: white; font-weight: 800;">[N6] a las [N7] horas</span>.`,
                error_saved_fechas: 'Ocurrio un problema al tratar de guardar las fechas.',
                error_ubicaciones: 'Ocurrio un problema al tratar de guardar las locaciones.',
                error_solo_cazatalentos: 'Solo el rol de cazatalento puede crear horarios.'
            }
        },
        AgendaVirtualRouter_updateIntervaloHorario: {
            en: {
                alert_message_callback_confirmado: `<span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> has confirmed the callback on <span style="color: white; font-weight: 800;">[N5] at [N6] hours</span> for the role of <span style="color: white; font-weight: 800;">[N7]</span>. Let them know the last-minute details for their casting.`,
                alert_message_audicion_confirmado: `
                <span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> has confirmed the audition on <span style="color: white; font-weight: 800;">[N5] at [N6] hours</span> for the role of <span style="color: white; font-weight: 800;">[N7]</span>. Let them know the last-minute details for their casting.`,
                alert_message_callback_rechazado: `Hello <span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> has declined the callback on <span style="color: white; font-weight: 800;">[N5] at [N6] hours</span> for the role of <span style="color: white; font-weight: 800;">[N7]</span>. Let them know if you have any available dates and schedules for the casting.`,
                alert_message_audicion_rechazado: `Hello <span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> has declined the audition on <span style="color: white; font-weight: 800;">[N5] at [N6] hours</span> for the role of <span style="color: white; font-weight: 800;">[N7]</span>. Let them know if you have any available dates and schedules for the casting.`,
                error_saved_intervalos: 'There was a problem trying to save the intervals.',
                error_solo_cazatalentos: 'Only the talent scout role can create schedules.'
            },
            es: {
                alert_message_callback_confirmado: `<span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> ha confirmado el callback el día 
                <span style="color: white; font-weight: 800;">[N5] a las [N6] horas</span> para el rol de <span style="color: white; font-weight: 800;">[N7]</span>, déjale saber los detalles de último minuto para su
                casting.`,
                alert_message_audicion_confirmado: `<span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> ha confirmado la audicion el día 
                <span style="color: white; font-weight: 800;">[N5] a las [N6] horas</span> para el rol de <span style="color: white; font-weight: 800;">[N7]</span>, déjale saber los detalles de último minuto para su
                casting.`,
                alert_message_callback_rechazado: `¡Hola <span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> ha rechazado el callback el día 
                <span style="color: white; font-weight: 800;">[N5] a las [N6] horas”</span> para el rol de <span style="color: white; font-weight: 800;">[N7]</span>, déjale saber si tienes fechas y horarios disponibles para el casting.`,
                alert_message_audicion_rechazado: `¡Hola <span style="color: white; font-weight: 800;">[N1] [N2]</span>, <span style="color: white; font-weight: 800;">[N3] [N4]</span> ha rechazado la audicion el día 
                <span style="color: white; font-weight: 800;">[N5] a las [N6] horas”</span> para el rol de <span style="color: white; font-weight: 800;">[N7]</span>, déjale saber si tienes fechas y horarios disponibles para el casting.`,
                error_saved_intervalos: 'Ocurrio un problema al tratar de guardar los intervalos.',
                error_solo_cazatalentos: 'Solo el rol de cazatalento puede crear horarios.'
            }
        },
        AgendaVirtualRouter_updateBloqueHorario: {
            en: {
                error_saved_intervalos: 'There was a problem trying to save the intervals.',
            },
            es: {
                error_saved_intervalos: 'Ocurrio un problema al tratar de guardar los intervalos.',
            }
        },
        AgendaVirtualRouter_getLocalizacionesGuardadas: {
            en: {
                error_solo_cazatalento: 'Only the headhunter role can access the locations.',
            },
            es: {
                error_solo_cazatalento: 'Solo el rol de cazatalento puede consultar las localizaciones.',
            }
        },
        AgendaVirtualRouter_updateLocalizacion: {
            en: {
                error_saved_ubicacion: 'There was a problem trying to save the location.',
                error_solo_cazatalento: 'Only the headhunter role can save locations.',
            },
            es: {
                error_saved_ubicacion: 'Ocurrio un problema al tratar de guardar la localizacion.',
                error_solo_cazatalento: 'Solo el rol de cazatalento puede guardar localizaciones.'
            }
        },
        AuthRouter_createUser: {
            en: {
                error_no_cifro_contrasena: 'The password could not be encrypted.',
                error_usuario_o_correo_repetido: 'A user with that username or email already exists, please use another one.',
                error_usuario_invalido: 'An invalid user type was sent.',
            },
            es: {
                error_no_cifro_contrasena: 'No se pudo cifrar la contraseña.',
                error_usuario_o_correo_repetido: 'Ya existe un usuario con ese usuario o correo electronico, por favor utiliza otro.',
                error_usuario_invalido: 'No se envio un tipo de usuario valido',
            }
        },
        BannersRouter_deleteBanner: {
            en: {
                error_rol_invalido: 'Only the admin role can modify the banners.',
            },
            es: {
                error_rol_invalido: 'Solo el rol de admin puede modificar los banners.',
            }
        },
        BannersRouter_updateBanner: {
            en: {
                error_no_guardo_banner: 'An error occurred while trying to save the banner.',
                error_rol_invalido: 'Only the admin role can modify the banners.',
            },
            es: {
                error_no_guardo_banner: 'Ocurrio un error al tratar de guardar el banner.',
                error_rol_invalido: 'Solo el rol de admin puede modificar los banners.',
            }
        },
        CazatalentosRouter_getTalentosDestacadosByCazatalento: {
            en: {
                error_rol_invalido: 'Only the talent scout role can view their featured talents.',
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalento puede consultar sus talentos destacados.',
            }
        },
        CazatalentosRouter_getReporteTalentoByCazatalento: {
            en: {
                error_rol_invalido: 'Only the talent scout role can access the reports.',
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalento puede consultar los reportes.',
            }
        },
        CazatalentosRouter_getNotaTalentoByCazatalento: {
            en: {
                error_rol_invalido: 'Only the talent scout role can access the notes.',
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalento puede consultar las notas.',
            }
        },
        CazatalentosRouter_getTalentoRatingByCazatalento: {
            en: {
                error_rol_invalido: 'Only the talent scout role can modify the general information.',
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalento puede modificar la informacion general.',
            }
        },
        CazatalentosRouter_getAudicionTalentoByRol: {
            en: {
                error_rol_invalido: 'Only the talent scout role can access the talent auditions.',
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalento puede consultar las audiciones de los talentos.',
            }
        },
        CazatalentosRouter_updateReporteTalento: {
            en: {
                error_rol_invalido: `Only the talent scout role can modify the talent's report.`,
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalento puede modificar el reporte del talento.',
            }
        },
        CazatalentosRouter_updateNotaTalento: {
            en: {
                error_rol_invalido: `Only the talent scout role can modify the talent's notes.`,
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalento puede modificar las notas del talento.',
            }
        },
        CazatalentosRouter_deleteNotaTalento: {
            en: {
                error_rol_invalido: `Only the talent scout role can modify the talent's notes.`,
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalento puede modificar las notas del talento.',
            }
        },
        CazatalentosRouter_marcarComoVistoAplicacionRolTalento: {
            en: {
                error_rol_invalido: `Only the talent scout role can modify the talent's rating.`,
                id_role_not_found: 'The role with that ID was not found.',
                different_cazatalento: 'Only the talent scout who created the role can modify the talent.',
            },
            es: {
                id_role_not_found: 'No se encontro el rol con ese id',
                error_rol_invalido: 'Solo el rol de cazatalento puede modificar la calificacion del talento.',
                different_cazatalento: 'Solo el cazatalento que creo el rol puede modificar el talento.'
            }
        },
        CazatalentosRouter_updateTalentoDestacado: {
            en: {
                error_rol_invalido: `Only the talent scout role can modify the talent's rating.`,
                id_role_not_found: 'The role with that ID was not found.',
                different_cazatalento: 'Only the talent scout who created the role can modify the talent.',
            },
            es: {
                id_role_not_found: 'No se encontro el rol con ese id',
                error_rol_invalido: 'Solo el rol de cazatalento puede modificar la calificacion del talento.',
                different_cazatalento: 'Solo el cazatalento que creo el rol puede modificar el talento.'
            }
        },
        CazatalentosRouter_updateSeleccionTalento: {
            en: {
                error_rol_invalido: `Only the talent scout role can modify the talent's rating.`,
                id_role_not_found: 'The role with that ID was not found.',
                different_cazatalento: 'Only the talent scout who created the role can modify the talent.',
                cazatalento_message: `Talent scout [N1] [N2] has scheduled you for [N3] for the role of [N4] in the project [N5] on the date [N6]. You can see the details on the casting billboard.`,
                cazatalento_alerta_callback: `You have been <span style="color: white;">selected</span>! You have a <span style="color: white;">[N1]</span> for <b>[N2]</b>. You will be receiving casting information very soon. Congratulations on advancing to the second stage!`,
                cazatalento_alerta_audicion: `You have been <span style="color: white;">selected</span>! You have a <span style="color: white;">[N1]</span> for <b>[N2]</b>. You will be receiving casting information very soon. Congratulations on advancing to the first stage!`,
            },
            es: {
                id_role_not_found: 'No se encontro el rol con ese id',
                error_rol_invalido: 'Solo el rol de cazatalento puede modificar la calificacion del talento.',
                different_cazatalento: 'Solo el cazatalento que creo el rol puede modificar el talento.',
                cazatalento_message: `El cazatalentos [N1] [N2], te ha programado para [N3] para el rol de rol de [N4] del proyecto [N5] en la fecha de [N6], puedes ver los detalles en el casting billboard.`,
                cazatalento_alerta_callback: `¡Has sido <span style="color: white;">seleccionad@</span>! Tendrás una <span style="color: white;">[N1]</span> para <b>[N2]</b>. Estarás recibiendo información del casting muy pronto. ¡Felicidades por pasar a la segunda etapa!`,
                cazatalento_alerta_audicion: `¡Has sido <span style="color: white;">seleccionad@</span>! Tendrás una <span style="color: white;">[N1]</span> para <b>[N2]</b>. Estarás recibiendo información del casting muy pronto. ¡Felicidades por pasar a la primera etapa!`,
            }
        },
        CazatalentosRouter_updatePerfil: {
            en: {
                error_max_biografia_length: 'The maximum allowed characters is 500.',
                error_rol_invalido: 'Only the talent scout role can modify the general information.',
                error_update_cazatalento: `An error occurred while trying to update the talent's name.`,
                error_delete_redes_sociales: `An error occurred while trying to delete the talent's social media accounts.`,
                error_save_redes_sociales: `An error occurred while trying to save the talent's social media accounts.`,
            },
            es: {
                error_max_biografia_length: 'El maximo de caracteres permitido es 500.',
                error_rol_invalido: 'Solo el rol de cazatalento puede modificar la informacion general.',
                error_update_cazatalento: 'Ocurrio un error al tratar de actualizar el nombre del cazatalento.',
                error_delete_redes_sociales: 'Ocurrio un error al tratar de eliminar las redes sociales del cazatalento.',
                error_save_redes_sociales: 'Ocurrio un error al tratar de guardar las redes sociales del cazatalento.',
            }
        },
        ProyectosRouter_deleteProyecto: {
            en: {
                error_delete_project: 'An error occurred while trying to delete the project.',
                error_invalid_role: 'Only the talent scout role can modify projects.'
            },
            es: {
                error_delete_project: 'Ocurrio un error al tratar de eliminar el proyecto.',
                error_invalid_role: 'Solo el rol de cazatalentos puede modificar los proyectos.',
            }
        },
        ProyectosRouter_updateEstadoProyecto: {
            en: {
                error_save_project: 'An error occurred while trying to save the project.',
                message_proyecto_aprobado: `Your project <span style="color: white; font-weight: 800;">[N1]</span> has been successfully approved! We recommend you to stay alert for the applications you receive to find and recruit your talent as soon as possible.`,
                message_proyecto_rechazado: `Your project <span style="color: white; font-weight: 800;">[N1]</span> has been rejected! We recommend you to review the following observations to make the necessary corrections: </br> <span style="color: white; font-weight: 800;">[N2].</span>`,
                error_invalid_role: 'Only the talent scout and admin roles can modify projects.'
            },
            es: {
                error_save_project: 'Ocurrio un error al tratar de guardar el proyecto.',
                message_proyecto_aprobado: `¡Tu proyecto <span style="color: white; font-weight: 800;">[N1]</span> ha sido aprobado con éxito!
                Te recomendamos estar atento a las aplicaciones que recibas para así encontrar y reclutar a tu
                talento lo más pronto posible.`,
                message_proyecto_rechazado: `¡Tu proyecto <span style="color: white; font-weight: 800;">[N1]</span> ha sido rechazado!
                Te recomendamos revisar las siguientes observaciones para que sean corregidos: </br> <span style="color: white; font-weight: 800;">[N2].</span>`,
                error_invalid_role: 'Solo el rol de cazatalentos y admin puede modificar los proyectos.',
            }
        },
        ProyectosRouter_updateDestacado: {
            en: {
                error_save_project: 'An error occurred while trying to save the project.',
                error_invalid_role: 'Only the admin role can mark a project as featured.'
            },
            es: {
                error_save_project: 'Ocurrio un error al tratar de guardar el proyecto.',
                error_invalid_role: 'Solo el rol de admin puede marcar un proyecto como destacado.',
            }
        },
        ProyectosRouter_saveProyectoFiles: {
            en: {
                error_invalid_role: 'Only the talent scout role can modify the general information.'
            },
            es: {
                error_invalid_role: 'Solo el rol de cazatalento puede modificar la informacion general.',
            }
        },
        ProyectosRouter_updateProyecto: {
            en: {
                error_location_invalido: 'You must choose a valid location.',
                error_sindicato_invalido: 'You must choose a valid union type.',
                error_save_project: 'An error occurred while trying to save the project.',
                error_tipo_proyecto_invalido: 'You must choose a valid project type.',
                error_save_type_project: 'An error occurred while trying to save the project type.',
                error_save_sindicato: 'An error occurred while trying to save the project union.',
                error_invalid_role: 'Only the talent scout role can modify projects.'
            },
            es: {
                error_location_invalido: 'Debes elegir una locacion valida.',
                error_sindicato_invalido: 'Debes elegir un tipo de sindicato.',
                error_save_project: 'Ocurrio un error al tratar de guardar el proyecto.',
                error_tipo_proyecto_invalido: 'Debes elegir un tipo de proyecto.',
                error_save_type_project: 'Ocurrio un error al tratar de guardar el tipo de proyecto.',
                error_save_sindicato: 'Ocurrio un error al tratar de guardar el sindicato del proyecto.',
                error_invalid_role: 'Solo el rol de cazatalentos puede modificar los proyectos.',
            }
        },
        ProyectosRouter_deleteById: {
            en: {
                error_cant_delete: 'The project could not be deleted.',
                error_proyecto_not_found: 'The project with that id was not found.'
            },
            es: {
                error_cant_delete: 'No se pudo eliminar el proyecto.',
                error_proyecto_not_found: 'No se encontro el proyecto con ese id.'
            }
        },
        RepresentantesRouter_saveMediaInfoBasica: {
            en: {
            },
            es: {
            }
        },
        RepresentantesRouter_saveInfoBasica: {
            en: {
            },
            es: {
            }
        },
        RepresentantesRouter_savePermisos: {
            en: {
            },
            es: {
            }
        },
        RepresentantesRouter_saveMediaValidacion: {
            en: {
            },
            es: {
            }
        },
        RepresentantesRouter_saveValidacion: {
            en: {
            },
            es: {
            }
        },
        RepresentantesRouter_updatePerfil: {
            en: {
            },
            es: {
            }
        },
        RepresentantesRouter_getTalentosAsignados: {
            en: {
            },
            es: {
            }
        },
        RepresentantesRouter_removeTalento: {
            en: {
            },
            es: {
            }
        },
        RepresentantesRouter_assignTalento: {
            en: {
            },
            es: {
            }
        },
        RolesRouter_createAplicacionTalento: {
            en: {
                conversacion_message: `The talent [N1] [N2] has applied for the role of [N3] in the project [N4]. You can check the details on the casting billboard.`,
                alerta_message: `<p>Hello <b>[N1] [N2]</b>! You have received <span style="color: white;">new applications</span> for your project <b>[N3]</b>, access your <a style="text-decoration: underline; color: white;" href="/cazatalentos/billboard">personalized billboard</a> and select your favorites using the <span style="color: white">highlight</span> tool.</p>`
            },
            es: {
                conversacion_message: `El talento [N1] [N2], se ha postulado al rol de [N3] del proyecto [N4], puedes ver los detalles en el casting billboard.`,
                alerta_message: `<p>¡Hola <b>[N1] [N2]</b>! Has recibido
                <span style="color: white;">nuevas aplicaciones</span> para tu proyecto <b>[N3]</b>, accede a tu <a style="text-decoration: underline; color: white;" href="/cazatalentos/billboard"> billboard personalizado</a> y selecciona
                a tus favoritos utilizando la herramienta <span style="color: white">destacado</span>.</p>`
            }
        },
        RolesRouter_deleteRolById: {
            en: {
                error_rol_invalido: 'Only the talent scout role can modify roles.',
                error_delete_rol: 'An error occurred while trying to delete the role.',
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalentos puede modificar los roles.',
                error_delete_rol: 'Ocurrio un error al tratar de eliminar el rol.',
            }
        },
        RolesRouter_updateEstadoRolById: {
            en: {
                error_rol_invalido: 'Only the talent scout role can modify roles.',
                error_save_rol: 'An error occurred while trying to save the role.',
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalentos puede modificar los roles.',
                error_save_rol: 'Ocurrio un error al tratar de guardar el rol.',
            }
        },
        RolesRouter_saveRolFiles: {
            en: { 
                error_rol_invalido: 'Only the talent scout role can modify the role information.',
            },
            es: {
                error_rol_invalido: 'Solo el rol de cazatalento puede modificar la informacion del rol.',
            }
        },
        RolesRouter_saveRol: {
            en: {
                failed: 'Failed to update the self-tape data of the role.',
                error_save_medios_multimedia: 'Failed to save the multimedia media of the role.',
                error_save_requisitos: 'Failed to save the requirements of the role.',
                error_save_fechas_filmaciones: 'Failed to save the filming dates data.',
                error_save_fechas_casting: 'Failed to save the casting dates data.',
                error_save_nsfw_seleccionados: 'Failed to save the selected nsfw for the role.',
                error_save_nsfw: 'Failed to save the nsfw for the role.',
                error_save_habilidades_seleccionadas: 'Failed to create the selected skills for the role.',
                error_save_habilidades: 'Failed to create the skills for the role.',
                error_save_rol: 'Failed to update the role.',
                error_save_animal: 'Failed to save the animal of the role in the database.',
                error_save_etnias: 'Failed to save the ethnicities of the role in the database.',
                error_save_generos: 'Failed to save the genders of the role in the database.',
                error_save_filtros: 'Failed to update the demographic filters of the role in the database.',
                error_save_comp_mone: 'Failed to save the non-monetary compensations of the role in the database.',
                error_save_sueldo: 'Failed to save the salary of the role in the database.',
                error_save_comp: 'Failed to update the compensations of the role in the database.',
                invalid_age: 'Age cannot be greater than 110 or less than 0.',
                invalid_pais: 'You must select a nationality.',
                invalid_descripcion: 'The role description cannot exceed 500 characters.',
                invalid_descripcion_nsfw: 'The NSFW content description cannot exceed 500 characters.',
                invalid_castings: 'At least one casting date must be defined.',
                invalid_filmaciones: 'At least one filming date must be defined.',
                invalid_selftape: 'Self-tape instructions cannot exceed 500 characters.',
                invalid_requisitos: 'The work information for the role cannot exceed 500 characters.',
            },
            es: {
                failed: 'No se pudieron actualizar los datos del selftape del rol.',
                error_save_medios_multimedia: 'No se pudieron guardar los medios multimedia del rol.',
                error_save_requisitos: 'No se pudieron guardar los requisitos del rol.',
                error_save_fechas_filmaciones: 'No se pudieron guardar los datos de la fechas de filmaciones.',
                error_save_fechas_casting: 'No se pudieron guardar los datos de la fechas de castings.',
                error_save_nsfw_seleccionados: 'No se pudieron guardar los nsfw seleccionados del rol.',
                error_save_nsfw: 'No se pudieron guardar los nsfw del rol.',
                error_save_habilidades_seleccionadas: 'No se pudieron crear las habilidades seleccionadas del rol.',
                error_save_habilidades: 'No se pudieron crear las habilidades del rol.',
                error_save_rol: 'No se pudo actualizar el rol.',
                error_save_animal: 'No se pudo guardar el animal del rol en la base de datos.',
                error_save_etnias: 'No se pudieron guardar las etnias del rol en la base de datos.',
                error_save_generos: 'No se pudieron guardar los generos del rol en la base de datos.',
                error_save_filtros: 'No se pudo actualizar los filtros demograficos del rol en la base de datos.',
                error_save_comp_mone: 'No se pudieron guardar las compensaciones no monetarias del rol en la base de datos.',
                error_save_sueldo: 'No se pudo guardar el sueldo del rol en la base de datos.',
                error_save_comp: 'No se pudo actualizar las compensaciones del rol en la base de datos.',
                invalid_age: 'La edad no puede ser mayor a 110 ni menor a 0.',
                invalid_pais: 'Debes seleccionar una nacionalidad.',
                invalid_descripcion: 'La descripcion del rol no puede ser mayor a 500 caracteres.',
                invalid_descripcion_nsfw: 'La descripcion del contenido NSFW no puede ser mayor a 500 caracteres.',
                invalid_castings: 'Se debe definir al menos una fecha para castings.',
                invalid_filmaciones: 'Se debe definir al menos una fecha para filmaciones.',
                invalid_selftape: 'Las indicaciones del selftape no puede ser mayor a 500 caracteres.',
                invalid_requisitos: 'La informacion de trabajo del  rol no puede ser mayor a 500 caracteres.',
            }
        },
        RolesRouter_saveCompensacion: {
            en: {
                error_save_compensaciones_no_monetarias: 'Failed to save the non-monetary compensations of the role in the database.',
                error_save_sueldo: 'Failed to save the salary of the role in the database.',
                error_save_compensaciones: 'Failed to update the compensations of the role in the database.',
                role_not_found: 'The role was not found in the database.'
            },
            es: {
                error_save_compensaciones_no_monetarias: 'No se pudieron guardar las compensaciones no monetarias del rol en la base de datos.',
                error_save_sueldo: 'No se pudo guardar el sueldo del rol en la base de datos.',
                error_save_compensaciones: 'No se pudo actualizar las compensaciones del rol en la base de datos.',
                role_not_found: 'No se encontro el rol en la base de datos.',
            }
        },
        RolesRouter_saveFiltrosDemograficos: {
            en: {
                error_save_animal: 'Failed to save the animal of the role in the database.',
                error_delete_animal: 'Failed to delete the animal of the role in the database.',
                error_save_etnias: 'Failed to save the ethnicities of the role in the database.',
                error_save_generos: 'Failed to save the genders of the role in the database.',
                error_save_filtros: 'Failed to update the demographic filters of the role in the database.',
                role_not_found: 'The role was not found in the database.',
                invalid_age: 'Age cannot be greater than 110 or less than 0.',
                invalid_pais: 'You must select a nationality.'
            },
            es: {
                error_save_animal: 'No se pudo guardar el animal del rol en la base de datos.',
                error_delete_animal: 'No se pudo eliminar el animal del rol en la base de datos.',
                error_save_etnias: 'No se pudieron guardar las etnias del rol en la base de datos.',
                error_save_generos: 'No se pudieron guardar los generos del rol en la base de datos.',
                error_save_filtros: 'No se pudo actualizar los filtros demograficos del rol en la base de datos.',
                role_not_found: 'No se encontro el rol en la base de datos.',
                invalid_age: 'La edad no puede ser mayor a 110 ni menor a 0.',
                invalid_pais: 'Debes seleccionar una nacionalidad.',
            }
        },
        RolesRouter_saveDescripcionRol: {
            en: {
                error_save_nsfw_seleccionados: 'Failed to save the selected nsfw for the role.',
                error_save_nsfw: 'Failed to save the nsfw for the role.',
                error_delete_nsfw: 'Failed to delete the nsfw for the role.',
                error_save_habilidades_seleccionadas: 'Failed to create the selected skills for the role.',
                error_save_habilidades: 'Failed to create the skills for the role.',
                error_delete_habilidades: 'Failed to delete the skills for the role.',
                role_not_found: 'The role was not found in the database.',
                max_descripcion_reached: 'The role description cannot exceed 500 characters.',
                max_nsfw_descripcion_reached: 'The NSFW content description cannot exceed 500 characters.'
            },
            es: {
                error_save_nsfw_seleccionados: 'No se pudieron guardar los nsfw seleccionados del rol.',
                error_save_nsfw: 'No se pudieron guardar los nsfw del rol.',
                error_delete_nsfw: 'No se pudieron eliminar los nsfw del rol.',
                error_save_habilidades_seleccionadas: 'No se pudieron crear las habilidades seleccionadas del rol.',
                error_save_habilidades: 'No se pudieron crear las habilidades del rol.',
                error_delete_habilidades: 'No se pudieron eliminar las habilidades del rol.',
                role_not_found: 'No se encontro el rol en la base de datos.',
                max_descripcion_reached: 'La descripcion del rol no puede ser mayor a 500 caracteres.',
                max_nsfw_descripcion_reached: 'La descripcion del contenido NSFW no puede ser mayor a 500 caracteres.',
            }
        },
        RolesRouter_saveInfoCastingYFilmacion: {
            en: {
                error_saved_fechas: 'Failed to save the filming dates data.',
                error_delete_fechas: 'Failed to delete the filming dates data.',
                error_saved_fechas_casting: 'Failed to save the casting dates data.',
                error_delete_fechas_casting: 'Failed to delete the casting dates data.',
                no_fechas: 'At least one date must be defined.'
            },
            es: {
                error_saved_fechas: 'No se pudieron guardar los datos de la fechas de filmaciones.',
                error_delete_fechas: 'No se pudieron eliminar los datos de la fechas de filmaciones.',
                error_saved_fechas_casting: 'No se pudieron guardar los datos de la fechas de castings.',
                error_delete_fechas_casting: 'No se pudieron eliminar los datos de la fechas de castings.',
                no_fechas: 'Se debe definir al menos una fecha.',
            }
        },
        RolesRouter_saveRequisitosRol: {
            en: {
                error_save_medios_multimedia: 'Failed to save the multimedia media of the role.',
                error_delete_medios_multimedia: 'Failed to delete the media of the role.',
                error_save_requisitos: 'Failed to save the requirements of the role.',
                limit_info_trabajo_reached: 'The work information for the role cannot exceed 500 characters.'
            },
            es: {
                error_save_medios_multimedia: 'No se pudieron guardar los medios multimedia del rol.',
                error_delete_medios_multimedia: 'No se pudieron eliminar los medios del rol.',
                error_save_requisitos: 'No se pudieron guardar los requisitos del rol.',
                limit_info_trabajo_reached: 'La informacion de trabajo del  rol no puede ser mayor a 500 caracteres.',
            }
        },
        RolesRouter_saveSelftapeRol: {
            en: {
                limit_indicaciones_reached: 'Self-tape instructions cannot exceed 500 characters.',
                failed: 'Failed to update the self-tape data of the role.'
            },
            es: {
                limit_indicaciones_reached: 'Las indicaciones del selftape no puede ser mayor a 500 caracteres.',
                failed: 'No se pudieron actualizar los datos del selftape del rol.',
            }
        },
        TalentosRouter_saveSelftape: {
            en: {
                error_update: `An error occurred while trying to update the talent's profile selftapes.`,
                limit_reached: 'You have reached the limit of selftapes you can upload (6).'
            },
            es: {
                error_update: `Ocurrio un error al tratar de actualizar los selftapes de perfil del talento.`,
                limit_reached: `Ya se alcanzo el limite de selftapes que puedes subir (6)`,
            }
        },
        TalentosRouter_updatePerfil: {
            en: {
                error_save_redes_sociales: `An error occurred while trying to save the talent's social media.`,
                error_delete_redes_sociales: `An error occurred while trying to delete the talent's social media.`,
                error_save_info_gral: `An error occurred while trying to save the talent's general information.`,
                error_save_talento: `An error occurred while trying to update the talent's name.`,
                error_save_foto_perfil: 'An error occurred while trying to update the profile picture of talent [N1].',
                error_biografia_invalida: 'The maximum allowed characters is 500.'
            },
            es: {
                error_save_redes_sociales: 'Ocurrio un error al tratar de guardar las redes sociales del talento.',
                error_delete_redes_sociales: 'Ocurrio un error al tratar de eliminar las redes sociales del talento.',
                error_save_info_gral: 'Ocurrio un error al tratar de guardar la info general del talento.',
                error_save_talento: 'Ocurrio un error al tratar de actualizar el nombre del talento.',
                error_save_foto_perfil: `Ocurrio un error al tratar de actualizar la foto de perfil del talento [N1]`,
                error_biografia_invalida: 'El maximo de caracteres permitido es 500.',
            }
        },
        TalentosRouter_saveInfoGral: {
            en: {
                error_delete_representante: 'There was a problem trying to delete the representative.',
                error_save_representante: `An error occurred while trying to save the talent's representative.`,
                error_save_redes_sociales: `An error occurred while trying to save the talent's social media.`,
                error_delete_redes_sociales: `An error occurred while trying to delete the talent's social media.`,
                error_save_union: `An error occurred while trying to save the talent's union.`,
                error_save_info_gral: `An error occurred while trying to save the talent's general information.`,
                error_save_talento: `An error occurred while trying to update the talent's name.`,
                error_menor_edad_carta_responsiva: `If you are a minor, the letter of responsibility and the representative are mandatory.`,
                error_menor_edad_representante: 'If you are a minor, the representative is mandatory.',
                error_biografia_invalida: 'The maximum allowed characters is 500.',
                error_union_invalida: 'You must select a valid union type.',
                error_locacion_invalida: 'You must select a valid state.'
            },
            es: {
                error_delete_representante: 'Ocurrio un problema al tratar de eliminar el representante.',
                error_save_representante: 'Ocurrio un error al tratar de guardar el representante del talento.',
                error_save_redes_sociales: 'Ocurrio un error al tratar de guardar las redes sociales del talento.',
                error_delete_redes_sociales: 'Ocurrio un error al tratar de eliminar las redes sociales del talento.',
                error_save_union: 'Ocurrio un error al tratar de guardar la union del talento.',
                error_save_info_gral: 'Ocurrio un error al tratar de guardar la info general del talento.',
                error_save_talento: 'Ocurrio un error al tratar de actualizar el nombre del talento.',
                error_menor_edad_carta_responsiva: 'Si se es menor de edad la carta responsiva y el representante son obligatorios.',
                error_menor_edad_representante: 'Si se es menor de edad el representante es obligatorio.',
                error_biografia_invalida: 'El maximo de caracteres permitido es 500.',
                error_union_invalida: 'Debes seleccionar un tipo de union valida.',
                error_locacion_invalida: 'Debes seleccionar un estado valido.'
            }
        },
        TalentosRouter_updateEstaActivo: {
            en: {
                error_update_talento: 'An error occurred while trying to update the talent.'
            },
            es: {
                error_update_talento: 'Ocurrio un error al tratar de actualizar el talento',
            }
        },
        TalentosRouter_updateDestacado: {
            en: {
                error_update_talento: 'An error occurred while trying to update the talent.'
            },
            es: {
                error_update_talento: 'Ocurrio un error al tratar de actualizar el talento',
            }
        },
        TalentosRouter_updateCreditoDestacado: {
            en: {
                error_save_credito: 'An error occurred while trying to update the credit.',
            },
            es: {
                error_save_credito: 'Ocurrio un error al tratar de actualizar el credito.',
            }
        },
        TalentosRouter_saveCreditos: {
            en: {
                error_save_creditos: 'An error occurred while trying to save the talent credits.',
                error_delete_creditos: 'An error occurred while trying to delete the talent credits.',
                error_update_creditos: 'An error occurred while trying to update the talent credits.'
            },
            es: {
                error_save_creditos: 'Ocurrio un error al tratar de guardar los creditos por talentos.',
                error_delete_creditos: 'Ocurrio un error al tratar de eliminar los creditos por talentos.',
                error_update_creditos: 'Ocurrio un error al tratar de actualizar los creditos por talentos.',
            }
        },
        TalentosRouter_saveHabilidades: {
            en: {
                error_save_habilidades: `An error occurred while trying to save the talent's skills.`,
            error_delete_habilidades: `An error occurred while trying to delete the talent's skills.`
            },
            es: {
                error_save_habilidades: 'Ocurrio un error al tratar de guardar las habilidades por talentos.',
                error_delete_habilidades: 'Ocurrio un error al tratar de eliminar las habilidades por talentos.',
            }
        },
        TalentosRouter_saveActivos: {
            en: {
                error_save_equipos_deportivos: 'An error occurred while trying to save the sports equipment for talents.',
                error_delete_equipos_deportivos: 'An error occurred while trying to delete the sports equipment for talents.',
                error_save_props: 'An error occurred while trying to save the props for talents.',
                error_delete_props: 'An error occurred while trying to delete the props for talents.',
                error_delete_vestuarios: 'An error occurred while trying to delete the wardrobes for talents.',
                error_save_vestuarios: 'An error occurred while trying to save the wardrobes for talents.',
                error_delete_mascotas: 'An error occurred while trying to delete the mascots for talents.',
                error_save_mascotas: 'An error occurred while trying to save the mascots for talents.',
                error_delete_vehiculos: 'An error occurred while trying to delete the vehicles for talents.',
                error_save_vehiculos: 'An error occurred while trying to save the vehicles for talents.',
                error_activos_talento_not_found: 'An error occurred while trying to retrieve the assets for talent.'
            },
            es: {
                error_save_equipos_deportivos: 'Ocurrio un error al tratar de guardar los equipos deportivos por talentos.',
                error_delete_equipos_deportivos: 'Ocurrio un error al tratar de eliminar los equipos deportivos por talentos.',
                error_save_props: 'Ocurrio un error al tratar de guardar los props por talentos.',
                error_delete_props: 'Ocurrio un error al tratar de eliminar los props por talentos.',
                error_delete_vestuarios: 'Ocurrio un error al tratar de eliminar los vestuarios por talentos.',
                error_save_vestuarios: 'Ocurrio un error al tratar de guardar los vestuarios por talentos.',
                error_delete_mascotas: 'Ocurrio un error al tratar de eliminar las mascotas por talentos.',
                error_save_mascotas: 'Ocurrio un error al tratar de guardar las mascotas por talentos.',
                error_delete_vehiculos: 'Ocurrio un error al tratar de eliminar los vehiculos por talentos.',
                error_save_vehiculos: 'Ocurrio un error al tratar de guardar los vehiculos por talentos.',
                error_activos_talento_not_found: 'Ocurrio un error al tratar de obtener los activos por talento.',
            }
        },
        TalentosRouter_savePreferencias: {
            en: {
                error_save_otras_profesiones: 'An error occurred while trying to save other professions for talents.',
                error_delete_otras_profesiones: 'An error occurred while trying to delete other professions for talents.',
                error_save_disponibilidad: 'An error occurred while trying to save availabilities for talents.',
                error_delete_disponibilidad: 'An error occurred while trying to delete availabilities for talents.',
                error_save_documentos: 'An error occurred while trying to save requested documents for talents.',
                error_delete_documentos: 'An error occurred while trying to delete requested documents for talents.',
                error_save_locaciones: 'An error occurred while trying to save locations for talents.',
                error_delete_locaciones: 'An error occurred while trying to delete locations for talents.',
                error_save_intereses_en_proyectos: 'An error occurred while trying to save project interests for talents.',
                error_delete_intereses_en_proyectos: 'An error occurred while trying to delete project interests for talents.',
                error_save_tipos_de_trabajo: 'An error occurred while trying to save work types for talents.',
                error_delete_tipos_de_trabajo: 'An error occurred while trying to delete work types for talents.',
                error_locacion_invalida: 'At least one main location must be provided.'
            },
            es: {
                error_save_otras_profesiones: 'Ocurrio un error al tratar de guardar las otras profesiones por talentos.',
                error_delete_otras_profesiones: 'Ocurrio un error al tratar de eliminar las otras profesiones por talentos.',
                error_save_disponibilidad: 'Ocurrio un error al tratar de guardar las disponibilidades por talentos.',
                error_delete_disponibilidad: 'Ocurrio un error al tratar de eliminar las disponibilidades por talentos.',
                error_save_documentos: 'Ocurrio un error al tratar de guardar los documentos solicitados por talentos.',
                error_delete_documentos: 'Ocurrio un error al tratar de eliminar los documentos solicitados por talentos.',
                error_save_locaciones: 'Ocurrio un error al tratar de guardar las locaciones por talentos.',
                error_delete_locaciones: 'Ocurrio un error al tratar de eliminar las locaciones por talentos.',
                error_save_intereses_en_proyectos: 'Ocurrio un error al tratar de guardar los intereses en proyectos por talentos.',
                error_delete_intereses_en_proyectos: 'Ocurrio un error al tratar de eliminar los intereses por proyecto por talentos.',
                error_save_tipos_de_trabajo: 'Ocurrio un error al tratar de guardar los tipos de trabajos por talentos.',
                error_delete_tipos_de_trabajo: 'Ocurrio un error al tratar de eliminar los tipos de trabajos por talentos.',
                error_locacion_invalida: 'Se debe enviar al menos una locacion principal.',
            }
        },
        TalentosRouter_saveFiltrosApariencias: {
            en: {
                error_save_intereses_en_interpretar: 'An error occurred while trying to save interests in genres to interpret for talents.',
                error_delete_intereses_en_interpretar: 'An error occurred while trying to delete interests in genres to interpret for talents.',
                error_delete_tatuajes: 'An error occurred while trying to delete tattoos for talents.',
                error_save_tatuajes: 'An error occurred while trying to save tattoos for talents.',
                error_delete_piercings: 'An error occurred while trying to delete piercings for talents.',
                error_save_piercings: 'An error occurred while trying to save piercings for talents.',
                error_save_hermanos: 'An error occurred while trying to save the type of siblings for talents.',
                error_delete_hermanos: 'An error occurred while trying to delete the type of sibling for talents.',
                error_delete_particularidades: 'An error occurred while trying to delete particularities for talents.',
                error_save_particularidades: 'An error occurred while trying to save particularities for talents.'
            },
            es: {
                error_save_intereses_en_interpretar: 'Ocurrio un error al tratar de guardar los intereses en generos por interpretar por talentos.',
                error_delete_intereses_en_interpretar: 'Ocurrio un error al tratar de eliminar los intereses en generos por interpretar por talentos.',
                error_delete_tatuajes: 'Ocurrio un error al tratar de eliminar los tatuajes por talentos.',
                error_save_tatuajes: 'Ocurrio un error al tratar de guardar los tatuajes por talentos.',
                error_delete_piercings: 'Ocurrio un error al tratar de eliminar los piercings por talentos.',
                error_save_piercings: 'Ocurrio un error al tratar de guardar los piercings por talentos.',
                error_save_hermanos: 'Ocurrio un error al tratar de guardar el tipo de hermanos por talentos.',
                error_delete_hermanos: 'Ocurrio un error al tratar de eliminar el tipo de hermano por talentos.',
                error_delete_particularidades: 'Ocurrio un error al tratar de eliminar las particularidades por talentos.',
                error_save_particularidades: 'Ocurrio un error al tratar de guardar las particularidades por talentos.'
            }
        },
    }
    const _route = API_RESPONSES_TEXTS[route];
    if (_route) {
        const texts = _route[lang];
        console.log(lang);
        if (texts) {
            return (_key: string) => {
                const _text = texts[_key];
                if (_text) {
                    return _text;
                }
                return 'Texto No Definido';
            }    
        }
    }
    return (_key: string) => {
        return 'Texto No Definido';
    };
}

