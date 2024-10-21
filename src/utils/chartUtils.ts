import { FormDataType, Question, Category } from '../types';
import { ChartData, ChartOptions } from 'chart.js';

export const generateChartData = (
  formData: FormDataType,
  questions: Question[],
  categories: Category[],
  language: 'es' | 'pt'
): ChartData => {
  return {
    labels: categories.map((category) => category.name[language]),
    datasets: [
      {
        label: language === 'es' ? 'Puntuación' : 'Pontuação',
        data: categories.map((category) => {
          const categoryQuestions = questions.filter((q) => q.categoryId === category.id);
          const categoryScores = categoryQuestions.map((q) => formData.answers[q.id] || 0);
          return categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
};

export const chartOptions = (language: 'es' | 'pt'): ChartOptions => {
  return {
    indexAxis: 'y' as const,
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: language === 'es' ? 'Puntuación por categoría' : 'Pontuação por categoria',
      },
    },
  };
};