

// "use client";

// import { useState } from "react";
// import { 
//   PencilIcon, 
//   TrashIcon, 
//   ArrowLeftIcon,
//   UserIcon,
//   HeartIcon,
//   ClockIcon,
//   DocumentTextIcon,
//   CogIcon
// } from "@heroicons/react/24/outline";

// const ProfileViewer = ({ profile, onBack, onEdit, onDelete }) => {
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   // Debug: Log the profile data to see what we're working with
//   console.log('ProfileViewer received profile:', profile);

//   const formatArrayValue = (value) => {
//     if (Array.isArray(value) && value.length > 0) {
//       return value.join(", ");
//     }
//     return "Not specified";
//   };

//   const formatObjectValue = (obj, field) => {
//     if (obj && typeof obj === "object" && obj[field]) {
//       if (Array.isArray(obj[field])) {
//         return obj[field].length > 0 ? obj[field].join(", ") : "Not specified";
//       }
//       return obj[field];
//     }
//     return "Not specified";
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "Not specified";
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch {
//       return dateString;
//     }
//   };

//   const formatPreferences = (preferences) => {
//     if (!preferences || typeof preferences !== "object") return {};
//     return preferences;
//   };

//   const formatHealthInfo = (healthInfo) => {
//     if (!healthInfo || typeof healthInfo !== "object") return {};
//     return healthInfo;
//   };

//   const handleDelete = () => {
//     setShowDeleteConfirm(false);
//     onDelete(profile.id || profile.user_profile_id);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-4">
//       {/* Header */}
//       <div className="mb-4">
//         <button
//           onClick={onBack}
//           className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors text-sm"
//         >
//           <ArrowLeftIcon className="w-4 h-4" />
//           Back to Profiles
//         </button>
        
//         <div className="bg-white rounded-lg shadow-sm  p-4">
//           <div className="flex items-start justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
//                 <UserIcon className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">{profile.profile_name || profile.name}</h1>
//                 <p className="text-gray-600 text-sm">{profile.name}</p>
//                 <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
//                   <span>ID: {profile.user_profile_id || profile.id}</span>
//                   <span>•</span>
//                   <span>Role: {profile.role_entity_id}</span>
//                   <span>•</span>
//                   <span>Status: {profile.is_active ? "Active" : "Inactive"}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex gap-2">
//               <button
//                 onClick={() => onEdit(profile)}
//                 className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors text-sm"
//               >
//                 <PencilIcon className="w-3.5 h-3.5" />
//                 Edit
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(true)}
//                 className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors text-sm"
//               >
//                 <TrashIcon className="w-3.5 h-3.5" />
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* Basic Information */}
//         <div className="bg-white  rounded-lg p-4">
//           <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
//             <UserIcon className="w-4 h-4 text-gray-600" />
//             Basic Information
//           </h3>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Age:</span>
//               <span className="text-gray-900">{profile.age || "Not specified"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Gender:</span>
//               <span className="text-gray-900 capitalize">{profile.gender || "Not specified"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Location:</span>
//               <span className="text-gray-900">{profile.location || "Not specified"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Language:</span>
//               <span className="text-gray-900">{profile.language || "Not specified"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Emotional Baseline:</span>
//               <span className="text-gray-900 capitalize">{profile.emotional_baseline || "Not specified"}</span>
//             </div>
//           </div>
//         </div>

//         {/* Personality & Traits */}
//         <div className="bg-white  rounded-lg p-4">
//           <h3 className="text-md font-semibold text-gray-900 mb-3">Personality & Traits</h3>
//           <div className="space-y-3">
//             <div>
//               <h4 className="font-medium text-gray-800 text-sm mb-1">Personality Traits</h4>
//               <div className="flex flex-wrap gap-1">
//                 {profile.personality_traits?.map((trait, index) => (
//                   <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
//                     {trait}
//                   </span>
//                 )) || <span className="text-gray-500 text-xs">Not specified</span>}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-medium text-gray-800 text-sm mb-1">Interests</h4>
//               <div className="flex flex-wrap gap-1">
//                 {profile.interests?.map((interest, index) => (
//                   <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
//                     {interest}
//                   </span>
//                 )) || <span className="text-gray-500 text-xs">Not specified</span>}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-medium text-gray-800 text-sm mb-1">Hobbies</h4>
//               <p className="text-gray-700 text-sm">{formatArrayValue(profile.hobbies)}</p>
//             </div>
//             <div>
//               <h4 className="font-medium text-gray-800 text-sm mb-1">Dislikes</h4>
//               <p className="text-gray-700 text-sm">{formatArrayValue(profile.hates)}</p>
//             </div>
//           </div>
//         </div>

//         {/* Preferences */}
//         <div className="bg-white  rounded-lg p-4">
//           <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
//             <CogIcon className="w-4 h-4 text-gray-600" />
//             Preferences
//           </h3>
//           <div className="space-y-2 text-sm">
//             {Object.entries(formatPreferences(profile.preferences)).length > 0 ? (
//               Object.entries(formatPreferences(profile.preferences)).map(([key, value]) => (
//                 <div key={key} className="flex justify-between">
//                   <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
//                   <span className="text-gray-900 capitalize">{String(value).replace(/_/g, ' ')}</span>
//                 </div>
//               ))
//             ) : (
//               <span className="text-gray-500 text-sm">No preferences set</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Health Information */}
//       {Object.keys(formatHealthInfo(profile.health_info)).length > 0 && (
//         <div className="mt-4 bg-white  rounded-lg p-4">
//           <h3 className="text-md font-semibold text-gray-900 mb-3">Health Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
//             {Object.entries(formatHealthInfo(profile.health_info)).map(([key, value]) => (
//               <div key={key}>
//                 <h4 className="font-medium text-gray-800 text-sm mb-1 capitalize">{key.replace(/_/g, ' ')}</h4>
//                 <p className="text-gray-700">
//                   {Array.isArray(value) ? value.join(", ") : String(value)}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Loved Ones */}
//       {profile.loved_ones && profile.loved_ones.length > 0 && (
//         <div className="mt-4 bg-white  rounded-lg p-4">
//           <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
//             <HeartIcon className="w-4 h-4 text-gray-600" />
//             Loved Ones
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {profile.loved_ones.map((person, index) => (
//               <div key={index} className=" rounded-lg p-3">
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="font-medium text-sm">{person.name}</span>
//                   {person.relation && (
//                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                       {person.relation}
//                     </span>
//                   )}
//                 </div>
//                 {person.memories && person.memories.length > 0 && (
//                   <div>
//                     <h5 className="text-xs font-medium text-gray-600 mb-1">Memories:</h5>
//                     <ul className="text-xs text-gray-700 space-y-1">
//                       {person.memories.map((memory, memIndex) => (
//                         <li key={memIndex} className="list-disc list-inside">{memory}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Past Stories */}
//       {profile.past_stories && profile.past_stories.length > 0 && (
//         <div className="mt-4 bg-white  rounded-lg p-4">
//           <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
//             <DocumentTextIcon className="w-4 h-4 text-gray-600" />
//             Past Stories
//           </h3>
//           <div className="space-y-3">
//             {profile.past_stories.map((story, index) => (
//               <div key={index} className=" rounded-lg p-3">
//                 {story.title && (
//                   <h4 className="font-medium text-gray-800 text-sm mb-1">{story.title}</h4>
//                 )}
//                 <p className="text-gray-700 text-sm mb-2">{story.description}</p>
//                 <div className="flex justify-between items-center text-xs text-gray-500">
//                   {story.date && (
//                     <span className="flex items-center gap-1">
//                       <ClockIcon className="w-3 h-3" />
//                       {formatDateTime(story.date)}
//                     </span>
//                   )}
//                   {story.emotional_significance && (
//                     <span className="px-2 py-1 bg-gray-100 rounded capitalize">
//                       {story.emotional_significance}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Timestamps */}
//       <div className="mt-4 bg-white  rounded-lg p-4">
//         <h3 className="text-md font-semibold text-gray-900 mb-3">Timestamps</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <span className="text-gray-600">Created At:</span>
//             <p className="text-gray-900">{formatDateTime(profile.created_at)}</p>
//           </div>
//           <div>
//             <span className="text-gray-600">Updated At:</span>
//             <p className="text-gray-900">{formatDateTime(profile.updated_at)}</p>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full">
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Profile</h3>
//             <p className="text-gray-600 mb-6 text-sm">
//               Are you sure you want to delete "{profile.profile_name || profile.name}"? This action cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileViewer;



"use client";

import { useState } from "react";
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  UserIcon,
  HeartIcon,
  ClockIcon,
  DocumentTextIcon,
  CogIcon,
  SparklesIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

const ProfileViewer = ({ profile, onBack, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  console.log('ProfileViewer received profile:', profile);

  const formatArrayValue = (value) => {
    if (Array.isArray(value) && value.length > 0) {
      return value.join(", ");
    }
    return "Not specified";
  };

  const formatObjectValue = (obj, field) => {
    if (obj && typeof obj === "object" && obj[field]) {
      if (Array.isArray(obj[field])) {
        return obj[field].length > 0 ? obj[field].join(", ") : "Not specified";
      }
      return obj[field];
    }
    return "Not specified";
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatPreferences = (preferences) => {
    if (!preferences || typeof preferences !== "object") return {};
    return preferences;
  };

  const formatHealthInfo = (healthInfo) => {
    if (!healthInfo || typeof healthInfo !== "object") return {};
    return healthInfo;
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(profile.id || profile.user_profile_id);
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
        <div className="w-1.5 h-1.5 bg-green-600 mr-1.5"></div>
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
        <div className="w-1.5 h-1.5 bg-gray-400 mr-1.5"></div>
        Inactive
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-all duration-200 hover:gap-3 text-sm font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Profiles
          </button>
          
          {/* Profile Header Card */}
          <div className="bg-beige shadow-sm border border-accent p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center text-gray-800 shadow-lg">
                    <UserIcon className="w-7 h-7" />
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    {getStatusBadge(profile.is_active)}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {profile.profile_name || profile.name}
                  </h1>
                  <p className="text-gray-600 text-base font-medium mb-2">{profile.name}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      ID: {profile.user_profile_id || profile.id}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      Role: {profile.role_entity_id}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(profile)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-md transition-colors text-sm font-medium shadow-sm"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="bg-beige shadow-sm border border-accent p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              {(() => {
                return [
                  { label: "Age", value: profile.age, icon: "👤" },
                  { label: "Phone *", value: profile.phone, icon: "📞", required: true, isNewField: true },
                  { label: "Gender", value: profile.gender, icon: "⚧️" },
                  { label: "Location", value: profile.location, icon: "📍" },
                  { label: "Language", value: profile.language, icon: "🗣️" },
                  { label: "Emotional Baseline", value: profile.emotional_baseline, icon: "💝" }
                ];
              })().map((item, index) => {
                // Check if value exists and is not empty
                const hasValue = item.value !== null && 
                                item.value !== undefined && 
                                item.value !== '' && 
                                String(item.value).trim() !== '';
                
                const isRequired = item.required === true;
                const showAsRequired = isRequired && !hasValue;
                
                // Special handling for new required fields in existing profiles
                let displayText = hasValue ? item.value : (isRequired ? "Required" : "Not specified");
                if (item.isNewField && !hasValue) {
                  displayText = "Please add in edit mode";
                }
                
                return (
                                     <div key={index} className="flex items-center justify-between p-3 bg-beige">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-gray-600 font-medium text-sm">{item.label}</span>
                    </div>
                    <span className={`font-medium text-sm capitalize ${
                      showAsRequired ? "text-orange-500" : "text-gray-900"
                    }`}>
                      {displayText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personality & Traits */}
          <div className="bg-beige shadow-sm border border-accent p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Personality & Traits</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Personality Traits</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.personality_traits?.map((trait, index) => (
                    <span key={index} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-medium">
                      {trait}
                    </span>
                  )) || <span className="text-gray-500 text-sm">Not specified</span>}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs font-medium">
                      {interest}
                    </span>
                  )) || <span className="text-gray-500 text-sm">Not specified</span>}
                </div>
              </div>
              
              <div className="space-y-3">
                                 <div className="p-3 bg-beige">
                   <h4 className="font-semibold text-gray-800 text-sm mb-1">❤️ Loves</h4>
                   <p className="text-gray-700 text-sm">{formatArrayValue(profile.hobbies)}</p>
                </div>
                <div className="p-3 bg-beige">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">💔 Dislikes</h4>
                  <p className="text-gray-700 text-sm">{formatArrayValue(profile.hates)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-beige shadow-sm border border-accent p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100">
                <CogIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
            </div>
            
            <div className="space-y-3">
              {Object.entries(formatPreferences(profile.preferences)).length > 0 ? (
                Object.entries(formatPreferences(profile.preferences)).map(([key, value]) => (
                                     <div key={key} className="flex items-center justify-between p-3 bg-beige">
                     <span className="text-gray-700 font-medium text-sm capitalize">
                       {key.replace(/_/g, ' ')}
                     </span>
                     <span className="text-gray-800 font-semibold text-sm capitalize">
                      {String(value).replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CogIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <span className="text-gray-500 text-sm">No preferences configured yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Information */}
        {/* {Object.keys(formatHealthInfo(profile.health_info)).length > 0 && (
          <div className="mt-6 bg-beige shadow-sm border border-accent p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-red-600 text-lg">🏥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Health Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formatHealthInfo(profile.health_info)).map(([key, value]) => (
                                 <div key={key} className="p-4 bg-beige border border-accent">
                   <h4 className="font-semibold text-gray-800 text-sm mb-2 capitalize">
                     {key.replace(/_/g, ' ')}
                   </h4>
                   <p className="text-gray-700 text-sm">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Loved Ones */}


          {profile.loved_ones && profile.loved_ones.length > 0 && (
          <div className="mt-3 bg-beige shadow-sm border border-accent p-4">
            <div className="flex items-center gap-2 mb-3">
              <HeartIcon className="w-4 h-4 text-pink-600" />
              <h3 className="text-sm font-semibold text-gray-900">Loved Ones</h3>
            </div>
            
            <div className="space-y-2">
              {profile.loved_ones.slice(0, 4).map((person, index) => (
                <div key={index} className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded border border-pink-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-pink-900 text-sm">{person.name}</h4>
                    {person.relation && (
                      <span className="px-2 py-1 bg-pink-200 text-pink-800 rounded-full text-xs font-medium">
                        {person.relation}
                      </span>
                    )}
                  </div>
                  {console.log('Person memories:', person.memories)}
                  {person.memories && Array.isArray(person.memories) && person.memories.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-pink-700 mb-1">💭 Memories:</h5>
                      <p className="text-pink-800 text-xs mb-1 leading-relaxed">
                        • {person.memories[0]}
                      </p>
                      {person.memories.length > 1 && (
                        <div>
                          <p className="text-pink-800 text-xs mb-1 leading-relaxed">
                            • {person.memories[1]}
                          </p>
                          {person.memories.length > 2 && (
                            <p className="text-xs text-pink-600 italic">
                              +{person.memories.length - 2} more memories...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {profile.loved_ones.length > 4 && (
                                 <div className="p-3 bg-beige border border-accent flex items-center justify-center text-gray-500 text-sm">
                  +{profile.loved_ones.length - 4} more loved ones
                </div>
              )}
            </div>
          </div>
        )}
        {/* {profile.loved_ones && profile.loved_ones.length > 0 && (
          <div className="mt-6 bg-beige shadow-sm border border-accent p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-100 rounded-lg">
                <HeartIcon className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Loved Ones</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.loved_ones.map((person, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900">{person.name}</h4>
                    {person.relation && (
                      <span className="px-2 py-1 bg-pink-200 text-pink-800 rounded-full text-xs font-medium">
                        {person.relation}
                      </span>
                    )}
                  </div>
                  {person.memories && person.memories.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-pink-700 mb-2">💭 Memories:</h5>
                      <div className="space-y-1">
                        {person.memories.slice(0, 3).map((memory, memIndex) => (
                          <p key={memIndex} className="text-xs text-pink-800 bg-pink-100 p-2 rounded-lg">
                            {memory}
                          </p>
                        ))}
                        {person.memories.length > 3 && (
                          <p className="text-xs text-pink-600 italic">
                            +{person.memories.length - 3} more memories...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Past Stories */}
        {profile.past_stories && profile.past_stories.length > 0 && (
          <div className="mt-6 bg-beige shadow-sm border border-accent p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DocumentTextIcon className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Past Stories</h3>
            </div>
            
            <div className="space-y-4">
              {profile.past_stories.map((story, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                  {story.title && (
                    <h4 className="font-semibold text-orange-900 mb-2">{story.title}</h4>
                  )}
                  <p className="text-orange-800 mb-3 leading-relaxed">{story.description}</p>
                  <div className="flex justify-between items-center">
                    {story.date && (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                        <ClockIcon className="w-3 h-3" />
                        {formatDateTime(story.date)}
                      </span>
                    )}
                    {story.emotional_significance && (
                      <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium capitalize">
                        {story.emotional_significance}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="mt-6 bg-beige shadow-sm border border-accent p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100">
              <ClockIcon className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-4 bg-beige">
               <span className="text-gray-600 font-medium text-sm">Created At</span>
               <p className="text-gray-900 font-semibold mt-1">{formatDateTime(profile.created_at)}</p>
             </div>
             <div className="p-4 bg-beige">
               <span className="text-gray-600 font-medium text-sm">Last Updated</span>
               <p className="text-gray-900 font-semibold mt-1">{formatDateTime(profile.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-beige p-6 max-w-md w-full shadow-2xl border border-accent">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 flex items-center justify-center mx-auto mb-3">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Profile</h3>
              <p className="text-gray-600">
                Are you sure you want to delete "<span className="font-semibold">{profile.profile_name || profile.name}</span>"? 
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileViewer;