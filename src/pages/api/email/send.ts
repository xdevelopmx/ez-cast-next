import nodemailer from "nodemailer"
import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from "next";
import { render } from "@react-email/render";
import TestEmail from "~/components/emails/test";
import InvitacionTalentoEmail from "~/components/emails/invitacion-talento";
import PasswordRecoveryEmail from "~/components/emails/password-recovery";
import Constants from "~/constants";
import { prisma } from "~/server/db";

type EmailPayload = {
  to: string
  subject: string
  html: string,
  from: string
}

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.NEXT_PUBLIC_GMAIL_USER,
        pass: process.env.NEXT_PUBLIC_GMAIL_PASSWORD
    }
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

    let template: JSX.Element | null = null;
    
    switch (body.type) {
      case Constants.TIPOS_EMAILS.INVITACION_TALENTO: {
        template = InvitacionTalentoEmail({
          nombre: body.data['nombre'] as string,
          apellido: body.data['apellido'] as string,
          correo_representante: body.data['correo_representante'] as string,
          nota: body.data['nota'] as string,
        });
        break;
      }
      case Constants.TIPOS_EMAILS.PASSWORD_RECOVERY: {
        const randomString = crypto.randomBytes(4).toString('hex');
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        await prisma.codigosRecuperacionPassword.create({
          data: {
            code: randomString,
            for_user_with_email: body.to,
            valid_until: now
          }
        });
        template = PasswordRecoveryEmail({
          code: randomString,
          tipo_usuario: body.data['tipo_usuario'] as string
        });
        break;
      }
    }

    if (template) {
      await sendEmail({
          to: body.to,
          subject: body.subject,
          html: render(template),
          from: body.from
      });
    } else {
      return res.status(403).json({ message: 'Invalid template'});
    }
    return res.status(200).json({ message: "Email sent successfully" });
}