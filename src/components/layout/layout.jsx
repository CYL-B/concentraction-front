/** Layout to be used in all pages except sign-up. It includes :
 * header at top
 * navbar
 * footer at bottom
 * scrolltop at the bottom right corner
 * modal that shows up to add or update a task
 */

import { Header } from "./header";
import Footer from "./footer";
import NavBar from "../navigation/navBar";
import Scrolltop from "../scrolltop";

import { Modal } from "../modal/modal";
import { ModalProvider, ModalContext } from "../modal/modalContext";
export default function Layout({
  children,
  containerClassName,
  headerTitle,
  mainClassName,
  id,
  pageClassName,
}) {
  const scrollToMain = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <ModalProvider>

    <div id={id} className="layout flex w-screen min-h-screen bg-background ">
      <Modal/>
      <NavBar />
      <main
        role="main"
        className={`relative z-10 p-10 min-h-screen box-border overflow-x-hidden overflow-y-hidden w-full ${
          mainClassName ?? ""
        }`}
      >
        <Header headerTitle={headerTitle}></Header>
        <div className={`container mx-auto pb-14 ${containerClassName ?? ""}`}>
          <div className={`w-full ${pageClassName ?? ""}`}>{children}</div>
        </div>
        <Footer />
      </main>
      <Scrolltop scrollToTop={scrollToMain} />
    </div>
    </ModalProvider>
  );
}
//?? : if value on the left is defined, it returns said value, if not, returns value on the right
