import FacultyMetricsRow from "./FacultyMetricsRow";

export default function FacultyMetricsTable({ faculty }) {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">

              <th className="text-left px-6 py-4 font-semibold text-gray-700 min-w-[250px]">
                Faculty Name
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700 min-w-[300px]">
                Google Scholar
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700 min-w-[300px]">
                Website 2
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700 min-w-[300px]">
                Website 3
              </th>

            </tr>
          </thead>

          <tbody>

            {faculty.length === 0 ? (

              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No faculty found.
                </td>
              </tr>

            ) : (

              faculty.map((member) => (
                <FacultyMetricsRow
                  key={member.id}
                  faculty={member}
                />
              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}