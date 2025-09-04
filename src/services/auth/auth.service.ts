import { API_END_POINT } from '../../helpers/config';
import type { SignUpPayload } from '../../types/auth';

interface FetchOptions extends RequestInit {
  skipRefresh?: boolean;
}

export class AuthService {
  private async fetchWithAuth(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const token = sessionStorage.getItem('access_token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle token refresh on 401
    if (response.status === 401 && !options.skipRefresh) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry original request with new token
        return this.fetchWithAuth(url, { ...options, skipRefresh: true });
      }
    }

    return response;
  }

  async createUser(user: SignUpPayload) {
    const res = await fetch(`${API_END_POINT}/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res;
  }

  async updateUserPassword({
    session_id,
    new_password,
  }: {
    session_id: string;
    new_password: string;
  }) {
    const res = await fetch(`${API_END_POINT}/auth/password-reset`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', // Add this
      },
      body: JSON.stringify({
        session_id,
        new_password,
      }),
    });
    return res;
  }

  // async deleteUser(token: string, userId: string) {
  //   const res = await this.fetchWithAuth(`api/users/delete-user/${userId}`, {
  //     method: 'DELETE',
  //   });
  //   return res;
  // }

  async loginUser(user: { email: string; password: string }) {
    const formData = new URLSearchParams();
    formData.append('username', user.email);
    formData.append('password', user.password);

    const res = await fetch(`${API_END_POINT}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });
    return res;
  }

  async sendOTPMail(email: string) {
    const res = await fetch(`${API_END_POINT}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return res;
  }

  async checkOTP(otp: string) {
    const res = await fetch(
      `${API_END_POINT}/auth/password-reset-session/${otp}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res;
  }

  async refreshToken(): Promise<{ access_token: string } | null> {
    try {
      const res = await fetch(`${API_END_POINT}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('access_token', data.access_token);
        return data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async fetchCurrentUser() {
    const res = await this.fetchWithAuth('/user/profile');
    return res;
  }

  async logout() {
    const res = await this.fetchWithAuth('/auth/sign-out', {
      method: 'DELETE',
    });
    return res;
  }
}

export const authService = new AuthService();
