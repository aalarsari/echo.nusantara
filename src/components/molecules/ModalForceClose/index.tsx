"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { SingleDeviceLogin } from "@/lib/nextAuth/SDL";

export const ModalForceClose = ({ session }: { session: any }) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSingleDeviceLogin = async () => {
      if (session) {
        try {
          const isSingleDeviceLogin = await SingleDeviceLogin(
            `/api/auth/get-sessionId?sessionId=${session.user.sessionId}`,
            "/api/auth/signout",
          );
          if (isSingleDeviceLogin) {
            setShowModal(true);
            document.body.style.overflow = "hidden";
          }
        } catch (error) {
          console.error("Error checking single device login:", error);
        }
      }
    };

    checkSingleDeviceLogin();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [session]);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleOkClick = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
    closeModal();
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-headline"
                    >
                      Peringatan!
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Anda telah login di perangkat lain. Silakan logout dari
                        perangkat tersebut jika ini bukan Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={handleOkClick}
                  type="button"
                  className="inline-flex w-full transform justify-center rounded-md bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-4 py-2 font-josefins text-base font-medium text-white shadow-sm outline-none transition-all duration-300 ease-in-out hover:scale-95 hover:bg-gradient-to-t hover:from-[#ab9a82] hover:to-[#ab9a82]  focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
