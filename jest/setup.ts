import "@testing-library/jest-dom/extend-expect";

jest.mock('react-chartjs-2', () => ({
  Line: () => null
}));