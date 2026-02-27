'use client'

import { 
  CheckCircle, 
  XCircle, 
  Star, 
  Trash2, 
  DollarSign,
  Archive
} from 'lucide-react'

interface BulkActionsProps {
  selectedCount: number
  onAction: (action: string) => void
  onClearSelection: () => void
}

export default function BulkActions({ 
  selectedCount, 
  onAction,
  onClearSelection 
}: BulkActionsProps) {
  const actions = [
    { 
      id: 'publish', 
      label: 'Publish', 
      icon: CheckCircle, 
      color: 'bg-green-600 hover:bg-green-700 text-white' 
    },
    { 
      id: 'unpublish', 
      label: 'Unpublish', 
      icon: XCircle, 
      color: 'bg-amber-600 hover:bg-amber-700 text-white' 
    },
    { 
      id: 'feature', 
      label: 'Feature', 
      icon: Star, 
      color: 'bg-purple-600 hover:bg-purple-700 text-white' 
    },
    { 
      id: 'unfeature', 
      label: 'Unfeature', 
      icon: Archive, 
      color: 'bg-gray-600 hover:bg-gray-700 text-white' 
    },
    { 
      id: 'mark_sold', 
      label: 'Mark Sold', 
      icon: DollarSign, 
      color: 'bg-blue-600 hover:bg-blue-700 text-white' 
    },
    { 
      id: 'delete', 
      label: 'Delete', 
      icon: Trash2, 
      color: 'bg-red-600 hover:bg-red-700 text-white' 
    }
  ]

  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
      <span className="text-sm font-medium text-blue-900">
        {selectedCount} vehicle{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2 ml-auto">
        {actions.map(action => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5 transition-colors ${action.color}`}
            >
              <Icon size={14} />
              {action.label}
            </button>
          )
        })}
        <button
          onClick={onClearSelection}
          className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
