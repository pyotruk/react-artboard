export const isZoom = (event: WheelEvent): boolean => event.ctrlKey;
export const isScroll = (event: WheelEvent): boolean => !event.ctrlKey;
