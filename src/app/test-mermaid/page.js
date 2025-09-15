"use client";
import { useState } from 'react';
import MermaidDiagram from '@/components/MermaidDiagram';

export default function MermaidTest() {
  const [selectedDiagram, setSelectedDiagram] = useState('flowchart');

  const diagrams = {
    flowchart: `graph TD
    A[Incoming Call] --> B[/phone/voice endpoint]
    B --> C{User Verification}
    C -->|Failed| D[Play rejection message]
    C -->|Success| E[Play greeting]
    D --> F[Hangup]
    E --> G[Gather speech input]
    G --> H[/phone/gather-response]
    H --> I{Intent Detection}
    I -->|No intent| J[Continue with initial chat]
    I -->|Intent detected| K["Play 'please wait' message"]
    K --> L[Route to orchestrator]
    L --> M[Generate specialized response]
    M --> N[Continue conversation]
    J --> G
    N --> G`,
    
    sequence: `sequenceDiagram
    participant U as User
    participant T as Twilio
    participant A as API Gateway
    participant O as Orchestrator
    
    U->>T: Make call
    T->>A: Webhook /phone/voice
    A->>A: Verify user
    A->>T: TwiML response
    T->>U: Play greeting
    U->>T: Speak
    T->>A: /phone/gather-response
    A->>O: Check intent
    O->>A: Intent detected
    A->>T: TwiML response
    T->>U: AI response`,
    
    state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Ringing : Incoming Call
    Idle --> Calling : Outbound Call
    Ringing --> Connected : Answer
    Calling --> Connected : Answer
    Connected --> Speaking : User Speaks
    Speaking --> Processing : VAD Detects End
    Processing --> Responding : Generate Response
    Responding --> Connected : Play Response
    Connected --> [*] : Hangup
    Ringing --> [*] : No Answer
    Calling --> [*] : Failed`
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mermaid Diagram Test</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Diagram Type:
        </label>
        <select 
          value={selectedDiagram}
          onChange={(e) => setSelectedDiagram(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="flowchart">Call Flow Chart</option>
          <option value="sequence">Sequence Diagram</option>
          <option value="state">State Diagram</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedDiagram === 'flowchart' && 'Phone Call Flow Chart'}
          {selectedDiagram === 'sequence' && 'Call Sequence Diagram'}
          {selectedDiagram === 'state' && 'Call State Machine'}
        </h2>
        
        <MermaidDiagram 
          chart={diagrams[selectedDiagram]} 
          id={`test-${selectedDiagram}`}
          title={
            selectedDiagram === 'flowchart' ? 'Phone Call Flow Chart' :
            selectedDiagram === 'sequence' ? 'Call Sequence Diagram' :
            'Call State Machine'
          }
          showToolbar={true}
        />
      </div>

      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Raw Mermaid Code:</h3>
        <pre className="text-sm bg-white p-4 rounded border overflow-x-auto">
          {diagrams[selectedDiagram]}
        </pre>
      </div>
    </div>
  );
}