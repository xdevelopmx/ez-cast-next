import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Typography,
} from "@mui/material";
import { useContext, type CSSProperties, type FC } from "react";
import { MContainer } from "../layout/MContainer";
import { MTooltip } from "./MTooltip";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface Props {
  id: string;
  label?: string;
  options: string[];
  onChange?: (e: boolean, i: number) => void;
  values: boolean[];
  style?: CSSProperties;
  labelStyle?: CSSProperties;
  labelClassName?: string;
  onAllOptionChecked?: (cheked: boolean) => void;
  title?: string;
  titleStyle?: CSSProperties;
  direction?: "vertical" | "horizontal";
  loading?: boolean;
  fontWeight?: number;

  textTooltip?: string;
  styleTooltip?: CSSProperties;
  colorTooltip?: "orange" | "blue";
  disabled?: boolean;

  MContainerStyles?: CSSProperties;
}

export const MCheckboxGroup: FC<Props> = ({
  disabled,
  direction,
  title,
  titleStyle,
  onAllOptionChecked,
  labelClassName,
  id,
  onChange,
  values,
  labelStyle,
  style,
  options,
  fontWeight,
  textTooltip,
  styleTooltip = {},
  colorTooltip = "orange",
  loading,
  MContainerStyles,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const elements_count = options.length > 0 ? options.length : 5;
  return (
    <div>
      {title && (
        <Typography
          fontSize={"1.2rem"}
          fontWeight={fontWeight || 600}
          style={titleStyle}
          component={"p"}
        >
          {title}
          {textTooltip && (
            <MTooltip
              sx={styleTooltip}
              text={textTooltip}
              color={colorTooltip}
              placement="right"
            />
          )}
        </Typography>
      )}
      {loading &&
        Array.from({ length: elements_count }).map((s, i) => {
          return <Skeleton key={i} style={style}></Skeleton>;
        })}
      {!loading && onAllOptionChecked && (
        <FormGroup id={id}>
          <MContainer direction="vertical">
            <FormControlLabel
              className={labelClassName}
              style={labelStyle}
              control={
                <Checkbox
                  disabled={disabled}
                  onChange={(e) => {
                    onAllOptionChecked(e.target.checked);
                  }}
                  style={style}
                  sx={{
                    color: "#069CB1",
                    "&.Mui-checked": {
                      color: "#069CB1",
                    },
                  }}
                />
              }
              label={
                textos["seleccionar_todos"]
                  ? textos["seleccionar_todos"]
                  : "Texto No Definido"
              }
            />
            <Divider
              style={{ margin: 8, borderColor: "#000", borderTopWidth: 1 }}
            />
          </MContainer>
        </FormGroup>
      )}
      {!loading && (
        <FormGroup id={id}>
          <MContainer
            direction={direction ? direction : "vertical"}
            styles={MContainerStyles}
          >
            {options.map((e, i) => {
              const value = values[i];
              return (
                <FormControlLabel
                  className={labelClassName}
                  style={labelStyle}
                  key={i}
                  control={
                    <Checkbox
                      className="check"
                      disabled={disabled}
                      checked={value && value === true ? value : false}
                      onChange={
                        onChange
                          ? (e) => onChange(e.target.checked, i)
                          : () => {
                              console.log("nothing");
                            }
                      }
                      style={style}
                      sx={{
                        color: "#069CB1",
                        "&.Mui-checked": {
                          color: "#069CB1",
                        },
                      }}
                    />
                  }
                  label={e}
                />
              );
            })}
          </MContainer>
        </FormGroup>
      )}
    </div>
  );
};
