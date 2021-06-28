import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IVital } from '../services/interfaces/vital.interface';
import { getVitalMetrics } from '../services/jsonPlaceholder';
import { AppThunk, AppState } from '.';

/**
 * interface to represent a list of web-vital metrics
 * with it's requests state
 * @interface VitalList
 */
interface VitalList {
  /**
   * current request state
   * @type {string}
   */
  readyStatus: string;

  /**
   * list of web-vital metrics
   * @type {IVital[]}
   */
  vitals: IVital[];

  /**
   * request error
   * @type {string|null}
   */
  error: string | null;
}

/**
 * initial state
 * @type {VitalList}
 */
export const initialState: VitalList = {
  readyStatus: 'invalid',
  vitals: [],
  error: null,
};

/**
 * automatically generates action creators and action types for web-vital metrics
 * using initial state and reducers
 */
const vitalList = createSlice({
  name: 'vitalList',
  initialState,
  reducers: {
    getRequesting: (state: VitalList) => {
      state.readyStatus = 'request';
    },
    getSuccess: (state, { payload }: PayloadAction<IVital[]>) => {
      state.readyStatus = 'success';
      state.vitals = payload;
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure';
      state.error = payload;
    },
  },
});

// export default reducers and actions
export default vitalList.reducer;
export const { getRequesting, getSuccess, getFailure } = vitalList.actions;

/**
 * fetch list of web-vital metrics (thunk)
 * @param {?Array<string>} ids - list of ids (sessions)
 * @returns {AppThunk}
 */
export const fetchVitalList =
  (ids?: string[]): AppThunk =>
  async (dispatch) => {
    dispatch(getRequesting());

    const { error, result } = await getVitalMetrics(ids);

    if (error) {
      dispatch(getFailure(error.message));
    } else {
      dispatch(getSuccess(result as IVital[]));
    }
  };

/**
 * if it is success then we can start a request
 * check for readyStatus on state.vitalList
 */
const shouldFetchVitalList = (state: AppState) =>
  state.vitalList.readyStatus !== 'success';

/**
 * fetch list of web-vital metrics if needed (thunk)
 * delays fetching of web-vital metric list method call until it is ready
 * @param {?Array<string>} ids - lsit of ids (sessions)
 * @returns {Appthunk}
 */
export const fetchVitalListIfNeed =
  (ids?: string[]): AppThunk =>
  (dispatch, getState) => {
    if (shouldFetchVitalList(getState())) {
      return dispatch(fetchVitalList(ids));
    }
    return null;
  };
