import { useState } from 'react';
import { ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import AdminSubNav from '../components/AdminSubNav';
import { Button, Card, EmptyState, Field, Input, PageHeader, Select, Textarea } from '../components/ui';
import { resetDemo, useStore } from '../lib/store';
import { roleMeta, roleOrder, type Role } from '../lib/auth';
import type { TeamMember } from '../lib/types';

export default function TeamRoles() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Team & Roles"
        subtitle="Everyone who holds a role in Tan90, and Super Admin access."
        action={
          <Button variant="secondary" onClick={resetDemo}>
            Reset demo data
          </Button>
        }
      />
      <AdminSubNav />
      <TeamManagementPanel />
    </div>
  );
}

function TeamManagementPanel() {
  const { teamMembers, dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [superAdmin, setSuperAdmin] = useState(false);

  function reset() {
    setName('');
    setPhone('');
    setDescription('');
    setRole('');
    setSuperAdmin(false);
    setAdding(false);
  }

  function addMember() {
    const member: TeamMember = {
      id: `TM-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      name: name.trim(),
      phone: phone.trim(),
      description: description.trim() || undefined,
      role: superAdmin ? 'admin' : role || null,
      superAdmin,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: member });
    reset();
  }

  function removeMember(member: TeamMember) {
    if (window.confirm(`Remove ${member.name} from the team? They will no longer show up under any role.`)) {
      dispatch({ type: 'DELETE_TEAM_MEMBER', payload: { id: member.id } });
    }
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Every role, plus who holds it. Super Admin has every permission across every module — the same bypass
          the Admin role itself gets in the app.
        </p>
        <Button variant="secondary" onClick={() => setAdding((a) => !a)}>
          <UserPlus size={15} />
          {adding ? 'Cancel' : 'Add member'}
        </Button>
      </div>

      {adding && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
          </Field>
          <Field label="Phone number">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98200 12345" required />
          </Field>
          <Field label="Role" hint={superAdmin ? 'Super Admin overrides this to Admin' : undefined}>
            <Select value={role} onChange={(e) => setRole(e.target.value as Role)} disabled={superAdmin}>
              <option value="">No role assigned</option>
              {roleOrder.map((r) => (
                <option key={r} value={r}>
                  {roleMeta[r].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Description">
            <Textarea rows={1} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional — location, shift, notes" />
          </Field>
          <label className="sm:col-span-2 flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: 'var(--text-primary)' }}>
            <input type="checkbox" checked={superAdmin} onChange={(e) => setSuperAdmin(e.target.checked)} className="w-4 h-4 accent-[var(--brand)]" />
            <ShieldCheck size={15} color="var(--brand)" />
            Super Admin — full access to every module
          </label>
          <Button className="sm:col-span-2" onClick={addMember} disabled={!name.trim() || !phone.trim()}>
            Add to team
          </Button>
        </div>
      )}

      {teamMembers.length === 0 ? (
        <EmptyState text="No team members yet." />
      ) : (
        <div className="overflow-x-auto border-t" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Phone</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Description</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m, i) => (
                <tr key={m.id} style={{ borderTop: i === 0 ? undefined : '1px solid var(--border)' }}>
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                    {m.name}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                    {m.phone}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {m.superAdmin ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--brand)' }}>
                        <ShieldCheck size={13} />
                        Super Admin
                      </span>
                    ) : m.role ? (
                      roleMeta[m.role].label
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No role</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                    {m.description || '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => removeMember(m)}
                      aria-label={`Remove ${m.name}`}
                      className="p-1.5 rounded-lg hover:opacity-70"
                      style={{ color: 'var(--status-critical)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
