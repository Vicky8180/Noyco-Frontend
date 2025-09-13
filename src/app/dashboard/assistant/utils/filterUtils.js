export const filterPatientsByAge = (patients, age) => {
    return patients.filter(patient => patient.age > age);
};

export const filterPatientsByDiagnosis = (patients, diagnosis) => {
    return patients.filter(patient => patient.diagnosis.includes(diagnosis));
};

export const filterRecentlyDiagnosedPatients = (patients, days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return patients.filter(patient => new Date(patient.diagnosisDate) >= cutoffDate);
};

export const filterPatientsByNameOrNumber = (patients, searchTerm) => {
    return patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        patient.phone.includes(searchTerm)
    );
};

export const applyFilters = (patients, filters) => {
    let filteredPatients = [...patients];

    if (filters.age) {
        filteredPatients = filterPatientsByAge(filteredPatients, filters.age);
    }
    if (filters.diagnosis) {
        filteredPatients = filterPatientsByDiagnosis(filteredPatients, filters.diagnosis);
    }
    if (filters.recentlyDiagnosedDays) {
        filteredPatients = filterRecentlyDiagnosedPatients(filteredPatients, filters.recentlyDiagnosedDays);
    }
    if (filters.searchTerm) {
        filteredPatients = filterPatientsByNameOrNumber(filteredPatients, filters.searchTerm);
    }

    return filteredPatients;
};