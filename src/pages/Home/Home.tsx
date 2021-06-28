import { FC, useEffect, memo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Helmet } from 'react-helmet';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { AppState, AppThunk } from '../../store';
import { IVital } from '../../services/interfaces/vital.interface';
import { IDevice } from '../../services/interfaces/device.interface';
import { fromVital } from '../../interfaces/chartdata.interface';
import { fetchDeviceListIfNeed } from '../../store/device.list';
import { fetchVitalListIfNeed } from '../../store/vital.list';
import { groupBy, toMatrix } from '../../utils/helpers';
import { Chart } from '../../components';
import styles from './styles.module.scss';

export type Props = RouteComponentProps;

const Home: FC<Props> = (): JSX.Element => {
  const dispatch = useDispatch();
  const { deviceList, vitalList } = useSelector(
    (state: AppState) => state,
    shallowEqual,
  );

  // Fetch client-side data here
  useEffect(() => {
    dispatch(fetchDeviceListIfNeed());
  }, [dispatch]);

  const renderVitals = () => {
    const { readyStatus, vitals } = vitalList;

    if (!readyStatus || readyStatus === 'invalid' || readyStatus === 'request')
      return <p>Please select an url to display a web-site performance...</p>;

    if (readyStatus === 'failure') return <p>Oops, Failed to load list!</p>;

    const { devices } = deviceList;
    const keys: string[] = [];
    const grouped: Map<string, IVital[]> = groupBy(
      vitals,
      (vital: IVital) => vital.name,
    );
    grouped.forEach((_, key: string) => keys.push(key));

    const gridKeys: string[][] = toMatrix(keys, 2);
    return gridKeys.map((rowKeys: string[], index: number) => (
      <Row key={`row_${rowKeys[index]}`}>
        {rowKeys.map((colKey) => (
          <Col key={colKey} xs="6">
            <Chart
              title={colKey}
              devices={devices}
              items={fromVital(grouped.get(colKey))}
            />
          </Col>
        ))}
      </Row>
    ));
  };

  const onSelectUrl = (url: string | null): void => {
    const { readyStatus, devices } = deviceList;
    if (readyStatus === 'success' && devices.length > 0) {
      const ids: string[] = devices
        .filter((device: IDevice) => device.url === url)
        .map((device: IDevice) => device.id);
      dispatch(fetchVitalListIfNeed(ids));
    }
  };

  const renderUrls = () => {
    const { readyStatus, devices } = deviceList;

    if (
      !readyStatus ||
      readyStatus === 'invalid' ||
      readyStatus === 'request'
    ) {
      return <NavDropdown.Item href="#">Loading...</NavDropdown.Item>;
    }

    if (readyStatus === 'failure') {
      return (
        <NavDropdown.Item href="#">Could not fetch web-sites!</NavDropdown.Item>
      );
    }

    if (devices.length > 0) {
      const keys: string[] = [];
      const grouped = groupBy(devices, (device: IDevice) => device.url);
      grouped.forEach((_, key: string) => keys.push(key));

      return keys.map((key: string) => (
        <NavDropdown.Item
          key={`urls_${grouped.get(key)?.[0]?._id}`}
          eventKey={key}
        >
          {key}
        </NavDropdown.Item>
      ));
    }

    return (
      <NavDropdown.Item href="#">
        There are no web-sites reported!
      </NavDropdown.Item>
    );
  };

  return (
    <div className={styles.Home}>
      <Helmet title="Home" />
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Perf Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" onSelect={onSelectUrl}>
            <NavDropdown title="Urls" id="basic-nav-dropdown">
              {renderUrls()}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid>{renderVitals()}</Container>
    </div>
  );
};

// Fetch server-side data here
export const loadData = (): AppThunk[] => [
  fetchDeviceListIfNeed(),
  // More pre-fetched actions...
];

export default memo(Home);
