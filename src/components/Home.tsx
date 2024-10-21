import React from 'react';

interface HomeProps {
  language: 'es' | 'pt';
  onStartQuestionnaire: () => void;
}

const Home: React.FC<HomeProps> = ({ language, onStartQuestionnaire }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">
          {language === 'es' ? 'Bienvenido a DORA Analyzer' : 'Bem-vindo ao DORA Analyzer'}
        </h1>
        <p className="mb-6 text-base sm:text-lg text-gray-600 text-justify">
          {language === 'es'
            ? 'DORA Analyzer es una herramienta desarrollada por Ozona Consulting para MEO para recopilar y analizar información de las entidades financieras clientes de MEO que deben tener cumplimiento con el reglamento europeo DORA.'
            : 'DORA Analyzer é uma ferramenta desenvolvida pela Ozona Consulting para a MEO para recolher e analisar informação das entidades financeiras clientes da MEO que devem estar em conformidade com o regulamento europeu DORA.'}
        </p>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            onClick={onStartQuestionnaire}
          >
            {language === 'es' ? 'Iniciar Cuestionario' : 'Iniciar Questionário'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;