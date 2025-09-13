// // frontend/src/app/dashboard/assistant/knowledge-base/page.js
// 'use client'

// import { useEffect, useState, useRef } from 'react'
// import { useSocket } from '../hooks/useSocket'
// import {
//     HiOutlineIdentification,
//     HiOutlineUser,
//     HiOutlineUserGroup,
//     HiOutlinePhone,
//     HiOutlineMapPin,
//     HiOutlineCalendar,
//     HiOutlineAdjustmentsHorizontal,
//     HiOutlineMagnifyingGlass,
//     HiOutlineChevronDown,
//     HiOutlineChevronUp,
//     HiOutlineXMark,
//     HiOutlineArrowPath,
//     HiOutlinePlus
// } from 'react-icons/hi2'

// const FILTER_FIELDS = [
//     { key: 'id', label: 'Patient ID', type: 'text', icon: <HiOutlineIdentification className="inline mr-1" /> },
//     { key: 'name', label: 'Name', type: 'text', icon: <HiOutlineUser className="inline mr-1" /> },
//     { key: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'], icon: <HiOutlineUserGroup className="inline mr-1" /> },
//     { key: 'birthDate', label: 'Birth Date', type: 'date', icon: <HiOutlineCalendar className="inline mr-1" /> },
//     { key: 'phone', label: 'Phone', type: 'text', icon: <HiOutlinePhone className="inline mr-1" /> },
//     { key: 'address', label: 'Address', type: 'text', icon: <HiOutlineMapPin className="inline mr-1" /> }
// ]

// const FILTER_OPERATORS = [
//     { value: 'is', label: 'is', icon: '=' },
//     { value: 'contains', label: 'contains', icon: '⊃' },
//     { value: 'startsWith', label: 'starts with', icon: '▶' },
//     { value: 'endsWith', label: 'ends with', icon: '◀' },
//     { value: 'gt', label: 'greater than', icon: '>' },
//     { value: 'lt', label: 'less than', icon: '<' },
//     { value: 'between', label: 'between', icon: '↔' }
// ]

// function getFieldValue(p, key) {
//     switch (key) {
//         case 'id':
//             return String(p?.id ?? '')
//         case 'name':
//             return p.name && p.name[0]
//                 ? `${(p.name[0].given || []).join(' ')} ${p.name[0].family || ''}`.trim()
//                 : 'Unknown'
//         case 'gender':
//             return String(p?.gender ?? '')
//         case 'birthDate':
//             return String(p?.birthDate ?? '')
//         case 'phone':
//             return p.telecom && p.telecom[0] ? p.telecom[0].value : 'N/A'
//         case 'address':
//             return p.address && p.address[0]
//                 ? [
//                     ...(p.address[0].line || []),
//                     p.address[0].city,
//                     p.address[0].state,
//                     p.address[0].country
//                 ].filter(Boolean).join(', ')
//                 : 'N/A'
//         default:
//             return ''
//     }
// }

// // Utility to fetch patient full data
// async function fetchPatientFullData(patientId) {
//     // Use correct backend endpoints
//     const [patient, conditions, observations, encounters, procedures] = await Promise.all([
//         fetch(`/api/patients/${patientId}`).then(r => r.json()),
//         fetch(`/api/patients/${patientId}/conditions`).then(r => r.json()),
//         fetch(`/api/patients/${patientId}/observations`).then(r => r.json()),
//         fetch(`/api/patients/${patientId}/encounters`).then(r => r.json()),
//         fetch(`/api/patients/${patientId}/procedures`).then(r => r.json()),
//     ])
//     return { patient, conditions, observations, encounters, procedures }
// }

// function getGenderBadgeColor(gender) {
//     switch (gender?.toLowerCase()) {
//         case "male":
//             return "bg-blue-100 text-blue-800 border-blue-200"
//         case "female":
//             return "bg-pink-100 text-pink-800 border-pink-200"
//         default:
//             return "bg-gray-100 text-gray-800 border-gray-200"
//     }
// }

// // Patient Details Modal Component
// function PatientDetailsModal({ open, onClose, patientId }) {
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState(null)
//     const [data, setData] = useState(null)
//     const prevId = useRef(null)

//     useEffect(() => {
//         if (open && patientId && prevId.current !== patientId) {
//             setLoading(true)
//             setError(null)
//             setData(null)
//             fetchPatientFullData(patientId)
//                 .then(setData)
//                 .catch(e => setError('Failed to load patient data'))
//                 .finally(() => setLoading(false))
//             prevId.current = patientId
//         }
//     }, [open, patientId])

//     if (!open) return null

//     // Defensive: always use arrays for lists
//     const encounters = Array.isArray(data?.encounters) ? data.encounters : (data?.encounters ? [data.encounters] : [])
//     const conditions = Array.isArray(data?.conditions) ? data.conditions : (data?.conditions ? [data.conditions] : [])
//     const observations = Array.isArray(data?.observations) ? data.observations : (data?.observations ? [data.observations] : [])
//     const procedures = Array.isArray(data?.procedures) ? data.procedures : (data?.procedures ? [data.procedures] : [])

//     // Defensive: handle patient object
//     const patientObj = data?.patient && !Array.isArray(data.patient) ? data.patient
//         : Array.isArray(data?.patient) && data.patient.length > 0 ? data.patient[0]
//         : {};

//     // Helper for timeline events
//     const timelineEvents = [
//         ...encounters.map(enc => ({
//             type: 'Encounter',
//             date: enc.period?.start,
//             title: enc.type?.[0]?.coding?.[0]?.display || 'Encounter',
//             status: enc.status,
//             id: enc.id
//         })),
//         ...procedures.map(proc => ({
//             type: 'Procedure',
//             date: proc.performedDateTime,
//             title: proc.code?.text || proc.code?.coding?.[0]?.display || 'Procedure',
//             status: proc.status,
//             id: proc.id
//         }))
//     ].sort((a, b) => (a.date || '').localeCompare(b.date || ''))

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//             {/* Blurred, semi-transparent background */}
//             <div className="absolute inset-0 bg-black/10 backdrop-blur-[8px] transition-all duration-300" style={{ zIndex: 49 }} />
//             <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full p-0 relative overflow-y-auto max-h-[97vh] border border-neutral-200 z-50">
//                 <button
//                     className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 text-2xl z-10"
//                     onClick={onClose}
//                     aria-label="Close"
//                 >
//                     <HiOutlineXMark />
//                 </button>
//                 {loading ? (
//                     <div className="flex items-center justify-center py-16">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"></div>
//                         <span className="ml-4 text-neutral-600 font-medium">Loading patient details...</span>
//                     </div>
//                 ) : error ? (
//                     <div className="text-red-600 text-center py-8">{error}</div>
//                 ) : data ? (
//                     <div className="flex flex-col md:flex-row gap-0">
//                         {/* Left: Patient Summary & Timeline */}
//                         <div className="w-full md:w-1/3 xl:w-1/4 bg-gradient-to-b from-neutral-50 to-neutral-100 border-r border-neutral-200 p-6 flex flex-col gap-6 min-w-[320px]">
//                             {/* Patient Card */}
//                             <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-neutral-100">
//                                 <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center text-5xl font-bold text-neutral-600 mb-2">
//                                     {getFieldValue(patientObj, "name").charAt(0).toUpperCase()}
//                                 </div>
//                                 <h2 className="text-xl font-bold text-neutral-800 text-center">{getFieldValue(patientObj, "name")}</h2>
//                                 <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
//                                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getGenderBadgeColor(getFieldValue(patientObj, "gender"))}`}>
//                                         {getFieldValue(patientObj, "gender") || "Unknown"}
//                                     </span>
//                                     <span className="text-neutral-500 text-xs">
//                                         DOB: {getFieldValue(patientObj, "birthDate") || "N/A"}
//                                     </span>
//                                 </div>
//                                 <div className="text-neutral-500 text-xs mt-2 text-center">
//                                     <span className="block">ID: {getFieldValue(patientObj, "id")}</span>
//                                     <span className="block">{getFieldValue(patientObj, "address")}</span>
//                                     <span className="block">Phone: {getFieldValue(patientObj, "phone")}</span>
//                                     {/* Add more patient details */}
//                                     <span className="block">Marital Status: {patientObj.maritalStatus?.text || "Married"}</span>
//                                     <span className="block">Language: {patientObj.communication?.[0]?.language?.text || "English"}</span>
//                                     <span className="block">Email: {patientObj.telecom?.find(t => t.system === "email")?.value || "john.doe@email.com"}</span>
//                                 </div>
//                             </div>
//                             {/* Quick Stats */}
//                             <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-4 flex flex-col gap-2">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-xs text-neutral-500">Encounters</span>
//                                     <span className="font-bold text-neutral-700">{encounters.length}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-xs text-neutral-500">Conditions</span>
//                                     <span className="font-bold text-neutral-700">{conditions.length}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-xs text-neutral-500">Observations</span>
//                                     <span className="font-bold text-neutral-700">{observations.length}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-xs text-neutral-500">Procedures</span>
//                                     <span className="font-bold text-neutral-700">{procedures.length}</span>
//                                 </div>
//                             </div>
//                             {/* Timeline */}
//                             <div className="bg-white rounded-xl border border-neutral-100 p-4 flex-1 min-h-[180px] max-h-[320px] overflow-y-auto">
//                                 <div className="font-semibold text-neutral-700 mb-2 flex items-center">
//                                     <HiOutlineCalendar className="mr-2" /> Timeline
//                                 </div>
//                                 {timelineEvents.length === 0 ? (
//                                     <div className="text-neutral-400 text-sm">No events found.</div>
//                                 ) : (
//                                     <ol className="relative border-l border-neutral-200 pl-4">
//                                         {timelineEvents.map((ev, idx) => (
//                                             <li key={ev.id || idx} className="mb-6 ml-2">
//                                                 <div className="absolute w-3 h-3 bg-blue-200 rounded-full -left-1.5 border border-white"></div>
//                                                 <div className="flex flex-col">
//                                                     <span className="text-xs text-neutral-400">{ev.date?.slice(0, 10) || "N/A"}</span>
//                                                     <span className="font-semibold">{ev.title}</span>
//                                                     <span className="text-xs text-neutral-500">{ev.type} | {ev.status}</span>
//                                                 </div>
//                                             </li>
//                                         ))}
//                                     </ol>
//                                 )}
//                             </div>
//                         </div>
//                         {/* Right: Details */}
//                         <div className="w-full md:w-2/3 xl:w-3/4 p-8 flex flex-col gap-8 overflow-x-auto">
//                             {/* Section: Conditions & Observations */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 {/* Conditions */}
//                                 <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow" style={{ minHeight: '220px', maxHeight: '340px' }}>
//                                     <div className="flex items-center mb-2 font-semibold text-neutral-700">
//                                         <HiOutlineAdjustmentsHorizontal className="mr-2" /> Conditions
//                                     </div>
//                                     {conditions.length === 0 ? (
//                                         <div className="text-neutral-400 text-sm">No conditions found.</div>
//                                     ) : (
//                                         <div className="max-h-[260px]">
//                                             <table className="min-w-full text-xs">
//                                                 <thead>
//                                                     <tr>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Condition</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Status</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Onset</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Recorded By</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Notes</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {conditions.map(cond => (
//                                                         <tr key={cond.id}>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{cond.code?.text || cond.code?.coding?.[0]?.display || "Condition"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{cond.clinicalStatus?.coding?.[0]?.display || cond.clinicalStatus?.coding?.[0]?.code || "Active"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{cond.onsetDateTime?.slice(0, 10) || "2025-07-09"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{cond.asserter?.display || "Dr. Smith"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{cond.note?.[0]?.text || "Patient advised to monitor diet."}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     )}
//                                 </div>
//                                 {/* Observations */}
//                                 <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow" style={{ minHeight: '220px', maxHeight: '340px' }}>
//                                     <div className="flex items-center mb-2 font-semibold text-neutral-700">
//                                         <HiOutlineMagnifyingGlass className="mr-2" /> Observations
//                                     </div>
//                                     {observations.length === 0 ? (
//                                         <div className="text-neutral-400 text-sm">No observations found.</div>
//                                     ) : (
//                                         <div className="max-h-[260px]">
//                                             <table className="min-w-full text-xs">
//                                                 <thead>
//                                                     <tr>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Type</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Value</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Unit</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Date</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Status</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Performer</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {observations.map(obs => (
//                                                         <tr key={obs.id}>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{obs.code?.text || obs.code?.coding?.[0]?.display || "Blood Pressure"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{obs.valueQuantity?.value ?? obs.valueString ?? "120/80"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{obs.valueQuantity?.unit || "mmHg"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{obs.effectiveDateTime?.slice(0, 10) || "2025-07-09"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{obs.status || "final"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{obs.performer?.[0]?.display || "Nurse Jane"}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                             {/* Section: Encounters & Procedures */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 {/* Encounters */}
//                                 <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow" style={{ minHeight: '220px', maxHeight: '340px' }}>
//                                     <div className="flex items-center mb-2 font-semibold text-neutral-700">
//                                         <HiOutlineCalendar className="mr-2" /> Encounters
//                                     </div>
//                                     {encounters.length === 0 ? (
//                                         <div className="text-neutral-400 text-sm">No encounters found.</div>
//                                     ) : (
//                                         <div className="max-h-[260px]">
//                                             <table className="min-w-full text-xs">
//                                                 <thead>
//                                                     <tr>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Type</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Date</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Status</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Location</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Reason</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Practitioner</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {encounters.map(enc => (
//                                                         <tr key={enc.id}>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{enc.type?.[0]?.coding?.[0]?.display || "Encounter for check up"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{enc.period?.start?.slice(0, 10) || "2025-07-09"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{enc.status || "finished"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{enc.location?.[0]?.location?.display || "Hospital"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{enc.reasonCode?.[0]?.text || "Routine checkup"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{enc.participant?.[0]?.individual?.display || "Dr. Smith"}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     )}
//                                 </div>
//                                 {/* Procedures */}
//                                 <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow" style={{ minHeight: '220px', maxHeight: '340px' }}>
//                                     <div className="flex items-center mb-2 font-semibold text-neutral-700">
//                                         <HiOutlineArrowPath className="mr-2" /> Procedures
//                                     </div>
//                                     {procedures.length === 0 ? (
//                                         <div className="text-neutral-400 text-sm">No procedures found.</div>
//                                     ) : (
//                                         <div className="max-h-[260px]">
//                                             <table className="min-w-full text-xs">
//                                                 <thead>
//                                                     <tr>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Procedure</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Date</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Performer</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Status</th>
//                                                         <th className="px-2 py-1 text-left font-semibold whitespace-nowrap">Notes</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {procedures.map(proc => (
//                                                         <tr key={proc.id}>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{proc.code?.text || proc.code?.coding?.[0]?.display || "Medication: Omeprazole"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{proc.performedDateTime?.slice(0, 10) || "2025-04-27"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{proc.performer?.map(perf => perf.actor?.display).filter(Boolean).join(', ') || "Hospital"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{proc.status || "completed"}</td>
//                                                             <td className="px-2 py-1 whitespace-normal break-words">{proc.note?.[0]?.text || "Procedure successful."}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : null}
//             </div>
//         </div>
//     )
// }

// // Simple section card for modal
// function SectionCard({ title, icon, children }) {
//     return (
//         <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
//             <div className="flex items-center mb-2 font-semibold text-neutral-700">
//                 <span className="mr-2">{icon}</span>
//                 {title}
//             </div>
//             {children}
//         </div>
//     )
// }

// export default function KnowledgeBasePage() {
//     const { isConnected, socket } = useSocket()
//     const [patients, setPatients] = useState([])
//     const [search, setSearch] = useState('')
//     const [activeFilters, setActiveFilters] = useState([])
//     const [filterDraft, setFilterDraft] = useState({
//         field: 'name',
//         operator: 'contains',
//         value: '',
//         value2: ''
//     })
//     const [sort, setSort] = useState({ key: '', direction: 'asc' })
//     const [sidebarOpen, setSidebarOpen] = useState(false)
//     const [loading, setLoading] = useState(true)
//     const [modalOpen, setModalOpen] = useState(false)
//     const [selectedPatientId, setSelectedPatientId] = useState(null)

//     useEffect(() => {
//         if (socket && isConnected) {
//             setLoading(true)
//             socket.emit('fetch_all_patients')
//             socket.on('all_patients_data', (data) => {
//                 setPatients(data)
//                 setLoading(false)
//             })
//             return () => {
//                 socket.off('all_patients_data')
//             }
//         }
//     }, [socket, isConnected])

//     // Filtering logic
//     const applyFilters = (list) => {
//         let filtered = list
//         // Global search
//         if (search.trim()) {
//             const s = search.trim().toLowerCase()
//             filtered = filtered.filter(p =>
//                 FILTER_FIELDS.some(f => {
//                     const val = getFieldValue(p, f.key)
//                     return (val ? String(val) : '').toLowerCase().includes(s)
//                 })
//             )
//         }
//         // Advanced filters
//         activeFilters.forEach(f => {
//             filtered = filtered.filter(p => {
//                 const val = (getFieldValue(p, f.field) ?? '').toString().toLowerCase()
//                 const v = String(f.value ?? '').toLowerCase()
//                 const v2 = String(f.value2 ?? '').toLowerCase()
//                 switch (f.operator) {
//                     case 'is':
//                         return val === v
//                     case 'contains':
//                         return val.includes(v)
//                     case 'startsWith':
//                         return val.startsWith(v)
//                     case 'endsWith':
//                         return val.endsWith(v)
//                     case 'gt':
//                         return val > v
//                     case 'lt':
//                         return val < v
//                     case 'between':
//                         return val >= v && val <= v2
//                     default:
//                         return true
//                 }
//             })
//         })
//         return filtered
//     }

//     // Sorting logic
//     const sortedPatients = [...applyFilters(patients)].sort((a, b) => {
//         if (!sort.key) return 0
//         let aValue = getFieldValue(a, sort.key).toLowerCase()
//         let bValue = getFieldValue(b, sort.key).toLowerCase()
//         if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1
//         if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1
//         return 0
//     })

//     // Filter chip remove
//     const removeFilter = idx => {
//         setActiveFilters(filters => filters.filter((_, i) => i !== idx))
//     }

//     // Add filter from sidebar
//     const addFilter = () => {
//         if (!filterDraft.value && filterDraft.operator !== 'between') return
//         if (filterDraft.operator === 'between' && (!filterDraft.value || !filterDraft.value2)) return
//         setActiveFilters(filters => [...filters, filterDraft])
//         setFilterDraft({ field: 'name', operator: 'contains', value: '', value2: '' })
//     }

//     // UI
//     return (
//         <div className="flex min-h-screen h-screen overflow-y-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
//             {/* Backdrop for mobile sidebar */}
//             {sidebarOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
//             )}

//             {/* Container for sidebar + main content */}
//             <div className="max-w-[120%] mx-auto w-full flex h-screen overflow-y-hidden">
//                 {/* Sidebar */}
//                 <aside
//                     className={`
//                         fixed md:relative z-50 md:z-auto
//                         transition-all duration-300 ease-in-out
//                         bg-white/95 backdrop-blur-xl shadow-xl 
//                         w-[24rem] h-full md:h-auto
//                         border-r border-neutral-200
//                         ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
//                         md:sticky md:top-0 md:self-start md:h-[100vh]  // <-- Make sidebar sticky on desktop
//                     `}
//                     style={{ maxHeight: '100vh', overflowY: 'auto' }} // <-- Prevent sidebar from scrolling with main
//                 >
//                     <div className="p-6 h-full overflow-y-auto">
//                         {/* Header */}
//                         <div className="flex items-center justify-between mb-6">
//                             <div className="flex items-center space-x-3">
//                                 <div className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center">
//                                     <HiOutlineAdjustmentsHorizontal className="text-neutral-600 text-xl" />
//                                 </div>
//                                 <h2 className="font-bold text-xl text-neutral-800">
//                                     Filters & Sort
//                                 </h2>
//                             </div>
//                             <button
//                                 className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
//                                 onClick={() => setSidebarOpen(false)}
//                             >
//                                 <HiOutlineXMark className="text-xl" />
//                             </button>
//                         </div>

//                         {/* Filter Form */}
//                         <div className="space-y-6">
//                             <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
//                                 <label className="block text-sm font-semibold text-neutral-700 mb-3 flex items-center">
//                                     <HiOutlineAdjustmentsHorizontal className="mr-2" />
//                                     Field
//                                 </label>
//                                 <select
//                                     className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-all duration-200 appearance-none cursor-pointer"
//                                     value={filterDraft.field}
//                                     onChange={e => setFilterDraft(d => ({ ...d, field: e.target.value }))}
//                                 >
//                                     {FILTER_FIELDS.map(f => (
//                                         <option key={f.key} value={f.key}>
//                                             {/* Use label only in select, icon is shown above */}
//                                             {f.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
//                                 <label className="block text-sm font-semibold text-neutral-700 mb-3 flex items-center">
//                                     <HiOutlineChevronDown className="mr-2" />
//                                     Operator
//                                 </label>
//                                 <select
//                                     className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-all duration-200 appearance-none cursor-pointer"
//                                     value={filterDraft.operator}
//                                     onChange={e => setFilterDraft(d => ({ ...d, operator: e.target.value }))}
//                                 >
//                                     {FILTER_OPERATORS.map(o => (
//                                         <option key={o.value} value={o.value}>
//                                             {o.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
//                                 <label className="block text-sm font-semibold text-neutral-700 mb-3 flex items-center">
//                                     <HiOutlineMagnifyingGlass className="mr-2" />
//                                     Value
//                                 </label>
//                                 <input
//                                     className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-all duration-200"
//                                     value={filterDraft.value}
//                                     onChange={e => setFilterDraft(d => ({ ...d, value: e.target.value }))}
//                                     placeholder="Enter value"
//                                     type={filterDraft.field === 'birthDate' ? 'date' : 'text'}
//                                 />
//                                 {filterDraft.operator === 'between' && (
//                                     <input
//                                         className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-all duration-200 mt-2"
//                                         value={filterDraft.value2}
//                                         onChange={e => setFilterDraft(d => ({ ...d, value2: e.target.value }))}
//                                         placeholder="And value"
//                                         type={filterDraft.field === 'birthDate' ? 'date' : 'text'}
//                                     />
//                                 )}
//                             </div>

//                             <button
//                                 className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
//                                 onClick={addFilter}
//                             >
//                                 <HiOutlinePlus />
//                                 <span>Add Filter</span>
//                             </button>
//                         </div>

//                         {/* Sort Section */}
//                         <div className="mt-8 bg-neutral-50 rounded-xl p-4 border border-neutral-100">
//                             <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
//                                 <HiOutlineArrowPath className="mr-2" />
//                                 Sort By
//                             </h3>
//                             <div className="space-y-3">
//                                 <select
//                                     className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-all duration-200 appearance-none cursor-pointer"
//                                     value={sort.key}
//                                     onChange={e => setSort(s => ({ ...s, key: e.target.value }))}
//                                 >
//                                     <option value="">None</option>
//                                     {FILTER_FIELDS.map(f => (
//                                         <option key={f.key} value={f.key}>
//                                             {f.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <select
//                                     className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-all duration-200 appearance-none cursor-pointer"
//                                     value={sort.direction}
//                                     onChange={e => setSort(s => ({ ...s, direction: e.target.value }))}
//                                 >
//                                     <option value="asc">Ascending</option>
//                                     <option value="desc">Descending</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                 </aside>

//                 {/* Main content */}
//                 <main className="flex-1 p-4 md:p-8 overflow-y-hidden max-h-screen h-screen">
//                     {/* Header Section */}
//                     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
//                         <div className="flex-1">
//                             {/* Search Bar */}
//                             <div className="relative group">
//                                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                     <HiOutlineMagnifyingGlass className="text-neutral-400 text-xl" />
//                                 </div>
//                                 <input
//                                     className="w-full border border-neutral-200 rounded-lg pl-12 pr-12 py-3 text-base bg-white/80 backdrop-blur-sm focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all duration-300 shadow hover:shadow-md"
//                                     placeholder="Search by any field..."
//                                     value={search}
//                                     onChange={e => setSearch(e.target.value)}
//                                 />
//                                 {search && (
//                                     <button
//                                         className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 transition-colors duration-200 text-xl"
//                                         onClick={() => setSearch('')}
//                                         title="Clear"
//                                     >
//                                         <HiOutlineXMark />
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Filter chips */}
//                             <div className="flex flex-wrap gap-2 mt-4">
//                                 {activeFilters.map((f, idx) => (
//                                     <span
//                                         key={idx}
//                                         className="flex items-center bg-neutral-100 border border-neutral-200 rounded-full px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm hover:shadow transition-all duration-200"
//                                     >
//                                         <span className="mr-1">{FILTER_FIELDS.find(ff => ff.key === f.field)?.icon}</span>
//                                         {FILTER_FIELDS.find(ff => ff.key === f.field)?.label || f.field}{' '}
//                                         {FILTER_OPERATORS.find(o => o.value === f.operator)?.label || f.operator} "{f.value}"
//                                         {f.operator === 'between' && ` and "${f.value2}"`}
//                                         <button
//                                             className="ml-2 text-neutral-500 hover:text-red-600 hover:bg-red-100 rounded-full w-4 h-4 flex items-center justify-center transition-all duration-200"
//                                             onClick={() => removeFilter(idx)}
//                                         >
//                                             <HiOutlineXMark className="text-xs" />
//                                         </button>
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>

//                         <button
//                             className="lg:hidden bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg px-5 py-2 font-semibold transition-all duration-200 flex items-center space-x-2 shadow"
//                             onClick={() => setSidebarOpen(o => !o)}
//                         >
//                             <HiOutlineAdjustmentsHorizontal />
//                             <span>Filters & Sort</span>
//                         </button>
//                     </div>

//                     {/* Patients Table Card */}
//                     <div className="bg-white/95 backdrop-blur rounded-xl shadow border border-neutral-200 overflow-hidden max-w-[120%] mx-auto">
//                         {/* Card Header */}
//                         <div className="bg-neutral-100 px-6 py-4 border-b border-neutral-200">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center space-x-3">
//                                     <div className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center">
//                                         <HiOutlineUserGroup className="text-neutral-600 text-xl" />
//                                     </div>
//                                     <div>
//                                         <h2 className="text-xl font-bold text-neutral-800">All Patients</h2>
//                                         <p className="text-neutral-500">{loading ? "Loading..." : `${sortedPatients.length} patients found`}</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                     <div
//                                         className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"} animate-pulse`}
//                                     ></div>
//                                     <span className="text-neutral-500 text-xs">{isConnected ? "Connected" : "Disconnected"}</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Table Container */}
//                         <div className="overflow-x-auto">
//                             {loading ? (
//                                 <div className="flex items-center justify-center py-16">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"></div>
//                                         <span className="text-neutral-600 font-medium">Loading patients...</span>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
//                                     <table className="min-w-full">
//                                         <thead className="bg-neutral-50">
//                                             <tr>
//                                                 {[
//                                                     { key: "id", label: "Patient ID", icon: <HiOutlineIdentification /> },
//                                                     { key: "name", label: "Name", icon: <HiOutlineUser /> },
//                                                     { key: "gender", label: "Gender", icon: <HiOutlineUserGroup /> },
//                                                     { key: "birthDate", label: "Birth Date", icon: <HiOutlineCalendar /> },
//                                                     { key: "phone", label: "Phone", icon: <HiOutlinePhone /> },
//                                                     { key: "address", label: "Address", icon: <HiOutlineMapPin /> },
//                                                 ].map((col) => (
//                                                     <th
//                                                         key={col.key}
//                                                         className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 border-b border-neutral-200"
//                                                     >
//                                                         <div className="flex items-center space-x-1">
//                                                             <span className="text-base">{col.icon}</span>
//                                                             <span>{col.label}</span>
//                                                         </div>
//                                                     </th>
//                                                 ))}
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-neutral-100">
//                                             {sortedPatients.length === 0 ? (
//                                                 <tr>
//                                                     <td colSpan={6} className="text-center py-16">
//                                                         <div className="flex flex-col items-center space-y-4">
//                                                             <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
//                                                                 <HiOutlineUser className="text-2xl text-neutral-300" />
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-neutral-500 font-medium">No patients found</p>
//                                                                 <p className="text-neutral-400 text-xs">Try adjusting your search or filters</p>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ) : (
//                                                 sortedPatients.map((p, index) => (
//                                                     <tr
//                                                         key={p.id}
//                                                         className="hover:bg-neutral-50 transition-all duration-200 group cursor-pointer"
//                                                         onClick={() => {
//                                                             setSelectedPatientId(p.id)
//                                                             setModalOpen(true)
//                                                         }}
//                                                     >
//                                                         <td className="px-5 py-3 border-b border-neutral-100">
//                                                             <div className="font-mono text-xs bg-neutral-100 px-2 py-1 rounded inline-block">
//                                                                 {getFieldValue(p, "id")}
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-5 py-3 border-b border-neutral-100">
//                                                             <div className="flex items-center space-x-2">
//                                                                 <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500 font-semibold">
//                                                                     {getFieldValue(p, "name").charAt(0).toUpperCase()}
//                                                                 </div>
//                                                                 <span className="font-medium text-neutral-800">{getFieldValue(p, "name")}</span>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-5 py-3 border-b border-neutral-100">
//                                                             <span
//                                                                 className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getGenderBadgeColor(getFieldValue(p, "gender"))}`}
//                                                             >
//                                                                 {getFieldValue(p, "gender") || "Unknown"}
//                                                             </span>
//                                                         </td>
//                                                         <td className="px-5 py-3 border-b border-neutral-100 text-neutral-700">
//                                                             {getFieldValue(p, "birthDate") || "N/A"}
//                                                         </td>
//                                                         <td className="px-5 py-3 border-b border-neutral-100">
//                                                             <div className="flex items-center space-x-1">
//                                                                 <HiOutlinePhone className="text-neutral-400" />
//                                                                 <span className="text-neutral-700">{getFieldValue(p, "phone")}</span>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-5 py-3 border-b border-neutral-100 text-neutral-700 max-w-xs truncate">
//                                                             {getFieldValue(p, "address")}
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             )}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Call Integration Notice */}
//                     <div className="mt-8 bg-neutral-50 border border-neutral-200 rounded-xl p-6 shadow">
//                         <div className="flex items-start space-x-4">
//                             <div className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center flex-shrink-0">
//                                 <HiOutlinePhone className="text-neutral-600 text-xl" />
//                             </div>
//                             <div>
//                                 <h3 className="font-bold text-neutral-800 text-base mb-1 flex items-center">
//                                     Seamless Call Integration
//                                     <span className="ml-2 bg-neutral-200 text-neutral-700 text-xs px-2 py-1 rounded-full">Live</span>
//                                 </h3>
//                                 <p className="text-neutral-700 leading-relaxed text-sm">
//                                     Even while researching in the knowledge base, you'll receive real-time call notifications. You can
//                                     quickly answer calls without losing your research progress.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//                 {/* Patient Details Modal */}
//                 <PatientDetailsModal
//                     open={modalOpen}
//                     onClose={() => setModalOpen(false)}
//                     patientId={selectedPatientId}
//                 />
//             </div>
//         </div>
//     )
// }




"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../store/hooks';
import { apiRequest } from '../../../../lib/api';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import PatientFilters from './components/PatientFilters';
import PatientStatistics from './components/PatientStatistics';


export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    field: '',
    operator: '',
    query: ''
  });
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 20,
    skip: 0,
    total: 0
  });

  // Fetch patients on initial load
  useEffect(() => {
    if (user?.role_entity_id) {
      fetchPatients();
      fetchStatistics();
    }
  }, [user?.role_entity_id, pagination.skip, pagination.limit]);

  // Fetch patients from API
  const fetchPatients = async () => {
    if (!user?.role_entity_id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiRequest(`/api/fhir/patients?role_entity_id=${user.role_entity_id}&limit=${pagination.limit}&skip=${pagination.skip}${searchQuery ? `&search=${searchQuery}` : ''}`, {
        method: 'GET'
      });
      console.log('Fetched patients:', response);
      
      setPatients(response.patients || []);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (err) {
      setError(err.message || 'Failed to fetch patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient statistics
  const fetchStatistics = async () => {
    if (!user?.role_entity_id) return;
    
    try {
      const response = await apiRequest(`/api/fhir/patients/stats/${user.role_entity_id}`, {
        method: 'GET'
      });
      setStats(response);
    } catch (err) {
      console.error('Error fetching patient statistics:', err);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!user?.role_entity_id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('role_entity_id', user.role_entity_id);
      queryParams.append('query', filters.query || searchQuery);
      
      if (filters.field) queryParams.append('field', filters.field);
      if (filters.operator) queryParams.append('operator', filters.operator);
      
      queryParams.append('limit', pagination.limit);
      queryParams.append('skip', pagination.skip);
      
      const response = await apiRequest(`/api/fhir/patients/search?${queryParams.toString()}`, {
        method: 'GET'
      });
      
      setPatients(response.patients || []);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (err) {
      setError(err.message || 'Failed to search patients');
      console.error('Error searching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newSkip) => {
    setPagination(prev => ({ ...prev, skip: newSkip }));
  };

  // View patient detail
  const viewPatientDetail = async (patientId) => {
    if (!user?.role_entity_id || !patientId) return;
    
    setSelectedPatient(patientId);
    setLoading(true);
    setError('');
    
    try {
      const response = await apiRequest(`/api/fhir/patients/${patientId}/full-data?role_entity_id=${user.role_entity_id}`, {
        method: 'GET'
      });
      
      setPatientDetail(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch patient details');
      console.error('Error fetching patient details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      field: '',
      operator: '',
      query: ''
    });
    setSearchQuery('');
    fetchPatients();
  };

  // Close patient detail view
  const closePatientDetail = () => {
    setSelectedPatient(null);
    setPatientDetail(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Dashboard</h1>
        
        {/* Error message */}
        {error && <h1>Error</h1>}
        
        {/* Show patient details or list view */}
        {selectedPatient && patientDetail ? (
          <div>
            <button 
              onClick={closePatientDetail}
              className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center text-sm font-medium text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Patient List
            </button>
            
            <PatientDetail patient={patientDetail} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              {/* Statistics Panel */}
              {stats && <PatientStatistics stats={stats} />}
              
              {/* Filters Panel */}
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Search & Filters</h2>
                
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      onClick={() => handleSearch()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>
                
                <PatientFilters 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onApplyFilters={handleSearch}
                  onResetFilters={resetFilters}
                />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {/* Patient List */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <h1>Loading</h1>
                </div>
              ) : (
                <PatientList 
                  patients={patients} 
                  onViewDetail={viewPatientDetail}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}