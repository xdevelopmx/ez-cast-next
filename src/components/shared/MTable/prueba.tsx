/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IconButton } from '@mui/material';
import React from 'react'
import MotionDiv from '~/components/layout/MotionDiv';

type Props = {
    accordionContent: any;
    i: number;
    accordion_content_width: any;
}

export const Prueba = ({ accordionContent, i, accordion_content_width }: Props) => {
    return (
        <MotionDiv show={accordionContent !== null} animation="fade">
            <div style={{ position: 'relative', width: 100 }}>
                <div style={{ position: 'absolute', width: accordion_content_width - 8 }}>
                    {/* <IconButton onClick={() => {
                        setExpandedRows(prev => {
                            if (prev.includes(`panel${i}`)) {
                                return prev.filter(p => p !== `panel${i}`);
                            }
                            return prev.concat([`panel${i}`]);
                        })
                    }} style={{ position: 'absolute', width: 16, top: -8, right: 8 }} color="primary" aria-label="expandir" component="label">
                        {(expanded_rows.includes(`panel${i}`)) ? <DownIcon sx={{ color: '#928F8F' }} /> : <UpIcon sx={{ color: '#928F8F' }} />}
                    </IconButton> */}
                </div>
                {/* // eslint-disable-next-line @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-call*/},
                {accordionContent && accordionContent(i, accordion_content_width - 8)}
            </div>
        </MotionDiv>
    )
}
