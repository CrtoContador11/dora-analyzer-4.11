import React from 'react';
import { PlusCircle, BarChart, List, FileText, Home } from 'lucide-react';

interface MenuProps {
  currentView: 'home' | 'form' | 'report' | 'savedForms' | 'drafts' | 'questionnaireStarter';
  setCurrentView: (view: 'home' | 'form' | 'report' | 'savedForms' | 'drafts' | 'questionnaireStarter') => void;
  language: 'es' | 'pt';
}

const Menu: React.FC<MenuProps> = ({ currentView, setCurrentView, language }) => {
  const menuItems = [
    { view: 'home', icon: Home, label: { es: 'Inicio', pt: 'Início' } },
    { view: 'questionnaireStarter', icon: PlusCircle, label: { es: 'Nuevo', pt: 'Novo' } },
    { view: 'report', icon: BarChart, label: { es: 'Informe', pt: 'Relatório' } },
    { view: 'savedForms', icon: List, label: { es: 'Guardados', pt: 'Salvos' } },
    { view: 'drafts', icon: FileText, label: { es: 'Borradores', pt: 'Rascunhos' } },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-2">
        <ul className="flex justify-between items-center py-2">
          {menuItems.map((item) => (
            <li key={item.view} className="flex-1 text-center">
              <button
                className={`flex flex-col items-center justify-center px-1 py-2 rounded-md transition-colors duration-200 w-full ${
                  currentView === item.view 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                }`}
                onClick={() => setCurrentView(item.view as 'home' | 'form' | 'report' | 'savedForms' | 'drafts' | 'questionnaireStarter')}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label[language]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;