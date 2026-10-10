import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus, PreferredContactMethod } from '../../types';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  AlertCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { AddLeadModal } from './AddLeadModal';
import { EditLeadModal } from './EditLeadModal';
import { LeadDetailModal } from './LeadDetailModal';

interface LeadManagementViewProps {
  onOpenBookAppointment: (lead: Lead) => void;
}

export const LeadManagementView: React.FC<LeadManagementViewProps> = ({
  onOpenBookAppointment,
}) => {
  const {
    leads,
    deleteLead,
    changeLeadStatus,
    setSelectedLeadId,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [inspectingLead, setInspectingLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.enquiryDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.notes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' || lead.status === statusFilter;

    const matchesChannel =
      channelFilter === 'ALL' || lead.preferredContactMethod === channelFilter;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  const statuses: { label: string; value: string }[] = [
    { label: 'All Leads', value: 'ALL' },
    { label: 'New', value: 'New' },
    { label: 'Contacted', value: 'Contacted' },
    { label: 'Awaiting Reply', value: 'Awaiting Reply' },
    { label: 'Qualified', value: 'Qualified' },
    { label: 'Booked', value: 'Appointment Booked' },
    { label: 'Not Interested', value: 'Not Interested' },
    { label: 'Closed', value: 'Closed' },
  ];

  const handleOpenAssistant = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('assistant');
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300';
      case 'Contacted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300';
      case 'Awaiting Reply':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300';
      case 'Qualified':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300';
      case 'Appointment Booked':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300';
      case 'Not Interested':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300';
      case 'Closed':
        return 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
            Lead Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track, filter, qualify, and engage all inbound prospective clients
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Card / Table view toggle */}
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-md p-1.5 text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`rounded-md p-1.5 text-xs transition-colors ${
                viewMode === 'cards'
                  ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
              title="Grid cards view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3 dark:border-slate-800">
        {statuses.map((s) => {
          const count =
            s.value === 'ALL'
              ? leads.length
              : leads.filter((l) => l.status === s.value).length;
          const isSelected = statusFilter === s.value;
          return (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{s.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Channel Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, phone, details, or notes..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            Channel:
          </span>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS / Text</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
            No leads match your filter
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try adjusting search terms or add a new inbound lead.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setChannelFilter('ALL');
            }}
            className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="py-3 px-4 font-bold text-slate-500 dark:text-slate-400">Lead Name & Contact</th>
                  <th className="py-3 px-4 font-bold text-slate-500 dark:text-slate-400">Enquiry / Need</th>
                  <th className="py-3 px-4 font-bold text-slate-500 dark:text-slate-400">Status</th>
                  <th className="py-3 px-4 font-bold text-slate-500 dark:text-slate-400">AI Score</th>
                  <th className="py-3 px-4 font-bold text-slate-500 dark:text-slate-400">Source</th>
                  <th className="py-3 px-4 font-bold text-slate-500 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-950 dark:text-indigo-300">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <button
                            onClick={() => setInspectingLead(lead)}
                            className="font-bold text-slate-900 hover:text-indigo-600 text-left dark:text-white dark:hover:text-indigo-400"
                          >
                            {lead.name}
                          </button>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{lead.phone || lead.email}</span>
                            <span className="uppercase text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                              [{lead.preferredContactMethod}]
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="line-clamp-1 font-semibold text-slate-800 dark:text-slate-200">
                        {lead.qualification.need}
                      </p>
                      <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {lead.enquiryDetails}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => changeLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold border-0 outline-hidden cursor-pointer ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Awaiting Reply">Awaiting Reply</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Appointment Booked">Appointment Booked</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${
                              lead.qualification.score >= 80
                                ? 'bg-emerald-500'
                                : lead.qualification.score >= 50
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${lead.qualification.score}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {lead.qualification.score}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {lead.source}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenAssistant(lead.id)}
                          className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300 dark:hover:bg-indigo-900"
                          title="Open AI Draft Simulator"
                        >
                          <Bot className="h-3.5 w-3.5" />
                          <span>AI Chat</span>
                        </button>

                        <button
                          onClick={() => onOpenBookAppointment(lead)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-purple-600 dark:hover:bg-slate-800"
                          title="Book appointment"
                        >
                          <CalendarCheck className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setInspectingLead(lead)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                          title="View lead profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setEditingLead(lead)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                          title="Edit lead"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setLeadToDelete(lead)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                          title="Delete lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-200 transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-950 dark:text-indigo-300">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {lead.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lead.source} • {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
              </div>

              {/* Inquiry snippet */}
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
                <p className="line-clamp-2">"{lead.enquiryDetails}"</p>
              </div>

              {/* Extracted requirement tags */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {lead.qualification.need}
                </span>
                {lead.qualification.budget && (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {lead.qualification.budget}
                  </span>
                )}
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase">
                  {lead.preferredContactMethod}
                </span>
              </div>

              {/* Actions footer */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span>Score:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {lead.qualification.score}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenAssistant(lead.id)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    <span>AI Chat</span>
                  </button>
                  <button
                    onClick={() => setInspectingLead(lead)}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    title="Inspect Lead"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setEditingLead(lead)}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    title="Edit Lead"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setLeadToDelete(lead)}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700"
                    title="Delete Lead"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Lead Modal */}
      <EditLeadModal
        lead={editingLead}
        isOpen={Boolean(editingLead)}
        onClose={() => setEditingLead(null)}
      />

      {/* Inspect Lead Profile Modal */}
      <LeadDetailModal
        lead={inspectingLead}
        isOpen={Boolean(inspectingLead)}
        onClose={() => setInspectingLead(null)}
        onEdit={(lead) => setEditingLead(lead)}
        onBookAppointment={(lead) => onOpenBookAppointment(lead)}
      />

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete Lead "{leadToDelete.name}"?
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  This will permanently remove this lead, their conversation history, and any associated appointment records.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={() => setLeadToDelete(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteLead(leadToDelete.id);
                  setLeadToDelete(null);
                }}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
