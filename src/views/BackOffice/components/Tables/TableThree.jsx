const packageData = [
  {
    name: 'Free package',
    price: 0.0,
    invoiceDate: `Jan 13,2023`,
    status: 'Paid',
  },
  {
    name: 'Standard Package',
    price: 59.0,
    invoiceDate: `Jan 13,2023`,
    status: 'Paid',
  },
  {
    name: 'Business Package',
    price: 99.0,
    invoiceDate: `Jan 13,2023`,
    status: 'Unpaid',
  },
  {
    name: 'Standard Package',
    price: 59.0,
    invoiceDate: `Jan 13,2023`,
    status: 'Pending',
  },
];

const TableThree = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                            First Name
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Last Name
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Email
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            Creation Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user, key) => (
                        <tr key={key} className="border-b border-[#eee] dark:border-strokedark">
                            <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                <h5 className="font-medium text-black dark:text-white">{user.firstName}</h5>
                            </td>
                            <td className="py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{user.lastName}</p>
                            </td>
                            <td className="py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{user.email}</p>
                            </td>
                            <td className="py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{user.createdAt}</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
};

export default TableThree;
