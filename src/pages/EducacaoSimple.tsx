import React from 'react';

const EducacaoSimple = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Setor de Educação
          </h1>
          <p className="text-lg text-muted-foreground">
            Formando o futuro de Chipindo através da educação de qualidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-blue-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">12</h3>
            <p className="text-blue-600">Escolas Primárias</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">156</h3>
            <p className="text-green-600">Professores</p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">2.847</h3>
            <p className="text-purple-600">Estudantes</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Programas Educativos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Alfabetização de Adultos</h3>
              <p className="text-muted-foreground">
                Programa para reduzir o analfabetismo na população adulta.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Bolsa de Estudo Municipal</h3>
              <p className="text-muted-foreground">
                Apoio financeiro para estudantes carenciados.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/services" className="text-primary hover:underline">
            ← Voltar para Serviços
          </a>
        </div>
      </div>
    </div>
  );
};

export default EducacaoSimple; 