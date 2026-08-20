export default function PublicationHeader({ config }) {

    return (
        <div className="mb-6">

            <h1 className="text-3xl font-bold text-gray-800">
                {config.title}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
                Manage, filter and export {config.title.toLowerCase()}.
            </p>

        </div>
    );
}