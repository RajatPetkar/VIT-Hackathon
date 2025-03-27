// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function Plagiarism() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          Plagiarism & AI Content Detector
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col items-center space-y-4">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-50 hover:text-blue-700">
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base leading-normal">
                {file ? file.name : 'Select a file'}
              </span>
              <input 
                type="file" 
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              />
            </label>

            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Analyzing...' : 'Check Document'}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </form>

        {results && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <ScoreCard 
                title="Plagiarism Score"
                score={results.plagiarismScore}
                warning={results.warning}
                color="red"
              />
              <ScoreCard 
                title="AI Content Score"
                score={results.aiScore}
                warning={results.aiWarning}
                color="purple"
              />
              <ScoreCard 
                title="Overall Risk"
                score={results.overallScore}
                color="blue"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Text Excerpt</h3>
              <div className="bg-gray-50 p-4 rounded-md max-h-48 overflow-y-auto">
                {results.textExcerpt}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ScoreCard = ({ title, score, warning, color }) => (
  <div className={`p-4 rounded-lg border-l-4 border-${color}--500 bg-${color}-50`}>
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <div className="flex items-center justify-between">
      <div className="text-3xl font-bold">{score}%</div>
      <div className={`text-sm text-${color}-700`}>
        {warning && (
          <span className="bg-white px-2 py-1 rounded-full">{warning}</span>
        )}
      </div>
    </div>
  </div>
);

export default Plagiarism;