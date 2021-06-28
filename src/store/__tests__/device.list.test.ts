import axios from "axios";

import { IConnection } from "../../services/interfaces/connection.interface";
import { IDevice } from "../../services/interfaces/device.interface";

import mockStore from "../../utils/mockStore";
import deviceList, {
  initialState,
  getRequesting,
  getSuccess,
  getFailure,
  fetchDeviceList,
  fetchDeviceListIfNeed,
} from "../device.list";

jest.mock("axios");

const mockData = [
  {
    _id: "60d0431a74a8240af878195e",
    id: "v1-1624261119060-2428637885473",
    url: "http://localhost/kasaba/",
    referrer: "",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
    memory: 8,
    cpus: 8,
    connection: {
      effectiveType: "4g",
      rtt: 50,
      downlink: 10,
    } as IConnection,
    createdAt: "2021-06-21T07:43:22.700+00:00"
  } as IDevice,
];
const mockError = "Oops! Something went wrong.";

describe("device.list reducer tests", () => {
  it("should handle initial state for devices", () => {
    // @ts-expect-error
    expect(deviceList(undefined, {})).toEqual(initialState);
  });

  it("should handle requesting for devices correctly", () => {
    expect(deviceList(undefined, { type: getRequesting.type })).toEqual({
      readyStatus: "request",
      devices: [],
      error: null,
    });
  });

  it("should handle success for devices correctly", () => {
    expect(
      deviceList(undefined, { type: getSuccess.type, payload: mockData })
    ).toEqual({ ...initialState, readyStatus: "success", devices: mockData });
  });

  it("should handle failure for devices correctly", () => {
    expect(
      deviceList(undefined, { type: getFailure.type, payload: mockError })
    ).toEqual({ ...initialState, readyStatus: "failure", error: mockError });
  });
});

describe("device.list action tests", () => {
  it("fetches device list successful", async () => {
    const { dispatch, getActions } = mockStore();
    const expectedActions = [
      { type: getRequesting.type },
      { type: getSuccess.type, payload: mockData },
    ];

    // @ts-expect-error
    axios.post.mockResolvedValue({ data: { result: mockData } });

    await dispatch(fetchDeviceList());
    expect(getActions()).toEqual(expectedActions);
  });

  it('fetches devices if current state.status is not successfull', async () => {
    const { dispatch, getActions } = mockStore({
      deviceList: {
        readyStatus: 'requesting',
        devices: [],
        error: null,
      }      
    });
    const expectedActions = [
      { type: getRequesting.type },
      { type: getSuccess.type, payload: mockData },
    ];

    deviceList(undefined, { type: getRequesting.type });
    // @ts-expect-error
    axios.post.mockResolvedValue({ data: { result: mockData } });

    await dispatch(fetchDeviceListIfNeed());
    expect(getActions()).toEqual(expectedActions);
  });

  it('fetches devices if current state.status is successfull', async () => {
    const { dispatch } = mockStore({
      deviceList: {
        readyStatus: 'success',
        devices: [],
        error: null,
      }
    });

    deviceList(undefined, { type: getRequesting.type });
    // @ts-expect-error
    axios.post.mockResolvedValue({ data: { result: mockData } });

    const result = await dispatch(fetchDeviceListIfNeed());
    expect(result).toBeNull();
  });

  it("fetches device list failed", async () => {
    const { dispatch, getActions } = mockStore();
    const expectedActions = [
      { type: getRequesting.type },
      { type: getFailure.type, payload: mockError },
    ];

    // @ts-expect-error
    axios.post.mockRejectedValue({ message: mockError });

    await dispatch(fetchDeviceList());
    expect(getActions()).toEqual(expectedActions);
  });
});
