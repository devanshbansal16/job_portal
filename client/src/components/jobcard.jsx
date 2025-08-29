import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);

  // Navigate to apply page
  const handleApply = () => {
    navigate(`/apply-job/${job._id}`);
    scrollTo(0, 0);
  };

  // Navigate to detailed job page
  const handleLearnMore = () => {
    navigate(`/job/${job._id}`);
    scrollTo(0, 0);
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const companyLogoSrc = job.companyId?.imageUrl
    || (job.companyId?.image ? `${backendUrl}/uploads/${job.companyId.image}` : assets.default_company_logo);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4">
      
      {/* Company Icon */}
      <div className="flex justify-center">
        <img
          src={companyLogoSrc}
          alt={`${job.companyId?.name || "Company"} logo`}
          className="w-12 h-12 object-contain"
          onError={(e) => { e.currentTarget.src = assets.default_company_logo; }}
        />
      </div>

      {/* Job Title */}
      <h4 className="text-lg font-semibold text-center text-gray-800">{job.title}</h4>

      {/* Category & Location */}
      <div className="flex justify-center gap-4 text-sm text-gray-600">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
          {job.category || "General"}
        </span>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
          {job.location}
        </span>
      </div>

      {/* Short Description */}
      <p
        className="text-sm text-gray-500 leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(job.description.slice(0, 150) + '...')
        }}
      ></p>

      {/* Buttons */}
      <div className="flex justify-between gap-3 mt-auto">
        <button
          onClick={handleApply}
          aria-label="Apply for job"
          className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
        >
          Apply Now
        </button>
        <button
          onClick={handleLearnMore}
          aria-label="View job details"
          className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
