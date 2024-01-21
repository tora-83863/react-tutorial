import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useTheme } from '@mui/material/styles';

import { numberFormat } from '../util/util';

export interface ChartSeries {
  key: string;
  name: string;
  stroke: string;
}

export default function CustomChart(
  props: {
    seriesList: ChartSeries[];
    dataList: unknown[];
    xLabel?: string;
    yLabel?: string;
  } = {
    seriesList: [],
    dataList: [],
    xLabel: "",
    yLabel: "",
  }
) {
  const theme = useTheme();

  return (
    <ResponsiveContainer>
      <LineChart
        data={props.dataList}
        margin={{
          top: 16,
          right: 16,
          bottom: 0,
          left: 24,
        }}
      >
        <XAxis
          dataKey="year"
          style={theme.typography.body2}
          type="number"
          domain={["dataMin", "dataMax"]}
        ></XAxis>
        <YAxis
          stroke={theme.palette.text.secondary}
          style={theme.typography.body2}
        ></YAxis>
        {props.seriesList.map((row: ChartSeries, index) => (
          <Line
            dataKey={row.key}
            name={row.name}
            stroke={row.stroke}
            key={index}
            isAnimationActive={false}
          />
        ))}
        <Tooltip formatter={(val: number) => `${numberFormat(val)}人`} />
      </LineChart>
    </ResponsiveContainer>
  );
}
