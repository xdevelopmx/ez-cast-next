import dayjs from "dayjs";

export function expandDates(fechas: {fecha_inicio: Date, fecha_fin: Date | null}[]) {
    const dates = new Set<string>();
    fechas.forEach(date => {
        console.log('date', date);
        const start_day = date.fecha_inicio.getDate();
        console.log('start', start_day);
        const end_day = ((date.fecha_fin) ? date.fecha_fin.getDate() : date.fecha_inicio.getDate());
        const start_month = date.fecha_inicio.getMonth();
        const end_month = (date.fecha_fin) ? date.fecha_fin.getMonth() : date.fecha_inicio.getMonth();
        const start_year = date.fecha_inicio.getFullYear();
        const end_year = (date.fecha_fin) ? date.fecha_fin.getFullYear() : date.fecha_inicio.getFullYear();
        for (let y = start_year; y <= end_year; y++) {
            let final_month = end_month;
            let initial_month = start_month;
            if (y !== end_year) {
                final_month = 11;
            }
            if (start_year !== end_year && y === end_year) {
                initial_month = 0;
            }
            for (let m = initial_month; m <= final_month; m++) {
                const final_day = (m !== end_month) ? 31 : end_day;
                const initial_day = (m !== start_month) ? 1 : start_day;
                for (let d = initial_day; d <= final_day; d++) {
                    const n_date = `${d < 10 ? `0${d}` : d}/${m < 9 ? `0${m + 1}` : m + 1}/${y}`;
                    if (dayjs(n_date, 'DD/MM/YYYY', true).isValid()) {
                        dates.add(n_date)
                    }
                }
            }
        }
    })
    return dates;
}

export function formatDate(date: Date) {
    const formatter = new Intl.DateTimeFormat('es', {
        timeZone: 'UTC',
        timeZoneName: 'short',
        month: 'short',
        day: '2-digit',
    })
    return formatter.format(date);
}

export function calculateIntervalos(duracion_minutos: number, inicio_tiempo: string, fin_tiempo: string, pausa?: {inicio_tiempo: string, fin_tiempo: string}) {
    let intervalos = 0;
    if (duracion_minutos > 0) {
        const inicio = inicio_tiempo.split(':');
        const fin = fin_tiempo.split(':');
        const i_descanso = (pausa) ? pausa.inicio_tiempo.split(':') : ['00', '00'];
        const f_descanso = (pausa) ? pausa.fin_tiempo.split(':') : ['00', '00'];
        const hora_inicio = inicio[0];
        const minutos_inicio = inicio[1];
        const hora_fin = fin[0];
        const minutos_fin = fin[1];
        const hora_descanso_inicio = i_descanso[0];
        const minutos_descanso_inicio = i_descanso[1];
        const hora_descanso_fin = f_descanso[0];
        const minutos_descanso_fin = f_descanso[1];
        let diff = 0;
        if (hora_fin && minutos_fin && hora_inicio && minutos_inicio && hora_descanso_inicio && minutos_descanso_inicio && hora_descanso_fin && minutos_descanso_fin) {
            const hora_inicio_con_minutos = (parseInt(hora_inicio) * 60) + parseFloat(minutos_inicio);
            const hora_fin_con_minutos = (parseInt(hora_fin) * 60) + parseFloat(minutos_fin);
            if (pausa) {
                const hora_incio_descanso_con_minutos = (parseInt(hora_descanso_inicio) * 60) + parseFloat(minutos_descanso_inicio);
                const hora_fin_descanso_con_minutos = (parseInt(hora_descanso_fin) * 60) + parseFloat(minutos_descanso_fin); 
                if (hora_fin_descanso_con_minutos < hora_incio_descanso_con_minutos) {
                    return 0;
                }
                const diff_primera_mitad = hora_incio_descanso_con_minutos - hora_inicio_con_minutos;
                const diff_segunda_mitad = hora_fin_con_minutos - hora_fin_descanso_con_minutos;
                diff = diff_primera_mitad + diff_segunda_mitad;
                
            } else {
                diff = hora_fin_con_minutos - hora_inicio_con_minutos;
            }
            if (diff >= duracion_minutos) {
                return Math.floor(diff / duracion_minutos);
            }
        }
    }
}

export function generateIntervalos(duracion_minutos: number, inicio_tiempo: string, fin_tiempo: string, pausa?: {inicio_tiempo: string, fin_tiempo: string}) {
    const intervalos: {inicio: string, fin: string, tipo: 'intervalo' | 'descanso'}[] = [];
    const inicio = inicio_tiempo.split(':');
    const fin = fin_tiempo.split(':');
    const i_descanso = (pausa) ? pausa.inicio_tiempo.split(':') : ['00', '00'];
    const f_descanso = (pausa) ? pausa.fin_tiempo.split(':') : ['00', '00'];
    const hora_inicio = inicio[0];
    const minutos_inicio = inicio[1];
    const hora_fin = fin[0];
    const minutos_fin = fin[1];
    const hora_descanso_inicio = i_descanso[0];
    const minutos_descanso_inicio = i_descanso[1];
    const hora_descanso_fin = f_descanso[0];
    const minutos_descanso_fin = f_descanso[1];
    if (!pausa) {
        if (hora_inicio && minutos_inicio && hora_fin && minutos_fin) {
            const inicio_for = (parseInt(hora_inicio) * 60) + parseInt(minutos_inicio);
            const fin_for = (parseInt(hora_fin) * 60) + parseInt(minutos_fin);
            for(let x = inicio_for; x < fin_for; x += duracion_minutos) {
                intervalos.push({inicio: `${Math.floor(x / 60)}:${Math.floor(x % 60)}`, fin: `${Math.floor((x + duracion_minutos) / 60)}:${Math.floor((x + duracion_minutos) % 60)}`, tipo: 'intervalo'});
            }
        }
    } else {
        if (hora_inicio && minutos_inicio && hora_descanso_inicio && minutos_descanso_inicio) {
            const inicio_for = (parseInt(hora_inicio) * 60) + parseInt(minutos_inicio);
            const fin_for = (parseInt(hora_descanso_inicio) * 60) + parseInt(minutos_descanso_inicio);
            for(let x = inicio_for; x < fin_for; x += duracion_minutos) {
                intervalos.push({inicio: `${Math.floor(x / 60)}:${Math.floor(x % 60)}`, fin: `${Math.floor((x + duracion_minutos) / 60)}:${Math.floor((x + duracion_minutos) % 60)}`, tipo: 'intervalo'});
            }
        }
        intervalos.push({inicio: pausa.inicio_tiempo, fin: pausa.fin_tiempo, tipo: 'descanso'});
        if (hora_descanso_fin && minutos_descanso_fin && hora_fin && minutos_fin) {
            const inicio_for = (parseInt(hora_descanso_fin) * 60) + parseInt(minutos_descanso_fin);
            const fin_for = (parseInt(hora_fin) * 60) + parseInt(minutos_fin);
            for(let x = inicio_for; x < fin_for; x += duracion_minutos) {
                if (x + duracion_minutos < fin_for) {
                    intervalos.push({inicio: `${Math.floor(x / 60)}:${Math.floor(x % 60)}`, fin: `${Math.floor((x + duracion_minutos) / 60)}:${Math.floor((x + duracion_minutos) % 60)}`, tipo: 'intervalo'});
                }
            }
        }
    }
    return intervalos;
}