export default function ServiceTable({ includedServices, excludedServices }) {
    return (
        <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-orange-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800">Included</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800">Excluded</th>
                </tr>
            </thead>
            <tbody>
                <tr className="even:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                        <ul className="list-disc">
                            {includedServices?.length > 0 ? (
                                includedServices.map((service, index) => <li key={index}>{service.services}</li>)
                            ) : (
                                <li>No services included.</li>
                            )}
                        </ul>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        <ul className="list-disc">
                            {excludedServices?.length > 0 ? (
                                excludedServices.map((service, index) => <p key={index}>{service.services}</p>)
                            ) : (
                                <li>No services excluded.</li>
                            )}
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
