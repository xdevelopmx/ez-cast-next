/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { motion } from 'framer-motion'
import { LoaderSlide, MainLayout } from "~/components";
import Link from "next/link";
import { api } from "~/utils/api";
import { type User } from "next-auth";
import { getSession } from "next-auth/react";
import { Carroucel } from "~/components/shared/Carroucel";
import { MContainer } from "~/components/layout/MContainer";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
//import { useRouter } from "next/router";
import { TipoUsuario } from "~/enums";
import { useRef, useState } from "react";
import { DetallesProyecto } from "~/components/proyecto/detalles";
import { MBanner } from "~/components/shared/MBanner";



const TestPage: NextPage = ({  }) => {

  const get_representantes = api.representantes.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false
  });


  
  
  return (
    <>
      {JSON.stringify(get_representantes.data)}
    </>
  );
};



export default TestPage;