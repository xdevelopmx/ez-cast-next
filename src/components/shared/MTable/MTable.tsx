import {
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  Skeleton,
  Typography,
  SxProps,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import {
  useMemo,
  useState,
  type CSSProperties,
  type FC,
  useRef,
  useContext,
} from "react";
import MotionDiv from "~/components/layout/MotionDiv";
import classes from "./MTable.module.css";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import useMeasure from "react-use-measure";

type MRow = { [key: string]: number | string | boolean | JSX.Element };

interface MTableProps {
  data: MRow[];
  loading?: boolean;
  style?: CSSProperties;
  columnsHeader?: JSX.Element[];
  headerStyles?: SxProps;
  headerClassName?: string;
  backgroundColorHeader?: string;
  backgroundColorData?: string;
  disable_animation?: boolean;
  alternate_colors?: boolean;
  styleHeaderRow?: CSSProperties;
  styleHeaderTableCell?: CSSProperties;
  styleTableRow?: CSSProperties;
  accordionContent?: (element_index: number) => JSX.Element | null;
  noDataContent?: JSX.Element;

  dataStylesRow?: CSSProperties;
  filasExpandidas?: string[];
}

export const MTable: FC<MTableProps> = ({
  noDataContent,
  accordionContent,
  disable_animation,
  loading,
  data,
  columnsHeader,
  headerClassName,
  headerStyles,
  backgroundColorData = "#ededed ",
  backgroundColorHeader = "#EBEBEB",
  style = {},
  alternate_colors = true,
  styleHeaderRow = {},
  styleHeaderTableCell = {},
  styleTableRow = {},
  dataStylesRow = {},

  filasExpandidas,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const [pagination, setPagination] = useState<{
    page: number;
    page_size: number;
  }>({ page: 0, page_size: 5 });
  const [expanded_rows, setExpandedRows] = useState<string[]>([]);
  const [ref, { height }] = useMeasure();
  const _data = useMemo(() => {
    if (loading && columnsHeader) {
      return Array.from({ length: 5 }).map((n, i) => {
        return columnsHeader.map((c, j) => {
          return (
            <Skeleton
              key={j}
              className="my-2 p-3"
              variant="rectangular"
              height={32}
            />
          );
        });
      });
    } else {
      return data;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  const paginated_data = useMemo(() => {
    const start = pagination.page * pagination.page_size;
    const end = pagination.page * pagination.page_size + pagination.page_size;
    const sliced_data = _data.slice(start, end);
    if (sliced_data.length === 0 && pagination.page > 0) {
      setPagination((v) => {
        return { ...v, page: v.page - 1 };
      });
    }
    return sliced_data;
  }, [pagination, _data]);

  const table_body_ref = useRef<HTMLTableSectionElement>(null);

  const accordion_content_width = useMemo(() => {
    if (table_body_ref.current) {
      return table_body_ref.current.getBoundingClientRect().width;
    }
    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table_body_ref.current]);

  return (
    <AnimatePresence>
      <TableContainer
        component={Paper}
        style={{ ...style, overflowY: "hidden" }}
        className="grid-scroll"
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          size="small"
        >
          {columnsHeader && (
            <TableHead
              className={classes[headerClassName ? headerClassName : ""]}
              style={{
                textAlign: 'left',
                backgroundColor: backgroundColorHeader,
              }}
              sx={headerStyles}
            >
              <TableRow sx={{ styleHeaderRow }}>
                {columnsHeader &&
                  columnsHeader.map((c, i) => (
                    <TableCell

                      align="left"
                      sx={{ 
                        ...styleHeaderTableCell, 
                        ...headerStyles,
                        color: "#000",
                      }}
                      key={i}
                    >
                      {c}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
          )}

          <TableBody ref={table_body_ref}>
            {_data.length > 0 &&
              paginated_data.map((row, i) => {
                const row_values = Object.entries(row);
                return (
                  <>
                    {!disable_animation && (
                      <motion.tr
                        style={{
                          backgroundColor: alternate_colors
                            ? i % 2
                              ? backgroundColorData
                              : "white"
                            : backgroundColorData,
                          ...styleTableRow,
                        }}
                        key={i}
                        layout={true}
                        onClick={() => {
                          if (accordionContent) {
                            setExpandedRows((prev) => {
                              if (prev.includes(`panel${i}`)) {
                                return prev.filter((p) => p !== `panel${i}`);
                              }
                              return prev.concat([`panel${i}`]);
                            });
                          }
                        }}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ opacity: 0.2, y: 0.3 }}
                      >
                        {row_values.map((val, i) => {
                          if (i === 0) {
                            return (
                              <TableCell
                                style={{ padding: "0px 8px", ...dataStylesRow }}
                                key={i}
                                align="left"
                                component="th"
                                scope="row"
                              >
                                {val[1]}
                              </TableCell>
                            );
                          }
                          if (['ACTIONS', 'ACCIONES'].includes(val[0]?.toString().toUpperCase())) {
                            return (
                              <TableCell
                                key={i}
                                align="left"
                                style={{
                                  ...dataStylesRow,
                                  width: 176
                                }}
                              >
                                {val[1]}
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell
                              key={i}
                              align="left"
                              style={{
                                ...dataStylesRow,
                              }}
                            >
                              {val[1]}
                            </TableCell>
                          );
                        })}
                      </motion.tr>
                    )}
                    {disable_animation && (
                      <TableRow
                        style={{
                          ...styleTableRow,
                          position: "relative",
                          backgroundColor: alternate_colors
                            ? i % 2
                              ? backgroundColorData
                              : "white"
                            : backgroundColorData,
                        }}
                      >
                        {row_values.map((val, i) => {
                          if (i === 0) {
                            return (
                              <TableCell
                                style={{ padding: "0px 8px" }}
                                key={i}
                                align="left"
                                component="th"
                                scope="row"
                              >
                                {val[1]}
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={i} align="left">
                              {val[1]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    )}
                    <TableRow
                      style={{
                        ...styleTableRow,
                      }}
                    >
                      <TableCell colSpan={columnsHeader?.length}>
                        {accordionContent && accordionContent((pagination.page * pagination.page_size) + i)}
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            {_data.length === 0 && (
              <>
                {!noDataContent && (
                  <TableRow
                    style={{
                      ...styleTableRow,
                    }}
                  >
                    <TableCell align="left" component="th" scope="row">
                      <Typography
                        fontSize={"1rem"}
                        fontWeight={600}
                        component={"p"}
                      >
                        {textos["no_registros"]
                          ? textos["no_registros"]
                          : "Texto No definido"}{" "}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
        {noDataContent && noDataContent}
      </TableContainer>
      <MotionDiv
        show={_data.length > 5}
        animation={"fade"}
        style={{ backgroundColor: "#069cb1", width: "100%" }}
      >
        <TablePagination
          sx={{ backgroundColor: "#069cb1" }}
          labelRowsPerPage={
            textos["registros_por_pagina"]
              ? textos["registros_por_pagina"]
              : "Texto No Definido"
          }
          component="div"
          count={_data.length}
          page={pagination.page}
          rowsPerPageOptions={[1, 3, 5, 10, 15, 20]}
          onPageChange={(e, page) => {
            setPagination({ ...pagination, page: page });
          }}
          rowsPerPage={pagination.page_size}
          onRowsPerPageChange={(e) => {
            setPagination({
              ...pagination,
              page_size: parseInt(e.target.value),
            });
          }}
        />
      </MotionDiv>
    </AnimatePresence>
  );
};
