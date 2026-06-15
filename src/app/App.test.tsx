import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "./store";
import App from "./App";
import ContextProvider from "./context/ContextProvider";

test("renders app without crashing", () => {
  const { container } = render(
    <Provider store={store}>
      <ContextProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ContextProvider>
    </Provider>,
  );

  expect(container).toBeInTheDocument();
});
