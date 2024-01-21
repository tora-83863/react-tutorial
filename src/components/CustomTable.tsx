import { useState } from 'react';

import { TableContainer, TableSortLabel } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberFormat } from '../util/util';

export type DataList = {
  year: number;
  total?: number;
  male?: number;
  female?: number;
};

export default function CustomTable(
  props: {
    dataList: DataList[];
  } = {
    dataList: [],
  }
) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortItem, setSortItem] = useState<keyof DataList>("year");

  function CustomTableCell(props: {
    id: keyof DataList;
    label: string;
    align: "left" | "center" | "right";
  }) {
    return (
      <TableCell
        align={props.align}
        onClick={() => {
          // ソート変更
          setSortOrder(
            sortItem !== props.id || sortOrder === "desc" ? "asc" : "desc"
          );
          setSortItem(props.id);
        }}
        style={{ cursor: "pointer" }}
      >
        <TableSortLabel
          active={sortItem === props.id ? true : false}
          direction={sortOrder}
          hideSortIcon={true}
        />
        {props.label}
      </TableCell>
    );
  }

  return (
    <TableContainer sx={{ maxHeight: "100%" }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <CustomTableCell id="year" label="年" align="right" />
            <CustomTableCell id="total" label="総数" align="right" />
            <CustomTableCell id="male" label="男性" align="right" />
            <CustomTableCell id="female" label="女性" align="right" />
          </TableRow>
        </TableHead>
        <TableBody style={{ height: "100", overflow: "hidden" }}>
          {props.dataList
            .sort((item1, item2) => {
              if (sortItem === undefined) {
                return 0;
              } else {
                const val1 = item1[sortItem] ?? 0;
                const val2 = item2[sortItem] ?? 0;
                return sortOrder === "asc" ? val1 - val2 : val2 - val1;
              }
            })
            .map((row) => (
              <TableRow key={row.year}>
                <TableCell
                  align="right"
                  key="year"
                >{`${row.year}年`}</TableCell>
                <TableCell align="right">{numberFormat(row.total)}</TableCell>
                <TableCell align="right">{numberFormat(row.male)}</TableCell>
                <TableCell align="right">{numberFormat(row.female)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
