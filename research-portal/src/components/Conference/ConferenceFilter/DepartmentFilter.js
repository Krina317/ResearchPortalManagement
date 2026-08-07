import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function DepartmentFilter({ selectedDepartments, onChange }) {

    const departments = ["CE", "IT", "MCA", "PGIN"];

    const [showPopup, setShowPopup] = useState(false);
    const [searchText, setSearchText] = useState("");
    const popupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleDepartmentChange(department) {
        if (selectedDepartments.includes(department)) {
            onChange(selectedDepartments.filter(item => item !== department));
        } else {
            onChange([...selectedDepartments, department]);
        }
    }

    function selectAll(){ onChange(departments); }
    function clearAll(){ onChange([]); }

    const filteredDepartments = departments.filter(d =>
        d.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="relative" ref={popupRef}>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
            </label>

            <button
                onClick={() => setShowPopup(!showPopup)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center bg-white hover:border-emerald-500"
            >
                {selectedDepartments.length === 0 ? "Select Department" : `${selectedDepartments.length} Selected`}
                <ChevronDown size={18} />
            </button>

            {showPopup && (
                <div className="absolute left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50">

                    <div className="px-5 py-4 border-b">
                        <h2 className="font-semibold">Select Departments</h2>
                    </div>

                    <div className="p-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search Department"
                                className="w-full border rounded-lg pl-9 pr-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between px-5 pb-3 text-sm">
                        <button onClick={selectAll} className="text-emerald-600 hover:underline">Select All</button>
                        <button onClick={clearAll} className="text-red-500 hover:underline">Clear</button>
                    </div>

                    <div className="max-h-60 overflow-y-auto px-5 pb-4">
                        {filteredDepartments.map(department => (
                            <label key={department} className="flex items-center gap-3 py-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedDepartments.includes(department)}
                                    onChange={() => handleDepartmentChange(department)}
                                />
                                {department}
                            </label>
                        ))}
                    </div>

                    <div className="border-t p-4 flex justify-end gap-3">
                        <button onClick={() => setShowPopup(false)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">Cancel</button>
                        <button onClick={() => setShowPopup(false)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Apply</button>
                    </div>

                </div>
            )}

        </div>
    );
}