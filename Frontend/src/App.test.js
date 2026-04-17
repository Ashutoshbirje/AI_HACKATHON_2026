import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Welcome to Fusion Force/i);
  expect(headingElement).toBeInTheDocument();
});
