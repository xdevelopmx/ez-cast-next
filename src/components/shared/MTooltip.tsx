import { Divider, IconButton, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import { type ReactNode, type FC } from 'react'
import { MContainer } from '../layout/MContainer'
import { styled, SxProps, Theme } from '@mui/material/styles';
import { QuestionMark } from '@mui/icons-material';

interface Props {
    color: 'blue' | 'orange' | 'white', 
    text: ReactNode, 
    placement: 'top-start' | 'top' | 'top-end' | 'left-start' | 'left' | 'left-end'| 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end'
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

export const MTooltip: FC<Props> = ({ sx, text, placement, color }) => {
    return (
        <BootstrapTooltip color={color} placement={placement} title={text}>
            <IconButton sx={sx} style={{ marginLeft: 16, border: 'solid', color: '#069cb1', width: 16, height: 16}}>
                <QuestionMark sx={{width: 16, heigth: 16}} />
            </IconButton>
        </BootstrapTooltip>
    )
}



