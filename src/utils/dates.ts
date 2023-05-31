
export function expandDates(fechas: {fecha_inicio: Date, fecha_fin: Date | null}[]) {
    const dates = new Set<string>();
    fechas.forEach(date => {
        console.log('date', date);
        const start_day = date.fecha_inicio.getDate() + 1;
        console.log('start', start_day);
        const end_day = ((date.fecha_fin) ? date.fecha_fin.getDate() : date.fecha_inicio.getDate()) + 1;
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
                    console.log(`${d < 10 ? `0${d}` : d}/${m < 9 ? `0${m + 1}` : m + 1}/${y}`)
                    dates.add(`${d < 10 ? `0${d}` : d}/${m < 9 ? `0${m + 1}` : m + 1}/${y}`)
                }
            }
        }
    })
    console.log(dates);
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