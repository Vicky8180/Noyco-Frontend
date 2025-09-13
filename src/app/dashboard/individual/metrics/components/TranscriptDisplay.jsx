import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';



export default function TranscriptDisplay({ conversationId, fetchTranscript }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchTranscript(conversationId);
        setMessages(data.messages || []);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };
    if (conversationId) load();
  }, [conversationId]);

  if (!conversationId) return <p className="text-gray-500">Select a conversation</p>;
  if (loading) return <p>Loading transcript…</p>;
  if (error) return <p className="text-red-500">Error loading transcript</p>;

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4 bg-white rounded-lg shadow-sm border">
      {messages.map((msg, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">
            {msg.sender} • {format(new Date(msg.timestamp), 'PPpp')}
          </span>
          <div className={`px-4 py-2 rounded-lg inline-block max-w-xl ${msg.sender === 'assistant' ? 'bg-blue-50 self-start' : 'bg-green-50 self-end'}`}> 
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

TranscriptDisplay.propTypes = {
  conversationId: PropTypes.string,
  fetchTranscript: PropTypes.func.isRequired,
};
