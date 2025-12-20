const BASE_URL = 'http://localhost:3000';

export async function aptFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
        },
        ...options,
    })

    if (!response.ok) {
        throw new Error('API Request Failed');
    }

    return response.json() as Promise<T>;
}