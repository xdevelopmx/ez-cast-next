import React, { useState } from 'react'

import { motion } from 'framer-motion'
import MotionDiv from '../layout/MotionDiv'
import { Box } from '@mui/material';
import { ConversacionesPreview } from '../shared/ConversacionesPreview';
import { CalendarPreview } from '../shared/CalendarPreview';

export const Flotantes = () => {
    const [show_conversaciones, setShowConversaciones] = useState(false);
    const [show_calendar, setShowCalendar] = useState(false);
    return (
        <Box position={'relative'}>
            <div className="fixed_items">
                <div className="container_chat_blue mb-3">
                    <div className="image_chat" onClick={() => { setShowConversaciones(prev => !prev) }}>
                        <span className="count_msn active">3</span>
                        <motion.img src="/assets/img/iconos/ico_chat_blue.svg" width={55} height={55} alt="icon" />
                    </div>
                    <MotionDiv show={show_conversaciones} style={{position: 'absolute', right: 76, bottom: 0}} animation={'down-to-up'}>
                        <ConversacionesPreview 
                            width={'500px'}
                            onClose={() => setShowConversaciones(false)} 
                        />
                    </MotionDiv>
                    <div className="container_calendar_blue" style={{ marginTop: 10 }}>
                        <div className="image_calendar" onClick={() => { setShowCalendar(prev => !prev) }}>
                            <motion.img src="/assets/img/iconos/ico_calendar_blue.svg" width={55} height={55} alt="icon" />
                        </div>
                        <MotionDiv show={show_calendar} style={{position: 'absolute', right: 76, bottom: 0}} animation={'down-to-up'}>
                            <CalendarPreview 
                                width={500}
                                onClose={() => setShowCalendar(false)}
                            />
                        </MotionDiv>
                    </div>
                </div>
            </div>

        </Box>
    )
}
