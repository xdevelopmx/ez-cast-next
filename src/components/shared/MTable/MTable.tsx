import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { TableCell, tableCellClasses, TableRow, TableContainer, Paper, Table, TableHead, TableBody, Typography, TablePagination, createTheme, Skeleton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, type CSSProperties, type FC } from "react";
import MotionDiv from "~/components/layout/MotionDiv";
import classes from './MTable.module.css';

type MRow = { [key: string]: number | string | boolean | JSX.Element };


interface MTableProps {
	data: MRow[],
	loading?: boolean,
	style?: CSSProperties;
	columnsHeader?: JSX.Element[],
	headerStyles?: CSSProperties,
	headerClassName?: string,
	backgroundColorHeader?: string,
	backgroundColorData?: string,
	disable_animation?: boolean
}



export const MTable: FC<MTableProps> = ({
	disable_animation, loading, data, columnsHeader, headerClassName, headerStyles, backgroundColorData = '#ededed ',
	backgroundColorHeader = '#4ab7c6', style = {}
}) => {
	const [pagination, setPagination] = useState<{page: number, page_size: number}>({page: 0, page_size: 5});

	const _data = useMemo(() => {
		if (loading && columnsHeader) {
			return Array.from({ length: 5 }).map((n, i) => { 
				return columnsHeader.map((c, j) => {
					return <Skeleton key={j} className="my-2 p-3" variant="rectangular"  height={32} />
				})
			})
		} else {
			return data;
		}
	}, [data, loading]);

	const paginated_data = useMemo(() => {
		const start = (pagination.page * pagination.page_size);
		const end = (pagination.page * pagination.page_size) + pagination.page_size;
		const sliced_data = _data.slice(start, end);
		if (sliced_data.length === 0 && pagination.page > 0) {
			setPagination(v => { return { ...v, page: v.page - 1 }});
		}
		return sliced_data;
	}, [pagination, _data]);
	console.log('paginated', paginated_data);
	return (
		<AnimatePresence>
			<TableContainer component={Paper} style={{ ...style, overflowY: 'hidden' }}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					{
						columnsHeader &&
						<TableHead
							className={classes[(headerClassName) ? headerClassName : '']}
							style={{ ...headerStyles, backgroundColor: backgroundColorHeader }}
						>
							<TableRow>
								{columnsHeader &&
									columnsHeader.map((c, i) => <TableCell align="center" sx={{ color: '#fff' }} key={i}>{c}</TableCell>)
								}
							</TableRow>
						</TableHead>
					}

					<TableBody>
						
						{_data.length > 0 && paginated_data.map((row, i) => {
							
							const row_values = Object.entries(row);
							return (
								<>
								
									{!disable_animation &&
									
										<motion.tr
											style={{ backgroundColor: (i % 2) ? backgroundColorData : 'white' }}
											key={i}
											layout={true}
											initial={{ opacity: 0, y: 100 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 15 }}
											transition={{ opacity: 0.2, y: 0.3 }}
										>
											<>
												{row_values.map((val, i) => {
													if (i === 0) {
														return (
															<TableCell
																style={{padding: 8}}
																key={i}
																align='center'
																component="th"
																scope="row"
															>
																{val[1]}
															</TableCell>
														)
													}
													return <TableCell key={i} align='center'>{val[1]}</TableCell>
												})}
											</>
										</motion.tr>
									}
									{disable_animation &&
										<TableRow>
											{row_values.map((val, i) => {
												if (i === 0) {
													return (
														<TableCell
															style={{padding: 8}}
															key={i}
															align='center'
															component="th"
															scope="row"
														>
															{val[1]}
														</TableCell>
													)
												}
												return <TableCell key={i} align='center'>{val[1]}</TableCell>
											})}
										</TableRow>
									}
								</>
							)
						})}
						{_data.length === 0 &&
							<TableRow>
								<TableCell align='center' component="th" scope="row">
									<Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
										No hay registros
									</Typography>

								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
				<MotionDiv show={_data.length > 5} animation={'fade'}>
					<TablePagination
						labelRowsPerPage={'Registros por pagina'}
						component="div"
						count={_data.length}
						page={pagination.page}
						rowsPerPageOptions={[1, 3, 5, 10, 15, 20]}
						onPageChange={(e, page) => { setPagination({...pagination, page: page})}}
						rowsPerPage={pagination.page_size}
						onRowsPerPageChange={(e) => { setPagination({...pagination, page_size: parseInt(e.target.value)})}}
					/>
				</MotionDiv>
			</TableContainer>
		</AnimatePresence>
	)
}