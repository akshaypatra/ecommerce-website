import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiUser, FiMapPin } from 'react-icons/fi';
import { authAPI } from '../services/api';

function ProfilePage({ user, setUser }) {
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: '', last_name: '', phone: '',
  });
  const [addressForm, setAddressForm] = useState({
    full_name: '', phone: '', address_line1: '', address_line2: '',
    city: '', state: '', pincode: '', country: 'India', address_type: 'home', is_default: false,
  });

  const loadData = useCallback(async () => {
    try {
      const [profileRes, addrRes] = await Promise.all([
        authAPI.getProfile(),
        authAPI.getAddresses(),
      ]);
      const p = profileRes.data;
      setProfileForm({ first_name: p.first_name || '', last_name: p.last_name || '', phone: p.phone || '' });
      const addrData = Array.isArray(addrRes.data) ? addrRes.data
        : Array.isArray(addrRes.data?.results) ? addrRes.data.results : [];
      setAddresses(addrData);
      if (setUser) setUser(p);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(profileForm);
      if (setUser) setUser(res.data);
      setEditProfile(false);
    } catch {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.createAddress(addressForm);
      setAddresses(prev => Array.isArray(prev) ? [...prev, res.data] : [res.data]);
      setShowAddressForm(false);
      setAddressForm({
        full_name: '', phone: '', address_line1: '', address_line2: '',
        city: '', state: '', pincode: '', country: 'India', address_type: 'home', is_default: false,
      });
    } catch {
      alert('Failed to add address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await authAPI.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Failed to delete address.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--spiritual-teal)' }} />
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '2rem' }}>My Account</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            <FiUser className="me-1" /> Profile
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'addresses' ? 'active' : ''}`} onClick={() => setTab('addresses')}>
            <FiMapPin className="me-1" /> Addresses
          </button>
        </li>
      </ul>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card" style={{ borderRadius: 'var(--radius-lg)', maxWidth: '600px' }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ color: 'var(--spiritual-purple)', fontWeight: '600', marginBottom: 0 }}>Personal Information</h5>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setEditProfile(!editProfile)}>
                <FiEdit2 className="me-1" /> {editProfile ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Email</label>
              <p style={{ color: 'var(--text-light)' }}>{user?.email || '—'}</p>
            </div>

            {editProfile ? (
              <>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>First Name</label>
                    <input type="text" className="form-control" value={profileForm.first_name}
                      onChange={e => setProfileForm(p => ({ ...p, first_name: e.target.value }))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Last Name</label>
                    <input type="text" className="form-control" value={profileForm.last_name}
                      onChange={e => setProfileForm(p => ({ ...p, last_name: e.target.value }))} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Phone</label>
                  <input type="tel" className="form-control" value={profileForm.phone}
                    onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                  <FiSave className="me-1" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>First Name</label>
                    <p style={{ color: 'var(--text-light)' }}>{profileForm.first_name || '—'}</p>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Last Name</label>
                    <p style={{ color: 'var(--text-light)' }}>{profileForm.last_name || '—'}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Phone</label>
                  <p style={{ color: 'var(--text-light)' }}>{profileForm.phone || '—'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Addresses Tab */}
      {tab === 'addresses' && (
        <div>
          <button className="btn btn-primary mb-3" onClick={() => setShowAddressForm(!showAddressForm)}>
            <FiPlus className="me-1" /> Add Address
          </button>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="card p-3 mb-4" style={{ borderRadius: 'var(--radius-lg)', maxWidth: '600px' }}>
              <div className="row g-3">
                <div className="col-6">
                  <input type="text" className="form-control" placeholder="Full Name *" required
                    value={addressForm.full_name} onChange={e => setAddressForm(p => ({ ...p, full_name: e.target.value }))} />
                </div>
                <div className="col-6">
                  <input type="tel" className="form-control" placeholder="Phone *" required
                    value={addressForm.phone} onChange={e => setAddressForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="col-12">
                  <input type="text" className="form-control" placeholder="Address Line 1 *" required
                    value={addressForm.address_line1} onChange={e => setAddressForm(p => ({ ...p, address_line1: e.target.value }))} />
                </div>
                <div className="col-12">
                  <input type="text" className="form-control" placeholder="Address Line 2"
                    value={addressForm.address_line2} onChange={e => setAddressForm(p => ({ ...p, address_line2: e.target.value }))} />
                </div>
                <div className="col-4">
                  <input type="text" className="form-control" placeholder="City *" required
                    value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} />
                </div>
                <div className="col-4">
                  <input type="text" className="form-control" placeholder="State *" required
                    value={addressForm.state} onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))} />
                </div>
                <div className="col-4">
                  <input type="text" className="form-control" placeholder="Pincode *" required
                    value={addressForm.pincode} onChange={e => setAddressForm(p => ({ ...p, pincode: e.target.value }))} />
                </div>
                <div className="col-6">
                  <select className="form-select" value={addressForm.address_type}
                    onChange={e => setAddressForm(p => ({ ...p, address_type: e.target.value }))}>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-6 d-flex align-items-center">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={addressForm.is_default}
                      onChange={e => setAddressForm(p => ({ ...p, is_default: e.target.checked }))} />
                    <label className="form-check-label">Default address</label>
                  </div>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary me-2">Save Address</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddressForm(false)}>Cancel</button>
                </div>
              </div>
            </form>
          )}

          {addresses.length === 0 && !showAddressForm ? (
            <div className="empty-state">
              <FiMapPin style={{ fontSize: '2rem', color: 'var(--spiritual-teal)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-light)' }}>No addresses saved yet.</p>
            </div>
          ) : (
            <div className="row g-3">
              {addresses.map(addr => (
                <div key={addr.id} className="col-md-6">
                  <div className="card h-100" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{addr.full_name}</strong>
                          {addr.is_default && <span className="badge bg-success ms-2">Default</span>}
                          <span className="badge bg-secondary ms-1" style={{ textTransform: 'capitalize' }}>{addr.address_type}</span>
                        </div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAddress(addr.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>
                        {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 0 }}>
                        📞 {addr.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
