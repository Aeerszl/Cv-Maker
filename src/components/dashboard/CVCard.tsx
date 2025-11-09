/**
 * CV Card Component
 * 
 * Displays CV summary in dashboard grid
 * 
 * Features:
 * - Template preview
 * - Quick actions (edit, delete, duplicate)
 * - Last modified date
 * - Completion status
 * - Hover animations
 * 
 * @module components/dashboard/CVCard
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  FileText, 
  Edit, 
  Trash2, 
  Copy, 
  Download,
  MoreVertical,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { CVCardProps } from '@/types/dashboard';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Template color mapping for visual distinction
 */
const TEMPLATE_COLORS = {
  modern: 'from-blue-500 to-blue-600',
  classic: 'from-gray-600 to-gray-700',
  creative: 'from-purple-500 to-purple-600',
  professional: 'from-green-500 to-green-600',
  minimal: 'from-orange-500 to-orange-600',
} as const;

/**
 * CVCard Component
 * 
 * Reusable card for displaying CV in grid
 */
export function CVCard({
  id,
  title,
  template,
  lastModified,
  createdAt: _createdAt,
  isComplete = false,
  onEdit,
  onDelete,
  onDuplicate,
  onDownload,
}: CVCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useLanguage();

  /**
   * Format date to Turkish locale
   */
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return t('cvCard.today');
    if (days === 1) return t('cvCard.yesterday');
    if (days < 7) return t('cvCard.daysAgo').replace('{days}', String(days));
    
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  /**
   * Handle delete with confirmation
   */
  const handleDelete = async () => {
    if (!confirm(t('cvCard.deleteConfirm').replace('{title}', title))) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete?.(id);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setIsMenuOpen(false);
    }
  };

  /**
   * Template display name
   */
  const templateName = template.charAt(0).toUpperCase() + template.slice(1);

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      {/* Template Preview */}
      <div className={`relative h-48 rounded-t-xl bg-linear-to-br ${TEMPLATE_COLORS[template]} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText className="w-16 h-16 text-white/30" />
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-gray-900/90 rounded text-xs font-medium text-foreground">
          {templateName}
        </div>
        {isComplete && (
          <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
          {title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span>{formatDate(lastModified)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/cv/edit/${id}`}
            onClick={() => onEdit?.(id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{t('cvCard.edit')}</span>
          </Link>

          {/* More Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              aria-label="More actions"
            >
              <MoreVertical className="w-5 h-5 text-foreground" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-border z-20 py-1">
                  <button
                    onClick={() => {
                      onDownload?.(id);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('cvCard.download')}</span>
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate?.(id);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{t('cvCard.duplicate')}</span>
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeleting ? t('cvCard.deleting') : t('cvCard.delete')}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
