import React from 'react';

export default function PatientFilters({ filters, onFilterChange, onApplyFilters, onResetFilters }) {
  // Available filter fields
  const filterFields = [
    { value: 'name.family', label: 'Family Name' },
    { value: 'name.given', label: 'Given Name' },
    { value: 'gender', label: 'Gender' },
    { value: 'birthDate', label: 'Birth Date' },
    { value: 'address.city', label: 'City' },
    { value: 'address.state', label: 'State' },
    { value: 'address.postalCode', label: 'Postal Code' }
  ];

  // Available operators
  const operators = [
    { value: 'eq', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' }
  ];

  // Handle field change
  const handleFieldChange = (e) => {
    onFilterChange({
      ...filters,
      field: e.target.value
    });
  };

  // Handle operator change
  const handleOperatorChange = (e) => {
    onFilterChange({
      ...filters,
      operator: e.target.value
    });
  };

  // Handle query change
  const handleQueryChange = (e) => {
    onFilterChange({
      ...filters,
      query: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
        <select
          value={filters.field}
          onChange={handleFieldChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Select a field</option>
          {filterFields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
        <select
          value={filters.operator}
          onChange={handleOperatorChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Select an operator</option>
          {operators.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input
          type="text"
          value={filters.query}
          onChange={handleQueryChange}
          placeholder="Enter filter value..."
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
      
      <div className="pt-2 flex space-x-3">
        <button
          onClick={onApplyFilters}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply Filter
        </button>
        <button
          onClick={onResetFilters}
          className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>
      
      {/* Gender Quick Filters */}
      <div className="pt-2">
        <p className="text-sm font-medium text-gray-700 mb-2">Quick Filters</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              onFilterChange({
                field: 'gender',
                operator: 'eq',
                query: 'male'
              });
              onApplyFilters();
            }}
            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors"
          >
            Male
          </button>
          <button
            onClick={() => {
              onFilterChange({
                field: 'gender',
                operator: 'eq',
                query: 'female'
              });
              onApplyFilters();
            }}
            className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full hover:bg-pink-200 transition-colors"
          >
            Female
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const yearAgo = new Date();
              yearAgo.setFullYear(today.getFullYear() - 65);
              
              onFilterChange({
                field: 'birthDate',
                operator: 'lt',
                query: yearAgo.toISOString().split('T')[0]
              });
              onApplyFilters();
            }}
            className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
          >
            65+ Years
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const yearAgo = new Date();
              yearAgo.setFullYear(today.getFullYear() - 18);
              
              onFilterChange({
                field: 'birthDate',
                operator: 'gt',
                query: yearAgo.toISOString().split('T')[0]
              });
              onApplyFilters();
            }}
            className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200 transition-colors"
          >
            Under 18
          </button>
        </div>
      </div>
    </div>
  );
}