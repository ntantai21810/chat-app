import { RefObject, useCallback, useEffect } from "react";

export const useDetectClickOutside = (
  ref: RefObject<any>,
  onClick: () => any
) => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClick();
      }
    },
    [ref, onClick]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handleClickOutside]);
};
