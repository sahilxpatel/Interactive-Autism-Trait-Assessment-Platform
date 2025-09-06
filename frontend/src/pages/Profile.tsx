import { useAuth } from '../components/auth/AuthProvider';
import { signOut, updateProfile } from 'firebase/auth';
import { auth } from '../components/firebase';

export function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSetName = async () => {
    const name = prompt('Enter display name', displayName || '');
    if (name) {
      await updateProfile(user, { displayName: name });
      // Force UI update by reloading (simple approach)
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={handleSetName} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit Display Name</button>
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">Logout</button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Account Info</h2>
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            <li><strong>UID:</strong> {user.uid}</li>
            <li><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</li>
            {user.metadata && (
              <>
                <li><strong>Created:</strong> {new Date(user.metadata.creationTime || '').toLocaleString()}</li>
                <li><strong>Last Sign-In:</strong> {new Date(user.metadata.lastSignInTime || '').toLocaleString()}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
