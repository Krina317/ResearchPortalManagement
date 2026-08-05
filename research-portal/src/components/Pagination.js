export default function Pagination() {
    return (
        <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500">
                Page 1 of 20
            </p>
            <div className="flex gap-2">
                <button className="border px-4 py-2 rounded-lg">
                    Previous
                </button>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
                    1
                </button>
                <button className="border px-4 py-2 rounded-lg">
                    2
                </button>
                <button className="border px-4 py-2 rounded-lg">
                    3
                </button>
                <button className="border px-4 py-2 rounded-lg">
                    Next
                </button>
            </div>
        </div>
    );
}