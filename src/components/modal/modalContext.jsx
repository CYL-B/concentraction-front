import { createContext } from "react";
import { useOpenModal } from "../../utils/hooks/openModal";

//creates object ModalContext
export const ModalContext = createContext();

export function ModalProvider({ children }) {
  //retrieves values returned from custom hook and pass them to the provider so children components in the tree  can access them
  const {modal, handleOpenModal, closeModal, ref, todayTask, handleUpdateTaskFunction } = useOpenModal();
  return (
    <ModalContext.Provider value={{ modal, handleOpenModal, closeModal, ref, todayTask, handleUpdateTaskFunction}}>
      {children}
    </ModalContext.Provider>
  );
}
