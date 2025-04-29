import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError('Failed to load project details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-50 to-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-white flex items-center justify-center">
      <div className="text-red-500 font-medium text-lg">{error}</div>
    </div>
  );

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-red-100">
          {/* Header with Back Button */}
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 w-fit"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              
              <button
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 w-fit"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                {project.name}
              </h1>
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300
                  ${project.status === 'In Progress' ? 'bg-red-100 text-red-700' :
                  project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'}`}
                >
                  {project.status}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{project.type}</span>
              </div>
            </div>
          </div>

          {/* Project Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 hover:shadow-red-100 hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="font-semibold text-gray-800">Location</h3>
              </div>
              <p className="text-gray-600">{project.location}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 hover:shadow-red-100 hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-gray-800">Timeline</h3>
              </div>
              <p className="text-gray-600">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 hover:shadow-red-100 hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-gray-800">Budget</h3>
              </div>
              <p className="text-gray-600">${parseFloat(project.budget).toLocaleString()}</p>
            </div>
          </div>

          {/* Project Description */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Project Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Project Progress</h3>
              <span className="text-lg font-bold text-red-600">{project.completion || 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-red-400 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${project.completion || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;