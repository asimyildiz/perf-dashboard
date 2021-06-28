import { RouteConfig, renderRoutes } from "react-router-config";
import { Helmet } from "react-helmet";

import config from "../config";
// Import your global styles here
import "bootstrap/dist/css/bootstrap.min.css";
import "normalize.css/normalize.css";
import styles from "./styles.module.scss";

interface Route {
  route: { routes: RouteConfig[] };
}

const App = ({ route }: Route): JSX.Element => (
  <div className={styles.App}>
    <Helmet {...config.APP} />    
    {/* Child routes won't render without this */}
    {renderRoutes(route.routes)}
  </div>
);

export default App;
