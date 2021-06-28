import { memo, FC } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

import { IChartData } from '../../interfaces/chartdata.interface';
import { IDevice } from '../../services/interfaces/device.interface';
import styles from './styles.module.scss';

/**
 * interface to represent the parameter
 * passed to the component
 * @interface Props
 */
interface Props {
  title: string;
  devices: IDevice[];
  items: IChartData[] | undefined;
}

/**
 * create data object which will be passed to the Line chart
 * @param {string} label - label of data (TTFB, FID...)
 * @param {Array<IDevice>} devices - device data
 * @param {Array<IChartData>|undefined} items - chart data array
 * @returns {unknown}
 */
const getChartData = (
  label: string,
  devices: IDevice[],
  items: IChartData[] | undefined,
): unknown => {
  if (items) {
    const data: number[] = items.map((item: IChartData) => item.value);
    const labels: string[][] = devices
      .filter(
        (device: IDevice) =>
          items.findIndex((item: IChartData) => item.id === device.id) > -1,
      )
      .map((device: IDevice) => {
        const date = moment(device.createdAt);
        return [date.format('MMMM Do YYYY'), date.format('h:mm:ss a')];
      });

    return {
      labels,
      datasets: [
        {
          label,
          data,
          fill: false,
          backgroundColor: styles.chartBackgroundColor,
          borderColor: styles.chartBorderColor,
        },
      ],
    };
  }

  return {};
};

const getOptions = () => ({
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'right',
      align: 'start',
    },
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
});

/**
 * create a chart based on the data passed
 * @param {Props} param0 - props
 * @returns {JSXElement}
 */
const Chart: FC<Props> = ({ title, devices, items }: Props) => (
  <div className={styles.Chart}>
    <Line
      type="line"
      data={getChartData(title, devices, items)}
      options={getOptions()}
    />
  </div>
);

export default memo(Chart);
