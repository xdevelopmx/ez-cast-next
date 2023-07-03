import nodemailer from "nodemailer"
import type { NextApiRequest, NextApiResponse } from "next";
import { render } from "@react-email/render";
import TestEmail from "~/components/emails/test";
import InvitacionTalentoEmail from "~/components/emails/invitacion-talento";

type EmailPayload = {
  to: string
  subject: string
  html: string,
  from: string
}

// Replace with your SMTP credentials
const smtpOptions = {
  host: process.env.NEXT_PUBLIC_SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || "2525"),
  secure: false,
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER || "user",
    pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD || "password",
  },
}

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions
  })

  return await transporter.sendMail({
    ...data,
  }, (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const body = JSON.parse(req.body as string) as {
        to: string,
        subject: string, 
        type: string,
        from: string,
        data: {[key: string]: string}
    }

    let template = InvitacionTalentoEmail({
        nombre: body.data['nombre'] as string,
        apellido: body.data['apellido'] as string,
        correo_representante: body.data['correo_representante'] as string,
        nota: body.data['nota'] as string,
    })

    await sendEmail({
        to: body.to,
        subject: body.subject,
        html: render(template),
        from: body.from
    });

    return res.status(200).json({ message: "Email sent successfully" });
}