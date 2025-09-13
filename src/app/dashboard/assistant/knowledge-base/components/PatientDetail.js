import React, { useState } from 'react';

export default function PatientDetail({ patient }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!patient) return null;

  // Helper functions to format and extract data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getPatientName = () => {
    if (!patient.name || patient.name.length === 0) return 'Unknown';
    
    const name = patient.name[0];
    const givenName = name.given?.join(' ') || '';
    const familyName = name.family || '';
    
    return `${givenName} ${familyName}`.trim() || 'Unknown';
  };

  const getPatientAddress = () => {
    if (!patient.address || patient.address.length === 0) return 'No address on file';
    
    const address = patient.address[0];
    const parts = [];
    
    if (address.line) parts.push(address.line.join(', '));
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ') || 'No address details';
  };

  const getPatientContact = () => {
    if (!patient.telecom || patient.telecom.length === 0) return 'No contact information';
    
    return patient.telecom.map(t => {
      const systemLabel = t.system ? `${t.system.charAt(0).toUpperCase() + t.system.slice(1)}:` : '';
      return `${systemLabel} ${t.value}${t.use ? ` (${t.use})` : ''}`;
    }).join(', ');
  };

  // Format coding display for FHIR CodeableConcept
  const getCodeableConceptDisplay = (codeableConcept) => {
    if (!codeableConcept) return 'N/A';
    if (codeableConcept.text) return codeableConcept.text;
    if (codeableConcept.coding && codeableConcept.coding.length > 0) {
      return codeableConcept.coding[0].display || codeableConcept.coding[0].code || 'No description';
    }
    return 'N/A';
  };

  // Render tabs
  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <dl className="divide-y divide-gray-200">
              <div className="py-2 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="text-sm text-gray-900">{getPatientName()}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Patient ID</dt>
                <dd className="text-sm text-gray-900">{patient.id}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="text-sm text-gray-900">
                  {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Unknown'}
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Birth Date</dt>
                <dd className="text-sm text-gray-900">{formatDate(patient.birthDate)}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="text-sm text-gray-900">{getPatientAddress()}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="text-sm text-gray-900">{getPatientContact()}</dd>
              </div>
            </dl>
          </div>
        </div>

        {patient.conditions && patient.conditions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Conditions</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <ul className="divide-y divide-gray-200">
                {patient.conditions.slice(0, 5).map((condition, index) => (
                  <li key={index} className="py-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getCodeableConceptDisplay(condition.code)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Recorded: {formatDate(condition.recordedDate)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        condition.clinicalStatus?.coding?.[0]?.code === 'active' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {condition.clinicalStatus?.coding?.[0]?.code || 'unknown'}
                      </span>
                    </div>
                  </li>
                ))}
                {patient.conditions.length > 5 && (
                  <li className="py-2 text-center">
                    <button 
                      onClick={() => setActiveTab('conditions')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all {patient.conditions.length} conditions
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {patient.observations && patient.observations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Observations</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <ul className="divide-y divide-gray-200">
                {patient.observations.slice(0, 5).map((observation, index) => (
                  <li key={index} className="py-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getCodeableConceptDisplay(observation.code)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Date: {formatDate(observation.effectiveDateTime)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {observation.valueQuantity?.value} {observation.valueQuantity?.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          {observation.status}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
                {patient.observations.length > 5 && (
                  <li className="py-2 text-center">
                    <button 
                      onClick={() => setActiveTab('observations')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all {patient.observations.length} observations
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {patient.encounters && patient.encounters.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Encounters</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <ul className="divide-y divide-gray-200">
                {patient.encounters.slice(0, 3).map((encounter, index) => (
                  <li key={index} className="py-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {encounter.type?.length > 0 ? getCodeableConceptDisplay(encounter.type[0]) : 'Visit'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(encounter.period?.start)} 
                          {encounter.period?.end ? ` to ${formatDate(encounter.period.end)}` : ''}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        encounter.status === 'finished' 
                          ? 'bg-green-100 text-green-800' 
                          : encounter.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {encounter.status}
                      </span>
                    </div>
                  </li>
                ))}
                {patient.encounters.length > 3 && (
                  <li className="py-2 text-center">
                    <button 
                      onClick={() => setActiveTab('encounters')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all {patient.encounters.length} encounters
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderConditionsTab = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">All Conditions</h3>
      
      {patient.conditions && patient.conditions.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clinical Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Onset Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recorded Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patient.conditions.map((condition, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getCodeableConceptDisplay(condition.code)}
                    </div>
                    {condition.code?.coding?.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {condition.code.coding[0].code}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      condition.clinicalStatus?.coding?.[0]?.code === 'active' 
                        ? 'bg-red-100 text-red-800' 
                        : condition.clinicalStatus?.coding?.[0]?.code === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {condition.clinicalStatus?.coding?.[0]?.code || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {condition.verificationStatus?.coding?.[0]?.code || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(condition.onsetDateTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(condition.recordedDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500">No conditions recorded for this patient.</p>
        </div>
      )}
    </div>
  );

  const renderObservationsTab = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">All Observations</h3>
      
      {patient.observations && patient.observations.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patient.observations.map((observation, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getCodeableConceptDisplay(observation.code)}
                    </div>
                    {observation.code?.coding?.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {observation.code.coding[0].code}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {observation.valueQuantity ? (
                      <div>
                        <span className="font-medium">{observation.valueQuantity.value}</span>
                        {observation.valueQuantity.unit && (
                          <span className="ml-1 text-gray-500">{observation.valueQuantity.unit}</span>
                        )}
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(observation.effectiveDateTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      observation.status === 'final' 
                        ? 'bg-green-100 text-green-800' 
                        : observation.status === 'preliminary'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {observation.status || 'unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500">No observations recorded for this patient.</p>
        </div>
      )}
    </div>
  );

  const renderEncountersTab = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">All Encounters</h3>
      
      {patient.encounters && patient.encounters.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patient.encounters.map((encounter, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {encounter.type?.length > 0 ? getCodeableConceptDisplay(encounter.type[0]) : 'N/A'}
                    </div>
                    {encounter.reasonCode?.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Reason: {getCodeableConceptDisplay(encounter.reasonCode[0])}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {encounter.class_?.display || encounter.class_?.code || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(encounter.period?.start)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(encounter.period?.end)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      encounter.status === 'finished' 
                        ? 'bg-green-100 text-green-800' 
                        : encounter.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : encounter.status === 'planned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      {encounter.status || 'unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500">No encounters recorded for this patient.</p>
        </div>
      )}
    </div>
  );

  const renderProceduresTab = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">All Procedures</h3>
      
      {patient.procedures && patient.procedures.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedure
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patient.procedures.map((procedure, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getCodeableConceptDisplay(procedure.code)}
                    </div>
                    {procedure.code?.coding?.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {procedure.code.coding[0].code}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(procedure.performedDateTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      procedure.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : procedure.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {procedure.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {procedure.reasonCode?.length > 0 
                      ? getCodeableConceptDisplay(procedure.reasonCode[0]) 
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500">No procedures recorded for this patient.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{getPatientName()}</h2>
            <div className="mt-2 flex items-center text-blue-100">
              <span className="text-sm">{formatDate(patient.birthDate)}</span>
              <div className="mx-2 h-1 w-1 rounded-full bg-blue-200"></div>
              <span className="text-sm">{patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Unknown'}</span>
              <div className="mx-2 h-1 w-1 rounded-full bg-blue-200"></div>
              <span className="text-sm">ID: {patient.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="px-8 flex space-x-8 overflow-x-auto" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeTab === 'overview' ? 'page' : undefined}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('conditions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'conditions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeTab === 'conditions' ? 'page' : undefined}
          >
            Conditions {patient.conditions?.length > 0 && `(${patient.conditions.length})`}
          </button>
          <button
            onClick={() => setActiveTab('observations')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'observations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeTab === 'observations' ? 'page' : undefined}
          >
            Observations {patient.observations?.length > 0 && `(${patient.observations.length})`}
          </button>
          <button
            onClick={() => setActiveTab('encounters')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'encounters'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeTab === 'encounters' ? 'page' : undefined}
          >
            Encounters {patient.encounters?.length > 0 && `(${patient.encounters.length})`}
          </button>
          <button
            onClick={() => setActiveTab('procedures')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'procedures'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeTab === 'procedures' ? 'page' : undefined}
          >
            Procedures {patient.procedures?.length > 0 && `(${patient.procedures.length})`}
          </button>
        </nav>
      </div>

      <div className="p-8 bg-gray-50">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'conditions' && renderConditionsTab()}
        {activeTab === 'observations' && renderObservationsTab()}
        {activeTab === 'encounters' && renderEncountersTab()}
        {activeTab === 'procedures' && renderProceduresTab()}
      </div>
    </div>
  );
}