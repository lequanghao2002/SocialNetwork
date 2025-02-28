export const setLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error set local storage: ', error);
    }
};

export const getLocalStorage = (key) => {
    try {
        const value = localStorage.getItem(key);

        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error get local storage: ', error);
    }
};

export const removeLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error remove local storage: `, error);
    }
};
