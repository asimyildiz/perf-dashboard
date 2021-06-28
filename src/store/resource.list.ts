import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IResource } from '../services/interfaces/resource.interface';
import { getResourceMetrics } from '../services/jsonPlaceholder';
import { AppThunk, AppState } from '.';

/**
 * interface to represent a list of resource metrics
 * with it's requests state
 * @interface ResourceList
 */
interface ResourceList {
  /**
   * current request state
   * @type {string}
   */
  readyStatus: string;

  /**
   * list of resource metrics
   * @type {IResource[]}
   */
  resources: IResource[];

  /**
   * request error
   * @type {string|null}
   */
  error: string | null;
}

/**
 * initial state
 * @type {ResourceList}
 */
export const initialState: ResourceList = {
  readyStatus: 'invalid',
  resources: [],
  error: null,
};

/**
 * automatically generates action creators and action types for resource metrics
 * using initial state and reducers
 */
const resourceList = createSlice({
  name: 'resourceList',
  initialState,
  reducers: {
    getRequesting: (state: ResourceList) => {
      state.readyStatus = 'request';
    },
    getSuccess: (state, { payload }: PayloadAction<IResource[]>) => {
      state.readyStatus = 'success';
      state.resources = payload;
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure';
      state.error = payload;
    },
  },
});

// export default reducers and actions
export default resourceList.reducer;
export const { getRequesting, getSuccess, getFailure } = resourceList.actions;

/**
 * fetch list of resource metrics (thunk)
 * @param {?Array<string>} ids - list of ids (sessions)
 * @returns {AppThunk}
 */
export const fetchResourceList =
  (ids?: string[]): AppThunk =>
  async (dispatch) => {
    dispatch(getRequesting());

    const { error, result } = await getResourceMetrics(ids);

    if (error) {
      dispatch(getFailure(error.message));
    } else {
      dispatch(getSuccess(result as IResource[]));
    }
  };

/**
 * if it is success then we can start a request
 * check for readyStatus on state.resourceList
 */
const shouldFetchResourceList = (state: AppState) =>
  state.resourceList.readyStatus !== 'success';

/**
 * fetch list of resource metrics if needed (thunk)
 * delays fetching of resource list method call until it is ready
 * @param {?Array<string>} ids - lsit of ids (sessions)
 * @returns {Appthunk}
 */
export const fetchResourceListIfNeed =
  (ids?: string[]): AppThunk =>
  (dispatch, getState) => {
    if (shouldFetchResourceList(getState())) {
      return dispatch(fetchResourceList(ids));
    }
    return null;
  };
