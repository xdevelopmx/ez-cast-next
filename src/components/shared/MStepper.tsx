import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
  useContext,
} from "react";
import { motion } from "framer-motion";
import MotionDiv from "../layout/MotionDiv";
import { Step, StepLabel, Stepper, type SxProps } from "@mui/material";
import { MContainer } from "../layout/MContainer";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface Props {
  onStepChange: (step: number) => void;
  current_step: number;
  step_titles: { [step: number]: string | undefined };
  onStepSave?: (step: number) => void;
  disabled?: boolean;
  children: JSX.Element[];
  style?: CSSProperties;
  onFinish?: () => void;

  tooltips?: { [step: number]: ReactNode };

  stylesStepper?: SxProps;
  stylesStep?: SxProps;
  stylesStepLabel?: SxProps;
  styleH3Paso?: CSSProperties;
  styleSpanH3PasoTitulo?: CSSProperties;
}

export const MStepper: FC<Props> = ({
  onStepSave,
  onStepChange,
  disabled,
  current_step,
  step_titles,
  children,
  onFinish,
  tooltips,
  stylesStepper,
  styleH3Paso,
  stylesStep,
  stylesStepLabel,
  styleSpanH3PasoTitulo,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const animation_time_ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    if (animation_time_ref.current) {
      clearTimeout(animation_time_ref.current);
    }
    animation_time_ref.current = setTimeout(() => {
      setShowContent(true);
    }, 200);
    setShowContent(false);
  }, [current_step]);
  return (
    <MotionDiv show={showContent} animation={"fade"}>
      <>
        <Stepper
          sx={stylesStepper}
          activeStep={current_step - 1}
          alternativeLabel
        >
          {children.map((_, i) => (
            <Step sx={stylesStep} key={`step${i}`}>
              <StepLabel
                sx={stylesStepLabel}
                onClick={() => {
                  if (!disabled) {
                    onStepChange(i + 1);
                  }
                }}
              ></StepLabel>
            </Step>
          ))}
        </Stepper>
        <h3 className="paso-stepper" style={styleH3Paso}>
          <span>
            {textos["paso"] ? textos["paso"] : "Texto No Definido"} {current_step}{" "}
            <span style={styleSpanH3PasoTitulo}>
              {" "}
              {step_titles[current_step]}
            </span>
          </span>
          {tooltips && tooltips[current_step]}
        </h3>

        {children[current_step - 1]}

        <div className="botones ">
          <MContainer
            styles={{ width: "100%" }}
            direction="horizontal"
            justify="space-between"
          >
            <>
              {children.length > 0 && current_step > 1 && (
                <button
                  className="boton-next-step margen"
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onStepChange(current_step - 1);
                  }}
                >
                  <motion.img src="/assets/img/iconos/arow_l_blue.svg" />{" "}
                  {textos["regresar_paso"]
                    ? textos["regresar_paso"]
                    : "Texto No Definido"}
                </button>
              )}
              {children.length > 0 && current_step === 1 && <div />}

              {onStepSave &&
                children.length > 0 &&
                current_step < children.length && (
                  <button
                    className={`${
                      current_step === 1 ? "ml-65" : ""
                    } boton-next-step margen`}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onStepSave(current_step);
                    }}
                  >
                    {textos["guardar_y_terminar_mas_tarde"]
                      ? textos["guardar_y_terminar_mas_tarde"]
                      : "Texto No Definido"}
                  </button>
                )}

              {children.length > 0 && current_step < children.length && (
                <button
                  className="boton-next-step margen"
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onStepChange(current_step + 1);
                  }}
                >
                  {textos["paso_siguiente"]
                    ? textos["paso_siguiente"]
                    : "Texto No Definido"}{" "}
                  <motion.img src="/assets/img/iconos/arow_r_blue.svg" />
                </button>
              )}
              {onFinish &&
                children.length > 0 &&
                current_step === children.length && (
                  <button
                    className="boton-next-step margen"
                    type="button"
                    onClick={() => {
                      onFinish();
                    }}
                  >
                    {textos["finalizar"]
                      ? textos["finalizar"]
                      : "Texto No Definido"}{" "}
                    <motion.img src="/assets/img/iconos/arow_r_blue.svg" />
                  </button>
                )}
            </>
          </MContainer>
        </div>
      </>
    </MotionDiv>
  );
};
