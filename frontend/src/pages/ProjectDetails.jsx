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
        const response = await axios.get(`http://localhost:5000/api/projects/${id}`);
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-red-600 font-medium text-lg">{error}</div>
    </div>
  );

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header with Back Button */}
          <div className="flex flex-col space-y-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 w-fit"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-900">{project.name}</h1>
          </div>

          {/* Rest of the project details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="group">
                <h3 className="text-sm font-medium text-gray-500">Project Type</h3>
                <p className="mt-2 text-lg text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                  {project.type}
                </p>
              </div>
              
              <div className="group">
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-2 text-lg text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                  {project.location}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full transition-all duration-300
                  ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'}`}
                >
                  {project.status}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <h3 className="text-sm font-medium text-gray-500">Project Timeline</h3>
                <p className="mt-2 text-lg text-gray-700">
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="group">
                <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                <p className="mt-2 text-lg text-gray-700">
                  ${parseFloat(project.budget).toLocaleString()}
                </p>
              </div>
              
              <div className="group">
                <h3 className="text-sm font-medium text-gray-500">Project Manager</h3>
                <p className="mt-2 text-lg text-gray-700">
                  {project.manager}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Project Description</h3>
            <p className="text-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Project Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${project.completion || 0}%` }}
              ></div>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600">
              {project.completion || 0}% Complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;