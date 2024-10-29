import React from 'react';

function RecruiterHome() {
  // Hardcoded recommended candidates data
  const recommendedCandidates = [
    {
      id: 1,
      name: 'Alice Nguyen',
      skills: ['React', 'JavaScript', 'UI Design'],
      location: 'San Francisco, CA',
      experience: '3 years',
    },
    {
      id: 2,
      name: 'Bob Tran',
      skills: ['Node.js', 'Express', 'MongoDB'],
      location: 'Austin, TX',
      experience: '5 years',
    },
    {
      id: 3,
      name: 'Carol Le',
      skills: ['Python', 'Data Analysis', 'Machine Learning'],
      location: 'Seattle, WA',
      experience: '4 years',
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-6 bg-gradient-to-br from-blue-100 to-blue-300">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8">Recommended Candidates</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {recommendedCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="flex flex-col p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-blue-800">{candidate.name}</h2>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Location:</span> {candidate.location}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Experience:</span> {candidate.experience}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Skills:</span> {candidate.skills.join(', ')}
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecruiterHome;
