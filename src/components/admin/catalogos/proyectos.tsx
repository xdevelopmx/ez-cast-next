import { Circle, People, Star } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CazatalentosPreview } from "~/components/cazatalento/dialogs/cazatalentos-preview";
import { MContainer } from "~/components/layout/MContainer";
import { SectionTitle } from "~/components/shared";
import ConfirmationDialog from "~/components/shared/ConfirmationDialog";
import { MSearchInput } from "~/components/shared/MSearchInput";
import { MTable } from "~/components/shared/MTable/MTable";
import Constants from "~/constants";
import useNotify from "~/hooks/useNotify";
import RolesIndexPage from "~/pages/cazatalentos/roles";
import TheatersIcon from '@mui/icons-material/Theaters';
import { api, parseErrorBody } from "~/utils/api";

export const CatalogoProyectos = () => {
  const { notify } = useNotify();

  const [dialog, setDialog] = useState<{
    open: boolean;
    id_proyecto: number;
    id: "INFO_CAZATALENTO" | "INFO_PROYECTO";
  }>({ open: false, id_proyecto: 0, id: "INFO_PROYECTO" });

  const [confirmation_dialog, setConfirmationDialog] = useState<{
    opened: boolean;
    title: string;
    content: JSX.Element;
    action: "RECHAZAR" | "APROBAR";
    data: Map<string, unknown>;
  }>({
    opened: false,
    title: "",
    content: <></>,
    action: "RECHAZAR",
    data: new Map(),
  });

  const [observaciones, setObservaciones] = useState("");

  const [data, setData] = useState<any[]>([]);

  const [estatus_proyecto, setEstatusProyecto] = useState("");

  const [search_text, setSearchText] = useState("");

  const session = useSession();

  const proyectos = api.proyectos.getAll.useQuery(
    {
      where:
        estatus_proyecto.length > 0
          ? {
              estatus: estatus_proyecto,
            }
          : null,
      order_by: [
        {
          id: "asc",
        },
        {
          destacado: "asc",
        },
      ],
    },
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (proyectos.data) {
      setData(proyectos.data);
    }
  }, [proyectos.data]);

  const update_estatus = api.proyectos.updateEstadoProyecto.useMutation({
    onSuccess: (data) => {
      setData((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return prev.map((p) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (p.id === data.id) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            p.estatus = data.estatus;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return p;
        });
      });
      setObservaciones("");
      notify("success", "Se actualizo el proyecto con exito");
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const update_en_casting = api.proyectos.updateEnCartelera.useMutation({
    onSuccess: (data) => {
      setData((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return prev.map((p) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (p.id === data.id) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            p.en_casting = data.en_casting;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return p;
        });
      });
      notify("success", "Se actualizo el proyecto con exito");
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  })

  const update_destacado = api.proyectos.updateDestacado.useMutation({
    onSuccess: (data) => {
      setData((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return prev.map((p) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (p.id === data.id) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            p.destacado = data.destacado;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return p;
        });
      });
      notify("success", "Se actualizo el proyecto con exito");
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const table_data = useMemo(() => {
    if (!proyectos.data) {
      return [];
    }
    if (search_text.length === 0) {
      return proyectos.data;
    }
    const s_text = search_text.toLowerCase();
    return proyectos.data.filter((p) => {
      return (
        p.nombre.toLowerCase().includes(s_text) ||
        p.estatus.toLowerCase().includes(s_text) ||
        p.tipo?.descripcion.toLowerCase().includes(s_text) ||
        p.created.toLocaleDateString("es-mx").includes(s_text)
      );
    });
  }, [search_text, proyectos.data]);

  return (
    <Box>
      <SectionTitle
        titleSx={{ marginTop: 2, marginBottom: 4 }}
        title="Catalogo de Proyectos en EZCast"
      />
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Tabs
          sx={{ my: 2 }}
          value={estatus_proyecto}
          onChange={(e, tab) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setEstatusProyecto(tab);
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Todos" value={""} />
          <Tab
            label="Pendientes a aprobar"
            value={Constants.ESTADOS_PROYECTO.ENVIADO_A_APROBACION}
          />
          <Tab label="Aprobados" value={Constants.ESTADOS_PROYECTO.APROBADO} />
          <Tab
            label="Rechazados"
            value={Constants.ESTADOS_PROYECTO.RECHAZADO}
          />
          <Tab
            label="Pendiente"
            value={Constants.ESTADOS_PROYECTO.POR_VALIDAR}
          />
          <Tab
            label="Archivados"
            value={Constants.ESTADOS_PROYECTO.ARCHIVADO}
          />
        </Tabs>
        
      </Box>
      <Box sx={{width: '100%', margin: 2}}>
        <Box sx={{marginLeft: 'calc(100% - 416px)'}}>
          <MSearchInput
            w={400}
            placeholder="Buscar proyectos"
            onChange={(value) => {
              setSearchText(value);
            }}
          />
        </Box>
      </Box>
      <MTable
        columnsHeader={[
          <Typography
            key={1}
            sx={{ color: "#fff" }}
            fontSize={"1.2rem"}
            fontWeight={600}
            component={"p"}
          >
            Proyecto
          </Typography>,
          <Typography
            key={2}
            sx={{ color: "#fff" }}
            fontSize={"1.2rem"}
            fontWeight={600}
            component={"p"}
          >
            Cazatalentos
          </Typography>,
          <Typography
            key={3}
            sx={{ color: "#fff" }}
            fontSize={"1.2rem"}
            fontWeight={600}
            component={"p"}
          >
            Estado
          </Typography>,
          <Typography
            key={4}
            sx={{ color: "#fff" }}
            fontSize={"1.2rem"}
            fontWeight={600}
            component={"p"}
          >
            Tipo
          </Typography>,
          <Typography
            key={5}
            sx={{ color: "#fff" }}
            fontSize={"1.2rem"}
            fontWeight={600}
            component={"p"}
          >
            Fecha
          </Typography>,
          <Typography
            key={6}
            sx={{ color: "#fff" }}
            fontSize={"1.2rem"}
            fontWeight={600}
            component={"p"}
          >
            Acciones
          </Typography>,
        ]}
        backgroundColorHeader="#069cb1"
        styleHeaderTableCell={{ padding: "5px !important" }}
        loading={proyectos.isFetching}
        data={table_data.map((p) => {
          return {
            nombre: (() => {
              let color = "grey";
              switch (p.estatus.toUpperCase()) {
                case Constants.ESTADOS_PROYECTO.ENVIADO_A_APROBACION:
                  color = "#f9b233";
                  break;
                case Constants.ESTADOS_PROYECTO.RECHAZADO:
                  color = "tomato";
                  break;
                case Constants.ESTADOS_PROYECTO.APROBADO:
                  color = "green";
                  break;
              }
              return (
                <MContainer direction="horizontal">
                  <Circle
                    style={{
                      color: color,
                      width: 12,
                      height: 12,
                      marginTop: 6,
                      marginRight: 4,
                    }}
                  />
                  <Typography variant="subtitle2">{p.nombre}</Typography>
                </MContainer>
              );
            })(),
            cazatalentos: p.cazatalentos.nombre + " " + p.cazatalentos.apellido,
            estado: (() => {
              switch (p.estatus.toUpperCase()) {
                case Constants.ESTADOS_PROYECTO.POR_VALIDAR:
                  return "Pendiente";
                case Constants.ESTADOS_PROYECTO.ARCHIVADO:
                  return "Archivado";
                case Constants.ESTADOS_PROYECTO.ENVIADO_A_APROBACION:
                  return "Enviado a aprobación";
                case Constants.ESTADOS_PROYECTO.RECHAZADO:
                  return "Inactivo";
                case Constants.ESTADOS_PROYECTO.APROBADO:
                  return "Activo";
              }
              return p.estatus;
            })(),
            tipo: p.tipo
              ? p.tipo.id_tipo_proyecto === 99
                ? p.tipo.descripcion
                : p.tipo.tipo_proyecto.es
              : "ND",
            fecha: p.created.toLocaleDateString("es-mx"),
            acciones: (
              <MContainer direction="horizontal" justify="center">
                <>
                  {p.estatus === Constants.ESTADOS_PROYECTO.APROBADO && (
                    <IconButton
                      style={{ color: p.destacado ? "#f9b233" : "gray" }}
                      aria-label="marcar como destacado"
                      onClick={() => {
                        update_destacado.mutate({
                          id: p.id,
                          destacado: !p.destacado,
                        });
                      }}
                    >
                      <Star />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label="cazatalentos"
                    onClick={() => {
                      //update_destacado.mutate({id: p.id, destacado: !p.destacado});
                      setDialog({
                        open: true,
                        id_proyecto: p.id,
                        id: "INFO_CAZATALENTO",
                      });
                    }}
                  >
                    <People />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      update_en_casting.mutate({
                        id: p.id,
                        en_casting: !p.en_casting,
                      });
                      e.stopPropagation();
                    }}
                    color={p.en_casting ? 'primary' : 'default'}
                    aria-label="Actualizar Estado En Cartelera"
                    component="label"
                  >
                    <TheatersIcon/>
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      setDialog({
                        open: true,
                        id_proyecto: p.id,
                        id: "INFO_PROYECTO",
                      });
                      e.stopPropagation();
                    }}
                    color="primary"
                    aria-label="consultar"
                    component="label"
                  >
                    <Image
                      src={"/assets/img/iconos/search_blue.png"}
                      width={16}
                      height={16}
                      alt="archivar"
                    />
                  </IconButton>
                </>
              </MContainer>
            ),
          };
        })}
        noDataContent={
          table_data.length >
          0 ? undefined : proyectos.isFetching ? undefined : (
            <div style={{ padding: 16 }} className="box_message_blue">
              {estatus_proyecto.length === 0 && (
                <>
                  <p className="h3">No has creado ningún proyecto</p>
                  <p>
                    Al crear un proyecto, aquí tendrás una vista general de tus
                    proyectos activos e inactivos.
                    <br />
                    Recuerda crear todos tus roles y leer los requisitos de
                    aprobación antes de terminar y mandarlos.
                    <br />
                    ¡Comienza ahora mismo!
                  </p>
                </>
              )}
              {estatus_proyecto.length > 0 && (
                <p className="h3">
                  No se encontro ningún proyecto con ese estatus
                </p>
              )}
            </div>
          )
        }
      />
      <ConfirmationDialog
        opened={confirmation_dialog.opened}
        onOptionSelected={(confirmed: boolean) => {
          if (confirmed) {
            switch (confirmation_dialog.action) {
              case "RECHAZAR": {
                const id = confirmation_dialog.data.get("id");
                const observaciones =
                  confirmation_dialog.data.get("observaciones");
                if (id) {
                  update_estatus.mutate({
                    id: id as number,
                    estatus: Constants.ESTADOS_PROYECTO.RECHAZADO,
                    observaciones: observaciones as string,
                  });
                }
                break;
              }
              case "APROBAR": {
                const id = confirmation_dialog.data.get("id");
                if (id) {
                  update_estatus.mutate({
                    id: id as number,
                    estatus: Constants.ESTADOS_PROYECTO.APROBADO,
                  });
                }
                break;
              }
            }
          } else {
            setDialog({ ...dialog, open: true });
          }
          setConfirmationDialog({ ...confirmation_dialog, opened: false });
        }}
        title={confirmation_dialog.title}
        content={confirmation_dialog.content}
      />
      <CazatalentosPreview
        onClose={() => setDialog({ ...dialog, open: false })}
        open={dialog.open && dialog.id === "INFO_CAZATALENTO"}
        id_proyecto={dialog.id_proyecto}
      />
      <Dialog
        fullWidth={true}
        maxWidth={"xl"}
        open={dialog.open && dialog.id === "INFO_PROYECTO"}
        onClose={() => {
          setDialog({ ...dialog, open: false });
        }}
      >
        <DialogContent>
          <RolesIndexPage
            user={session.data?.user}
            id_proyecto={dialog.id_proyecto}
            can_edit={false}
            onProjectChange={(action) => {
              setDialog({ ...dialog, open: false });
              switch (action) {
                case "PROYECTO_APROBADO": {
                  const params = new Map<string, unknown>();
                  params.set("id", dialog.id_proyecto);
                  setConfirmationDialog({
                    action: "APROBAR",
                    data: params,
                    opened: true,
                    title: "Aprobar Proyecto",
                    content: (
                      <Box>
                        <Typography variant="body2">
                          Seguro que deseas aprobar este proyecto?
                        </Typography>
                      </Box>
                    ),
                  });
                  break;
                }
                case "PROYECTO_RECHAZADO": {
                  const params = new Map<string, unknown>();
                  params.set("id", dialog.id_proyecto);
                  setConfirmationDialog({
                    action: "RECHAZAR",
                    data: params,
                    opened: true,
                    title: "Rechazar Proyecto",
                    content: (
                      <Box>
                        <Typography variant="body2">
                          Seguro que deseas rechazar este proyecto?
                        </Typography>
                        <label
                          style={{
                            fontWeight: 600,
                            width: "100%",
                            marginTop: 10,
                          }}
                          className={"form-input-label"}
                          htmlFor={"observaciones-input"}
                        >
                          Observaciones
                        </label>
                        <TextField
                          id="observaciones-input"
                          multiline
                          rows={3}
                          onChange={(e) => {
                            params.set("observaciones", e.target.value);
                            //setObservaciones(e.target.value)
                          }}
                        />
                      </Box>
                    ),
                  });
                  break;
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialog({ ...dialog, open: false });
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
