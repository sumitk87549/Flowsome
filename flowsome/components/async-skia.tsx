// components/async-skia.tsx  (web/fallback stub — no real rendering)
export const Canvas = ({ children, ...props }: any) => null;
export const Circle = () => null;
export const Path = () => null;
export const Group = ({ children }: any) => null;
export const Paint = () => null;
export const vec = (x: number, y: number) => ({ x, y });
export const useDerivedValue = (fn: () => any, deps?: any[]) => ({ value: fn() });
export const useSharedValue = (val: any) => ({ value: val });
