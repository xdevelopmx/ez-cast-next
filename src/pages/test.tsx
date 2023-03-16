import { signIn, useSession, signOut } from "next-auth/react"
import { TipoUsuario } from "~/server/auth";
import { api } from "~/utils/api";

export default function Test() {
    const session = useSession();
    const create_talento = api.auth.createUser.useMutation();
    return (
        <>
            <p>{JSON.stringify(session)}</p>
            <button  onClick={ () => {
                signIn('credentials', {
                    user: 'tester',
                    password: 'lolxd',
                    tipo_usuario: 'talento',
                    correo_usuario: '',
                    redirect: false,
                }).then(res => {
                    console.log(res);
                }).catch(console.log);
            }}>Log in</button>

            <button  onClick={ () => {
                signOut().then(() => {
                    console.log('logout');
                }).catch(console.error)
            }}>Cerrar session</button>

            <p>{JSON.stringify(create_talento.data)}</p>

            <button  onClick={ () => {
                create_talento.mutate({
                    tipo_usuario: TipoUsuario.TALENTO,
                    user: {
                        nombre: 'test', 
                        apellido: 'testies', 
                        contrasenia: 'lolxd', 
                        usuario: 'testera', 
                        email: 'tester@gmail.com', 
                        profile_img_url: '/uploads/por/ahi', 
                        tipo_membresia: 'gratis',
                        cobro_membresia: 'mensual',
                    }
                });
            }}>Crear talento</button>
        </>
    )
}