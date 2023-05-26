import React from 'react'

import { motion } from 'framer-motion'

export const Flotantes = () => {
    return (
        <>
            <div className="fixed_items">
                <div className="container_chat_blue mb-3">
                    <div className="image_chat">
                        <span className="count_msn active">3</span>
                        <motion.img src="/assets/img/iconos/ico_chat_blue.svg" width={55} height={55} alt="icon" />
                    </div>
                    <div className="container_calendar_blue" style={{ marginTop: 10 }}>
                        <div className="image_calendar">
                            <motion.img src="/assets/img/iconos/ico_calendar_blue.svg" width={55} height={55} alt="icon" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
