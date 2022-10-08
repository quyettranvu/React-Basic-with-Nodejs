export const setLocalStorage = (key,value)=>{
    localStorage.setItem(key,JSON.stringify(value));
}

export const getLocalStorage = (key,value)=>{
    return JSON.parse(localStorage.getItem(key));
}

export const deleteLocalStorage = (key)=>{
    localStorage.removeItem(key);
}