"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  visible: boolean;
  onClose: () => void;
  top?: string;
}

export const Notifications = ({
  message,
  type,
  visible,
  onClose,
  top = "2.5",
}: NotificationProps) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return visible
    ? createPortal(
        <div
          className={classNames(
            "fixed z-[99999] w-full max-w-md text-center",
            "rounded p-4 text-white shadow-lg",
            {
              "bg-green-500": type === "success",
              "bg-red-500": type === "error",
            },
            "sm:left-[15%]",
            "md:left-[22%]",
            "lg:left-[35%]",
            "transform lg:-translate-x-1/2",
          )}
          style={{
            top: `${top}rem`,
            animation: `${visible ? "slideIn" : "slideOut"} 0.5s forwards`,
            opacity: visible ? 1 : 0,
          }}
        >
          {message}
        </div>,
        document.body,
      )
    : null;
};
