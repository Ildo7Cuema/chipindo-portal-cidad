import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          ✅ Página de Teste Funcionando!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          O roteamento está funcionando corretamente.
        </p>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Páginas Sectoriais Disponíveis:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/educacao" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
              Educação
            </a>
            <a href="/saude" className="p-4 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
              Saúde
            </a>
            <a href="/agricultura" className="p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
              Agricultura
            </a>
            <a href="/sector-mineiro" className="p-4 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors">
              Sector Mineiro
            </a>
            <a href="/desenvolvimento-economico" className="p-4 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors">
              Desenvolvimento Económico
            </a>
            <a href="/cultura" className="p-4 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
              Cultura
            </a>
            <a href="/tecnologia" className="p-4 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors">
              Tecnologia
            </a>
            <a href="/energia-agua" className="p-4 bg-cyan-100 rounded-lg hover:bg-cyan-200 transition-colors">
              Energia e Água
            </a>
          </div>
        </div>
        <div className="mt-8">
          <a href="/services" className="text-primary hover:underline">
            ← Voltar para Serviços
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 