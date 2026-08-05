import ConferenceHeader from "./ConferenceHeader";
import ConferenceToolbar from "./ConferenceToolbar";
import ConferenceFilter from "./ConferenceFilter";
import ConferenceTable from "./ConferenceTable";
import Pagination from "../Pagination";


export default function ConferencePage() {
  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <ConferenceHeader />
      <ConferenceToolbar />
      <ConferenceFilter />
      <ConferenceTable />
      <Pagination />
    </div>
  );
}