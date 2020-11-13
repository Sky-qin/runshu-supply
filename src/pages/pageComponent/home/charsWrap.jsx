import React from "react";
import { Chart, LineAdvance } from "bizcharts";

import "./index.scss";

const ChartWrap = ({ data }) => {
  return (
    <Chart autoFit height={300} data={data}>
      <LineAdvance shape="smooth" point area position="date*count" />
    </Chart>
  );
};

export default ChartWrap;
