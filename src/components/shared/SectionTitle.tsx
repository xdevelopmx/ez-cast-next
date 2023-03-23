import { Divider, Typography } from '@mui/material';
import { type FC } from 'react'
import { MContainer } from '../layout/MContainer'


interface Props {
    title: string;
    onClickButton?: (...args: unknown[]) => unknown;
    textButton?: string;
}

export const SectionTitle: FC<Props> = ({ title, textButton = 'Editar', onClickButton }) => {
    return (
        <>
            <MContainer direction='horizontal' justify='space-between'>
                <Typography fontWeight={600}>{title}</Typography>

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
