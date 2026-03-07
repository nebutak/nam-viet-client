import React from 'react'
import { X, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * PagePreviewDialog — Full-screen dialog that embeds a page component inline.
 * Props:
 *   open        — boolean
 *   onClose     — function to close the dialog
 *   title       — string: dialog header title
 *   route       — string: route path (for the "open in new tab" button)
 *   children    — the page component to render inside
 */
export const PagePreviewDialog = ({ open, onClose, title, route, children }) => {
    const navigate = useNavigate()

    if (!open) return null

    const handleOpenFull = () => {
        onClose()
        if (route) navigate(route)
    }

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative bg-background w-[96vw] max-w-[1400px] h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-background/95 z-10 shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    <div className="flex items-center gap-2">
                        {route && (
                            <button
                                onClick={handleOpenFull}
                                title="Mở trang đầy đủ"
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-muted border border-transparent hover:border-border"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Mở trang đầy đủ
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
