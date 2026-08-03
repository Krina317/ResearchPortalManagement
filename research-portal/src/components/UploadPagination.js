export default function UploadPagination() {
    return (
      <div className="flex items-center justify-between mt-5 mb-6">
  
        <p className="text-sm text-gray-500">
          Showing 1 - 25 of 214 rows
        </p>
  
        <div className="flex items-center gap-2">
  
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Previous
          </button>
  
          <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white">
            1
          </button>
  
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            2
          </button>
  
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            3
          </button>
  
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Next
          </button>
  
        </div>
  
      </div>
    );
  }