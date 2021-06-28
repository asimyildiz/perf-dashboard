import { IVital } from '../services/interfaces/vital.interface';

/**
 * web-vitals and resource metrics client representation
 * @interface IChartData
 */
export interface IChartData {
  /**
   * session id of the metric
   * @type {string}
   */
  id: string;

  /**
   * name of the metric
   * @type {string}
   */
  name: string;

  /**
   * value of the metric
   * @type {number}
   */
  value: number;
}

/**
 * map IVital[] data to IChartData[]
 * @param {IVital[]|undefined} vitals
 * @returns {IChartData[]|undefined}
 */
export const fromVital = (
  vitals: IVital[] | undefined,
): IChartData[] | undefined =>
  vitals?.map(
    (item: IVital) => ({ id: item.id, name: item.name, value: item.value } as IChartData),
  );
