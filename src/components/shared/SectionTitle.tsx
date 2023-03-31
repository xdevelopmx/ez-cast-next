import { Divider, SxProps, Typography } from '@mui/material';
import { type FC } from 'react'
import { MContainer } from '../layout/MContainer'


interface Props {
    title: string;
    subtitle?: string;
    onClickButton?: (...args: unknown[]) => unknown;
    textButton?: string;
    titleSx?: SxProps;
    subtitleSx?: SxProps;
}

export const SectionTitle: FC<Props> = ({ title, subtitle, titleSx, subtitleSx, textButton = 'Editar', onClickButton }) => {
    return (
        <>
            <MContainer direction='horizontal' justify='space-between'>
                <MContainer direction='horizontal'>
                    <Typography sx={titleSx} fontWeight={600}>{title}</Typography>
                    <>
                        {subtitle && <Typography sx={subtitleSx} fontWeight={300}>{subtitle}</Typography>}
                    </>
                </MContainer>
                {
                    onClickButton
                        ? (
                            <Typography sx={{ color: '#069CB1', cursor: 'pointer' }} onClick={onClickButton}>
                                {textButton}
                            </Typography>
                        )
                        : <></>
                }
            </MContainer>
            <Divider sx={{ backgroundColor: '#069CB1' }} />


        </>
    )
}
