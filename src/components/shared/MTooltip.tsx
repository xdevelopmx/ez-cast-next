import { Divider, IconButton, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import { type ReactNode, type FC } from 'react'
import { MContainer } from '../layout/MContainer'
import { styled, SxProps, Theme } from '@mui/material/styles';
import { QuestionMark } from '@mui/icons-material';

interface Props {
	color: 'blue' | 'orange' | 'white',
	text: ReactNode,
	icon?: ReactNode,
	onClick?: () => void,
	placement: 'top-start' | 'top' | 'top-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end'
	sx?: SxProps<Theme>
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, color }) => {
	return ({
		[`& .${tooltipClasses.arrow}`]: {
			color: (color === 'blue') ? '#069cb1' : 'orange',
		},
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: (color === 'blue') ? '#069cb1' : 'orange',
			color: (color === 'blue') ? 'white' : 'black',
		},
	})
})

export const MTooltip: FC<Props> = ({ onClick, sx, text, placement, color, icon }) => {
	return (
		<BootstrapTooltip color={color} placement={placement} title={text}>
			<IconButton onClick={onClick} sx={sx} style={icon ? {} : { marginLeft: 16, border: '2px solid #069cb1', color: '#069cb1', width: 16, height: 16 }}>
				{icon ? icon : <QuestionMark sx={{ width: 16, heigth: 16 }} />}
			</IconButton>
		</BootstrapTooltip>
	)
}



