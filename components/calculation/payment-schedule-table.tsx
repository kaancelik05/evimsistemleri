'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CalculationResult } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/calculations'
import { exportToPDF, exportToExcel } from '@/lib/export-utils'
import { Download, FileText, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentScheduleTableProps {
  result: CalculationResult
  calculationType: 'ev' | 'araba'
  financingType: 'cekilisli' | 'cekilissiz'
}

export function PaymentScheduleTable({ result, calculationType, financingType }: PaymentScheduleTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = Math.ceil(result.schedule.length / itemsPerPage)
  
  const paginatedSchedule = result.schedule.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status: string, canAccess: boolean) => {
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

  const getRowClassName = (status: string, monthNumber: number) => {
    if (monthNumber <= 5) {
      return 'bg-red-50 border-l-4 border-l-red-500'
    }
    
    switch (status) {
      case 'accessible':
      case 'lucky':
        return 'bg-green-50 border-l-4 border-l-green-500'
      case 'unlucky':
        return 'bg-yellow-50 border-l-4 border-l-yellow-500'
      case 'financing_obtained':
        return 'bg-blue-50 border-l-4 border-l-blue-500'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Toplam Ödeme</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(result.totalPayment)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Taksit Sayısı</p>
                <p className="text-lg font-bold text-gray-900">
                  {result.installmentCount} ay
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Organizasyon Ücreti</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(result.organizationFee)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Erişim Ayı</p>
                <p className="text-lg font-bold text-gray-900">
                  {result.accessibleMonth ? `${result.accessibleMonth}. ay` : 'Belirsiz'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                    className={cn(getRowClassName(item.status, item.monthNumber))}
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
                      {getStatusBadge(item.status, item.canAccessFinancing)}
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