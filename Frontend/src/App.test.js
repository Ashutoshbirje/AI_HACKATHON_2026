import { render } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: () => null,
  Navigate: () => null,
}));

test('app renders', () => {
  render(<App />);
});