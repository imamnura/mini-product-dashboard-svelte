import { describe, it, expect } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  it('should debounce function calls', async () => {
    let count = 0;
    const increment = () => count++;
    const debouncedIncrement = debounce(increment, 100);

    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    expect(count).toBe(0);

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(count).toBe(1);
  });

  it('should pass arguments correctly', async () => {
    let result = '';
    const setValue = (val: string) => {
      result = val;
    };
    const debouncedSetValue = debounce(setValue, 50);

    debouncedSetValue('first');
    debouncedSetValue('second');
    debouncedSetValue('third');

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result).toBe('third');
  });

  it('should use custom delay', async () => {
    let executed = false;
    const fn = () => {
      executed = true;
    };
    const debouncedFn = debounce(fn, 200);

    debouncedFn();

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(executed).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(executed).toBe(true);
  });
});
