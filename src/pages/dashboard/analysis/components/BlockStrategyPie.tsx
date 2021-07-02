import React from 'react';
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
  Label,
  View,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class BlockStrategyPie extends React.Component {
  render() {
    const { DataView } = DataSet;
    const data = [
      {
        value: 10,
        type: '白名单策略',
        name: '一级',
      },
      {
        value: 10,
        type: '白名单策略',
        name: '二级',
      },
      {
        value: 40,
        type: '白名单策略',
        name: '三级',
      },
      {
        value: 20,
        type: '黑名单策略',
        name: '一级',
      },
      {
        value: 45,
        type: '黑名单策略',
        name: '二级',
      },
      {
        value: 60,
        type: '黑名单策略',
        name: '三级',
      },
    ];
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'type',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: (val:any) => {
          val = `${(val * 100).toFixed(2)}%`;
          return val;
        },
      },
    };
    const dv1 = new DataView();
    dv1.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'name',
      as: 'percent',
    });
    return (
      <div>
        <Chart
          height={200}
          width={250}
          data={dv}
          scale={cols}
          forceFit
        >
          <Coord type="theta" radius={0.5} />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="type"
            tooltip={[
              'type*percent',
              (item, percent) => {
                percent = `${(percent * 100).toFixed(2)}%`;
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
            select={false}
          >
            <Label content="type" offset={-10} />
          </Geom>
          <View data={dv1} scale={cols}>
            <Coord type="theta" radius={0.75} innerRadius={0.5 / 0.75} />
            <Geom
              type="intervalStack"
              position="percent"
              color={[
                'name',
                [
                  '#BAE7FF',
                  '#7FC9FE',
                  '#71E3E3',
                  '#ABF5F5',
                  '#8EE0A1',
                  '#BAF5C4',
                ],
              ]}
              tooltip={[
                'name*percent',
                (item, percent) => {
                  percent = `${(percent * 100).toFixed(2)}%`;
                  return {
                    name: item,
                    value: percent,
                  };
                },
              ]}
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
              select={false}
            >
              <Label content="name" />
            </Geom>
          </View>
        </Chart>
      </div>
    );
  }
}
export default BlockStrategyPie
