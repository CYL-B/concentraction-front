import debounce from "lodash.debounce";
import { useCallback, useMemo } from 'react'


export default function debounceDnD(functionToDebounce, delay) {
    return (
    useMemo(()=>debounce(functionToDebounce, delay),  []))
}

