'use client'

import { useState } from 'react'
import { 
  Search, 
  Upload, 
  Image as ImageIcon,
  Trash2,
  Download,
  Grid,
  List,
  Filter,
  FolderOpen,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Mock data for demonstration
const mockMedia = [
  { id: '1', name: 'toyota-land-cruiser-1.jpg', url: '/placeholder.jpg', type: 'image', size: '2.4 MB', dimensions: '1920x1080', uploaded_at: '2024-01-15', folder: 'vehicles' },
  { id: '2', name: 'bmw-x5-exterior.jpg', url: '/placeholder.jpg', type: 'image', size: '1.8 MB', dimensions: '1600x900', uploaded_at: '2024-01-14', folder: 'vehicles' },
  { id: '3', name: 'hero-banner-1.jpg', url: '/placeholder.jpg', type: 'image', size: '3.2 MB', dimensions: '2400x800', uploaded_at: '2024-01-10', folder: 'banners' },
  { id: '4', name: 'blog-cover-1.jpg', url: '/placeholder.jpg', type: 'image', size: '1.5 MB', dimensions: '1200x630', uploaded_at: '2024-01-08', folder: 'blog' },
  { id: '5', name: 'team-member-1.jpg', url: '/placeholder.jpg', type: 'image', size: '0.8 MB', dimensions: '800x800', uploaded_at: '2024-01-05', folder: 'team' },
  { id: '6', name: 'logo-transparent.png', url: '/placeholder.jpg', type: 'image', size: '45 KB', dimensions: '512x512', uploaded_at: '2024-01-01', folder: 'logos' },
  { id: '7', name: 'interior-feature.jpg', url: '/placeholder.jpg', type: 'image', size: '2.1 MB', dimensions: '1800x1200', uploaded_at: '2023-12-28', folder: 'vehicles' },
  { id: '8', name: 'wheel-detail.jpg', url: '/placeholder.jpg', type: 'image', size: '1.2 MB', dimensions: '1500x1000', uploaded_at: '2023-12-20', folder: 'vehicles' },
]

const folders = ['All', 'vehicles', 'banners', 'blog', 'team', 'logos']

export default function MediaPage() {
  const [media, setMedia] = useState(mockMedia)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('All')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = selectedFolder === 'All' || item.folder === selectedFolder
    return matchesSearch && matchesFolder
  })

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredMedia.map(m => m.id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleDelete = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id))
    setSelectedItems(prev => prev.filter(i => i !== id))
  }

  const handleBulkDelete = () => {
    setMedia(prev => prev.filter(m => !selectedItems.includes(m.id)))
    setSelectedItems([])
  }

  const totalSize = media.reduce((acc, item) => {
    const size = parseFloat(item.size)
    return acc + (item.size.includes('MB') ? size : size / 1024)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">Manage your images and files</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Upload size={18} />
          Upload Files
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ImageIcon size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Files</p>
              <p className="text-xl font-bold text-gray-900">{media.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Storage Used</p>
              <p className="text-xl font-bold text-gray-900">{totalSize.toFixed(1)} MB</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FolderOpen size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Folders</p>
              <p className="text-xl font-bold text-gray-900">{folders.length - 1}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Grid size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Selected</p>
              <p className="text-xl font-bold text-gray-900">{selectedItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Folder filter */}
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder === 'All' ? 'All Folders' : folder.charAt(0).toUpperCase() + folder.slice(1)}
              </option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              {selectedItems.length} file(s) selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <Download size={14} />
                Download
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <div 
              key={item.id}
              className={`relative group bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                selectedItems.includes(item.id) ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectItem(item.id)}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <ImageIcon size={32} className="text-gray-300" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{item.size}</p>
              </div>
              
              {/* Selection indicator */}
              {selectedItems.includes(item.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-white" />
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                  <ImageIcon size={14} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredMedia.length && filteredMedia.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimensions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folder</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMedia.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-gray-50 cursor-pointer ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon size={20} className="text-gray-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.size}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.dimensions}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">{item.folder}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.uploaded_at}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
