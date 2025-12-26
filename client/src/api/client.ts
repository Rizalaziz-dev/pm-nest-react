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

    // Smart Error Handling
    if (!response.ok) {
        // --- START INTEGRATION ---
        if (response.status === 401) {
            // 1. Wipe the dead token
            localStorage.removeItem('token');

            // 2. Redirect to login (Full page reload is safest here)
            // This ensures all React state is wiped clean
            window.location.href = '/login'; 
        }
        // --- END INTEGRATION ---
        let errorMessage = 'API Request Failed'

        try{
            // Catch the error from Nest JS as a JSON object in the Body
            const errorData = await response.json();

            // Check for the object as an array  or one line string 
            errorMessage = Array.isArray(errorData.message)
                // Grab the data as an array
                ? errorData.message[0]
                // If the data as a string it grab to not a problem
                : errorData.message;

        // Handle, if it's not a JSON
        } catch (parseError) {
            errorMessage = response.statusText || errorMessage
        }
        // Send the error message to tanstack 
        throw new Error(errorMessage)
    }

    return response.json() as Promise<T>;
}