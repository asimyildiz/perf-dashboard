import { IBase } from './base.interface';

/**
 * interface to represent a web-vital data
 * @interface IVital
 * @extends IBase
 */
export interface IVital extends IBase {
  /**
   * name of the web-vital event
   * @type {string}
   */
  name: string;

  /**
   * delta time of the web-vital event
   * @type {number}
   */
  delta: number;

  /**
   * time of the web-vital event
   * @type {number}
   */
  value: number;
}

/**
 * interface to represent a list of IVital data
 * @interface VitalMetricsData
 */
export interface VitalMetricsData {
  /**
   * list of IVital data
   * @type {Array<IVital>}
   */
  result?: IVital[];

  /**
   * service error
   * @type {Error}
   */
  error?: Error;
}
