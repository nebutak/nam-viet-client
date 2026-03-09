import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const SortableWidget = ({ id, children, isEditMode }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative bg-background rounded-xl border shadow-sm ${isEditMode ? 'cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary/50' : ''
                }`}
        >
            {isEditMode && (
                <div
                    className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing z-50 bg-background/80 rounded-md"
                    {...attributes}
                    {...listeners}
                    title="Kéo thả để di chuyển"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="5 9 2 12 5 15"></polyline>
                        <polyline points="9 5 12 2 15 5"></polyline>
                        <polyline points="19 9 22 12 19 15"></polyline>
                        <polyline points="9 19 12 22 15 19"></polyline>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <line x1="12" y1="2" x2="12" y2="22"></line>
                    </svg>
                </div>
            )}
            <div className={isEditMode ? 'pointer-events-none' : ''}>
                {children}
            </div>
        </div>
    )
}
