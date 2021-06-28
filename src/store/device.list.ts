import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IDevice } from '../services/interfaces/device.interface';
import { getDevices } from '../services/jsonPlaceholder';
import { AppThunk, AppState } from '.';

/**
 * interface to represent a list of devices
 * with it's requests state
 * @interface DeviceList
 */
interface DeviceList {
  /**
   * current request state
   * @type {string}
   */
  readyStatus: string;

  /**
   * list of devices
   * @type {IDevice[]}
   */
  devices: IDevice[];

  /**
   * request error
   * @type {string|null}
   */
  error: string | null;
}

/**
 * initial state
 * @type {DeviceList}
 */
export const initialState: DeviceList = {
  readyStatus: 'invalid',
  devices: [],
  error: null,
};

/**
 * automatically generates action creators and action types for devices
 * using initial state and reducers
 */
const deviceList = createSlice({
  name: 'deviceList',
  initialState,
  reducers: {
    getRequesting: (state: DeviceList) => {
      state.readyStatus = 'request';
    },
    getSuccess: (state, { payload }: PayloadAction<IDevice[]>) => {
      state.readyStatus = 'success';
      state.devices = payload;
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure';
      state.error = payload;
    },
  },
});

// export default reducers and actions
export default deviceList.reducer;
export const { getRequesting, getSuccess, getFailure } = deviceList.actions;

/**
 * fetch list of devices (thunk)
 * @param {?Date} startDate - start date for device query
 * @param {?Date} endDate - end date for device query
 * @returns {AppThunk}
 */
export const fetchDeviceList =
  (startDate?: Date, endDate?: Date): AppThunk =>
  async (dispatch) => {
    dispatch(getRequesting());

    const { error, result } = await getDevices(startDate, endDate);

    if (error) {
      dispatch(getFailure(error.message));
    } else {
      dispatch(getSuccess(result as IDevice[]));
    }
  };

/**
 * if it is success then we can start a request
 * check for readyStatus on state.deviceList
 */
const shouldFetchDeviceList = (state: AppState) =>
  state.deviceList.readyStatus !== 'success';

/**
 * fetch list of devices if needed (thunk) for a web site
 * delays fetching of device list method call until it is ready
 * @param {?Date} startDate - start date for device query
 * @param {?Date} endDate - end date for device query
 * @returns {Appthunk}
 */
export const fetchDeviceListIfNeed =
  (startDate?: Date, endDate?: Date): AppThunk =>
  (dispatch, getState) => {
    if (shouldFetchDeviceList(getState())) {
      return dispatch(fetchDeviceList(startDate, endDate));
    }
    return null;
  };
