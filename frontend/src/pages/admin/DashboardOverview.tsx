import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Home,
  Users,
  DollarSign,
  FileSpreadsheet,
  Mail,
  PlusCircle,
  Activity,
  Globe2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardOverview: React.FC = () => {
  const { showToast } = useToast();

  // Query summary counts
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['adminSummary'],
    queryFn: async () => {
      const res = await api.get('/analytics/summary');
      return res.data;
    },
  });

  // Query graphs data
  const { data: graphData, isLoading: graphsLoading } = useQuery({
    queryKey: ['adminGraphs'],
    queryFn: async () => {
      const res = await api.get('/analytics/graphs');
      return res.data;
    },
  });

  const handleExportCSV = async () => {
    try {
      showToast('Exporting leads database to CSV...', 'info');
      const response = await api.get('/analytics/export', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Leads_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Leads report downloaded successfully!', 'success');
    } catch (err) {
      showToast('Report export failed.', 'error');
    }
  };

  const summary = summaryData?.summary;

  const COLORS = ['#C9A227', '#0F172A', '#1E293B', '#64748B'];

  if (summaryLoading || graphsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Operations Center</h1>
          <p className="text-sm text-slate-500">Live indicators, pipeline performance, and property metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/properties">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <PlusCircle className="w-4 h-4" /> Add Listing
            </Button>
          </Link>
          <Button size="sm" variant="accent" onClick={handleExportCSV} className="flex items-center gap-1 shadow-goldGlow">
            <FileSpreadsheet className="w-4 h-4" /> Export Leads CSV
          </Button>
        </div>
      </div>

      {/* Metrics Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Today\'s Leads', value: summary?.todayLeads || 0, sub: `${summary?.totalLeads || 0} Total in Pipeline`, icon: <Users className="w-5 h-5 text-accent" /> },
          { label: 'Today\'s Enquiries', value: summary?.todayEnquiries || 0, sub: 'Customer website forms', icon: <Mail className="w-5 h-5 text-accent" /> },
          { label: 'Active Properties', value: summary?.availableProperties || 0, sub: `${summary?.soldProperties || 0} sold listings`, icon: <Home className="w-5 h-5 text-accent" /> },
          { label: 'Monthly Revenue', value: `$${(summary?.monthlyRevenue || 0).toLocaleString()}`, sub: 'From closed contracts', icon: <DollarSign className="w-5 h-5 text-accent" /> },
        ].map((card, idx) => (
          <Card key={idx} hoverEffect className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 flex-shrink-0">
              {card.icon}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{card.label}</p>
              <h3 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">{card.value}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">{card.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Visualizers (Charts & Graphs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart: Property Views */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-accent" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Property Views Traffic</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData?.propertyViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <ChartTooltip formatter={(val) => [`${val} Views`, 'Views']} />
                <Line type="monotone" dataKey="views" stroke="#C9A227" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Area chart: Monthly Revenue */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-accent" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Revenue Analytics ($)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData?.revenueAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <ChartTooltip formatter={(val) => [`$${val}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#C9A227" fill="rgba(201, 162, 39, 0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar chart: Lead pipeline funnel stages */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-accent" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Leads Pipeline Conversion</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData?.leadConversion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <ChartTooltip formatter={(val) => [`${val} Leads`, 'Total']} />
                <Bar dataKey="value" fill="#C9A227" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {graphData?.leadConversion?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie chart: Category distribution */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4.5 h-4.5 text-accent" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Property Category Distribution</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={graphData?.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {graphData?.categoryDistribution?.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(val) => [`${val}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Pie Chart Legend panel */}
            <div className="w-1/2 space-y-2 text-xs">
              {graphData?.categoryDistribution?.map((cat: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-500 font-semibold">{cat.name}</span>
                  <span className="font-bold text-slate-900 dark:text-white">({cat.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
