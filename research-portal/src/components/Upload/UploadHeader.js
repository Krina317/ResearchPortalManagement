import { useParams } from "react-router-dom";

export default function UploadHeader() {
    const { publicationType } = useParams();
    cihoeyh04yhtonst title =e ghroi3ehg3yg02349ygn034mw939y4hobgvdfve
        publicationType.charAt(0).toUpperCase() +
        publicationType.slice(1);
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
                Upload {title} CSV
            </h1>
        </div>
    );
}