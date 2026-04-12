"use client"

import React, { useState, ReactNode } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Scale, 
  Briefcase, 
  Award, 
  DollarSign,
  ChevronDown,
  Download,
  Eye,
  Calendar,
  Filter,
  Search,
  Building2,
  Users,
  LucideIcon
} from 'lucide-react';

// Type definitions for data structures
interface Ordinance {
  id: string;
  title: string;
  date: string;
  status: string;
  category: string;
  author: string;
  [key: string]: unknown;
}

interface Resolution {
  id: string;
  title: string;
  date: string;
  status: string;
  category: string;
  urgency: string;
  [key: string]: unknown;
}

interface ExecutiveOrder {
  id: string;
  title: string;
  date: string;
  department: string;
  implementor: string;
  [key: string]: unknown;
}

interface BidAward {
  id: string;
  title: string;
  date: string;
  amount: string;
  winner: string;
  status: string;
  type: string;
  [key: string]: unknown;
}

interface FinancialAid {
  barangay: string;
  quarter: string;
  amount: string;
  purpose: string;
  dateReleased: string;
  status: string;
  [key: string]: unknown;
}
// Sample data for different disclosure categories
const ordinanceData: Ordinance[] = [
  { id: "2025-012", title: "Enhanced Traffic Management System", date: "2025-09-15", status: "Active", category: "Traffic", author: "Hon. Carmela A. Acebedo" },
  { id: "2025-011", title: "Environmental Protection Guidelines", date: "2025-09-10", status: "Active", category: "Environment", author: "Hon. Shaira Aliya A. Diaz" },
  { id: "2025-010", title: "Business Operating Hours Regulation", date: "2025-09-05", status: "Active", category: "Business", author: "Hon. Martin Angelo B. Adrina, Jr." },
  { id: "2024-089", title: "Comprehensive Land Use Plan Implementation", date: "2024-12-20", status: "Active", category: "Planning", author: "Hon. John Edgar C. Adajar" },
  { id: "2024-088", title: "Public Market Modernization Guidelines", date: "2024-12-15", status: "Active", category: "Infrastructure", author: "Hon. Leonardo C. Villanueva" },
  { id: "2024-087", title: "Tourism Development Incentives", date: "2024-12-10", status: "Active", category: "Tourism", author: "Hon. Syra A. Medina" },
  { id: "2023-076", title: "Disaster Risk Reduction Management Code", date: "2023-11-25", status: "Active", category: "Safety", author: "Hon. Richard C. Pavico" },
  { id: "2023-075", title: "Senior Citizens Welfare Enhancement", date: "2023-11-20", status: "Active", category: "Social Welfare", author: "Hon. Lou Vicent B. Amante" },
];

const resolutionData: Resolution[] = [
  { id: "2025-089", title: "Approval of City Budget for FY 2026", date: "2025-09-12", status: "Approved", category: "Budget", urgency: "High" },
  { id: "2025-088", title: "Authorization for Infrastructure Loan", date: "2025-09-08", status: "Approved", category: "Finance", urgency: "High" },
  { id: "2025-087", title: "Designation of Heritage Sites", date: "2025-09-05", status: "Approved", category: "Heritage", urgency: "Medium" },
  { id: "2025-086", title: "Partnership Agreement with Universities", date: "2025-08-30", status: "Approved", category: "Education", urgency: "Medium" },
  { id: "2025-085", title: "Health Emergency Preparedness Plan", date: "2025-08-25", status: "Approved", category: "Health", urgency: "High" },
];

const executiveOrderData: ExecutiveOrder[] = [
  { id: "EO-2025-023", title: "Creation of Digital Transformation Task Force", date: "2025-09-14", department: "Information Technology", implementor: "City Administrator" },
  { id: "EO-2025-022", title: "Enhanced Public Health Protocols", date: "2025-09-10", department: "City Health Office", implementor: "City Health Officer" },
  { id: "EO-2025-021", title: "Streamlined Business Registration Process", date: "2025-09-06", department: "Business Permits Office", implementor: "Business Permits Head" },
  { id: "EO-2025-020", title: "Waste Segregation Implementation", date: "2025-08-28", department: "Environment Office", implementor: "Environment Officer" },
  { id: "EO-2025-019", title: "Traffic Enforcement Enhancement", date: "2025-08-22", department: "Traffic Management Office", implementor: "Traffic Supervisor" },
];

const bidsAwardsData: BidAward[] = [
  { 
    id: "BAC-2025-045", 
    title: "Construction of Multi-Purpose Community Center", 
    date: "2025-09-15", 
    amount: "₱15,500,000.00", 
    winner: "ABC Construction Corp.", 
    status: "Awarded",
    type: "Infrastructure"
  },
  { 
    id: "BAC-2025-044", 
    title: "Supply of Medical Equipment for Health Centers", 
    date: "2025-09-10", 
    amount: "₱8,750,000.00", 
    winner: "MedTech Solutions Inc.", 
    status: "Awarded",
    type: "Medical"
  },
  { 
    id: "BAC-2025-043", 
    title: "Road Rehabilitation Project Phase 3", 
    date: "2025-09-05", 
    amount: "₱22,300,000.00", 
    winner: "RoadMaster Construction", 
    status: "Ongoing Evaluation",
    type: "Infrastructure"
  },
  { 
    id: "BAC-2025-042", 
    title: "IT Equipment Procurement", 
    date: "2025-08-30", 
    amount: "₱5,200,000.00", 
    winner: "TechSolutions Philippines", 
    status: "Awarded",
    type: "Technology"
  },
];

const financialAidData = [
  { 
    barangay: "Barangay I Poblacion", 
    quarter: "Q3 2025", 
    amount: "₱450,000.00", 
    purpose: "Infrastructure Development", 
    dateReleased: "2025-09-10",
    status: "Released"
  },
  { 
    barangay: "Barangay II Poblacion", 
    quarter: "Q3 2025", 
    amount: "₱420,000.00", 
    purpose: "Health Programs", 
    dateReleased: "2025-09-10",
    status: "Released"
  },
  { 
    barangay: "Barangay San Antonio", 
    quarter: "Q3 2025", 
    amount: "₱380,000.00", 
    purpose: "Peace and Order", 
    dateReleased: "2025-09-08",
    status: "Released"
  },
  { 
    barangay: "Barangay San Bartolome", 
    quarter: "Q3 2025", 
    amount: "₱465,000.00", 
    purpose: "Education Support", 
    dateReleased: "2025-09-08",
    status: "Released"
  },
  { 
    barangay: "Barangay San Buenaventura", 
    quarter: "Q3 2025", 
    amount: "₱395,000.00", 
    purpose: "Environmental Programs", 
    dateReleased: "2025-09-06",
    status: "Released"
  },
];

// Type for table column
interface Column<T extends Record<string, unknown>> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
}

// Reusable Table Component
interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: { key: keyof T; value: string; label: string }[];
}

function DataTable<T extends Record<string, unknown>>({
  columns, 
  data, 
  searchable = false, 
  filterable = false, 
  filterOptions = [] 
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  const filteredData = data.filter((item: T) => {
    const matchesSearch = searchable
      ? Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    const filterKey = filterOptions.find(opt => opt.value === filterValue)?.key as keyof T | undefined;

    const matchesFilter = filterable && filterValue && filterKey
      ? String(item[filterKey]) === filterValue
      : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {(searchable || filterable) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          )}
          {filterable && (
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterValue}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterValue(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column, index) => (
                <th key={index} className="text-left p-4 font-semibold text-gray-900 bg-gray-50">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="p-4 text-gray-700">
                    {column.render ? column.render(row) : (row[column.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        Showing {filteredData.length} of {data.length} entries
      </div>
    </div>
  );
}

// Tab Component
interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  count: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function FullDisclosurePage() {
  const [activeTab, setActiveTab] = useState<string>('ordinances');

  const tabs: Tab[] = [
    { id: 'ordinances', label: 'City Ordinances', icon: Scale, count: ordinanceData.length },
    { id: 'resolutions', label: 'City Resolutions', icon: FileText, count: resolutionData.length },
    { id: 'executive', label: 'Executive Orders', icon: Briefcase, count: executiveOrderData.length },
    { id: 'bids', label: 'Bids & Awards', icon: Award, count: bidsAwardsData.length },
    { id: 'financial', label: 'Barangay Financial Aid', icon: DollarSign, count: financialAidData.length }
  ];

  const ordinanceColumns: Column<Ordinance>[] = [
    { header: 'Ordinance No.', accessor: 'id' },
    { header: 'Title', accessor: 'title' },
    { 
      header: 'Date Enacted', 
      accessor: 'date',
      render: (row: Ordinance) => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          {new Date(row.date).toLocaleDateString()}
        </div>
      )
    },
    { header: 'Category', accessor: 'category' },
    { header: 'Author', accessor: 'author' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: Ordinance) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id', // Provide a valid key from Ordinance, even if unused
      render: () => (
        <div className="flex space-x-2">
          <button className="p-1 text-emerald-600 hover:text-emerald-800">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const resolutionColumns: Column<Resolution>[] = [
    { header: 'Resolution No.', accessor: 'id' },
    { header: 'Title', accessor: 'title' },
    { 
      header: 'Date Passed', 
      accessor: 'date',
      render: (row: Resolution) => new Date(row.date).toLocaleDateString()
    },
    { header: 'Category', accessor: 'category' },
    { 
      header: 'Urgency', 
      accessor: 'urgency',
      render: (row: Resolution) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.urgency === 'High' ? 'bg-red-100 text-red-800' : 
          row.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {row.urgency}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: Resolution) => (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id', // Provide a valid key from Resolution, even if unused
      render: () => (
        <div className="flex space-x-2">
          <button className="p-1 text-emerald-600 hover:text-emerald-800">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const executiveColumns: Column<ExecutiveOrder>[] = [
    { header: 'Executive Order No.', accessor: 'id' },
    { header: 'Title', accessor: 'title' },
    { 
      header: 'Date Issued', 
      accessor: 'date',
      render: (row: ExecutiveOrder) => new Date(row.date).toLocaleDateString()
    },
    { header: 'Department', accessor: 'department' },
    { header: 'Implementor', accessor: 'implementor' },
    {
      header: 'Actions',
      accessor: 'id', // Provide a valid key from ExecutiveOrder, even if unused
      render: () => (
        <div className="flex space-x-2">
          <button className="p-1 text-emerald-600 hover:text-emerald-800">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const bidsColumns: Column<BidAward>[] = [
    { header: 'BAC No.', accessor: 'id' },
    { header: 'Project Title', accessor: 'title' },
    { 
      header: 'Date', 
      accessor: 'date',
      render: (row: BidAward) => new Date(row.date).toLocaleDateString()
    },
    { 
      header: 'Contract Amount', 
      accessor: 'amount',
      render: (row: BidAward) => (
        <span className="font-semibold text-emerald-700">{row.amount}</span>
      )
    },
    { header: 'Winning Bidder', accessor: 'winner' },
    { header: 'Type', accessor: 'type' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: BidAward) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Awarded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id', // Provide a valid key from BidAward, even if unused
      render: () => (
        <div className="flex space-x-2">
          <button className="p-1 text-emerald-600 hover:text-emerald-800">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const financialColumns: Column<FinancialAid>[] = [
    { header: 'Barangay', accessor: 'barangay' },
    { header: 'Quarter', accessor: 'quarter' },
    { 
      header: 'Amount Released', 
      accessor: 'amount',
      render: (row: FinancialAid) => (
        <span className="font-semibold text-emerald-700">{row.amount}</span>
      )
    },
    { header: 'Purpose', accessor: 'purpose' },
    { 
      header: 'Date Released', 
      accessor: 'dateReleased',
      render: (row: FinancialAid) => new Date(row.dateReleased).toLocaleDateString()
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: FinancialAid) => (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          {row.status}
        </span>
      )
    }
  ];

  const renderTabContent = (): ReactNode => {
    switch (activeTab) {
      case 'ordinances':
        return (
          <DataTable 
            columns={ordinanceColumns} 
            data={ordinanceData} 
            searchable={true}
            filterable={true}
            filterOptions={[
              { value: 'Traffic', label: 'Traffic', key: 'category' },
              { value: 'Environment', label: 'Environment', key: 'category' },
              { value: 'Business', label: 'Business', key: 'category' },
              { value: 'Planning', label: 'Planning', key: 'category' },
              { value: 'Infrastructure', label: 'Infrastructure', key: 'category' },
              { value: 'Tourism', label: 'Tourism', key: 'category' },
              { value: 'Safety', label: 'Safety', key: 'category' },
              { value: 'Social Welfare', label: 'Social Welfare', key: 'category' }
            ]}
          />
        );
      case 'resolutions':
        return <DataTable columns={resolutionColumns} data={resolutionData} searchable={true} />;
      case 'executive':
        return <DataTable columns={executiveColumns} data={executiveOrderData} searchable={true} />;
      case 'bids':
        return <DataTable columns={bidsColumns} data={bidsAwardsData} searchable={true} />;
      case 'financial':
        return <DataTable columns={financialColumns} data={financialAidData} searchable={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            Transparency & Accountability
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Full Disclosure Portal
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            In compliance with the Full Disclosure Policy, we provide transparent access to 
            government documents, financial records, and legislative proceedings.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30 shadow-xl">
          <CardContent className="p-8">
            <TabNavigation 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
            {renderTabContent()}
          </CardContent>
        </Card>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                Document Request
              </h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-gray-700 mb-4">
                Need access to other government documents? Submit a formal request through our Freedom of Information office.
              </p>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Submit Request
              </button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/30">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-emerald-600" />
                Contact Information
              </h3>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-gray-700 mb-4">
                For questions or clarifications about any disclosed information, contact our Records Office.
              </p>
              <div className="text-sm text-gray-600">
                <p>Phone: (049) 562-1234 ext. 205</p>
                <p>Email: records@sanpablocity.gov.ph</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200/30">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse" />
            <p className="text-sm text-gray-600">
              Documents are updated regularly. Last updated: September 17, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}