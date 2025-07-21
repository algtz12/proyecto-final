import React, { useState } from 'react';
import { getSalesReport } from '../../services/reportService';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';
import ReportView from './ReportView';

const ReportBuilder = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    format: 'json'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams({ ...params, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await getSalesReport(params);
      setReportData(data);
    } catch (err) {
      setError('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Generador de Reportes</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={params.fecha_inicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={params.fecha_fin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formato
              </label>
              <select
                name="format"
                value={params.format}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Generar Reporte'}
          </button>
        </form>
      </div>
      
      {error && <ErrorAlert message={error} />}
      
      {reportData && (
        <ReportView 
          data={reportData} 
          format={params.format} 
        />
      )}
    </div>
  );
};

export default ReportBuilder;