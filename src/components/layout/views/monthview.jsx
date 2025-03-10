import CalendarWrapper from "../../calendar/calendarWrapper";
import { Heading4 } from "../../typography";
import ObjectivesSection from "../../objectives/objectivesSection";

// import { useApolloClient } from "@apollo/client";
// import { GET_USER_TASKS } from "../../../services/queries";

export function MonthView() {
  // const client = useApolloClient();
  // const { tasks } = client.readQuery({
  //   query: GET_USER_TASKS,
  //   // Provide any required variables in this object.
  // }) || {};

  return (
    <section className="Monthview mt-[100px]">
      <div className="Monthview__calendar flex mb-6">
        <div className="Monthview__objectives basis-1/4 flex flex-col ">
          <Heading4 classHeading="underline mb-8">OBJECTIVES</Heading4>
          <ObjectivesSection />
        </div>
        <CalendarWrapper />
      </div>
    </section>
  );
}
