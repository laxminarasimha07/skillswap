import React, { useEffect, useState } from 'react';
import { connectionApi } from '../api/connectionApi';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';
import toast from 'react-hot-toast';
import { userApi } from '../api/userApi';

const ConnectionsPage = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [peerById, setPeerById] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const connectionData = await connectionApi.getConnections();
      setConnections(connectionData);

      if (user) {
        const peerIds = [
          ...new Set(
            connectionData
              .map((c) => (c.senderId === user.id ? c.receiverId : c.senderId))
              .filter(Boolean)
          ),
        ];
        const peers = await Promise.all(peerIds.map((id) => userApi.getUserById(id).catch(() => null)));
        const map = Object.fromEntries(peerIds.map((id, idx) => [id, peers[idx]]));
        setPeerById(map);
      }
    } catch (error) {
      console.error('Error while loading connections', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (connectionId) => {
    try {
      await connectionApi.acceptRequest(connectionId);
      toast.success('Request accepted');
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await connectionApi.rejectRequest(connectionId);
      toast.success('Request rejected');
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const connected = connections.filter(c => c.status === 'ACCEPTED').sort((a, b) => b.id - a.id);
  const history = connections.filter(c => c.status !== 'ACCEPTED').sort((a, b) => b.id - a.id);

  const renderConnectionItem = (connection) => {
    const peerId = user && connection.senderId === user.id ? connection.receiverId : connection.senderId;
    const isIncomingPending = connection.status === 'PENDING' && user && connection.receiverId === user.id;
    const peer = peerById[peerId];

    return (
      <li key={connection.id} className="border border-gray-100 rounded-lg p-3 flex justify-between items-center gap-3">
        <div>
          <p className="font-semibold text-gray-900">{peer?.name || `User #${peerId}`}</p>
          <p className="text-sm text-gray-500">
            {peer?.branch ? `${peer.branch} • ${peer.year}` : null}
            {peer?.branch ? ' • ' : null}
            Status: {connection.status}
          </p>
        </div>

        {isIncomingPending ? (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => handleAccept(connection.id)}>Accept</Button>
            <Button variant="outline" size="sm" onClick={() => handleReject(connection.id)}>Reject</Button>
          </div>
        ) : (
          <span className="text-xs rounded-full px-2 py-1 bg-blue-50 text-blue-600 whitespace-nowrap">
            {connection.status}
          </span>
        )}
      </li>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Connections</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Connected</h2>
            {connected.length === 0 ? (
              <p className="text-gray-500">No active connections yet.</p>
            ) : (
              <ul className="space-y-2">
                {connected.map(renderConnectionItem)}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-xl border p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">History</h2>
            {history.length === 0 ? (
              <p className="text-gray-500">No connection history.</p>
            ) : (
              <ul className="space-y-2">
                {history.map(renderConnectionItem)}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
