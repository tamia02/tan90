import { useEffect, useState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { useStore } from '../lib/store';
import { Button, Card, CheckboxRow, Field, Input, PageHeader, Select } from '../components/ui';
import { roleMeta } from '../lib/auth';

interface Prefs {
  emailAlerts: boolean;
  smsAlerts: boolean;
  language: string;
  extra: string;
}

const defaultPrefs: Prefs = { emailAlerts: true, smsAlerts: false, language: 'English', extra: '' };

const extraFieldLabel: Partial<Record<string, string>> = {
  guard: 'Default gate location',
  storeExec: 'Default staging area',
  storeManager: 'Default bin prefix',
  qc: 'Default reason code',
  vendor: 'Preferred contact number',
  finance: 'Default currency display',
  admin: 'Session timeout (minutes)',
};

export default function SettingsPage() {
  const { auth } = useStore();
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [saved, setSaved] = useState(false);

  const storageKey = auth ? `tan90-prefs-${auth.role}` : null;

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setPrefs({ ...defaultPrefs, ...JSON.parse(raw) });
      else setPrefs(defaultPrefs);
    } catch {
      setPrefs(defaultPrefs);
    }
  }, [storageKey]);

  if (!auth) return null;
  const meta = roleMeta[auth.role];

  function save() {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Settings" subtitle={`Preferences for your ${meta.label} account.`} />

      <Card className="p-5 flex flex-col gap-4">
        <Field label="Signed in as">
          <Input value={auth.name} disabled />
        </Field>
        <Field label="Module">
          <Input value={meta.moduleName} disabled />
        </Field>

        {extraFieldLabel[auth.role] && (
          <Field label={extraFieldLabel[auth.role]!}>
            <Input value={prefs.extra} onChange={(e) => setPrefs((p) => ({ ...p, extra: e.target.value }))} placeholder="Optional" />
          </Field>
        )}

        <Field label="Language">
          <Select value={prefs.language} onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}>
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </Select>
        </Field>

        <div className="flex flex-col gap-2">
          <CheckboxRow checked={prefs.emailAlerts} onChange={(e) => setPrefs((p) => ({ ...p, emailAlerts: e.target.checked }))}>
            Email alerts for this module
          </CheckboxRow>
          <CheckboxRow checked={prefs.smsAlerts} onChange={(e) => setPrefs((p) => ({ ...p, smsAlerts: e.target.checked }))}>
            SMS alerts for this module
          </CheckboxRow>
        </div>

        <Button onClick={save} className="self-start">
          {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saved ? 'Saved' : 'Save preferences'}
        </Button>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Stored locally in this browser — demo prototype, not synced to a server yet.
        </p>
      </Card>
    </div>
  );
}
