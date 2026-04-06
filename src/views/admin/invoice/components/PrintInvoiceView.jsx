import { dateFormat } from '@/utils/date-format'
import { moneyFormat, toVietnamese } from '@/utils/money-format'
import React, { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

const PrintInvoiceView = ({ invoice, setting, onAfterPrint }) => {
  const contentRef = useRef(null)
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: invoice?.code ? `HD-${invoice?.code}` : 'Hóa đơn',
    onAfterPrint: onAfterPrint,
  })

  useEffect(() => {
    reactToPrintFn()
  }, [reactToPrintFn])

  return (
    <div className="hidden">
      <PrintableContent
        ref={contentRef}
        setting={setting}
        invoice={invoice}
      />
    </div>
  )
}

const PrintableContent = React.forwardRef(({ setting, invoice }, ref) => {
  const items = invoice?.details || invoice?.invoiceItems || []
  
  const postedReceipts = invoice?.paymentReceipts?.filter(r => r.isPosted) || []
  const totalPaid = postedReceipts.reduce((sum, r) => sum + Number(r.amount || 0), 0)
  const totalAmount = Number(invoice?.totalAmount || invoice?.total || 0)
  const currentDebt = Number(invoice?.customer?.currentDebt || 0)
  const unpaidThisInvoice = totalAmount - totalPaid
  const oldDebt = currentDebt - unpaidThisInvoice
  const prepaidCredit = oldDebt < 0 ? Math.abs(oldDebt) : 0
  const displayOldDebt = oldDebt > 0 ? oldDebt : 0
  const effectiveTotalPaid = totalPaid + prepaidCredit
  const totalDebt = displayOldDebt + totalAmount - effectiveTotalPaid

  const createdDate = new Date(invoice?.createdAt || invoice?.orderDate || new Date())
  const day = createdDate.getDate().toString().padStart(2, '0')
  const month = (createdDate.getMonth() + 1).toString().padStart(2, '0')
  const year = createdDate.getFullYear()
  const printDateStr = `Ngày ${day} tháng ${month} năm ${year}`

  const now = new Date()
  const nowTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear().toString().slice(-2)}`

  const logoSrc = setting?.logo
    ? (setting.logo.startsWith('http') ? setting.logo : window.location.origin + setting.logo)
    : window.location.origin + "/images/logo/logo-nobackground.png"

  return (
    <div ref={ref}>
      <style dangerouslySetInnerHTML={{__html: `
        @page { size: A5 portrait; margin: 5mm 6mm; }
        @media print {
          body { margin: 0; padding: 0; }
          .print-invoice-a5 {
            width: 136mm !important;
            max-height: 198mm !important;
            overflow: hidden !important;
            padding: 3mm 5mm !important;
            font-size: 11px !important;
            box-sizing: border-box !important;
          }
          .print-invoice-a5 * { box-sizing: border-box !important; }
          .print-invoice-a5 table { border-collapse: collapse !important; }
          .print-invoice-a5 th, .print-invoice-a5 td { border: 0.5px solid #000 !important; }
        }
      `}} />

      <div className="print-invoice-a5 mx-auto bg-white font-serif"
           style={{ width: '136mm', maxHeight: '198mm', padding: '3mm 5mm', boxSizing: 'border-box', overflow: 'hidden', color: '#000', fontSize: '11px' }}>
        
        {/* Top header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px', fontSize: '8px', fontFamily: 'sans-serif', color: '#666' }}>
          <span>{nowTime}</span>
          <span>In Chứng Từ</span>
        </div>

        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div style={{ width: '65px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '10px' }}>
            <img src={logoSrc} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1, fontSize: '10px', lineHeight: 1.4 }}>
            <h1 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 2px 0', lineHeight: 1.3, color: '#d32f2f' }}>
              {setting?.brandName || 'CÔNG TY CP HS NAM VIỆT (VP TN)'}
            </h1>
            <p style={{ margin: '0 0 1px 0', color: '#1b8a47' }}>{setting?.address || 'Số 59, Nguyễn Chí Thanh, Khối 8, P. Tân An, TP. B.M.Thuột, Đắk Lắk'}</p>
            <div style={{ color: '#1976d2', fontSize: '9px', fontWeight: 'bold', lineHeight: 1.1, margin: '0 0 2px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ margin: '0 0 1px 0' }}>TK cá nhân - 975767788 - ngân hàng ACB chi nhánh phòng GD cao lãnh</div>
              <div>TK công ty - 08290639 - ngân hàng ACB chi nhánh phòng GD cao lãnh</div>
            </div>
            <p style={{ margin: '0 0 1px 0', color: '#8e24aa', fontWeight: 'bold' }}>Điện thoại: {setting?.phone ? (setting.phone.includes("0868") ? setting.phone : setting.phone + " - 0868 759 588") : "088 635 7788 - 0868 759 588"}</p>
            <p style={{ margin: '0 0 1px 0', color: '#1976d2', fontWeight: 'bold' }}>{setting?.email || 'hoasinhnamviet@gmail.com'}</p>
            <p style={{ margin: 0, color: '#1976d2', fontWeight: 'bold' }}>{setting?.website || 'www.hoasinhnamviet.com'}</p>
          </div>
        </div>

        {/* Title */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '18px', marginTop: '15px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#d32f2f' }}>HÓA ĐƠN BÁN HÀNG</h2>
          <div style={{ position: 'absolute', right: 0, top: '22px', fontSize: '10px', color: '#8e24aa', fontWeight: 'bold' }}>
            Số HĐ: {invoice?.orderCode || invoice?.code}
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ marginBottom: '8px', fontSize: '11px', lineHeight: 1.5 }}>
          <div style={{ display: 'flex', color: '#1565c0' }}>
            <span style={{ minWidth: '95px', whiteSpace: 'nowrap' }}>Tên khách hàng:</span>
            <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{invoice?.customer?.customerName}</span>
          </div>
          <div style={{ display: 'flex', color: '#1565c0' }}>
            <span style={{ minWidth: '95px', whiteSpace: 'nowrap' }}>Liên hệ:</span>
            <span>{invoice?.recipientName || invoice?.customer?.contactPerson || ''}</span>
          </div>
          <div style={{ display: 'flex', color: '#1565c0' }}>
            <span style={{ minWidth: '95px', whiteSpace: 'nowrap' }}>MST:</span>
            <span>{invoice?.customer?.taxCode || ''}</span>
          </div>
          <div style={{ display: 'flex', color: '#1b8a47' }}>
            <span style={{ minWidth: '95px', whiteSpace: 'nowrap' }}>Địa chỉ:</span>
            <span>{invoice?.deliveryAddress || invoice?.customer?.address || ''}</span>
          </div>
          <div style={{ display: 'flex', color: '#1b8a47' }}>
            <span style={{ minWidth: '95px', whiteSpace: 'nowrap' }}>Điện thoại:</span>
            <span>{invoice?.recipientPhone || invoice?.customer?.phone || ''}</span>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px', fontSize: '10px' }}>
          <thead>
            <tr style={{ color: '#1565c0' }}>
              <th style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'center', width: '22px', fontWeight: 'bold' }}>TT</th>
              <th style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'center', fontWeight: 'bold' }}>Tên sản phẩm</th>
              <th style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'center', width: '42px', fontWeight: 'bold' }}>ĐVT</th>
              <th style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'center', width: '28px', fontWeight: 'bold' }}>SL</th>
              <th style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'center', width: '58px', fontWeight: 'bold' }}>Giá</th>
              <th style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'center', width: '68px', fontWeight: 'bold' }}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={`item-${index}`}>
                <td style={{ border: '0.5px solid #000', padding: '1px 3px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '0.5px solid #000', padding: '1px 3px' }}>
                  {item.product?.productName || item.productName || 'Sản phẩm không xác định'}
                  {item.gift && ' (Quà tặng)'}
                </td>
                <td style={{ border: '0.5px solid #000', padding: '1px 3px', textAlign: 'center' }}>{item.unitName || item.product?.unit || item.unit?.name || ''}</td>
                <td style={{ border: '0.5px solid #000', padding: '1px 3px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ border: '0.5px solid #000', padding: '1px 3px', textAlign: 'right' }}>{moneyFormat(item.price || item.unitPrice)}</td>
                <td style={{ border: '0.5px solid #000', padding: '1px 3px', textAlign: 'right' }}>{moneyFormat(item.total)}</td>
              </tr>
            ))}
            
            {/* Summary Rows */}
            <tr style={{ color: '#1565c0' }}>
              <td colSpan={5} style={{ border: '0.5px solid #000', padding: '2px 3px' }}>Tổng cộng:</td>
              <td style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'right' }}>{moneyFormat(totalAmount)}</td>
            </tr>
            <tr style={{ color: '#1b8a47' }}>
              <td colSpan={5} style={{ border: '0.5px solid #000', padding: '2px 3px' }}>Thanh toán:</td>
              <td style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'right' }}>{moneyFormat(effectiveTotalPaid)}</td>
            </tr>
            <tr style={{ color: '#8e24aa' }}>
              <td colSpan={5} style={{ border: '0.5px solid #000', padding: '2px 3px' }}>Nợ cũ:</td>
              <td style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'right' }}>{moneyFormat(displayOldDebt)}</td>
            </tr>
            <tr style={{ color: '#d32f2f' }}>
              <td colSpan={5} style={{ border: '0.5px solid #000', padding: '2px 3px' }}>Tổng công nợ:</td>
              <td style={{ border: '0.5px solid #000', padding: '2px 3px', textAlign: 'right' }}>
                {totalDebt < 0 ? `+${moneyFormat(Math.abs(totalDebt))}` : moneyFormat(totalDebt)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* In Words & Notes */}
        <div style={{ marginBottom: '4px', fontSize: '11px', lineHeight: 1.5, color: '#d32f2f' }}>
          <p style={{ margin: '0 0 1px 0' }}>
            Viết bằng chữ: <span style={{ fontStyle: 'italic' }}>{toVietnamese(Math.abs(totalDebt))}</span>
          </p>
          <p style={{ margin: 0 }}>
            Ghi chú: {invoice?.note || ''}
          </p>
        </div>

        {/* Date - right aligned above "Người viết hóa đơn" */}
        <div style={{ textAlign: 'right', paddingRight: '10px', marginBottom: '4px' }}>
          <p style={{ fontStyle: 'italic', fontSize: '11px', margin: 0, display: 'inline-block', width: '45%', textAlign: 'center' }}>{printDateStr}</p>
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '11px', paddingLeft: '10px', paddingRight: '10px' }}>
          <div style={{ width: '45%' }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 2px 0' }}>Người nhận hàng</p>
            <div style={{ height: '50px' }}></div>
            <p style={{ margin: 0 }}>{invoice?.customer?.customerName}</p>
          </div>
          <div style={{ width: '45%' }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 2px 0' }}>Người viết hóa đơn</p>
            <div style={{ height: '50px' }}></div>
            <p style={{ margin: 0 }}>{invoice?.creator?.fullName || invoice?.user?.fullName || setting?.brandName}</p>
          </div>
        </div>
      </div>
    </div>
  )
})

PrintableContent.displayName = 'PrintableContent'

export default PrintInvoiceView
