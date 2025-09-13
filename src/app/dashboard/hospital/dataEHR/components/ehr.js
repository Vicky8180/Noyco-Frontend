import { useState, useEffect } from 'react';

const EHRConnector = () => {
  const [ehrProviders, setEhrProviders] = useState([
    {
      id: 'epic',
      name: 'Epic MyChart',
      baseUrl: 'https://api.epic.com/fhir',
      status: 'disconnected',
      logo: '/logos/epic-logo.png'
    },
    {
      id: 'cerner',
      name: 'Cerner PowerChart',
      baseUrl: 'https://api.cerner.com/fhir',
      status: 'disconnected',
      logo: '/logos/cerner-logo.png'
    },
    {
      id: 'athenahealth',
      name: 'athenahealth',
      baseUrl: 'https://api.athenahealth.com/v1',
      status: 'connected',
      logo: '/logos/athena-logo.png'
    },
    {
      id: 'allscripts',
      name: 'Allscripts',
      baseUrl: 'https://api.allscripts.com/fhir',
      status: 'disconnected',
      logo: '/logos/allscripts-logo.png'
    }
  ]);

  const [selectedProvider, setSelectedProvider] = useState('');
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dummy API simulation
  const connectToEHR = async (providerId) => {
    setLoading(true);
    setError('');
    
    setEhrProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, status: 'connecting' }
          : provider
      )
    );

    try {
      // Simulate API connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random connection success/failure
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setEhrProviders(prev => 
          prev.map(provider => 
            provider.id === providerId 
              ? { ...provider, status: 'connected' }
              : provider
          )
        );
        setSelectedProvider(providerId);
        await fetchPatientData(providerId);
      } else {
        throw new Error('Failed to connect to EHR system');
      }
    } catch (err) {
      setError(`Connection failed: ${err.message || 'Unknown error'}`);
      setEhrProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, status: 'disconnected' }
            : provider
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const disconnectFromEHR = (providerId) => {
    setEhrProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, status: 'disconnected' }
          : provider
      )
    );
    
    if (selectedProvider === providerId) {
      setSelectedProvider('');
      setPatientData([]);
    }
  };

  const fetchPatientData = async (providerId) => {
    // Simulate fetching patient data from different EHR systems
    const dummyData = {
      epic: [
        { id: 'EP001', name: 'John Doe', dateOfBirth: '1985-03-15', gender: 'Male', lastVisit: '2024-01-15' },
        { id: 'EP002', name: 'Jane Smith', dateOfBirth: '1990-07-22', gender: 'Female', lastVisit: '2024-01-20' }
      ],
      cerner: [
        { id: 'CN001', name: 'Bob Johnson', dateOfBirth: '1978-11-30', gender: 'Male', lastVisit: '2024-01-18' },
        { id: 'CN002', name: 'Alice Brown', dateOfBirth: '1995-05-08', gender: 'Female', lastVisit: '2024-01-22' }
      ],
      athenahealth: [
        { id: 'AT001', name: 'Mike Wilson', dateOfBirth: '1982-09-12', gender: 'Male', lastVisit: '2024-01-25' },
        { id: 'AT002', name: 'Sarah Davis', dateOfBirth: '1988-12-03', gender: 'Female', lastVisit: '2024-01-24' }
      ],
      allscripts: [
        { id: 'AS001', name: 'Tom Anderson', dateOfBirth: '1975-04-18', gender: 'Male', lastVisit: '2024-01-19' },
        { id: 'AS002', name: 'Lisa Martinez', dateOfBirth: '1992-08-25', gender: 'Female', lastVisit: '2024-01-21' }
      ]
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    setPatientData(dummyData[providerId] || []);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'connected': 
        return 'bg-green-200 text-green-800';
      case 'connecting': 
        return 'bg-amber-100 text-amber-800';
      case 'disconnected': 
        return 'bg-gray-200 text-gray-700';
      default: 
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getButtonStyles = (status) => {
    switch (status) {
      case 'disconnected':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed';
      case 'connecting':
        return 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed';
      case 'connected':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700 mb-4">
          🏥 EHR Integration Hub
        </h1>
        <p className="text-lg text-gray-500">
          Connect to multiple Electronic Health Record systems
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gray-50 border-l-4 border-gray-400 text-gray-700 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <span className="text-xl mr-2">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* EHR Providers Grid */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Available EHR Providers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {ehrProviders.map(provider => (
            <div 
              key={provider.id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
            >
              <div className="p-6">
                {/* Provider Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {provider.name}
                    </h3>
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyles(provider.status)}`}
                    >
                      {provider.status}
                    </span>
                  </div>
                </div>
                
                {/* Provider Details */}
                <div className="mb-6 space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Endpoint:</span>
                    <p className="text-sm text-gray-700 break-all">{provider.baseUrl}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <p className="text-sm text-gray-700 capitalize">{provider.status}</p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="space-y-2">
                  {provider.status === 'disconnected' && (
                    <button 
                      onClick={() => connectToEHR(provider.id)}
                      disabled={loading}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${getButtonStyles(provider.status)}`}
                    >
                      Connect
                    </button>
                  )}
                  {provider.status === 'connecting' && (
                    <button 
                      disabled 
                      className={`w-full px-4 py-2 rounded-lg font-semibold ${getButtonStyles(provider.status)}`}
                    >
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting...
                      </div>
                    </button>
                  )}
                  {provider.status === 'connected' && (
                    <button 
                      onClick={() => disconnectFromEHR(provider.id)}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${getButtonStyles(provider.status)}`}
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Data Table */}
      {selectedProvider && patientData.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Patient Data from {ehrProviders.find(p => p.id === selectedProvider)?.name}
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Visit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientData.map(patient => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {patient.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {patient.dateOfBirth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {patient.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {patient.lastVisit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Features */}
      <div className="bg-gray-100 border border-gray-200 rounded-xl shadow-sm p-8 text-gray-800">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="text-3xl mr-3">🚀</span>
          Upcoming Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-lg mr-3 text-gray-500">✨</span>
              <span className="text-md text-gray-700">Real-time patient data synchronization</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg mr-3 text-gray-500">🔒</span>
              <span className="text-md text-gray-700">Enhanced security with OAuth 2.0 and SMART on FHIR</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg mr-3 text-gray-500">📊</span>
              <span className="text-md text-gray-700">Advanced analytics and reporting</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-lg mr-3 text-gray-500">🔄</span>
              <span className="text-md text-gray-700">Automated data mapping and transformation</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg mr-3 text-gray-500">📱</span>
              <span className="text-md text-gray-700">Mobile app integration</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg mr-3 text-gray-500">🤖</span>
              <span className="text-md text-gray-700">AI-powered clinical decision support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EHRConnector;