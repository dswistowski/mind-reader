import React from 'react';
import { render } from '@testing-library/react';
import AppStateless from './App';

test('renders learn react link', () => {
  const { getByText } = render(<AppStateless />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
