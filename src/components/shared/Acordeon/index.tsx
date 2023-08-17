import { motion } from "framer-motion"
import type { PropsWithChildren } from "react";
import useMeasure from 'react-use-measure'

type PropsAcordeon = {
    show: boolean;
}

export const Acordeon = ({show, children}:PropsWithChildren<PropsAcordeon>) => {

    const [ref, { height }] = useMeasure();

  return (
    <div>
        <motion.div
            initial={false}
            style={{
                overflow: "hidden",
            }}
            animate={{
                height: show ? height : 0,
            }}
        >
            <div ref={ref}>{show && children}</div>
        </motion.div>
    </div>
  )
}
