import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Menu from './components/Menu';
import FormComponent from './formModule/FormComponent';
import Report from './components/Report';
import SavedForms from './components/SavedForms';
import Drafts from './components/Drafts';
import Home from './components/Home';
import { QuestionnaireStarter } from './questionnaireStarter';
import { FormDataType, Draft, Question, Category } from './types';
import { questions, categories } from './data';
import { generateAndSendPDF } from './telegramPDF/generateAndSendPDF';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'form' | 'report' | 'savedForms' | 'drafts' | 'questionnaireStarter'>('home');
  const [language, setLanguage] = useState<'es' | 'pt'>('es');
  const [formData, setFormData] = useState<FormDataType[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [userName, setUserName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [financialEntityName, setFinancialEntityName] = useState('');
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);

  const handleStartQuestionnaire = (provider: string, entity: string, user: string) => {
    setProviderName(provider);
    setFinancialEntityName(entity);
    setUserName(user);
    setCurrentView('form');
  };

  const handleFormSubmit = async (data: FormDataType) => {
    setFormData([...formData, data]);
    
    try {
      const success = await generateAndSendPDF(data, questions, categories, language, '');
      if (success) {
        console.log('PDF generated and sent successfully');
        setCurrentView('report');
      } else {
        console.error('Failed to generate or send PDF');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const handleSaveDraft = (draft: Draft) => {
    setDrafts([...drafts, draft]);
    setCurrentView('drafts');
  };

  const handleContinueDraft = (draft: Draft) => {
    setCurrentDraft(draft);
    setCurrentView('form');
  };

  const handleDeleteDraft = (date: string) => {
    setDrafts(drafts.filter(draft => draft.date !== date));
  };

  const handleUpdateForm = (updatedForm: FormDataType) => {
    setFormData(formData.map(form => form.date === updatedForm.date ? updatedForm : form));
  };

  const handleDeleteForm = (dateToDelete: string) => {
    setFormData(formData.filter(form => form.date !== dateToDelete));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header version="v 4.1" userName={userName} language={language} setLanguage={setLanguage} />
      <Menu currentView={currentView} setCurrentView={setCurrentView} language={language} />
      <main className="container mx-auto px-4 py-8 flex-grow overflow-auto">
        {currentView === 'home' && (
          <Home language={language} onStartQuestionnaire={() => setCurrentView('questionnaireStarter')} />
        )}
        {currentView === 'questionnaireStarter' && (
          <QuestionnaireStarter language={language} onStartQuestionnaire={handleStartQuestionnaire} />
        )}
        {currentView === 'form' && (
          <FormComponent
            onSubmit={handleFormSubmit}
            onSaveDraft={handleSaveDraft}
            questions={questions}
            categories={categories}
            language={language}
            userName={userName}
            providerName={providerName}
            financialEntityName={financialEntityName}
            currentDraft={currentDraft}
          />
        )}
        {currentView === 'report' && (
          <Report formData={formData} questions={questions} categories={categories} language={language} />
        )}
        {currentView === 'savedForms' && (
          <SavedForms
            formData={formData}
            questions={questions}
            categories={categories}
            language={language}
            onUpdateForm={handleUpdateForm}
            onDeleteForm={handleDeleteForm}
          />
        )}
        {currentView === 'drafts' && (
          <Drafts
            drafts={drafts}
            language={language}
            onContinueDraft={handleContinueDraft}
            onDeleteDraft={handleDeleteDraft}
          />
        )}
      </main>
    </div>
  );
};

export default App;