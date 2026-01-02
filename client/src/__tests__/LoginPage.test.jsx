import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("axios");

describe("LoginPage", () => {
  it("calls axios.post on Login and handles role", async () => {
    axios.post.mockResolvedValueOnce({ data: { role: "Admin" } });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Username:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const loginBtn = screen.getByText("Login");

    fireEvent.change(usernameInput, { target: { value: "admin" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/users/login", { username: "admin", password: "secret" });
    });
  });
});
