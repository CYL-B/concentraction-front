/** Whole calendar wrapping every day of each month with tasks due on that day
 * Include logic to generate as many Day components as there are days in the month
 * Include logic to generate as many MiniCard components as there are tasks due on each day **/
import { useState } from "react";
import { Day } from "./day";

//Custom date
import { getDaysInMonth, filteredTasks } from "../../utils/hooks/getDate";

//Apollo client import
import { useQuery } from "@apollo/client";
import { GET_USER_TASKS } from "../../services/queries";

export default function CalendarWrapper() {
  const [tasksMap, setTasksMap] = useState([]);
  const { data, loading, error } = useQuery(GET_USER_TASKS, {
    onCompleted: (data) => {
      //add confirmation message
      var dataFrom = data.getTasks.user.tasks;
      setTasksMap(dataFrom);
    },
    update(cache, { data }) {
      //current state of tasks
      const { tasks } = cache.readQuery({
        query: GET_USER_TASKS,
      });
      //change the data within the cache for get user tasks, copying current tasks and adding the new one
      cache.writeQuery({
        query: GET_USER_TASKS,
        data: {
          user: {
            tasks: [data.addTask, ...tasks],
          },
        },
      });
    },
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  //permet de créer un tableau à partir des valeurs
  const numberOfDays = [
    ...Array.from(getDaysInMonth(currentYear, currentMonth)),
  ];

  return (
    <div className="calendarWrapper grid grid-cols-3 basis-3/4 gap-2">
      {numberOfDays.map((date, index) => (
        <Day day={index + 1} key={date} tasks={filteredTasks(tasksMap, date)} />
      ))}
    </div>
  );
}
