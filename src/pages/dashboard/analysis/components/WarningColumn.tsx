import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";

class Groupedcolumn extends React.Component {
  render() {
    const data = [
      {
        name: "低危告警",
        "20210701": 18.9,
        "20210702": 28.8,
        "20210703": 39.3,
        "20210704": 81.4,
        "20210705": 47,
        "20210706": 20.3,
        "20210707": 24,
        "20210708": 35.6
      },
      {
        name: "中危告警",
        "20210701": 12.4,
        "20210702": 23.2,
        "20210703": 34.5,
        "20210704": 99.7,
        "20210705": 52.6,
        "20210706": 35.5,
        "20210707": 37.4,
        "20210708": 42.4
      },
      {
        name: "高危告警",
        "20210701": 12.4,
        "20210702": 23.2,
        "20210703": 34.5,
        "20210704": 99.7,
        "20210705": 52.6,
        "20210706": 35.5,
        "20210707": 37.4,
        "20210708": 42.4
      }
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["20210701", "20210702", "20210703", "20210704", "20210705", "20210706", "20210707", "20210708"],
      // 展开字段集
      key: "日期",
      // key字段
      value: "告警数" // value字段
    });
    return (
      <div>
        <Chart height={400} data={dv} forceFit>
          <Axis name="日期" />
          <Axis name="告警数" />
          <Legend />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="日期*告警数"
            color={"name"}
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 32
              }
            ]}
          />
        </Chart>
      </div>
    );
  }
}
export default Groupedcolumn;
