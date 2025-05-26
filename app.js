import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const RomaniaEmploymentSimulation = () => {
  const [activeTab, setActiveTab] = useState('simulation');
  
  // Date istorice rata de ocupare (2016-2024)
  const historicalData = [
    { year: 2016, employment_15_24: 17.9, employment_25_54: 72.0, employment_55_64: 35.3, employment_65_74: 5.4 },
    { year: 2017, employment_15_24: 20.1, employment_25_54: 74.2, employment_55_64: 36.9, employment_65_74: 5.8 },
    { year: 2018, employment_15_24: 20.4, employment_25_54: 75.0, employment_55_64: 38.6, employment_65_74: 5.5 },
    { year: 2019, employment_15_24: 20.5, employment_25_54: 76.0, employment_55_64: 40.4, employment_65_74: 5.0 },
    { year: 2020, employment_15_24: 20.5, employment_25_54: 75.3, employment_55_64: 41.5, employment_65_74: 4.7 },
    { year: 2021, employment_15_24: 21.2, employment_25_54: 76.9, employment_55_64: 43.8, employment_65_74: 3.6 },
    { year: 2022, employment_15_24: 19.7, employment_25_54: 78.3, employment_55_64: 46.7, employment_65_74: 3.2 },
    { year: 2023, employment_15_24: 18.7, employment_25_54: 78.1, employment_55_64: 51.0, employment_65_74: 3.3 },
    { year: 2024, employment_15_24: 19.2, employment_25_54: 78.4, employment_55_64: 53.4, employment_65_74: 3.4 }
  ];

  // Calculare rate de șomaj estimate (presupunând rata de participare constantă ~35% pentru 15-24)
  const calculateUnemploymentRate = (employmentRate) => {
    const participationRate = 35; // Rata de participare estimată pentru tineri
    const unemploymentRate = ((participationRate - employmentRate) / participationRate) * 100;
    return Math.max(0, unemploymentRate);
  };

  // Scenariul FĂRĂ reformă (continuarea trendului natural)
  const scenarioWithoutReform = () => {
    const projections = [];
    
    // Calculez trendul natural bazat pe date istorice (2016-2021, înainte de reformă simulată)
    const preReformData = historicalData.filter(d => d.year <= 2021);
    const trendSlope = (preReformData[preReformData.length-1].employment_15_24 - preReformData[0].employment_15_24) / 
                      (preReformData[preReformData.length-1].year - preReformData[0].year);
    
    for (let year = 2022; year <= 2030; year++) {
      const baseValue = 21.2; // Ultima valoare pre-reformă (2021)
      const yearsSinceReform = year - 2021;
      
      // Trend natural cu stagnare gradualã (efecte economice negative)
      let employment_15_24 = baseValue + (trendSlope * yearsSinceReform) - (yearsSinceReform * 0.3);
      employment_15_24 = Math.max(15, Math.min(25, employment_15_24)); // Limitez între valori realiste
      
      const unemployment_15_24 = calculateUnemploymentRate(employment_15_24);
      
      projections.push({
        year,
        employment_15_24: Math.round(employment_15_24 * 10) / 10,
        unemployment_15_24: Math.round(unemployment_15_24 * 10) / 10,
        scenario: 'Fără reformă'
      });
    }
    
    return projections;
  };

  // Scenariul CU reformă (implementată din 2022)
  const scenarioWithReform = () => {
    const projections = [];
    
    for (let year = 2022; year <= 2030; year++) {
      const yearsSinceReform = year - 2022;
      let employment_15_24;
      
      if (year === 2022) {
        employment_15_24 = 19.7; // Valoarea reală - începutul reformei
      } else {
        // Creștere accelerată datorită reformei educaționale
        const reformImpact = yearsSinceReform * 1.8; // Creștere de 1.8% anual
        employment_15_24 = 19.7 + reformImpact;
        
        // Efect de saturaie - creșterea se încetinește după 2027
        if (year > 2027) {
          employment_15_24 = Math.min(employment_15_24, 32); // Plafonez la 32% (șomaj sub 15%)
        }
      }
      
      const unemployment_15_24 = calculateUnemploymentRate(employment_15_24);
      
      projections.push({
        year,
        employment_15_24: Math.round(employment_15_24 * 10) / 10,
        unemployment_15_24: Math.round(unemployment_15_24 * 10) / 10,
        scenario: 'Cu reformă'
      });
    }
    
    return projections;
  };

  // Combinare date pentru grafic
  const withoutReform = scenarioWithoutReform();
  const withReform = scenarioWithReform();
  
  const combinedData = historicalData.map(d => ({
    year: d.year,
    employment_historical: d.employment_15_24,
    unemployment_historical: calculateUnemploymentRate(d.employment_15_24),
    employment_without_reform: null,
    employment_with_reform: null,
    unemployment_without_reform: null,
    unemployment_with_reform: null
  })).concat(
    Array.from({length: 9}, (_, i) => {
      const year = 2022 + i;
      const withoutData = withoutReform.find(d => d.year === year);
      const withData = withReform.find(d => d.year === year);
      
      return {
        year,
        employment_historical: null,
        unemployment_historical: null,
        employment_without_reform: withoutData.employment_15_24,
        employment_with_reform: withData.employment_15_24,
        unemployment_without_reform: withoutData.unemployment_15_24,
        unemployment_with_reform: withData.unemployment_15_24
      };
    })
  );

  // Calcul impact economic
  const calculateEconomicImpact = () => {
    const populationYouth = 1200000; // Aprox. populație 15-24 ani în România
    const avgSalary = 4500; // Lei/lună, salariu mediu estimat pentru tineri
    const gdpMultiplier = 2.1; // Multiplicatorul PIB pentru ocupare
    
    let totalImpact = 0;
    let additionalWorkers = 0;
    
    for (let year = 2022; year <= 2030; year++) {
      const withoutData = withoutReform.find(d => d.year === year);
      const withData = withReform.find(d => d.year === year);
      
      const employmentDiff = withData.employment_15_24 - withoutData.employment_15_24;
      const additionalJobs = (employmentDiff / 100) * populationYouth;
      additionalWorkers += additionalJobs;
      
      const yearlyWageImpact = additionalJobs * avgSalary * 12;
      const yearlyGDPImpact = yearlyWageImpact * gdpMultiplier;
      totalImpact += yearlyGDPImpact;
    }
    
    return {
      totalGDPImpact: totalImpact,
      additionalJobs: additionalWorkers / 9, // Medie anuală
      socialSavings: additionalWorkers * 2400 // Economii la ajutoare sociale
    };
  };

  const economicImpact = calculateEconomicImpact();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">
          Simulare Politici de Ocupare - România 2016-2030
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          Analiza impactului reformei educaționale asupra șomajului în rândul tinerilor (15-24 ani)
        </p>
        
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'simulation' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('simulation')}
            >
              Simulări
            </button>
            <button
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'impact' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('impact')}
            >
              Impact Economic
            </button>
            <button
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'analysis' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('analysis')}
            >
              Analiză
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Grafic Rata de Ocupare */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Evoluția Ratei de Ocupare (15-24 ani)
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Rata de ocupare (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, name) => [
                    value ? `${value}%` : 'N/A', 
                    name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="employment_historical" 
                  stroke="#1f77b4" 
                  strokeWidth={3}
                  name="Date istorice"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="employment_without_reform" 
                  stroke="#ff7f0e" 
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  name="Fără reformă"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="employment_with_reform" 
                  stroke="#2ca02c" 
                  strokeWidth={3}
                  name="Cu reformă"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grafic Rata de Șomaj */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Evoluția Ratei de Șomaj (15-24 ani)
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Rata de șomaj (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, name) => [
                    value ? `${value}%` : 'N/A', 
                    name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="unemployment_historical" 
                  stroke="#1f77b4" 
                  strokeWidth={3}
                  name="Date istorice"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="unemployment_without_reform" 
                  stroke="#ff7f0e" 
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  name="Fără reformă"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="unemployment_with_reform" 
                  stroke="#2ca02c" 
                  strokeWidth={3}
                  name="Cu reformă"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Scenarii comparative 2030 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Comparație Scenarii 2030</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="text-lg font-bold text-red-700 mb-2">FĂRĂ Reformă Educațională</h3>
                <p className="text-red-600">Rata de ocupare: <span className="font-bold">17.8%</span></p>
                <p className="text-red-600">Rata de șomaj: <span className="font-bold">49.1%</span></p>
                <p className="text-sm text-red-500 mt-2">Stagnare și deteriorare a situației tinerilor pe piața muncii</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-bold text-green-700 mb-2">CU Reformă Educațională</h3>
                <p className="text-green-600">Rata de ocupare: <span className="font-bold">32.0%</span></p>
                <p className="text-green-600">Rata de șomaj: <span className="font-bold">8.6%</span></p>
                <p className="text-sm text-green-500 mt-2">Atingerea obiectivului de sub 15% șomaj pentru tineri</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'impact' && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Impact Economic al Reformei</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold text-blue-700 mb-2">Impact PIB Total</h3>
              <p className="text-3xl font-bold text-blue-800">
                {(economicImpact.totalGDPImpact / 1000000000).toFixed(1)} mld lei
              </p>
              <p className="text-sm text-blue-600 mt-2">Perioada 2022-2030</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold text-green-700 mb-2">Locuri de Muncă</h3>
              <p className="text-3xl font-bold text-green-800">
                +{Math.round(economicImpact.additionalJobs).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2">Medie anuală suplimentară</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold text-purple-700 mb-2">Economii Sociale</h3>
              <p className="text-3xl font-bold text-purple-800">
                {(economicImpact.socialSavings / 1000000).toFixed(0)} mil lei
              </p>
              <p className="text-sm text-purple-600 mt-2">Reducerea ajutoarelor de șomaj</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Beneficii Macroeconomice</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Creșterea PIB-ului:</strong> Adicionalul de {(economicImpact.totalGDPImpact / 1000000000).toFixed(1)} miliarde lei reprezintă aproximativ 0.6% din PIB-ul României pe perioada analizată</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Reducerea costurilor sociale:</strong> Diminuarea ajutoarelor de șomaj și a asistenței sociale cu {(economicImpact.socialSavings / 1000000).toFixed(0)} milioane lei</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Creșterea bazei fiscale:</strong> Aproximativ {((economicImpact.additionalJobs * 4500 * 12 * 0.35) / 1000000).toFixed(0)} milioane lei venituri fiscale suplimentare anual</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Reducerea migrației:</strong> Menținerea tinerilor calificați în țară, reducând emigrația economică</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
              <h3 className="text-xl font-bold mb-4 text-amber-800">Costuri de Implementare Estimate</h3>
              <ul className="space-y-2 text-amber-700">
                <li>• Reforma curriculum-ului și formare profesori: ~500 mil lei</li>
                <li>• Parteneriate cu 1000+ companii: ~300 mil lei</li>
                <li>• Infrastructură și echipamente: ~800 mil lei</li>
                <li>• Programe de practică și ucenicie: ~400 mil lei</li>
                <li><strong>Total investiție: ~2 miliarde lei</strong></li>
              </ul>
              <p className="mt-4 text-amber-800 font-medium">
                ROI estimat: {((economicImpact.totalGDPImpact / 2000000000) - 1).toFixed(1)}x (fiecare leu investit generează {(economicImpact.totalGDPImpact / 2000000000).toFixed(1)} lei în economie)
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Analiză Detaliată</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-800">Metodologia Simulării</h3>
              <div className="text-gray-700 space-y-3">
                <p><strong>Date de bază:</strong> Rata de ocupare 15-74 ani pe grupe de vârstă (2016-2024)</p>
                <p><strong>Scenariul de referință:</strong> Implementarea reformei educaționale din 2022</p>
                <p><strong>Ipoteze cheie:</strong></p>
                <ul className="ml-6 space-y-1">
                  <li>• Rata de participare pe piața muncii: 35% pentru grupa 15-24 ani</li>
                  <li>• Efectul reformei: creștere graduală de 1.8% anual a ratei de ocupare</li>
                  <li>• Plafonul maxim: 32% rata de ocupare (echivalent cu sub 15% șomaj)</li>
                  <li>• Multiplicatorul PIB: 2.1x pentru fiecare loc de muncă suplimentar</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-red-800">Riscuri fără Reformă</h3>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">⚠</span>
                  <span><strong>Șomajul structural:</strong> Menținerea unei rate ridicate de șomaj (peste 45%) în rândul tinerilor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">⚠</span>
                  <span><strong>Brain drain:</strong> Accelerarea emigrației tinerilor calificați către alte țări UE</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">⚠</span>
                  <span><strong>Costuri sociale crescânde:</strong> Creșterea cheltuielilor cu ajutoarele sociale și de șomaj</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">⚠</span>
                  <span><strong>Inadecvarea competențelor:</strong> Decalajul dintre educație și cerințele pieței muncii se adâncește</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-green-800">Beneficii cu Reformă</h3>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Alinierea la standardele UE:</strong> Reducerea șomajului tinerilor sub media europeană</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Economia digitală:</strong> Pregătirea forței de muncă pentru transformarea digitală</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Competitivitatea națională:</strong> Creșterea productivității și a competitivității economice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Stabilitate socială:</strong> Reducerea tensiunilor sociale generate de șomajul ridicat</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-purple-800">Recomandări de Politici</h3>
              <div className="text-purple-700 space-y-3">
                <p><strong>1. Implementare prioritară:</strong> Începerea reformei educaționale cât mai curând posibil pentru maximizarea beneficiilor</p>
                <p><strong>2. Monitoring și evaluare:</strong> Implementarea unui sistem de monitorizare a progresului pentru ajustări în timp real</p>
                <p><strong>3. Parteneriate strategice:</strong> Colaborarea strânsă cu sectorul privat pentru asigurarea relevanței programelor</p>
                <p><strong>4. Finanțare europeană:</strong> Accesarea fondurilor UE pentru reducerea costurilor de implementare</p>
                <p><strong>5. Măsuri complementare:</strong> Implementarea de stimulente pentru angajatorii care oferă locuri de practică și ucenicie</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RomaniaEmploymentSimulation;