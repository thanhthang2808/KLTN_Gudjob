import React from 'react';

function AdminTransactions() {
  // Hardcoded transactions data
  const transactions = [
    {
      id: 1,
      user: 'Alice Nguyen',
      amount: '$150.00',
      date: '2023-10-15',
      status: 'Completed',
    },
    {
      id: 2,
      user: 'Bob Tran',
      amount: '$300.00',
      date: '2023-10-16',
      status: 'Pending',
    },
    {
      id: 3,
      user: 'Carol Le',
      amount: '$200.00',
      date: '2023-10-17',
      status: 'Failed',
    },
  ];

  return (
    <div className="flex flex-col items-center w-full p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Transaction History</h1>
      <div className="overflow-x-auto w-full max-w-4xl bg-white rounded-lg shadow-md p-4">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-blue-600 border-b border-gray-200">
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 py-2 border-b border-gray-200">{transaction.id}</td>
                <td className="px-4 py-2 border-b border-gray-200">{transaction.user}</td>
                <td className="px-4 py-2 border-b border-gray-200">{transaction.amount}</td>
                <td className="px-4 py-2 border-b border-gray-200">{transaction.date}</td>
                <td
                  className={`px-4 py-2 border-b border-gray-200 font-semibold ${
                    transaction.status === 'Completed'
                      ? 'text-green-600'
                      : transaction.status === 'Pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTransactions;
