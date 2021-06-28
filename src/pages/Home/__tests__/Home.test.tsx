import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { IConnection } from "../../../services/interfaces/connection.interface";
import { IDevice } from "../../../services/interfaces/device.interface";
import { IVital } from "../../../services/interfaces/vital.interface";
import { fetchDeviceListIfNeed } from "../../../store/device.list";
import mockStore from "../../../utils/mockStore";
import Home from "../Home";

describe("<Home />", () => {
  const renderHelper = (reducer = { readyStatus: "invalid" }) => {
    const { dispatch, ProviderWithStore } = mockStore({ deviceList: reducer, vitalList: reducer });
    const { container } = render(
      <ProviderWithStore>
        <MemoryRouter>
          {/* @ts-expect-error */}
          <Home />
        </MemoryRouter>
      </ProviderWithStore>
    );

    return { dispatch, firstChild: container.firstChild };
  };

  it("should fetch data when page loaded", () => {
    const { dispatch } = renderHelper();

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].toString()).toBe(
      fetchDeviceListIfNeed().toString()
    );
  });

  it("renders the loading status if data invalid", () => {
    expect(renderHelper().firstChild).toMatchSnapshot();
  });

  it("renders the loading status if requesting data", () => {
    const reducer = { readyStatus: "request" };

    expect(renderHelper(reducer).firstChild).toMatchSnapshot();
  });

  it("renders an error if loading failed", () => {
    const reducer = { readyStatus: "failure" };

    expect(renderHelper(reducer).firstChild).toMatchSnapshot();
  });

  it("renders the Chart Component if loading was successful", () => {
    const reducer = {
      readyStatus: "success",
      devices: [
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
      ],
      vitals: [
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
          id: "v1-1624261119060-2428637885473",
          name: "CLS",
          delta: 0.05607146357068885,
          value: 0.05607146357068885,
        } as IVital,
      ],
    };

    expect(renderHelper(reducer).firstChild).toMatchSnapshot();
  });

  it("not renders the Chart Component if loading was successful", () => {
    const reducer = {
      readyStatus: "success",
      devices: [],
      vitals: [
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
          id: "v1-1624261119060-2428637885473",
          name: "CLS",
          delta: 0.05607146357068885,
          value: 0.05607146357068885,
        } as IVital,
      ],
    };

    expect(renderHelper(reducer).firstChild).toMatchSnapshot();
  });
});
