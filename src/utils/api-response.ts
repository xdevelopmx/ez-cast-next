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
        }
    }
    const _route = API_RESPONSES_TEXTS[route];
    if (_route) {
        const texts = _route[lang];
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

