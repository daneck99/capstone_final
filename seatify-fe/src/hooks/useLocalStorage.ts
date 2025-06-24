import { useEffect, useState } from 'react';

 
const useLocalStorage = <ValueType>(key: string, defaultValue: ValueType) => {
  const [value, setValue] = useState(() => {
    const storedValue =
      typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  });

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (
        typeof window !== 'undefined' &&
        e.storageArea === localStorage &&
        e.key === key
      ) {
        setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
      }
    };

    // local 저장소가 변경되면 호출됨
    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key, defaultValue]);

  // 저장소 및 State 값 변경
  const setLocalStorageValue = (newValue: ValueType) => {
    setValue((currentValue: ValueType) => {
      const result =
        typeof newValue === 'function' ? newValue(currentValue) : newValue;
      if (typeof window !== 'undefined')
        localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  return [value, setLocalStorageValue];
};

export default useLocalStorage;
