'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CalculationResult, FormData } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/calculations'
import { exportToPDF, exportToExcel } from '@/lib/export-utils'
import { Download, FileText, Calendar, TrendingUp, Clock, CheckCircle, PiggyBank, Landmark, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentScheduleTableProps {
  result: CalculationResult
  formData: FormData
  calculationType: 'ev' | 'araba'
  financingType: 'cekilisli' | 'cekilissiz'
}

const InfoCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | number }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center space-x-3">
        <div className="bg-slate-100 p-2 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className='space-y-4'>
        <div className="flex items-center space-x-2">
            {icon}
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {children}
        </div>
    </div>
)

export function PaymentScheduleTable({ result, formData, calculationType, financingType }: PaymentScheduleTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = Math.ceil(result.schedule.length / itemsPerPage)
  
  const paginatedSchedule = result.schedule.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // --- Bank Loan Calculation ---
  const calculateBankLoanTotal = (principal: number, monthlyRate: number, months: number) => {
    if (months === 0) return principal;
    const r = monthlyRate;
    const n = months;
    const monthlyPayment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return monthlyPayment * n;
  }
  const bankLoanTotalPayment = calculateBankLoanTotal(formData.financingAmount, 0.03, result.installmentCount);

  // --- Piggy Bank Calculation ---
  // This calculation is no longer needed as per the new requirement.
  // const piggyBankMonths = Math.ceil(formData.financingAmount / formData.monthlyPayment);

  const evimSistemiErisimAyi = result.accessibleMonth
    ? financingType === 'cekilisli'
      ? `6 - ${result.accessibleMonth}. ay`
      : `${result.accessibleMonth}. ay`
    : 'Belirsiz';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Erişim Yok</Badge>
      case 'accessible':
        return <Badge variant="default" className="bg-green-100 text-green-800">Erişilebilir</Badge>
      case 'lucky':
        return <Badge variant="default" className="bg-green-100 text-green-800">Şanslı Çekiliş</Badge>
      case 'unlucky':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Şanssız Çekiliş</Badge>
      case 'financing_obtained':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Finansman Alındı</Badge>
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>
    }
  }

  const getRowClassName = (status: string) => {
    if (status === 'accessible') {
      return 'bg-green-50 border-l-4 border-l-green-500'
    }
    return ''
  }

  return (
    <div className="space-y-8">
      {/* Özet Kartları */}
      <div className="space-y-8">
        <Section title="Evim Sistemi ile" icon={<Home className="h-6 w-6 text-blue-600" />}>
            <InfoCard icon={<TrendingUp className="h-5 w-5 text-blue-600" />} title="Toplam Ödeme" value={formatCurrency(result.totalPayment + result.organizationFee)}  />
            <InfoCard icon={<Calendar className="h-5 w-5 text-green-600" />} title="Taksit Sayısı" value={`${result.installmentCount} ay`} />
            <InfoCard icon={<FileText className="h-5 w-5 text-purple-600" />} title="Organizasyon Ücreti" value={formatCurrency(result.organizationFee)} />
            <InfoCard icon={<CheckCircle className="h-5 w-5 text-orange-600" />} title="Erişim Ayı" value={evimSistemiErisimAyi} />
        </Section>
        
        <Section title="Banka Kredisi ile" icon={<Landmark className="h-6 w-6 text-red-600" />}>
            <InfoCard icon={<TrendingUp className="h-5 w-5 text-red-600" />} title="Toplam Ödeme" value={formatCurrency(bankLoanTotalPayment)} />
            <InfoCard icon={<Calendar className="h-5 w-5 text-green-600" />} title="Taksit Sayısı" value={`${result.installmentCount} ay`} />
            <InfoCard icon={<FileText className="h-5 w-5 text-purple-600" />} title="Aylık Taksit Tutarı" value={formatCurrency(bankLoanTotalPayment / result.installmentCount)} />
            <InfoCard icon={<CheckCircle className="h-5 w-5 text-orange-600" />} title="Erişim Ayı" value="1. ay" />
        </Section>
        
        <Section title="Kumbara Biriktirme ile" icon={<PiggyBank className="h-6 w-6 text-green-600" />}>
            <InfoCard icon={<TrendingUp className="h-5 w-5 text-green-600" />} title="Toplam Ödeme" value={formatCurrency(formData.financingAmount)} />
            <InfoCard icon={<Calendar className="h-5 w-5 text-green-600" />} title="Taksit Sayısı" value={`${result.installmentCount} ay`} />
            <InfoCard icon={<FileText className="h-5 w-5 text-purple-600" />} title="Aylık Biriktirme Miktarı" value={formatCurrency(result.totalPayment / result.installmentCount)}  />
            <InfoCard icon={<CheckCircle className="h-5 w-5 text-orange-600" />} title="Erişim Ayı" value={`${result.installmentCount}. ay`} />
        </Section>
      </div>

      {/* Ödeme Tablosu */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Ödeme Planı</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToPDF(result, calculationType, financingType)}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF İndir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToExcel(result, calculationType, financingType)}
              >
                <Download className="h-4 w-4 mr-2" />
                Excel İndir
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Ay</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-right">Ödeme Tutarı</TableHead>
                  <TableHead className="text-right">Kümülatif Ödeme</TableHead>
                  <TableHead className="text-right">Kalan Bakiye</TableHead>
                  <TableHead className="text-center">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSchedule.map((item) => (
                  <TableRow
                    key={item.monthNumber}
                    className={cn(getRowClassName(item.status))}
                  >
                    <TableCell className="font-medium">
                      {item.monthNumber}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(item.paymentDate))}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.paymentAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.cumulativePayment)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.remainingBalance)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(item.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Önceki
              </Button>
              <span className="text-sm text-gray-600">
                Sayfa {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sonraki
              </Button>
            </div>
          )}

          {/* Açıklama */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Durum Açıklamaları:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Erişim Yok: Henüz finansmana erişim hakkı kazanılmadı</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Erişilebilir: Bu ay finansmana erişim sağlanabilir</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Finansman Alındı: Finansman kullanılmıştır</span>
              </div>
              {financingType === 'cekilisli' && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Şanslı Çekiliş: Çekilişe dahil olduğunuz dönem</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Şanssız Çekiliş: Çekiliş dönemi sona ermiştir</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}