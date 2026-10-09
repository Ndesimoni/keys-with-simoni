import { useMemo, useRef, useState } from 'react';
import { MAX_MEDIA_TOTAL } from '../config/storage.js';
import { SEED_CRM } from '../data/demo.js';
import { blank, newId, schema } from '../lib/schema.js';
import { today } from '../lib/dates.js';
import { normalizeWorkspaceData } from '../lib/validation.js';
import { removeWorkspaceRecord, saveWorkspaceRecord } from '../features/records/commands.js';
import { createFullBackup, parseFullBackup } from '../services/files/backup.js';
import { downloadJson } from '../services/files/download.js';
import { calendarDefaults } from '../config/calendar.js';

export function useRecordActions(
  { db, data, setDb },
  { setDrawer, setDetail, setToast },
  navigate,
  calendarConnected = false,
) {
  const uploadRef = useRef(null);
  const restoreRef = useRef(null);
  const busyRef = useRef(false);
  const [fileBusy, setFileBusy] = useState(false);

  return useMemo(() => {
    const notify = (message) => setToast(message);
    const saveRecord = (module, record, original) => {
      const result = saveWorkspaceRecord(db, module, record, original);
      if (!result.workspace) return result;
      setDb(result.workspace);
      setDrawer(null);
      notify(original ? 'Record updated successfully' : 'Record added successfully');
      return result;
    };
    const deleteRecord = (module, record) => {
      const id = schema(module)[0].key;
      if (!confirm(`Delete ${record[id]} permanently from this browser?`)) return;
      setDb((current) => removeWorkspaceRecord(current, module, record));
      setDrawer(null);
      setDetail(null);
      notify('Record removed');
    };
    const clearDemo = () => {
      if (
        !confirm(
          'Start with an empty workspace? This replaces the demo records. Export first if you need your current data.',
        )
      )
        return;
      setDb({ data: blank(), demo: false });
      notify('Your blank CRM workspace is ready');
      navigate('Dashboard');
    };
    const restoreDemo = () => {
      if (
        !confirm(
          'Replace ALL local records with example data? Export your data first if you need it.',
        )
      )
        return;
      setDb({ data: SEED_CRM(), demo: true });
      notify('Example workspace restored');
    };
    const downloadFullBackup = () => {
      downloadJson(createFullBackup(data), `Keys_with_Simoni_Full_Backup_${today()}.json`);
      notify('Full backup exported with property media.');
    };
    const readFile = async (event, importFile) => {
      const input = event.currentTarget;
      const file = input.files?.[0];
      if (!file || busyRef.current) return;
      busyRef.current = true;
      setFileBusy(true);
      try {
        if (file.size > 15 * 1024 * 1024) throw Error('Please use a file smaller than 15 MB.');
        const restored = importFile
          ? normalizeWorkspaceData(await (await import('../lib/excel.js')).importExcel(file))
          : parseFullBackup(await file.text());
        if (JSON.stringify({ data: restored, demo: false }).length > MAX_MEDIA_TOTAL)
          throw Error('Records exceed this browser edition’s storage limit.');
        const count = Object.values(restored)
          .filter(Array.isArray)
          .reduce((sum, rows) => sum + rows.length, 0);
        const prompt = importFile
          ? `Import ${count} records from ${file.name}? This will REPLACE your existing local records. Export a backup first if needed.`
          : 'Restore this full backup? It replaces current CRM records and attached media.';
        if (!confirm(prompt)) return;
        setDb({ data: restored, demo: false });
        notify(
          importFile
            ? `Imported ${count} records from Excel.`
            : 'Full backup restored with property photos and floor plans.',
        );
        navigate(importFile ? 'Dashboard' : 'Properties');
      } catch (error) {
        alert(error.message || 'The selected file could not be opened.');
      } finally {
        input.value = '';
        busyRef.current = false;
        setFileBusy(false);
      }
    };
    const downloadRaw = () => {
      const link = document.createElement('a');
      link.href = `${import.meta.env.BASE_URL}data/Keys_with_Simoni_Real_Estate_CRM_Enhanced.xlsx`;
      link.download = 'Keys_with_Simoni_Real_Estate_CRM_Enhanced.xlsx';
      link.click();
    };
    const add = (module, pre = {}) => {
      setDetail(null);
      setDrawer({
        module,
        record: {
          [schema(module)[0].key]: newId(module, data[module]),
          ...calendarDefaults(module),
          ...(Object.keys(calendarDefaults(module)).length
            ? { calendar_enabled: calendarConnected ? 'Yes' : 'No' }
            : {}),
          ...pre,
        },
        original: null,
      });
    };
    const edit = (module, record, initialSection) => {
      setDetail(null);
      setDrawer({ module, record: { ...record }, original: record, initialSection });
    };
    const dispatchRow = (module, record) => setDetail({ module, record });
    const exportWorkbook = async () => {
      if (busyRef.current) return;
      busyRef.current = true;
      setFileBusy(true);
      try {
        const { exportExcel } = await import('../lib/excel.js');
        await exportExcel(data, notify);
      } catch {
        alert('Excel export could not be loaded. Please reload and try again.');
      } finally {
        busyRef.current = false;
        setFileBusy(false);
      }
    };
    return {
      uploadRef,
      restoreRef,
      fileBusy,
      notify,
      saveRecord,
      deleteRecord,
      clearDemo,
      restoreDemo,
      downloadFullBackup,
      downloadRaw,
      add,
      edit,
      dispatchRow,
      exportWorkbook,
      restoreFullBackup: (event) => readFile(event, false),
      onUpload: (event) => readFile(event, true),
    };
  }, [db, data, setDb, setDrawer, setDetail, setToast, navigate, fileBusy, calendarConnected]);
}
