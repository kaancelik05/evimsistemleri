import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { PaymentScheduleItem, CalculationResult } from './types'
import { formatCurrency, formatDate } from './calculations'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export function exportToPDF(
  result: CalculationResult,
  calculationType: 'ev' | 'araba',
  financingType: 'cekilisli' | 'cekilissiz'
) {
  const doc = new jsPDF()
  
  // Başlık
  doc.setFontSize(20)
  doc.text(`Evim Sistemleri - ${calculationType === 'ev' ? 'Ev' : 'Araba'} Finansman Planı`, 20, 30)
  
  // Özet bilgiler
  doc.setFontSize(12)
  doc.text(`Finansman Tipi: ${financingType === 'cekilisli' ? 'Çekilişli' : 'Çekilişsiz'}`, 20, 50)
  doc.text(`Toplam Ödeme: ${formatCurrency(result.totalPayment)}`, 20, 60)
  doc.text(`Taksit Sayısı: ${result.installmentCount} ay`, 20, 70)
  doc.text(`Organizasyon Ücreti: ${formatCurrency(result.organizationFee)}`, 20, 80)
  
  // Tablo verileri
  const tableData = result.schedule.map(item => [
    item.monthNumber,
    formatDate(item.paymentDate),
    formatCurrency(item.paymentAmount),
    formatCurrency(item.remainingBalance),
    item.canAccessFinancing ? 'Evet' : 'Hayır',
    getStatusText(item.status)
  ])

  // Tablo oluşturma
  doc.autoTable({
    head: [['Ay', 'Tarih', 'Ödeme', 'Kalan Bakiye', 'Erişim', 'Durum']],
    body: tableData,
    startY: 90,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] }
  })

  // PDF'i indir
  doc.save(`evim-sistemleri-${calculationType}-finansman-plani.pdf`)
}

export function exportToExcel(
  result: CalculationResult,
  calculationType: 'ev' | 'araba',
  financingType: 'cekilisli' | 'cekilissiz'
) {
  // Özet bilgiler
  const summaryData = [
    ['Evim Sistemleri - Finansman Planı', ''],
    ['Finansman Tipi', financingType === 'cekilisli' ? 'Çekilişli' : 'Çekilişsiz'],
    ['Toplam Ödeme', result.totalPayment],
    ['Taksit Sayısı', `${result.installmentCount} ay`],
    ['Organizasyon Ücreti', result.organizationFee],
    ['Net Finansman', result.netFinancing],
    ['Gerekli Ödeme', result.requiredPayment],
    ['', ''], // Boş satır
    ['Ay', 'Tarih', 'Ödeme Tutarı', 'Kalan Bakiye', 'Kümülatif Ödeme', 'Erişim', 'Durum']
  ]

  // Ödeme planı verileri
  const scheduleData = result.schedule.map(item => [
    item.monthNumber,
    formatDate(item.paymentDate),
    item.paymentAmount,
    item.remainingBalance,
    item.cumulativePayment,
    item.canAccessFinancing ? 'Evet' : 'Hayır',
    getStatusText(item.status)
  ])

  // Tüm verileri birleştir
  const allData = [...summaryData, ...scheduleData]

  // Worksheet oluştur
  const ws = XLSX.utils.aoa_to_sheet(allData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Finansman Planı')

  // Excel dosyasını indir
  XLSX.writeFile(wb, `evim-sistemleri-${calculationType}-finansman-plani.xlsx`)
}

function getStatusText(status: PaymentScheduleItem['status']): string {
  switch (status) {
    case 'waiting':
      return 'Bekleniyor'
    case 'accessible':
      return 'Erişilebilir'
    case 'lucky':
      return 'Şanslı'
    case 'unlucky':
      return 'Şanssız'
    default:
      return 'Bilinmiyor'
  }
}