import axios from "axios";

import { IVital } from "../../services/interfaces/vital.interface";

import mockStore from "../../utils/mockStore";
import vitalList, {
  initialState,
  getRequesting,
  getSuccess,
  getFailure,
  fetchVitalList,
  fetchVitalListIfNeed,
} from "../vital.list";

jest.mock("axios");

const mockData = [
  {
    _id: "60d0431a74a8240af8781960",
    id: "v1-1624261119060-2428637885473",
    name: "FCP",
    delta: 1449.5999999940395,
    value: 1449.5999999940395,
  } as IVital,
  {
    _id: "60d0431a74a8240af8781961",
    id: "v1-1624261119060-2428637885473",
    name: "TTFB",
    delta: 353.7999999821186,
    value: 353.7999999821186,
  } as IVital,
  {
    _id: "60d0462a2fa99e0c816bcec7",
    id: "v1-1624262142614-3321620775826",
    name: "CLS",
    delta: 0.05607146357068885,
    value: 0.05607146357068885,
  } as IVital,
];
const mockError = "Oops! Something went wrong.";

describe("vital.list reducer tests", () => {
  it("should handle initial state for vitals", () => {
    // @ts-expect-error
    expect(vitalList(undefined, {})).toEqual(initialState);
  });

  it("should handle requesting for vitals correctly", () => {
    expect(vitalList(undefined, { type: getRequesting.type })).toEqual({
      readyStatus: "request",
      vitals: [],
      error: null,
    });
  });

  it("should handle success for vitals correctly", () => {
    expect(
      vitalList(undefined, { type: getSuccess.type, payload: mockData })
    ).toEqual({ ...initialState, readyStatus: "success", vitals: mockData });
  });

  it("should handle failure for vitals correctly", () => {
    expect(
      vitalList(undefined, { type: getFailure.type, payload: mockError })
    ).toEqual({ ...initialState, readyStatus: "failure", error: mockError });
  });
});

describe("vital.list action tests", () => {
  it("fetches web-vital metrics success", async () => {
    const { dispatch, getActions } = mockStore();
    const expectedActions = [
      { type: getRequesting.type },
      { type: getSuccess.type, payload: mockData },
    ];

    // @ts-expect-error
    axios.post.mockResolvedValue({ data: { result: mockData } });

    await dispatch(fetchVitalList());
    expect(getActions()).toEqual(expectedActions);
  });

  it('fetches web-vital metrics if current state.status is not successfull', async () => {
    const { dispatch, getActions } = mockStore({
      vitalList: {
        readyStatus: 'requesting',
        vitals: [],
        error: null,
      }      
    });
    const expectedActions = [
      { type: getRequesting.type },
      { type: getSuccess.type, payload: mockData },
    ];

    vitalList(undefined, { type: getRequesting.type });
    // @ts-expect-error
    axios.post.mockResolvedValue({ data: { result: mockData } });

    await dispatch(fetchVitalListIfNeed());
    expect(getActions()).toEqual(expectedActions);
  });

  it('fetches web-vital metrics if current state.status is successfull', async () => {
    const { dispatch } = mockStore({
      vitalList: {
        readyStatus: 'success',
        vitals: [],
        error: null,
      }
    });

    vitalList(undefined, { type: getRequesting.type });
    // @ts-expect-error
    axios.post.mockResolvedValue({ data: { result: mockData } });

    const result = await dispatch(fetchVitalListIfNeed());
    expect(result).toBeNull();
  });

  it("fetches web-vital metrics failed", async () => {
    const { dispatch, getActions } = mockStore();
    const expectedActions = [
      { type: getRequesting.type },
      { type: getFailure.type, payload: mockError },
    ];

    // @ts-expect-error
    axios.post.mockRejectedValue({ message: mockError });

    await dispatch(fetchVitalList());
    expect(getActions()).toEqual(expectedActions);
  });
});
