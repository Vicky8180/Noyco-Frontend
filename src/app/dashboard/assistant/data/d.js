'use client';
import React, { useState } from 'react';
import { Search, Phone, Calendar, Clock, User, Edit, Plus, Trash2, Check, X, ChevronRight } from 'lucide-react';

// Sample patients data
const patientsData = [
    {
        id: 1,
        name: "John Doe",
        age: 65,
        diagnosis: "Diabetes",
        contact: "555-1234",
        lastDiagnosisDate: "2023-10-01",
        lastCallDate: "2023-10-15",
        priority: "High"
    },
    {
        id: 2,
        name: "Jane Smith",
        age: 72,
        diagnosis: "Hypertension",
        contact: "555-5678",
        lastDiagnosisDate: "2023-09-20",
        lastCallDate: "2023-10-10",
        priority: "Medium"
    },
    {
        id: 3,
        name: "Robert Johnson",
        age: 58,
        diagnosis: "Heart Disease",
        contact: "555-9012",
        lastDiagnosisDate: "2023-09-15",
        lastCallDate: "2023-10-12",
        priority: "High"
    },
    {
        id: 4,
        name: "Maria Garcia",
        age: 45,
        diagnosis: "Asthma",
        contact: "555-3456",
        lastDiagnosisDate: "2023-10-05",
        lastCallDate: "2023-10-08",
        priority: "Low"
    },
    {
        id: 5,
        name: "John Doe",
        age: 65,
        diagnosis: "Diabetes",
        contact: "555-1234",
        lastDiagnosisDate: "2023-10-01",
        lastCallDate: "2023-10-15",
        priority: "High"
    },
    {
        id: 6,
        name: "Jane Smith",
        age: 72,
        diagnosis: "Hypertension",
        contact: "555-5678",
        lastDiagnosisDate: "2023-09-20",
        lastCallDate: "2023-10-10",
        priority: "Medium"
    },
    {
        id: 7,
        name: "Robert Johnson",
        age: 58,
        diagnosis: "Heart Disease",
        contact: "555-9012",
        lastDiagnosisDate: "2023-09-15",
        lastCallDate: "2023-10-12",
        priority: "High"
    },
    {
        id: 8,
        name: "Maria Garcia",
        age: 45,
        diagnosis: "Asthma",
        contact: "555-3456",
        lastDiagnosisDate: "2023-10-05",
        lastCallDate: "2023-10-08",
        priority: "Low"
    }
];

const ManualCallScheduling = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatients, setSelectedPatients] = useState([]);
    const [checklist, setChecklist] = useState([]);
    const [callSettings, setCallSettings] = useState({
        callTime: 'immediate',
        scheduledDateTime: '',
        frequency: 'once',
        customFrequency: ''
    });
    const [newChecklistItem, setNewChecklistItem] = useState('');

    const filteredPatients = patientsData.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.contact.includes(searchTerm) ||
        patient.id.toString().includes(searchTerm)
    );

    const generateAIChecklist = (patient) => {
        const commonItems = [
            "Ask about current symptoms",
            "Medication adherence check",
            "Review recent vital signs",
            "Discuss any side effects"
        ];

        const conditionSpecific = {
            "Diabetes": [
                "Check blood sugar levels",
                "Diet and exercise compliance",
                "Foot care examination reminder"
            ],
            "Hypertension": [
                "Blood pressure monitoring",
                "Sodium intake discussion",
                "Stress management check"
            ],
            "Heart Disease": [
                "Chest pain or discomfort",
                "Activity tolerance assessment",
                "Cardiac medication review"
            ],
            "Asthma": [
                "Inhaler technique review",
                "Trigger identification",
                "Peak flow measurements"
            ]
        };

        return [...commonItems, ...(conditionSpecific[patient.diagnosis] || [])];
    };

    const handlePatientSelect = (patient) => {
        const isSelected = selectedPatients.find(p => p.id === patient.id);
        if (isSelected) {
            setSelectedPatients(selectedPatients.filter(p => p.id !== patient.id));
        } else {
            setSelectedPatients([...selectedPatients, patient]);
        }
    };

    const generateChecklist = () => {
        if (selectedPatients.length > 0) {
            const aiGeneratedItems = generateAIChecklist(selectedPatients[0]);
            setChecklist(aiGeneratedItems.map((item, index) => ({
                id: index + 1,
                text: item,
                completed: false
            })));
        }
    };

    const addChecklistItem = () => {
        if (newChecklistItem.trim()) {
            setChecklist([...checklist, {
                id: checklist.length + 1,
                text: newChecklistItem.trim(),
                completed: false
            }]);
            setNewChecklistItem('');
        }
    };

    const removeChecklistItem = (id) => {
        setChecklist(checklist.filter(item => item.id !== id));
    };

    const updateChecklistItem = (id, newText) => {
        setChecklist(checklist.map(item =>
            item.id === id ? { ...item, text: newText } : item
        ));
    };

    const handleScheduleCall = () => {
        // Here you would typically send the data to your backend
        console.log('Scheduling call with:', {
            patients: selectedPatients,
            checklist,
            callSettings
        });
        alert('Call scheduled successfully!');
        // Reset form
        setCurrentStep(1);
        setSelectedPatients([]);
        setChecklist([]);
        setSearchTerm('');
        setCallSettings({
            callTime: 'immediate',
            scheduledDateTime: '',
            frequency: 'once',
            customFrequency: ''
        });
    };

    const steps = [
        { number: 1, title: 'Search Patient', icon: Search },
        { number: 2, title: 'Select Patient', icon: User },
        { number: 3, title: 'Create Checklist', icon: Edit },
        { number: 4, title: 'Choose Call Time', icon: Clock },
        { number: 5, title: 'Review & Confirm', icon: Check }
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">


                {/* Progress Steps */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-wrap justify-between items-center">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {currentStep > step.number ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span className={`ml-2 text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                    {step.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 1: Search Patient */}
                {currentStep === 1 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Patient</h2>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, phone number, or ID..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPatients.map((patient) => (
                                <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(patient.priority)}`}>
                                            {patient.priority}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><span className="font-medium">Age:</span> {patient.age}</p>
                                        <p><span className="font-medium">Diagnosis:</span> {patient.diagnosis}</p>
                                        <p><span className="font-medium">Contact:</span> {patient.contact}</p>
                                        <p><span className="font-medium">Last Call:</span> {patient.lastCallDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setCurrentStep(2)}
                                disabled={filteredPatients.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Select Patient
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Select Patient */}
                {currentStep === 2 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Patient(s)</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    onClick={() => handlePatientSelect(patient)}
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPatients.find(p => p.id === patient.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                        <div className="flex items-center">
                                            <span className={`px-2 py-1 text-xs rounded-full mr-2 ${getPriorityColor(patient.priority)}`}>
                                                {patient.priority}
                                            </span>
                                            {selectedPatients.find(p => p.id === patient.id) && (
                                                <Check className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>{patient.diagnosis}</p>
                                        <p>{patient.contact}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedPatients.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h3 className="font-medium text-blue-900 mb-2">Selected Patients ({selectedPatients.length})</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPatients.map((patient) => (
                                        <span key={patient.id} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {patient.name}
                                            <button
                                                onClick={() => handlePatientSelect(patient)}
                                                className="ml-2 hover:text-blue-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentStep(3)}
                                disabled={selectedPatients.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Create Checklist
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Create/Edit Checklist */}
                {currentStep === 3 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create/Edit Checklist</h2>

                        <div className="mb-6">
                            <button
                                onClick={generateChecklist}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Generate AI Checklist
                            </button>
                            <p className="text-sm text-gray-600 mt-2">Generate a checklist based on patient conditions</p>
                        </div>

                        <div className="mb-6">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add checklist item..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={newChecklistItem}
                                    onChange={(e) => setNewChecklistItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                                />
                                <button
                                    onClick={addChecklistItem}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            {checklist.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={(e) => {
                                            const newChecklist = checklist.map(checkItem =>
                                                checkItem.id === item.id ? { ...checkItem, completed: e.target.checked } : checkItem
                                            );
                                            setChecklist(newChecklist);
                                        }}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                                        className="flex-1 px-2 py-1 border-none bg-transparent focus:ring-0 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => removeChecklistItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentStep(4)}
                                disabled={checklist.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Choose Call Time
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Choose Call Time */}
                {currentStep === 4 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Call Time</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Call Timing</label>
                                <div className="space-y-3">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="callTime"
                                            value="immediate"
                                            checked={callSettings.callTime === 'immediate'}
                                            onChange={(e) => setCallSettings({ ...callSettings, callTime: e.target.value })}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2">Immediate</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="callTime"
                                            value="scheduled"
                                            checked={callSettings.callTime === 'scheduled'}
                                            onChange={(e) => setCallSettings({ ...callSettings, callTime: e.target.value })}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2">Scheduled</span>
                                    </label>
                                </div>

                                {callSettings.callTime === 'scheduled' && (
                                    <div className="mt-4">
                                        <input
                                            type="datetime-local"
                                            value={callSettings.scheduledDateTime}
                                            onChange={(e) => setCallSettings({ ...callSettings, scheduledDateTime: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Frequency</label>
                                <select
                                    value={callSettings.frequency}
                                    onChange={(e) => setCallSettings({ ...callSettings, frequency: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="once">Once</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="custom">Custom</option>
                                </select>

                                {callSettings.frequency === 'custom' && (
                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            placeholder="e.g., Every 3 days"
                                            value={callSettings.customFrequency}
                                            onChange={(e) => setCallSettings({ ...callSettings, customFrequency: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep(3)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentStep(5)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Next: Review & Confirm
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Review & Confirm */}
                {currentStep === 5 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Confirm</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Selected Patients</h3>
                                <div className="space-y-2">
                                    {selectedPatients.map((patient) => (
                                        <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{patient.name}</p>
                                                <p className="text-sm text-gray-600">{patient.diagnosis} • {patient.contact}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(patient.priority)}`}>
                                                {patient.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Call Settings</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Timing:</span> {callSettings.callTime === 'immediate' ? 'Immediate' : `Scheduled for ${callSettings.scheduledDateTime}`}</p>
                                    <p><span className="font-medium">Frequency:</span> {callSettings.frequency === 'custom' ? callSettings.customFrequency : callSettings.frequency}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-3">Checklist ({checklist.length} items)</h3>
                            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                {checklist.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2 py-1">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <span className="text-sm">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep(4)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleScheduleCall}
                                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                Schedule Call
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManualCallScheduling;
