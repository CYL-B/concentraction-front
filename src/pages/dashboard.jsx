import Layout from "../components/layout/layout";
import Tabs from "../components/tabs";
import { DayView} from "../components/layout/views/dayview";
import { WeekView } from "../components/layout/views/weekview";
import { MonthView } from "../components/layout/views/monthview";

export default function Dashboard() {
  const tabButtons = ["Month view", "Day view", "Week view"];

  return (
    <Layout id="Backlog" headerTitle="Day">
      <Tabs
        tabsIds={tabButtons}
        getHeader={(tabId) => {
          return tabId;
        }}
        renderContent={(tabId) => {
          if (tabId === "Day view") {
            return <DayView />;
          } else if (tabId === "Week view") {
            return <WeekView />;
          } else {
            return <MonthView />;
          }
        }}
      />
    </Layout>
  );
}
