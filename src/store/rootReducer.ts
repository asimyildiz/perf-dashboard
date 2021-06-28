import { History } from "history";
import { connectRouter } from "connected-react-router";

import deviceList from "./device.list";
import vitalList from "./vital.list";
import resourceList from "./resource.list";

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
  deviceList,
  vitalList,
  resourceList,
  router: connectRouter(history) as any,
  // Register more reducers...
});
