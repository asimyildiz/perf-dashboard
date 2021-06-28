import { IVital } from "../../services/interfaces/vital.interface";

import { groupBy, toMatrix } from "../helpers";

const vitals: IVital[] = [
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
  {
    _id: "60d4af1a4c8241001fbf3349",
    id: "v1-1624261119060-2428637885473",
    name: "CLS",
    delta: 0.04302019421032219,
    value: 0.04302019421032219,
  } as IVital,
];

describe("helpers tests", () => {
  it("should create a map correctly when groupBy is called", () => {
    const keys: string[] = [];
    const grouped = groupBy(vitals, (vital: IVital) => vital.name);
    grouped.forEach((_, key: string) => keys.push(key));

    expect(keys).toHaveLength(3);
    expect(grouped.get('FCP')?.[0]._id).toBe('60d0431a74a8240af8781960');
  }); 

  it("should create a matrix of matrices when toMatrix is called", () => {
    const keys: string[] = [];
    const grouped = groupBy(vitals, (vital: IVital) => vital.name);
    grouped.forEach((_, key: string) => keys.push(key));

    const gridKeys: string[][] = toMatrix(keys, 2);
    expect(gridKeys).toHaveLength(2);
    expect(gridKeys[0]).toHaveLength(2);
    expect(gridKeys[1]).toHaveLength(1);
  })
});