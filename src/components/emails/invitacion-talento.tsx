import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Img } from '@react-email/img';
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";
import { Link } from "@react-email/link";

export default function InvitacionTalentoEmail(props: {
    nombre: string, 
    apellido: string,
    nota: string,
    correo_representante: string,
}) {
  return (
    <Html>
      <Section style={main}>
        <Img src="https://elasticbeanstalk-us-east-1-232555073760.s3.amazonaws.com/logo_color.png" alt="Logo" width="300" height="56" />;
        
        <Container style={container}>
         
          <Text style={heading}>Hola {`${props.nombre} ${props.apellido}!`}</Text>
          <Text style={paragraph}>El representante {`${props.correo_representante}`} te ha enviado una invitacion para que te unas a EZCAST</Text>
          <Text style={paragraph}>Puedes hacerlo ingresando a la plataforma en el siguiente Link</Text>
          <Link href="http://localhost:3000">EzCast</Link>;
        </Container>
      </Section>
    </Html>
  );
}

// Styles for the email template
const main = {
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};