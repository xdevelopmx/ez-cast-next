import styled from "@emotion/styled";
import { TableCell, tableCellClasses, TableRow, TableContainer, Paper, Table, TableHead, TableBody, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { type CSSProperties, type FC } from "react";
import MotionDiv from "~/components/layout/MotionDiv";
import classes from './MTable.module.css';

type MRow = { [key: string]: number | string | boolean | JSX.Element };


interface MTableProps {
	data: MRow[],
	style?: CSSProperties;
	columnsHeader?: JSX.Element[],
	headerStyles?: CSSProperties,
	headerClassName?: string,
	backgroundColorHeader?: string,
	backgroundColorData?: string,
}



export const MTable: FC<MTableProps> = ({
	data, columnsHeader, headerClassName, headerStyles, backgroundColorData = 'lightgrey',
	backgroundColorHeader = '#4ab7c6', style = {}
}) => {
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
									columnsHeader.map((c, i) => <TableCell align="center" key={i}>{c}</TableCell>)
								}
							</TableRow>
						</TableHead>
					}

					<TableBody>
						{data.length > 0 && data.map((row, i) => {
							const row_values = Object.entries(row);
							return (
								<motion.tr
									style={{ backgroundColor: (i % 2) ? backgroundColorData : 'white' }}
									key={i}
									layout
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
							)
						})}
						{data.length === 0 &&
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
			</TableContainer>
		</AnimatePresence>
	)
}