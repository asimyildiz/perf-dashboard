import axios from 'axios';

import { IResource } from '../../services/interfaces/resource.interface';

import mockStore from '../../utils/mockStore';
import resourceList, {
  initialState,
  getRequesting,
  getSuccess,
  getFailure,
  fetchResourceList,
  fetchResourceListIfNeed,
} from '../resource.list';

jest.mock('axios');

const mockData = [
  {
    _id: '60d0462a2fa99e0c816bced2',
    id: 'v1-1624262142614-3321620775826',
    name: 'http://localhost/kasaba/images/background-1.2.jpg',
    initiatorType: 'img',
    decodedBodySize: 789109,
    encodedBodySize: 789109,
    transferSize: 789408,
    redirectTime: 0,
    dnsLookupTime: 0,
    tcpHandshakeTime: 0,
    responseTime: 696.7999999821186,
    secureConnectionTime: 0,
    fetchUntilResponseEndTime: 1386.5999999940395,
    requestStartUntilResponseEndTime: 1386.5999999940395,
    startUntilResponseEndTime: 1386.5999999940395,
  } as IResource,
];
const mockError = 'Oops! Something went wrong.';

describe('resource.list reducer tests', () => {
  it('should handle initial state for resources', () => {
    // @ts-expect-error
    expect(resourceList(undefined, {})).toEqual(initialState);
  });

  it('should handle requesting for resources correctly', () => {
    expect(resourceList(undefined, { type: getRequesting.type })).toEqual({
      readyStatus: 'request',
      resources: [],
      error: null,
    });
  });

  it('should handle success for resources correctly', () => {
    expect(
      resourceList(undefined, { type: getSuccess.type, payload: mockData }),
    ).toEqual({ ...initialState, readyStatus: 'success', resources: mockData });
  });

  it('should handle failure for resources correctly', () => {
    expect(
      resourceList(undefined, { type: getFailure.type, payload: mockError }),
    ).toEqual({ ...initialState, readyStatus: 'failure', error: mockError });
  });
});

describe('resource.list action tests', () => {
  it('fetches resource metrics success', async () => {
    const { dispatch, getActions } = mockStore();
    const expectedActions = [
      { type: getRequesting.type },
      { type: getSuccess.type, payload: mockData },
    ];

    // @ts-expect-error
    axios.post.mockResolvedValue({ data: { result: mockData } });

    await dispatch(fetchResourceList());
    expect(getActions()).toEqual(expectedActions);
  });

  it('fetches resource metrics if current state.status is not successfull', async () => {
    const { dispatch, getActions } = mockStore({
      resourceList: {
        readyStatus: 'requesting',
        resources: [],
        error: null,
      }      
    });
    const expectedActions = [
      { type: getRequesting.type },
      { type: getSuccess.type, payload: mockData },
    ];

    resourceList(undefined, { type: getRequesting.type });
    // @ts-expect-error
    axios.post.mockResolvedValue({ data: { result: mockData } });

    await dispatch(fetchResourceListIfNeed());
    expect(getActions()).toEqual(expectedActions);
  });

  it('fetches resource metrics if current state.status is successfull', async () => {
    const { dispatch } = mockStore({
      resourceList: {
        readyStatus: 'success',
        resources: [],
        error: null,
      }
    });

    resourceList(undefined, { type: getRequesting.type });
    // @ts-expect-error
    axios.post.mockResolvedValue({ data: { result: mockData } });

    const result = await dispatch(fetchResourceListIfNeed());
    expect(result).toBeNull();
  });

  it('fetches resource metrics failed', async () => {
    const { dispatch, getActions } = mockStore();
    const expectedActions = [
      { type: getRequesting.type },
      { type: getFailure.type, payload: mockError },
    ];

    // @ts-expect-error
    axios.post.mockRejectedValue({ message: mockError });

    await dispatch(fetchResourceList());
    expect(getActions()).toEqual(expectedActions);
  });
});
