import React, { useState, useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FormDataType, Question, Category } from '../types';
import { generatePDF } from '../pdfGenerator/generatePDF';
import { generateChartData, chartOptions } from '../utils/chartUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReportProps {
  formData: FormDataType[];
  questions: Question[];
  categories: Category[];
  language: 'es' | 'pt';
}

const Report: React.FC<ReportProps> = ({ formData, questions, categories, language }) => {
  const [selectedFormIndex, setSelectedFormIndex] = useState(0);
  const chartRef = useRef<ChartJS>(null);
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    const updateChartHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setChartHeight(200);
      } else if (width < 768) {
        setChartHeight(250);
      } else {
        setChartHeight(300);
      }
    };

    updateChartHeight();
    window.addEventListener('resize', updateChartHeight);
    return () => window.removeEventListener('resize', updateChartHeight);
  }, []);

  const handleGeneratePDF = () => {
    if (chartRef.current) {
      const chartImage = chartRef.current.toBase64Image();
      const doc = generatePDF(formData[selectedFormIndex], questions, categories, language, chartImage);
      doc.save('informe_dora.pdf');
    }
  };

  if (formData.length === 0) {
    return (
      <div className="bg-white shadow-md rounded px-4 sm:px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {language === 'es' ? 'No hay informes disponibles' : 'Não há relatórios disponíveis'}
        </h2>
        <p className="text-sm sm:text-base">
          {language === 'es'
            ? 'Complete un cuestionario para ver el informe.'
            : 'Complete um questionário para ver o relatório.'}
        </p>
      </div>
    );
  }

  const selectedForm = formData[selectedFormIndex];
  const chartData = generateChartData(selectedForm, questions, categories, language);
  const options = chartOptions(language);

  return (
    <div className="bg-white shadow-md rounded px-4 sm:px-8 pt-6 pb-8 mb-4 w-full max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        {language === 'es' ? 'Informe de resultados' : 'Relatório de resultados'}
      </h2>
      <div className="mb-4">
        <label htmlFor="reportSelect" className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'es' ? 'Seleccionar informe:' : 'Selecionar relatório:'}
        </label>
        <select
          id="reportSelect"
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedFormIndex}
          onChange={(e) => setSelectedFormIndex(Number(e.target.value))}
        >
          {formData.map((form, index) => (
            <option key={index} value={index}>
              {form.providerName} - {new Date(form.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'pt-BR')}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-8 overflow-x-auto">
        <div style={{ height: `${chartHeight}px`, width: '100%' }}>
          <Bar ref={chartRef} data={chartData} options={options} />
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          {language === 'es' ? 'Detalles del informe' : 'Detalhes do relatório'}
        </h3>
        <p className="text-sm sm:text-base"><strong>{language === 'es' ? 'Proveedor TIC/Departamento:' : 'Provedor TIC/Departamento:'}</strong> {selectedForm.providerName}</p>
        <p className="text-sm sm:text-base"><strong>{language === 'es' ? 'Entidad Financiera:' : 'Entidade Financeira:'}</strong> {selectedForm.financialEntityName}</p>
        <p className="text-sm sm:text-base"><strong>{language === 'es' ? 'Usuario:' : 'Usuário:'}</strong> {selectedForm.userName}</p>
        <p className="text-sm sm:text-base"><strong>{language === 'es' ? 'Fecha:' : 'Data:'}</strong> {new Date(selectedForm.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'pt-BR')}</p>
      </div>
      <button
        className="mt-4 w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleGeneratePDF}
      >
        {language === 'es' ? 'Generar PDF' : 'Gerar PDF'}
      </button>
    </div>
  );
};

export default Report;