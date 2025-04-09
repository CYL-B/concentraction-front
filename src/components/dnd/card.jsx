/**Element that represents a task in a given list
 * cardDivider : divider between title and date
 * cardDeleteButton : button to delete the task
 * cardUpdateButton : button to update the task (triggers modal)**/

import { Body } from "../typography";
import Tag from "../tags";
import IconifyIcon from "../icon";

export function Card({ cardTitle, cardDate, cardTag, ...cardProps }) {
  //only creates a new card if given a title and due date
  if (cardTitle && cardDate) {
    return (
      <div
        {...cardProps}
        className="flex justify-between items-end h-fit bg-brand-blue rounded-xl p-2"
      >
        <div className="left-section">
          <Body classBody="font-bold text-neutral-white pb-1 text-shadow-card">
            {cardTitle}
          </Body>
          <CardDivider />
          <Body
            classBody="text-neutral-white pt-1 text-shadow-card"
            body2={true}
          >
            {cardDate}
          </Body>
        </div>
        <div className="middle-section">{cardTag && <Tag>{cardTag}</Tag>}</div>
      </div>
    );
  } else {
    return;
  }
}

function CardDivider() {
  return <hr className="text-neutral-white"></hr>;
}

export function CardButtonsBar({cardButtonsBarClass, cardButtonsBarDeleteId }) {

  const handleDeleteTask = () => {
    console.log("delete task", cardButtonsBarDeleteId);
  }

  const handleUpdateTask = () => {
      
  }
  return (
    <div className={`cardButtonsBar flex justify-between border-brand-blue border-solid border-l border-r border-b rounded-b-xl p-2 ${cardButtonsBarClass}`} {...cardButtonsBarDeleteId}>
      <button aria-label="update task" onClick={handleUpdateTask}>
        <Body classBody="text-brand-blue">Update</Body>
        {/* <IconifyIcon
          width={20}
          height={20}
          iconName="system-uicons:chevron-right"
          iconClassName="text-brand-blue text-shadow-card"
        /> */}
      </button>
      <button aria-label="delete task" onClick={handleDeleteTask}>
      <Body classBody="text-brand-red">Delete</Body>
        {/* <IconifyIcon
          width={20}
          height={20}
          iconName="system-uicons:cross-circle"
          iconClassName="text-brand-blue text-shadow-card"
        /> */}
      </button>
    </div>
  );
}
