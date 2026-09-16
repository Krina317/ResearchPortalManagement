export default function FacultyMetricsRow({ faculty }) {

    return (
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
  
        {/* Faculty Name */}
        <td className="px-6 py-5 align-top">
  
          <div className="font-medium text-gray-800">
            {faculty.name}
          </div>
  
        </td>
  
        {/* Google Scholar */}
        <td className="px-6 py-5 align-top">
  
          <div className="space-y-2">
  
            <div className="flex justify-between">
              <span className="text-gray-500">
                Citations
              </span>
  
              <span className="font-semibold text-gray-800">
                —
              </span>
            </div>
  
            <div className="flex justify-between">
              <span className="text-gray-500">
                h-index
              </span>
  
              <span className="font-semibold text-gray-800">
                —
              </span>
            </div>
  
            <div className="flex justify-between">
              <span className="text-gray-500">
                i10-index
              </span>
  
              <span className="font-semibold text-gray-800">
                —
              </span>
            </div>
  
          </div>
  
        </td>
  
        {/* Website 2 */}
        <td className="px-6 py-5 align-top">
  
          <div className="text-gray-400">
            Metrics not available
          </div>
  
        </td>
  
        {/* Website 3 */}
        <td className="px-6 py-5 align-top">
  
          <div className="text-gray-400">
            Metrics not available
          </div>
  
        </td>
  
      </tr>
    );
  }