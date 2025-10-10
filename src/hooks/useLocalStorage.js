
import { useEffect, useState } from 'react';
export function useLocalStorage(key, initialValue){
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initialValue; }
    catch { return initialValue; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.debug('localStorage set error', e); } }, [key, value]);
  return [value, setValue];
}
