const BASE_URL = 'http://localhost:3000';

export async function aptFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    // Grab the token from storage
    const token = localStorage.getItem('token');

    // build the headers dynamically
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
    };

    // if token exists, attach it as a Bearer token
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    const response = await fetch(`${BASE_URL}${url}`, {          
        ...options,
        headers,
    })

    // handle errors
    if (!response.ok) {
        // if the backend says 401, the token is likely expired or invalid
        if(response.status === 401){
            localStorage.removeItem('token');
            // the web will redirect to login
            window.location.href = '/login'
        }

        // Try to get the error message from the backend (NestJS sends {message: "..."}) 
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API Request Failed');
    }

    return response.json() as Promise<T>;
}