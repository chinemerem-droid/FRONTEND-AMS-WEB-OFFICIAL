import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders the login page', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const heading = screen.getByRole('heading', { name: /welcome back/i });
  expect(heading).toBeInTheDocument();
});
