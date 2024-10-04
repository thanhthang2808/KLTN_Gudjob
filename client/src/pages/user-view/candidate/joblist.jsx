import React, { useEffect, useState } from 'react';
import axios from 'axios';
import anhmau from '@/assets/anhmau.png';
import heart from '@/assets/heart.svg';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Replace this with your environment variable

function CandidateJobList() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // Fetch all jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/job/getall`, {
          withCredentials: true, // Include credentials if needed
        });
        setJobs(response.data.jobs); // Assuming the response structure has jobs inside data
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  // Handle click event to navigate to user news page
  const handleUserClickNews = (id) => {
    navigate(`/job/${id}`); // Navigate to job details page based on job ID
  };

  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', // Creates 3 equal columns
        gap: '10px', // Adds spacing between elements
        padding: '30px' 
      }}
    >
      {jobs.length > 0 ? jobs.map((job) => (
        <div key={job._id} style={{ backgroundColor: 'white', padding: '20px', display: 'flex' }}>
          <img 
            src={anhmau} 
            alt="anhmau" 
            className="w-20 h-auto" 
            style={{ marginRight: '30px' }} 
          />
          <div>
            <strong 
              onClick={() => handleUserClickNews(job._id)} 
              style={{ fontSize: 20, color: 'red', cursor: 'pointer' }}
            >
              {job.title}
            </strong><br/>
            <div style={{ fontSize: 18, color: 'silver' }}>{job.companyName}</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <h2 style={{ backgroundColor: '#f5f5dc', marginRight: 20 }}>
                {job.fixedSalary ? `${job.fixedSalary} Triệu` : `${job.salaryFrom}-${job.salaryTo} Triệu`}
              </h2>
              <h2 style={{ backgroundColor: '#f5f5dc', marginRight: 20 }}>{job.city}</h2>
              <img 
                src={heart} 
                alt="heart" 
                style={{ marginRight: '30px', width: 25, height: 25 }} 
              />
            </div>
          </div>
        </div>
      )) : (
        <p>No jobs available</p>
      )}
    </div>
  );
}

export default CandidateJobList;
