import { useState } from 'react';

export default function TeamView({ team, totalPower, battleData }) {
  const [copied, setCopied] = useState(false);
  
  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(battleData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">⚔️ Tu Equipo</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {team.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-lg text-center">
            <img 
              src={p.sprites.other['official-artwork'].front_default} 
              alt={p.name}
              className="w-20 h-20 mx-auto"
            />
            <p className="font-bold capitalize">{p.name}</p>
            <p className="text-sm text-blue-600">Poder: {p.customStats.totalPower}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-4 rounded-lg mb-4">
        <p className="text-xl font-bold text-center">
          💥 Poder Total del Equipo: <span className="text-blue-600">{totalPower}</span>
        </p>
      </div>
      
      <button
        onClick={copyJSON}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
      >
        {copied ? '✓ Copiado!' : '📋 Copiar JSON para Batalla'}
      </button>
      
      <details className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg">
        <summary className="cursor-pointer font-mono text-sm">Ver JSON</summary>
        <pre className="mt-2 text-xs overflow-auto">
          {JSON.stringify(battleData, null, 2)}
        </pre>
      </details>
    </div>
  );
}