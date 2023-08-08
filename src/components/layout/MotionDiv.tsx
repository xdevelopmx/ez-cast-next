import { AnimatePresence, motion } from "framer-motion";
import { type CSSProperties } from "react";

export default function MotionDiv(props: {
  children: JSX.Element;
  id?: string;
  animation:
    | "down-to-up"
    | "left-to-right"
    | "right-to-left"
    | "fade"
    | "fade-down-to-up";
  style?: CSSProperties;
  show: boolean;
}) {
  let animation: JSX.Element | null = null;
  switch (props.animation) {
    case "down-to-up": {
      animation = (
        <motion.div
          id={props.id}
          style={props.style}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ opacity: 0.2, y: 0.3 }}
        >
          {props.children}
        </motion.div>
      );
      break;
    }
    case "fade": {
      animation = (
        <motion.div
          id={props.id}
          style={props.style}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: 0.2 }}
        >
          {props.children}
        </motion.div>
      );
      break;
    }
    case "fade-down-to-up": {
      animation = (
        <motion.div
          id={props.id}
          style={props.style}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, height: "0%" }}
          transition={{ opacity: 0.2, height: 1 }}
        >
          {props.children}
        </motion.div>
      );
      break;
    }
    case "left-to-right": {
      animation = (
        <motion.div
          id={props.id}
          style={props.style}
          initial={{ opacity: 0, x: -650 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 15 }}
          transition={{ opacity: 0.1, x: 0.1 }}
        >
          {props.children}
        </motion.div>
      );
      break;
    }
    case "right-to-left": {
      animation = (
        <motion.div
          id={props.id}
          style={props.style}
          initial={{ opacity: 0.1, x: 650 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 15 }}
          transition={{ opacity: 0.2 }}
        >
          {props.children}
        </motion.div>
      );
      break;
    }
  }
  return <AnimatePresence>{props.show && animation}</AnimatePresence>;
}
