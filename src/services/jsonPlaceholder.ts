import axios from 'axios';

import { DevicesData } from './interfaces/device.interface';
import { VitalMetricsData } from './interfaces/vital.interface';
import { ResourceMetricsData } from './interfaces/resource.interface';
import config from '../config';

/**
 * returns a list of devices (sessions) for a web site reports
 * for a specific date interval
 * @param {?Date} startDate - start date for query
 * @param {?Date} endDate - end date for query
 * @returns {Promise<DevicesData>}
 */
export const getDevices = async (  
  startDate?: Date,
  endDate?: Date,
): Promise<DevicesData> => {
  try {
    const { data } = await axios.post(`${config.API_URL}/devices`, {
      startDate,
      endDate,
    });
    return { result: data.result };
  } catch (error) {
    return { error };
  }
};

/**
 * returns a list of web-vital metrics for a list of session ids
 * @param {?Array<string>} ids - list of session ids
 * @returns {Promise<VitalMetricsData>}
 */
export const getVitalMetrics = async (
  ids?: string[],
): Promise<VitalMetricsData> => {
  try {
    const { data } = await axios.post(`${config.API_URL}/vitals`, { ids });
    return { result: data.result };
  } catch (error) {
    return { error };
  }
};

/**
 * returns a list of resource metrics for a list of session ids
 * @param {?Array<string>} ids - list of session ids
 * @returns {Promise<ResourceMetricsData>}
 */
export const getResourceMetrics = async (
  ids?: string[],
): Promise<ResourceMetricsData> => {
  try {
    const { data } = await axios.post(`${config.API_URL}/resources`, { ids });
    return { result: data.result };
  } catch (error) {
    return { error };
  }
};
