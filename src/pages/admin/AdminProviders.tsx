import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ProviderProfile, ProviderStatus } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Eye,
} from 'lucide-react';

export const AdminProviders: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [docModalOpen, setDocModalOpen] = useState(false);

  const providers = storageService.getProviders();

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchTab = activeTab === 'ALL' || p.status === activeTab;
      const matchSearch =
        !searchQuery.trim() ||
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [providers, activeTab, searchQuery]);

  const handleApprove = (provider: ProviderProfile) => {
    storageService.updateProvider(provider.id, {
      status: 'APPROVED',
      verified: true,
      rejectionReason: undefined,
    });

    if (user) {
      storageService.logAdminAction(
        user,
        'PROVIDER_APPROVED',
        'Provider',
        provider.id,
        `Approved ${provider.fullName} (${provider.category}). Verified file: ${provider.documentName}`
      );
    }

    storageService.addNotification({
      userId: provider.userId,
      title: 'Application Approved!',
      message: 'Your specialist credentials have been verified. You can now accept customer appointments!',
      type: 'approval',
    });

    showToast(`Provider ${provider.fullName} has been approved and verified!`, 'success');
  };

  const handleOpenReject = (provider: ProviderProfile) => {
    setSelectedProvider(provider);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedProvider) return;

    storageService.updateProvider(selectedProvider.id, {
      status: 'REJECTED',
      verified: false,
      rejectionReason: rejectReason || 'Submitted licensing documents could not be verified by compliance.',
    });

    if (user) {
      storageService.logAdminAction(
        user,
        'PROVIDER_REJECTED',
        'Provider',
        selectedProvider.id,
        `Rejected ${selectedProvider.fullName}. Reason: ${rejectReason}`
      );
    }

    storageService.addNotification({
      userId: selectedProvider.userId,
      title: 'Application Update: Declined',
      message: `Your application was declined. Reason: ${rejectReason || 'Document verification failed.'}`,
      type: 'approval',
    });

    showToast(`Application for ${selectedProvider.fullName} rejected.`, 'info');
    setRejectModalOpen(false);
  };

  const handleToggleSuspend = (provider: ProviderProfile) => {
    const newStatus: ProviderStatus = provider.status === 'SUSPENDED' ? 'APPROVED' : 'SUSPENDED';
    storageService.updateProvider(provider.id, { status: newStatus });

    if (user) {
      storageService.logAdminAction(
        user,
        newStatus === 'SUSPENDED' ? 'PROVIDER_SUSPENDED' : 'PROVIDER_REACTIVATED',
        'Provider',
        provider.id,
        `Changed status of ${provider.fullName} to ${newStatus}`
      );
    }

    showToast(`Provider status set to ${newStatus}.`, 'info');
  };

  const handleInspectDoc = (provider: ProviderProfile) => {
    setSelectedProvider(provider);
    setDocModalOpen(true);
  };

  const tabs = [
    { key: 'ALL', label: 'All Providers', count: providers.length },
    { key: 'PENDING', label: 'Pending Review', count: providers.filter((p) => p.status === 'PENDING').length },
    { key: 'APPROVED', label: 'Approved', count: providers.filter((p) => p.status === 'APPROVED').length },
    { key: 'REJECTED', label: 'Rejected', count: providers.filter((p) => p.status === 'REJECTED').length },
    { key: 'SUSPENDED', label: 'Suspended', count: providers.filter((p) => p.status === 'SUSPENDED').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Service Provider Approvals & Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review submitted trade licenses, approve specialist applications, or suspend non-compliant partners.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search provider, category..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Trade & Category</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Verification Document</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Admin Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={provider.avatarUrl}
                        alt={provider.fullName}
                        className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{provider.fullName}</div>
                        <div className="text-[11px] text-slate-500">{provider.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{provider.title}</div>
                    <div className="text-[11px] text-blue-600">{provider.category}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {provider.experienceYears} Years
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">{provider.serviceCity}</td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleInspectDoc(provider)}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span className="truncate max-w-[140px] font-mono">
                        {provider.documentName || 'license.pdf'}
                      </span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={provider.status} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {provider.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(provider)}
                            className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleOpenReject(provider)}
                            className="px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}

                      {provider.status === 'APPROVED' && (
                        <button
                          onClick={() => handleToggleSuspend(provider)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
                        >
                          Suspend
                        </button>
                      )}

                      {provider.status === 'SUSPENDED' && (
                        <button
                          onClick={() => handleToggleSuspend(provider)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors"
                        >
                          Reactivate
                        </button>
                      )}

                      {provider.status === 'REJECTED' && (
                        <button
                          onClick={() => handleApprove(provider)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                        >
                          Reconsider & Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal with reason */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Provider Application"
        subtitle={`Applicant: ${selectedProvider?.fullName}`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Please enter a formal reason for rejection. This will be recorded in the audit log and notified to the
            applicant:
          </p>

          <textarea
            rows={3}
            required
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="E.g. Expired contractor license, insufficient liability coverage, invalid trade certificate..."
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>

      {/* Secure Document Viewer Modal */}
      <Modal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        title="Submitted Trade Verification Document"
        subtitle={`Applicant: ${selectedProvider?.fullName} (${selectedProvider?.title})`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>{selectedProvider?.documentName || 'state_contractor_license.pdf'}</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Uploaded during registration &middot; MIME: application/pdf &middot; Verified via AI Studio Secure Vault
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-6 text-center bg-slate-100/50 space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <div className="text-sm font-bold text-slate-800">State Trade Credential Verification</div>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Certificate verified for active status, bonding compliance, and clean disciplinary record. Sensitive
              government numbers are redacted for privacy.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setDocModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close Document
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
