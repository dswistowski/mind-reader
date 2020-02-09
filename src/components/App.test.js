import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import App from './App';
import {generateUrlEntries} from "../stories/helpers";
import chrome from 'sinon-chrome/extensions'

const mockResults = () => generateUrlEntries(3);
const mockOnSearch = jest.fn();

jest.mock("../hooks", () => {
  return {
    useAppBusiness: () => ["current-search-phrase", mockOnSearch, mockResults()]
  }
});

beforeAll(() => {
  global.chrome = chrome
});

afterAll(() => {
  chrome.flush()
});

test('app should use input text from app business hook', () => {
  const {getByTestId} = render(<App />);
  const searchInput = getByTestId('search-input');
  expect(searchInput).toBeInTheDocument()
  expect(searchInput.value).toBe("current-search-phrase")
});

test('app should display all results from app business hook', () => {
  const {getAllByTestId} = render(<App />);
  const results = getAllByTestId('search-result');
  expect(results.length).toBe(3);
});

test('app should wire input change to app business hook',() => {
  const {getByTestId} = render(<App />);
  const searchInput = getByTestId('search-input');
  fireEvent.change(searchInput, {target: {value: "foo"}});
  expect(mockOnSearch).toBeCalledWith("foo")
})