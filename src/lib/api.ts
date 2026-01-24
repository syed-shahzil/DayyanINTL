const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiClient {
    private token: string | null = null;
    private refreshToken: string | null = null;

    constructor() {
        this.token = localStorage.getItem('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
    }

    setTokens(access: string, refresh: string) {
        this.token = access;
        this.refreshToken = refresh;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    }

    clearTokens() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    async request(endpoint: string, options: RequestInit = {}) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            // TODO: Handle refresh token logic
            this.clearTokens();
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(errorData.detail || 'API Request Failed');
        }

        return response.json();
    }

    // Auth
    auth = {
        login: (data: any) => this.request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
        signup: (data: any) => this.request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
        me: () => this.request('/users/me'),
    };

    // Products
    products = {
        list: (params?: any) => {
            const query = new URLSearchParams(params).toString();
            return this.request(`/products?${query}`);
        },
        get: (id: string) => this.request(`/products/${id}`),
        create: (data: any) => this.request('/products', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => this.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => this.request(`/products/${id}`, { method: 'DELETE' }),
    };

    // Categories
    categories = {
        list: () => this.request('/categories'),
        create: (data: any) => this.request('/categories', { method: 'POST', body: JSON.stringify(data) }),
    };

    // Cart
    cart = {
        get: () => this.request('/cart/'),
        add: (productId: string, quantity: number) => this.request('/cart/', { method: 'POST', body: JSON.stringify({ product_id: productId, quantity }) }),
        update: (id: string, quantity: number) => this.request(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
        remove: (id: string) => this.request(`/cart/${id}`, { method: 'DELETE' }),
        clear: () => this.request('/cart/', { method: 'DELETE' }),
    };

    // Orders
    orders = {
        create: (data: any) => this.request('/orders/', { method: 'POST', body: JSON.stringify(data) }),
        myOrders: () => this.request('/orders/'),
        all: () => this.request('/orders/all'),
        updateStatus: (id: string, status: string) => this.request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    };

    // Wishlist
    wishlist = {
        list: () => this.request('/wishlist/'),
        add: (productId: string) => this.request('/wishlist/', { method: 'POST', body: JSON.stringify({ product_id: productId }) }),
        remove: (productId: string) => this.request(`/wishlist/${productId}`, { method: 'DELETE' }),
        check: (productId: string) => this.request(`/wishlist/check/${productId}`),
    };

    // Stats
    stats = {
        dashboard: () => this.request('/stats/dashboard'),
    };

    // Utils
    upload = (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        // Special handling for FormData (remove Content-Type header to let browser set boundary)
        return fetch(`${API_URL}/utils/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        }).then(res => {
            if (!res.ok) throw new Error('Upload failed');
            return res.json();
        });
    }
}

export const api = new ApiClient();
