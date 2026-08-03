import UploadHeader from "./UploadHeader";
import UploadBox from "./UploadBox";
import UploadPreviewTable from "./UploadPreviewTable";
import UploadSummaryCard from "./UploadSummaryCard";
import UploadPagination from "./UploadPagination";

export default function UploadPage() {

    return (

        <div className="px-8 py-6 bg-gray-50 min-h-screen">

            <UploadHeader/>

            <UploadBox/>

            <UploadPreviewTable/>

            <UploadPagination/>

            <UploadSummaryCard/>

        </div>

    );

}