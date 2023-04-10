export const conversorFecha = (fecha: Date) => {
    const f_mx = `${fecha?.toLocaleDateString('es-mx')}`;
    const f_split = f_mx?.split('/') || ['00', '00', '00'];
    const f_convertida = `${(f_split[2]) ? f_split[2] : ''}-${(f_split[1]) ? (f_split[1].length < 2) ? `0${f_split[1]}` : f_split[1] : ''}-${(f_split[0]) ? (f_split[0].length < 2) ? `0${f_split[0]}` : f_split[0] : ''}`;
    return f_convertida;
}