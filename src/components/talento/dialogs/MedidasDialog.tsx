import { Check, Close } from "@mui/icons-material";
import { Dialog, DialogContent, Typography, ButtonGroup, Button, DialogActions, Grid } from "@mui/material"
import { useState, useRef, useEffect } from "react";
import MotionDiv from "~/components/layout/MotionDiv"
import { MSelect } from "~/components/shared";
import useNotify from "~/hooks/useNotify";
import { api, parseErrorBody } from "~/utils/api";

const general_caderas_51_178 = Array.from({length: 128}).map((r, i) => 50 + (i + 1));
const general_entrepiernas_65_93 = Array.from({length: 29}).map((r, i) => 64 + (i + 1));
const general_guantes_15_30 = Array.from({length: 16}).map((r, i) => 14 + (i + 1));
const hombre_pecho_60_160 = Array.from({length: 101}).map((r, i) => 59 + (i + 1));
const hombre_cuello_36_76 = Array.from({length: 41}).map((r, i) => 35 + (i + 1));
const hombre_mangas_38_102 = Array.from({length: 65}).map((r, i) => 37 + (i + 1));
const hombre_saco = ['Chico','Mediano','Grande','Extra Grande'];
const hombre_playera = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL'];
const calzado_21_32 = Array.from({length: 23}).map((r, i) => 21 + (i*0.5));
const mujer_vestido_28_70 = Array.from({length: 43}).map((r, i) => 27 + (i + 1));
const mujer_busto_48_168 = Array.from({length: 121}).map((r, i) => 47 + (i + 1));
const mujer_copas =['A', 'B', 'C', 'D', 'DD', 'DDD', 'DDDD/E', 'F', 'FF', 'G', 'GG', 'H', 'HH', 'I', 'J', 'K', 'KK', 'L'];
const mujer_caderas_38_178 = Array.from({length: 141}).map((r, i) => 37 + (i + 1));
const mujer_playera = ['XXS','XS','S','M','L','XL','XXL','3XL','4XL','5XL','6XL','7XL','8XL'];
const mujer_pants_28_70 = Array.from({length: 43}).map((r, i) => 27 + (i + 1));
const bebes_meses = ['0-3','3-6','6-9','12','18','24'];
const calzado_ninos = ['7k (8.1cm)', '8k (9.0cm)', '9k (9.8cm)', '10k (10.6cm)', '10.5k (11.5cm)', '11k (12.3cm)', '12 (12.8cm)', '12.5 (13.2cm)', '13 (13.6cm)',
	'13.5 (14.0cm)', '14 (14.5cm)', '14.5 (14.9cm)', '15 (15.3cm)', '15.5 (15.7cm)', '16 (16.1cm)'];

export const MedidasDialog = (props: { id_talento: number, opened: boolean, onClose: (changed: boolean) => void }) => {
	const change_content_time_ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [option_selected, setOptionSelected] = useState<{current: 'GENERALES' | 'HOMBRE' | 'MUJER' | 'NINO/NINA' | '', updated: 'GENERALES' | 'HOMBRE' | 'MUJER' | 'NINO/NINA'}>({current: 'GENERALES', updated: 'GENERALES'});
	
	const medidas = api.talentos.getMedidasByIdTalento.useQuery(props.id_talento, {
        refetchOnWindowFocus: false,
    });

	const {notify} = useNotify();

	const save_medidas = api.talentos.saveMedidas.useMutation({
		onSuccess: (input) => {
			notify('success', 'Se actualizaron las medidas con exito');
			props.onClose(true);
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}	
	})

	const [form, setForm] = useState<{
		general_cadera: number | null,
		general_entrepiernas: number | null,
		general_guantes: number | null ,
		general_sombrero: number | null,
		hombre_pecho: number | null,
		hombre_cuello: number | null,
		hombre_mangas: number | null,
		hombre_saco: string | null,
		hombre_playera: string | null,
		hombre_calzado: number | null,
		mujer_vestido: number | null,
		mujer_busto: number | null,
		mujer_copa: string | null,
		mujer_cadera: number | null,
		mujer_playera: string | null,
		mujer_pants: number | null,
		mujer_calzado: number | null,
		nino_4_18_anios: string | null,
		nina_4_18_anios: string | null,
		toddler: string | null,
		bebe_meses: string | null,
		calzado_ninos: string | null
	}>();

	useEffect(() => {
		if (medidas.data) {
			setForm({
				general_cadera: (medidas.data.general_cadera) ? medidas.data.general_cadera : 0,
				general_entrepiernas: (medidas.data.general_entrepiernas) ? medidas.data.general_entrepiernas : 0,
				general_guantes: (medidas.data.general_guantes) ? medidas.data.general_guantes : 0,
				general_sombrero: (medidas.data.general_sombrero) ? medidas.data.general_sombrero : 0,
				hombre_pecho: (medidas.data.hombre_pecho) ? medidas.data.hombre_pecho : 0,
				hombre_cuello: (medidas.data.hombre_cuello) ? medidas.data.hombre_cuello : 0,
				hombre_mangas: (medidas.data.hombre_mangas) ? medidas.data.hombre_mangas : 0,
				hombre_saco: (medidas.data.hombre_saco) ? medidas.data.hombre_saco : ' ',
				hombre_playera: (medidas.data.hombre_playera) ? medidas.data.hombre_playera : ' ',
				hombre_calzado: (medidas.data.hombre_calzado) ? medidas.data.hombre_calzado : 0,
				mujer_vestido: (medidas.data.mujer_vestido) ? medidas.data.mujer_vestido : 0,
				mujer_busto: (medidas.data.mujer_busto) ? medidas.data.mujer_busto : 0,
				mujer_copa: (medidas.data.mujer_copa) ? medidas.data.mujer_copa : ' ',
				mujer_cadera: (medidas.data.mujer_cadera) ? medidas.data.mujer_cadera : 0,
				mujer_playera: (medidas.data.mujer_playera) ? medidas.data.mujer_playera : ' ',
				mujer_pants: (medidas.data.mujer_pants) ? medidas.data.mujer_pants : 0,
				mujer_calzado: (medidas.data.mujer_calzado) ? medidas.data.mujer_calzado : 0,
				nino_4_18_anios: (medidas.data.nino_4_18_anios) ? medidas.data.nino_4_18_anios : ' ',
				nina_4_18_anios: (medidas.data.nina_4_18_anios) ? medidas.data.nina_4_18_anios : ' ',
				toddler: (medidas.data.toddler) ? medidas.data.toddler : ' ',
				bebe_meses: (medidas.data.bebe_meses) ? medidas.data.bebe_meses : ' ',
				calzado_ninos: (medidas.data.calzado_ninos) ? medidas.data.calzado_ninos : ' '
			})
		}
	}, [medidas.data]);

	useEffect(() => {
        if (!change_content_time_ref.current) {
            change_content_time_ref.current = setTimeout(() => {
                setOptionSelected(prev => { return {...prev, current: prev.updated}});
             }, 200);
        }
        return (() => {
            if (change_content_time_ref.current) {
                clearTimeout(change_content_time_ref.current);
                change_content_time_ref.current = null;
            }
        })
	}, [option_selected.updated]);

	return (
		<Dialog fullWidth maxWidth={'md'} onClose={() => { props.onClose(false)}} open={props.opened}>
			<DialogContent sx={{ height: 700, overflow: 'hidden' }} >
				<Grid container sx={{ mt: 0, pl: 4 }}>
					<Grid item xs={12} mt={4}>
						<Typography variant="h6">
							Medidas Vestuario
						</Typography>
						<Typography variant="subtitle2">
							Elige la categoría que aplique para ti.
						</Typography>
						<ButtonGroup sx={{ mt: 2, mb: 4 }} variant="contained" aria-label="outlined primary button group">
							<Button
								onClick={() => { setOptionSelected({current:'', updated: 'GENERALES'}) }}
								variant={option_selected.current === 'GENERALES' ? 'contained' : 'outlined'}
							>
								Generales
							</Button>
							<Button
								onClick={() => { setOptionSelected({current:'', updated: 'HOMBRE'}) }}
								variant={option_selected.current === 'HOMBRE' ? 'contained' : 'outlined'}
							>
								Hombre
							</Button>
							<Button
								onClick={() => { setOptionSelected({current:'', updated: 'MUJER'}) }}
								variant={option_selected.current === 'MUJER' ? 'contained' : 'outlined'}
							>
								Mujer
							</Button>
							<Button
								onClick={() => { setOptionSelected({current:'', updated: 'NINO/NINA'}) }}
								variant={option_selected.current === 'NINO/NINA' ? 'contained' : 'outlined'}
							>
								Niño/Niña
							</Button>
						</ButtonGroup>
					</Grid>
					
					<Grid item xs={12}>
						<MotionDiv show={option_selected.current === 'GENERALES'} animation="fade">
							<Grid container sx={{ mt: 0, pl: 4 }}>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Cadera (cm)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='general-cadera'
										options={general_caderas_51_178.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, general_cadera: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.general_cadera) ? form.general_cadera.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Entrepierna (cm)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='general-entrepierna'
										options={general_entrepiernas_65_93.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, general_entrepiernas: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.general_entrepiernas) ? form.general_entrepiernas.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Guantes'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='general-guantes'
										options={general_guantes_15_30.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, general_guantes: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.general_guantes) ? form.general_guantes.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Sombrero'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='general-sombrero'
										options={general_guantes_15_30.map((d) => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, general_sombrero: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.general_sombrero) ? form.general_sombrero.toString() : '0'} 
									/>
								</Grid>

							</Grid>
						</MotionDiv>
						<MotionDiv show={option_selected.current === 'HOMBRE'} animation="fade">
							<Grid container sx={{ mt: 0, pl: 4 }}>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Pecho (cm)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='hombre-pecho'
										options={hombre_pecho_60_160.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, hombre_pecho: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.hombre_pecho) ? form.hombre_pecho.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Cuello (cm)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='hombre-cuello'
										options={hombre_cuello_36_76.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, hombre_cuello: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.hombre_cuello) ? form.hombre_cuello.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Mangas (largo cm)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='hombre-mangas'
										options={hombre_mangas_38_102.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, hombre_mangas: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.hombre_mangas) ? form.hombre_mangas.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Saco'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='hombre-saco'
										options={hombre_saco.map(d => { return { value: d, label: d }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, hombre_saco: e.target.value})
											}
										}}
										value={(form && form.hombre_saco) ? form.hombre_saco : ' '} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Playera'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='hombre-playera'
										options={hombre_playera.map(d => { return { value: d, label: d }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, hombre_playera: (e.target.value !== ' ') ? e.target.value : null})
											}
										}}
										value={(form && form.hombre_playera) ? form.hombre_playera : ' '} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Calzado (cm)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='hombre-calzado'
										options={calzado_21_32.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, hombre_calzado: (e.target.value !== '0') ? parseFloat(e.target.value) : null})					
											}
										}}
										value={(form && form.hombre_calzado) ? form.hombre_calzado.toString() : '0'} 
									/>
								</Grid>

							</Grid>
						</MotionDiv>
						<MotionDiv show={option_selected.current === 'MUJER'} animation="fade">
							<Grid container sx={{ mt: 0, pl: 4 }}>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Vestido'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='mujer-vestido'
										options={mujer_vestido_28_70.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, mujer_vestido: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.mujer_vestido) ? form.mujer_vestido.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Busto (cm)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='mujer-busto'
										options={mujer_busto_48_168.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, mujer_busto: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.mujer_busto) ? form.mujer_busto.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Copa'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='mujer-copa'
										options={mujer_copas.map(d => { return { value: d, label: d }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, mujer_copa: (e.target.value !== ' ') ? e.target.value : null})
											}
										}}
										value={(form && form.mujer_copa) ? form.mujer_copa : ' '} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Cadera'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='mujer-cadera'
										options={mujer_caderas_38_178.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, mujer_cadera: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.mujer_cadera) ? form.mujer_cadera.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Playera'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='mujer-playera'
										options={mujer_playera.map(d => { return { value: d, label: d }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, mujer_playera: (e.target.value !== ' ') ? e.target.value : ' ' })
											}
										}}
										value={(form && form.mujer_playera) ? form.mujer_playera : ' '} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Pants (cm)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='mujer-pants'
										options={mujer_pants_28_70.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, mujer_pants: (e.target.value !== '0') ? parseInt(e.target.value) : null})
											}
										}}
										value={(form && form.mujer_pants) ? form.mujer_pants.toString() : '0'} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Calzado (cm)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='mujer-calzado'
										options={calzado_21_32.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, mujer_calzado: (e.target.value !== '0') ? parseFloat(e.target.value) : null})
											}
										}}
										value={(form && form.mujer_calzado) ? form.mujer_calzado.toString() : '0'} 
									/>
								</Grid>
							</Grid>
						</MotionDiv>
						<MotionDiv show={option_selected.current === 'NINO/NINA'} animation="fade">
							<Grid container sx={{ mt: 0, pl: 4 }}>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Niño 4-18 años'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='nino-4-18'
										options={calzado_ninos.map(d => { return { value: d, label: d }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, nino_4_18_anios: (e.target.value !== ' ') ? e.target.value : null});
											}
										}}
										value={(form && form.nino_4_18_anios) ? form.nino_4_18_anios : ' '} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Niña 4-18 años'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='nina-4-18'
										options={calzado_ninos.map(d => { return { value: d, label: d }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, nina_4_18_anios: (e.target.value !== ' ') ? e.target.value : null});
											}
										}}
										value={(form && form.nina_4_18_anios) ? form.nina_4_18_anios : ' ' } 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Toddler (bebé)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='nino-toddler'
										options={calzado_ninos.map(d => { return { value: d, label: d }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, toddler: (e.target.value !== ' ') ? e.target.value : null});
											}
										}}
										value={(form && form.toddler) ? form.toddler : ' '} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Bebé (meses)'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='nino-bebe'
										options={bebes_meses.map(d => { return { value: d.toString(), label: d.toString() }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, bebe_meses: (e.target.value !== ' ') ? e.target.value : null});
											}
										}}
										value={(form && form.bebe_meses) ? form.bebe_meses : ' '} 
									/>
								</Grid>
								<Grid item xs={4} mt={4}>
									<Typography fontSize={'1.3rem'} fontWeight={400} variant="subtitle1">{'Calzado Niños'}</Typography>
								</Grid>
								<Grid item xs={8} mt={4}>
									<MSelect
										id='nino-calzado'
										options={calzado_ninos.map(d => { return { value: d, label: d }})}
										style={{ width: 150 }}
										onChange={(e) => { 
											if (form) {
												setForm({...form, calzado_ninos: (e.target.value !== ' ') ? e.target.value : null});
											}
										}}
										value={(form && form.calzado_ninos) ? form.calzado_ninos : ' '} 
									/>
								</Grid>
							</Grid>
						</MotionDiv>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions sx={{justifyContent: 'center'}}>
				<Button style={{ textDecoration: 'underline', fontWeight: 800}} onClick={() => { props.onClose(false) }} variant='text' startIcon={<Close />}>
					Cancelar
				</Button>
				<Button style={{ textDecoration: 'underline', fontWeight: 800}} onClick={() => { save_medidas.mutate((form) ? form : {}) }} variant='text' startIcon={<Check />}>
					Guardar
				</Button>
			</DialogActions>

		</Dialog>
	)

}
