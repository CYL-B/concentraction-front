import { useContext } from "react";
import { ModalContext } from "../modal/modalContext";
/** Element that represents a list in a given board with the whole droppable and draggable logic that works thanks to sortable Context */
import { Heading4 } from "../typography";
import IconifyIcon from "../icon";
import { AddButton } from "../button";
import { Card, CardButtonsBar } from "./card";

//dnd kit
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

//Dnd structure elements
import Droppable from "./droppable";
import Draggable from "./draggable";

export default function ListCard({
  listTitle,
  handleDelete = () => {},
  taskList = [],
  ...listCardProps
}) {
  const { handleOpenModal, handleUpdateTaskFunction } =
    useContext(ModalContext);

  const openModal = () => {
    let dateOfTheDay = new Date().toLocaleDateString("fr");
    let newTask = { startDate: dateOfTheDay, status: listTitle };
    handleUpdateTaskFunction(newTask);
    console.log("newTask", newTask);
    handleOpenModal();
  };
  return (
    <SortableContext
      id={listTitle}
      items={taskList}
      strategy={verticalListSortingStrategy}
      {...listCardProps}
    >
      <Droppable elementId={listTitle}>
        <div className="container-drop min-w-[200px] md:min-w-[296px] flex flex-col justify-between border container-drag border-solid border-neutral-black bg-neutral-white">
          <div className="list-header flex justify-between items-center border-b border-solid border-neutral-black px-3">
            <Heading4>{listTitle}</Heading4>
            <button onClick={handleDelete}>
              <IconifyIcon height={20} width={20} iconName="ph:trash-thin" />
            </button>
          </div>
          <div className=" list-body draggable gap-y-2 p-2 flex flex-col h-full">
            {taskList &&
              taskList.map((task, index) => {
                return (
                  <div className="group relative transition duration-200">
                    <Draggable id={task.id}>
                      <Card
                        key={task.name}
                        cardId={task.id}
                        cardTitle={task.name}
                        cardDate={task.endDate}
                        cardTag={task.category}
                      />
                    </Draggable>
                    <CardButtonsBar
                      cardButtonsBarDeleteId={task.id}
                      cardButtonsBarClass={
                        " max-h-0 pointer-events-none scale-95 opacity-0 overflow-hidden translate-y-[-0.25rem] transition-all transition-behavior[allow-discrete] duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-hover:scale-100 group-hover:max-h-20"
                      }
                    />
                  </div>
                );
              })}
          </div>
          <div className="list-footer border-t border-solid border-color-light-grey py-1">
            <AddButton
              addButtonClass="m-auto"
              addText={true}
              onClick={openModal}
            >
              Ajouter
            </AddButton>
          </div>
        </div>
      </Droppable>
    </SortableContext>
  );
}
