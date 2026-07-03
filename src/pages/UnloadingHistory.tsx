import { useStore } from '../lib/store';
import StoreExecSubNav from '../components/StoreExecSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { gateEntryLabel } from '../lib/derived';

export default function UnloadingHistory() {
  const { unloadingRecords, gateEntries } = useStore();
  const completed = [...unloadingRecords].filter((u) => u.completedAt).sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Unloading History" subtitle="Every completed unloading, most recent first." />
      <StoreExecSubNav />

      <Card className="p-0 overflow-hidden">
        {completed.length === 0 ? (
          <EmptyState text="No unloadings completed yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-4 py-2.5 font-medium">Gate Entry</th>
                  <th className="px-4 py-2.5 font-medium">Boxes</th>
                  <th className="px-4 py-2.5 font-medium">Staging Area</th>
                  <th className="px-4 py-2.5 font-medium">POD/LR</th>
                  <th className="px-4 py-2.5 font-medium">Completed</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((u) => {
                  const gate = gateEntries.find((g) => g.id === u.gateEntryId);
                  return (
                    <tr key={u.gateEntryId} style={{ borderTop: '1px solid var(--border)' }}>
                      <td className="px-4 py-2.5">{gate ? gateEntryLabel(gate) : u.gateEntryId}</td>
                      <td className="px-4 py-2.5 tabular-nums">{u.boxCount}</td>
                      <td className="px-4 py-2.5">{u.stagingArea}</td>
                      <td className="px-4 py-2.5">{u.podLrRef}</td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(u.completedAt!).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
