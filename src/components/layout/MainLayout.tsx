import { type ReactNode, type FC, type CSSProperties, useContext } from "react";
import { Footer, Header } from "./";
import AppContext from "~/context/app";
import { LoadingPage } from "../shared";
import MotionDiv from "./MotionDiv";

interface Props {
  children: ReactNode;
  style?: CSSProperties;

  menuSiempreBlanco?: boolean;
  menuAzul?: boolean;
  hideFooter?: boolean;
  hideHeader?: boolean;
}

export const MainLayout: FC<Props> = ({
  children,
  menuSiempreBlanco = false,
  style,
  menuAzul = false,
  hideFooter,
  hideHeader,
}) => {
  const { isLoadingData } = useContext(AppContext);
  return (
    <>
      {!hideHeader && (
        <Header menuSiempreBlanco={menuSiempreBlanco} menuAzul={menuAzul} />
      )}
      <div style={{ marginTop: 76, ...style }}>
        <MotionDiv show={isLoadingData} animation="fade">
          <LoadingPage />
        </MotionDiv>
        <MotionDiv show={!isLoadingData} animation="fade">
          <div>{children}</div>
        </MotionDiv>
      </div>
      {!hideFooter && <Footer />}
    </>
  );
};
