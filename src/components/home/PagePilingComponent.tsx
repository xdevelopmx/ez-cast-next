import {
  useState,
  Children,
  useEffect,
  useRef,
  type FC,
  type ReactNode,
  type SetStateAction,
  type Dispatch,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  children: ReactNode;
  onCambiarPagina?: (pagina: number) => void;

  pagina: number;
  setPagina: Dispatch<SetStateAction<number>>;
}

const duration = 0.6;

const variants = {
  inicial: ({
    direccion,
    duration,
  }: {
    direccion: "incrementando" | "decrementando";
    duration: number;
  }) => ({
    y: direccion === "incrementando" ? 0 : -1024,
    transition: {
      duration,
    },
  }),
  entrada: ({ duration }: { duration: number }) => ({
    y: 0,
    transition: {
      duration,
    },
  }),
  salida: ({
    direccion,
    duration,
  }: {
    direccion: "incrementando" | "decrementando";
    duration: number;
  }) => ({
    y: direccion === "incrementando" ? -1024 : 0,
    zIndex: direccion === "incrementando" ? 100 : 0,
    transition: {
      duration,
    },
  }),
};


export const PagePilingComponent: FC<Props> = ({
  children,
  onCambiarPagina,

  pagina,
  setPagina,
}) => {
  const [direccion, setDireccion] = useState("");
  const animando = useRef(false);
  const hijos = Children.map(children, (child) => child);
  const [cambioRealizado, setCambioRealizado] = useState(false);
  const scroll_timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const detectarRueda = (e: WheelEvent) => {
    const { deltaY } = e;
    console.log(deltaY);
    if (scroll_timeout.current) {
      clearTimeout(scroll_timeout.current);
    }
    scroll_timeout.current = setTimeout(() => {
      if (!cambioRealizado && !animando.current) {
        animando.current = true;
        setPagina((pagina) => {
          let nuevaPagina = pagina;
          if (deltaY > 0) {
            nuevaPagina = pagina + 1;
          } else {
            nuevaPagina = pagina - 1;
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          nuevaPagina = Math.max(0, Math.min(hijos!.length - 1, nuevaPagina));
          if (nuevaPagina === pagina) {
            animando.current = false;
            return pagina;
          } else {
            setDireccion(deltaY > 0 ? "incrementando" : "decrementando");
            setCambioRealizado(true); // Marcar el cambio como realizado
            return nuevaPagina;
          }
        });
      }
    }, 200);
  };

  // Reiniciar cambioRealizado a su estado inicial cuando finalice el evento de scroll
  useEffect(() => {
    const reiniciarCambio = () => {
      setCambioRealizado(false);
    };

    window.addEventListener('wheel', reiniciarCambio);

    return () => {
      window.removeEventListener('wheel', reiniciarCambio);
    };
  }, []);


  useEffect(() => {
    document.addEventListener("wheel", detectarRueda);

    return () => {
      document.removeEventListener("wheel", detectarRueda);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onCambiarPagina && onCambiarPagina(pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  return (
    <AnimatePresence
      custom={{
        direccion,
        duration,
      }}
    >
      <motion.div
        key={pagina}
        style={{ position: "relative" }}
        variants={variants}
        custom={{
          direccion,
          duration,
        }}
        onAnimationComplete={(definition) => {
          if (definition === "salida") {
            animando.current = false;
          }
        }}
        initial="inicial"
        animate="entrada"
        exit="salida"
      >
        {hijos && hijos[Math.abs(pagina) % hijos.length]}
      </motion.div>
    </AnimatePresence>
  );
};
