import { moneyFormat } from '@/utils/money-format'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

const PrintCashFlowReport = ({ data, summary, fromDate, toDate }) => {
  const now = new Date()
  const printTime = format(now, 'HH:mm dd/MM/yyyy', { locale: vi })

  // Filter out opening balance rows from the detailed list
  const transactionRows = data.filter(item => !item.isOpeningBalance)

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: vi })
    } catch {
      return dateStr
    }
  }

  return (
    <div>
      <div className="print-time">
        Thời gian in: {printTime}
      </div>

      <div className="header">
        <h1>THỐNG KÊ SỔ QUỸ</h1>
        <p>({fromDate} - {toDate})</p>
      </div>

      {/* Summary */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="label">QUỸ ĐẦU KỲ</div>
          <div className="value">{moneyFormat(summary.openingBalance)}</div>
        </div>
        <div className="summary-card">
          <div className="label">TỔNG THU</div>
          <div className="value text-green">{moneyFormat(summary.totalIn)}</div>
        </div>
        <div className="summary-card">
          <div className="label">TỔNG CHI</div>
          <div className="value text-red">{moneyFormat(summary.totalOut)}</div>
        </div>
        <div className="summary-card">
          <div className="label">TỒN QUỸ</div>
          <div className="value text-blue">{moneyFormat(summary.endingBalance)}</div>
        </div>
      </div>

      {/* Transaction Table */}
      <table>
        <thead>
          <tr>
            <th style={{ width: '30px' }}>STT</th>
            <th style={{ width: '90px' }}>MÃ PHIẾU</th>
            <th style={{ width: '90px' }}>PHIẾU NGÀY</th>
            <th style={{ width: '60px' }}>LOẠI PHIẾU</th>
            <th style={{ width: '130px' }}>NHÀ CUNG CẤP/<br/>KHÁCH HÀNG</th>
            <th style={{ width: '100px' }}>ĐỊA CHỈ</th>
            <th style={{ width: '180px' }}>GHI CHÚ</th>
            <th style={{ width: '90px' }}>GIÁ TRỊ</th>
            <th style={{ width: '80px' }}>NV NỘP TIỀN</th>
            <th style={{ width: '100px' }}>TỒN QUỸ</th>
          </tr>
        </thead>
        <tbody>
          {transactionRows.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center">Không có giao dịch</td>
            </tr>
          ) : (
            transactionRows.map((item, index) => (
              <tr key={item.id}>
                <td className="text-center">{index + 1}</td>
                <td>{item.code}</td>
                <td className="text-center">{formatDate(item.date)}</td>
                <td className="text-center">{item.type === 'receipt' ? 'thu' : 'chi'}</td>
                <td>
                  {item.partnerName || ''}
                  {item.phone ? <><br/>📞 {item.phone}</> : ''}
                </td>
                <td>{item.address || ''}</td>
                <td>
                  <strong>{item.typeLabel?.toUpperCase()}</strong>
                  <br/>{item.content}
                </td>
                <td className="text-right font-bold" style={{ color: item.amount >= 0 ? '#16a34a' : '#dc2626' }}>
                  {item.amount >= 0 ? '+' : ''}{moneyFormat(item.amount)}
                </td>
                <td>{item.submitter || ''}</td>
                <td className="text-right font-bold">{moneyFormat(item.runningBalance)}</td>
              </tr>
            ))
          )}
          {/* Last row: Opening balance marker */}
          <tr>
            <td colSpan={9} className="text-right font-bold">Quỹ Đầu Kỳ</td>
            <td className="text-right font-bold">{moneyFormat(summary.openingBalance)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PrintCashFlowReport
