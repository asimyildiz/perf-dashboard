/**
 * interface to represent a connection
 * @interface IConnection
 */
export interface IConnection {
  /**
   * downlink
   * @type {number}
   */
  downlink: number;

  /**
   * effective type
   * @type {string}
   */
  effectiveType: string;

  /**
   * round trip time
   * @type {number}
   */
  rtt: number;
}
