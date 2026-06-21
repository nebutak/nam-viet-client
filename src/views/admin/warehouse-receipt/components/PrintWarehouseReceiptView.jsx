import { dateFormat } from '@/utils/date-format'
import { moneyFormat, toVietnamese } from '@/utils/money-format'
import { getPublicUrl } from '@/utils/file'
import React, { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

const PrintWarehouseReceiptView = ({ receipt, setting, onAfterPrint, isTransferType, displayTransferWarehouse, isTransferIn, isTransferOut }) => {
  const contentRef = useRef(null)

  const documentTitle = receipt?.code
    ? `${receipt.receiptType === 1 ? 'PN' : 'PX'}-${receipt.code}`
    : (receipt?.receiptType === 1 ? 'Phieu-nhap' : 'Phieu-xuat')

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle,
    onAfterPrint: onAfterPrint,
  })

  useEffect(() => {
    if (receipt) {
      reactToPrintFn()
    }
  }, [receipt, reactToPrintFn])

  return (
    <div className="hidden">
      <PrintableContent
        ref={contentRef}
        setting={setting}
        receipt={receipt}
        isTransferType={isTransferType}
        displayTransferWarehouse={displayTransferWarehouse}
        isTransferIn={isTransferIn}
        isTransferOut={isTransferOut}
      />
    </div>
  )
}

const PrintableContent = React.forwardRef(({ setting, receipt, isTransferType, displayTransferWarehouse, isTransferIn, isTransferOut }, ref) => {
  const isImport = receipt?.receiptType === 1

  // Date formatting
  const createdDate = new Date(receipt?.receiptDate || receipt?.createdAt || new Date())
  const day = createdDate.getDate().toString().padStart(2, '0')
  const month = (createdDate.getMonth() + 1).toString().padStart(2, '0')
  const year = createdDate.getFullYear()
  const printDateStr = `Ngày ${day} tháng ${month} năm ${year}`

  // Top header print time
  const now = new Date()
  const nowTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear().toString().slice(-2)}`

  return (
    <div 
      ref={ref} 
      className="print-container font-serif text-black mx-auto bg-white w-[148mm] min-h-[210mm] text-[11px] p-3 relative leading-tight"
    >
      <style>{`
        @media print {
          @page {
            size: A5 portrait;
            margin: 5mm;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-container {
            width: 138mm !important;
            min-height: 200mm !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Top small header */}
      <div className="flex justify-between items-center mb-1 text-[9px] text-gray-500">
        <span>{nowTime}</span>
        <span>In Chứng Tử</span>
      </div>

      {/* Brand Header */}
      <div className="flex items-start mb-2 border-b border-gray-200 pb-1">
        {/* Logo */}
        <div className="w-16 h-16 mr-3 flex items-center justify-center flex-shrink-0">
          <img 
            src={setting?.logo ? getPublicUrl(setting.logo) : "/images/logo/logo-nobackground.png"} 
            alt="Logo" 
            className="max-w-full max-h-full object-contain" 
          />
        </div>
        
        <div className="flex-1 text-[10px] leading-snug">
          <h1 className="text-[12px] font-bold uppercase mb-0.5 text-red-600">
            {setting?.brandName || 'CÔNG TY CỔ PHẦN HÓA SINH NAM VIỆT'}
          </h1>
          <p className="mb-0.5 text-green-700 font-semibold">
            {setting?.address || 'Quốc Lộ 30, ấp Đông Mỹ, xã Mỹ Thọ, tỉnh Đồng Tháp.'}
          </p>
          <p className="mb-0.5 text-purple-700 font-semibold">
            Điện thoại: {setting?.phone ? (setting.phone.includes("0868") ? setting.phone : setting.phone + " - 0868 759 588") : "088 635 7788 - 0868 759 588"}
          </p>
          <p className="mb-0.5 text-amber-600 font-semibold">
            TK Lê Trung Thành: 9 75 76 77 88 - NH ACB CN Đồng Tháp
          </p>
          <p className="text-amber-600 font-semibold">
            TK Lê Trung Thành: 09 75 76 77 88 - NH SACOMBANK CN Đồng Tháp.
          </p>
        </div>
      </div>

      {/* Title & Subheader */}
      <div className="mb-3">
        <h2 className="text-lg font-bold text-center uppercase text-red-600 mb-1">
          {isImport ? 'PHIẾU NHẬP KHO' : 'PHIẾU XUẤT KHO'}
        </h2>
        <div className="flex justify-between items-center text-[10px] px-1">
          <span className="text-blue-700 font-semibold">
            Nội dung: {receipt?.reason || receipt?.notes || (isImport ? 'Nhập kho thành phẩm' : 'Xuất kho thành phẩm')}
          </span>
          <span className="text-red-600 font-bold">
            Số: {receipt?.code}
          </span>
        </div>
      </div>

      {/* Table */}
      <table className="mb-2 w-full text-[10px] border-collapse border border-black">
        <thead>
          <tr className="bg-[#e29d1c] text-black">
            <th className="border border-black p-1 text-center font-bold w-8">TT</th>
            <th className="border border-black p-1 text-center font-bold">Tên sản phẩm</th>
            <th className="border border-black p-1 text-center font-bold w-12">ĐVT</th>
            <th className="border border-black p-1 text-center font-bold w-16">SL</th>
            <th className="border border-black p-1 text-center font-bold w-24">Date</th>
          </tr>
        </thead>
        <tbody>
          {receipt?.details?.map((item, index) => {
            const itemDate = item.expiryDate || item.mfgDate || item.createdAt || '';
            const itemDateStr = itemDate ? dateFormat(itemDate) : '';
            return (
              <tr key={index} className="h-6">
                <td className="border border-black p-0.5 text-center">{index + 1}</td>
                <td className="border border-black p-0.5 px-1 font-semibold text-blue-700">
                  {item.productName || item.product?.productName}
                </td>
                <td className="border border-black p-0.5 text-center font-semibold text-blue-700">
                  {item.unitName || item.product?.unit?.name || '—'}
                </td>
                <td className="border border-black p-0.5 text-center font-bold text-blue-700">
                  {parseFloat(item.qtyActual || item.quantity || 0).toLocaleString('vi-VN')}
                </td>
                <td className="border border-black p-0.5 text-center font-semibold text-blue-700">
                  {itemDateStr}
                </td>
              </tr>
            )
          })}
          {/* Summary Row */}
          <tr className="bg-white text-black font-bold">
            <td className="border border-black p-0.5 px-2 text-center" colSpan={3}>Cộng:</td>
            <td className="border border-black p-0.5 text-center">
              {receipt?.details?.reduce((sum, item) => sum + parseFloat(item.qtyActual || item.quantity || 0), 0).toLocaleString('vi-VN')}
            </td>
            <td className="border border-black p-0.5"></td>
          </tr>
        </tbody>
      </table>

      {/* Date Str */}
      <div className="text-right text-[10px] font-semibold italic text-green-700 mb-2 pr-2">
        {printDateStr}
      </div>

      {/* Signatures */}
      <div className="flex justify-between text-center text-[10px] px-2 mb-8">
        <div className="w-1/3 flex flex-col items-center">
          <p className="font-bold">Lập phiếu</p>
          <div className="h-12"></div>
          <p className="font-bold text-red-600 uppercase text-[9px] leading-tight">
            {receipt?.creator?.fullName || receipt?.createdByUser?.fullName || 'NGUYỄN THỊ THÙY TRANG'}
          </p>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <p className="font-bold">Người nhận hàng</p>
          <div className="h-12"></div>
          <p className="font-bold text-red-600 uppercase text-[9px] leading-tight"></p>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <p className="font-bold">Thủ kho</p>
          <div className="h-12"></div>
          <p className="font-bold text-red-600 text-[9px] leading-tight">
            {setting?.warehouseKeeper || 'Nguyễn Thị Thùy Trang'}
          </p>
        </div>
      </div>
    </div>
  )
})

PrintableContent.displayName = 'PrintableContent'

export default PrintWarehouseReceiptView
