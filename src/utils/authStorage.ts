export const saveTokens = async (accessToken: string,
    refreshToken: string
) => {
    await localStorage.setItem('accessToken', accessToken);
}

export const getAccessToken = async () => {
    return localStorage.getItem('accessToken');
}

export const clearTokens = async () => {
    await localStorage.removeItem('accessToken');
}