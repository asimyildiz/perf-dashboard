import { IBase } from './base.interface';

/**
 * interface to represent a resource data
 * @interface IResource
 * @extends IBase
 */
export interface IResource extends IBase {
  /**
   * resource name (path)
   * @type {string}
   */
  name: string;

  /**
   * resource type (script | img | ...)
   * @type {string}
   */
  initiatorType: string;

  /**
   * decoded body size of the resource
   * @type {number}
   */
  decodedBodySize: number;

  /**
   * encoded body size of the resource
   * @type {number}
   */
  encodedBodySize: number;

  /**
   * transfer size of the resource
   * @type {number}
   */
  transferSize: number;

  /**
   * redirect time of the resource
   * @type {number}
   */
  redirectTime: number;

  /**
   * dns lookup time of the resource
   * @type {number}
   */
  dnsLookupTime: number;

  /**
   * handshake time of the resource
   * @type {number}
   */
  tcpHandshakeTime: number;

  /**
   * response time of the resource
   * @type {number}
   */
  responseTime: number;

  /**
   * secure connection time of the resource
   * @type {number}
   */
  secureConnectionTime: number;

  /**
   * fetch time until response end for the resource
   * @type {number}
   */
  fetchUntilResponseEndTime: number;

  /**
   * request start time until response end for the resource
   * @type {number}
   */
  requestStartUntilResponseEndTime: number;

  /**
   * start time until response end for the resource
   * @type {number}
   */
  startUntilResponseEndTime: number;
}

/**
 * interface to represent a list of IResource data
 * @interface ResourceMetricsData
 */
export interface ResourceMetricsData {
  /**
   * list of IResource data
   * @type {Array<IResource>}
   */
  result?: IResource[];

  /**
   * service error
   * @type {Error}
   */
  error?: Error;
}
