"use client";
import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  MessageCircle, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  Send,
  PhoneCall,
  Calendar,
  Activity
} from 'lucide-react';

const CommunicationSystem = () => {
  const [activeTab, setActiveTab] = useState('assistants');
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [userRole] = useState('hospital'); // hospital, admin, assistant

  // Sample data
  const [assistants, setAssistants] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '+1 (555) 123-4567',
      status: 'online',
      department: 'Emergency',
      activeCalls: 3,
      totalCalls: 147,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@hospital.com',
      phone: '+1 (555) 234-5678',
      status: 'busy',
      department: 'Cardiology',
      activeCalls: 1,
      totalCalls: 89,
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@hospital.com',
      phone: '+1 (555) 345-6789',
      status: 'offline',
      department: 'Pediatrics',
      activeCalls: 0,
      totalCalls: 203,
      avatar: 'ER'
    }
  ]);

  const [callTasks, setCallTasks] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 'P001',
      priority: 'high',
      type: 'Follow-up',
      assignedTo: 1,
      status: 'in-progress',
      scheduledTime: '2:30 PM',
      duration: '12 min',
      notes: 'Patient experiencing chest pain'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 'P002',
      priority: 'medium',
      type: 'Consultation',
      assignedTo: 2,
      status: 'pending',
      scheduledTime: '3:00 PM',
      duration: null,
      notes: 'Routine check-up inquiry'
    },
    {
      id: 3,
      patientName: 'Robert Wilson',
      patientId: 'P003',
      priority: 'low',
      type: 'Appointment',
      assignedTo: 1,
      status: 'completed',
      scheduledTime: '1:15 PM',
      duration: '8 min',
      notes: 'Appointment rescheduling'
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 'hospital',
      receiverId: 1,
      message: 'Please prioritize the emergency calls in queue',
      timestamp: '2:15 PM',
      read: true
    },
    {
      id: 2,
      senderId: 1,
      receiverId: 'hospital',
      message: 'Understood. Currently handling 3 calls.',
      timestamp: '2:17 PM',
      read: true
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedAssistant) return;
    
    const newMessage = {
      id: messages.length + 1,
      senderId: 'hospital',
      receiverId: selectedAssistant.id,
      message: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const AssistantCard = ({ assistant }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
              {assistant.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(assistant.status)}`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{assistant.name}</h3>
            <p className="text-sm text-gray-500">{assistant.department}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Active Calls</p>
          <p className="text-2xl font-semibold text-gray-900">{assistant.activeCalls}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Calls</p>
          <p className="text-2xl font-semibold text-gray-900">{assistant.totalCalls}</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={() => setSelectedAssistant(assistant)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Message
        </button>
        <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );

  const CallTaskCard = ({ task }) => {
    const assignedAssistant = assistants.find(a => a.id === task.assignedTo);
    
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(task.status)}
            <div>
              <h3 className="font-semibold text-gray-900">{task.patientName}</h3>
              <p className="text-sm text-gray-500">ID: {task.patientId}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium text-gray-900">{task.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Scheduled</p>
            <p className="font-medium text-gray-900">{task.scheduledTime}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">Assigned to</p>
          <p className="font-medium text-gray-900">{assignedAssistant?.name}</p>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{task.notes}</p>
        
        {task.duration && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Duration: {task.duration}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'assistants', label: 'Assistants', icon: Users },
              { id: 'call-tasks', label: 'Call Tasks', icon: Phone },
              { id: 'messages', label: 'Messages', icon: MessageCircle },
              { id: 'analytics', label: 'Analytics', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'assistants' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assistants.map((assistant) => (
              <AssistantCard key={assistant.id} assistant={assistant} />
            ))}
          </div>
        )}

        {activeTab === 'call-tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {callTasks.map((task) => (
              <CallTaskCard key={task.id} task={task} />
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assistant List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Assistants</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {assistants.map((assistant) => (
                  <button
                    key={assistant.id}
                    onClick={() => setSelectedAssistant(assistant)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedAssistant?.id === assistant.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {assistant.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(assistant.status)}`}></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{assistant.name}</p>
                        <p className="text-sm text-gray-500">{assistant.department}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              {selectedAssistant ? (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {selectedAssistant.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedAssistant.name}</h3>
                        <p className="text-sm text-gray-500">{selectedAssistant.status}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                      <PhoneCall className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="flex-1 p-6 space-y-4">
                    {messages
                      .filter(msg => msg.senderId === selectedAssistant.id || msg.receiverId === selectedAssistant.id)
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'hospital' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-2xl ${
                              message.senderId === 'hospital'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === 'hospital' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="p-6 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select an assistant to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Total Assistants</h3>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{assistants.length}</p>
              <p className="text-sm text-green-600">+2 this week</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Active Calls</h3>
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{callTasks.filter(t => t.status === 'in-progress').length}</p>
              <p className="text-sm text-gray-500">Currently in progress</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Completed Today</h3>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{callTasks.filter(t => t.status === 'completed').length}</p>
              <p className="text-sm text-green-600">94% completion rate</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Avg Response Time</h3>
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">2.3m</p>
              <p className="text-sm text-yellow-600">-15% from last week</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Assistant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Assistant</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Department</option>
                <option value="Emergency">Emergency</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Add Assistant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationSystem;