import {
  IconButton,
  Tooltip,
  tooltipClasses,
  type TooltipProps,
} from "@mui/material";
import { type ReactNode, type FC, type CSSProperties } from "react";
import { styled, type SxProps, type Theme } from "@mui/material/styles";
import { QuestionMark } from "@mui/icons-material";

interface Props {
  color: "blue" | "orange" | "white";
  text: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  placement:
    | "top-start"
    | "top"
    | "top-end"
    | "left-start"
    | "left"
    | "left-end"
    | "right-start"
    | "right"
    | "right-end"
    | "bottom-start"
    | "bottom"
    | "bottom-end";
  sx?: SxProps<Theme>;
  styles?: CSSProperties;
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, color }) => {
  return {
    [`& .${tooltipClasses.arrow}`]: {
      color: color === "blue" ? "#069cb1" : "orange",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: color === "blue" ? "#069cb1" : "orange",
      color: color === "blue" ? "white" : "black",
    },
  };
});

export const MTooltip: FC<Props> = ({
  onClick,
  sx,
  text,
  placement,
  color,
  icon,
  styles,
}) => {
  return (
    <BootstrapTooltip
      style={styles}
      color={color}
      placement={placement}
      title={text}
    >
      <IconButton
        onClick={onClick}
        sx={sx}
        style={
          icon
            ? {}
            : {
                marginLeft: 16,
                border: "2px solid #069cb1",
                color: "#069cb1",
                width: 10,
                height: 10,
              }
        }
      >
        {icon ? icon : <QuestionMark sx={{ width: 10, heigth: 10 }} />}
      </IconButton>
    </BootstrapTooltip>
  );
};
