import { useOrgStore } from './state/useOrgStore';
import { ProgressSteps } from './components/ProgressSteps';
import { FileDropZone } from './components/FileDropZone';
import { ColumnMapper } from './components/ColumnMapper';
import { ValidationPanel } from './components/ValidationPanel';
import { OrgChartView } from './components/OrgChartView';

function App() {
  const { step } = useOrgStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Org Chart Visualizer</h1>
          <ProgressSteps currentStep={step} />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {step === 'upload' && <FileDropZone />}
        {step === 'map' && <ColumnMapper />}
        {step === 'validate' && <ValidationPanel />}
        {step === 'visualize' && <OrgChartView />}
      </main>
    </div>
  );
}

export default App;
