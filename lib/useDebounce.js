import { useState, useEffect } from 'react';
// Our hook
export default function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // Return a cleanup function that will be called every time ...
    // ... useEffect is re-called. useEffect will only be re-called ...
    // ... if value changes (see the inputs array below).
    // This is how we prevent debouncedValue from changing if value is ...
    // ... changed within the delay period. Timeout gets cleared and restarted.
    // To put it in context, if the user is typing within our app's ...
    // ... search box, we don't want the debouncedValue to update until ...
    // ... they've stopped typing for more than 500ms.
    return () => {
      clearTimeout(handler);
    };
  });
  return debouncedValue;
}
