import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmploymentTimeline } from '@/components/ui/employment-timeline';
import { EmploymentForm } from '@/components/ui/employment-form';
import { useEmploymentData } from '@/hooks/useEmploymentData';
import { useEmploymentOperations } from '@/hooks/useEmploymentOperations';
import { CreateEmploymentRequest, UpdateEmploymentRequest } from '@/services/api/employmentService';
import { EmploymentRecord } from '@/types/frontend.types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  PlusIcon, 
  TrendingUpIcon,
  AlertTriangleIcon,
  CheckCircleIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmploymentSectionProps {
  personId: string;
  className?: string;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

interface FormMode {
  type: 'create' | 'edit' | 'view';
  record?: EmploymentRecord;
}

export function EmploymentSection({ 
  personId, 
  className, 
  onSuccess, 
  onError 
}: EmploymentSectionProps) {
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    record: EmploymentRecord;
    show: boolean;
  } | null>(null);

  // Hooks for data management
  const {
    employmentRecords,
    isLoading,
    isRefreshing,
    error,
    statistics,
    refreshData,
    addOptimisticRecord,
    updateOptimisticRecord,
    removeOptimisticRecord,
    revertOptimisticChanges
  } = useEmploymentData({ 
    personId, 
    autoRefresh: false 
  });

  const {
    isCreating,
    isUpdating,
    isDeleting,
    createEmployment,
    updateEmployment,
    deleteEmployment,
    endEmployment
  } = useEmploymentOperations({
    personId,
    onSuccess: (message) => {
      onSuccess?.(message);
      refreshData(); // Refresh data after successful operations
    },
    onError: (error) => {
      onError?.(error);
      revertOptimisticChanges(); // Revert optimistic changes on error
    }
  });

  // Handle form submission
  const handleFormSubmit = useCallback(async (data: CreateEmploymentRequest | UpdateEmploymentRequest) => {
    try {
      if (formMode?.type === 'create') {
        // Optimistic update for create
        const optimisticRecord = {
          jobTitle: data.jobTitle,
          employerName: data.employerName,
          startDate: data.startDate,
          isActive: data.isActive
        };
        addOptimisticRecord(optimisticRecord);
        
        await createEmployment(data as CreateEmploymentRequest);
      } else if (formMode?.type === 'edit' && formMode.record) {
        // Optimistic update for edit
        updateOptimisticRecord(formMode.record.id, data);
        
        await updateEmployment(formMode.record.id, data as UpdateEmploymentRequest);
      }
      
      setFormMode(null);
    } catch (error) {
      // Error handling is done in the useEmploymentOperations hook
      console.error('Form submission failed:', error);
    }
  }, [formMode, addOptimisticRecord, updateOptimisticRecord, createEmployment, updateEmployment]);

  // Handle employment deletion
  const handleDelete = useCallback(async (record: EmploymentRecord) => {
    if (!deleteConfirm) return;
    
    try {
      // Optimistic update for delete
      removeOptimisticRecord(record.id);
      
      await deleteEmployment(record.id);
      setDeleteConfirm(null);
    } catch (error) {
      // Error handling is done in the useEmploymentOperations hook
      console.error('Delete failed:', error);
    }
  }, [deleteConfirm, removeOptimisticRecord, deleteEmployment]);

  // Handle ending employment
  const handleEndEmployment = useCallback(async (record: EmploymentRecord) => {
    try {
      // Optimistic update for end
      updateOptimisticRecord(record.id, { 
        isActive: false, 
        endDate: new Date().toISOString().split('T')[0] 
      });
      
      await endEmployment(record.id);
    } catch (error) {
      // Error handling is done in the useEmploymentOperations hook
      console.error('End employment failed:', error);
    }
  }, [updateOptimisticRecord, endEmployment]);

  // Timeline event handlers
  const handleAddRecord = () => {
    setFormMode({ type: 'create' });
  };

  const handleEditRecord = (record: EmploymentRecord) => {
    setFormMode({ type: 'edit', record });
  };

  const handleViewRecord = (record: EmploymentRecord) => {
    setFormMode({ type: 'view', record });
  };

  const handleEndRecord = (record: EmploymentRecord) => {
    handleEndEmployment(record);
  };

  const handleDeleteRecord = (record: EmploymentRecord) => {
    setDeleteConfirm({ record, show: true });
  };

  const isFormLoading = isCreating || isUpdating || isDeleting;

  if (error) {
    return (
      <Card className={cn("border-red-200 bg-red-50", className)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-700">
            <AlertTriangleIcon className="w-5 h-5" />
            <div>
              <h3 className="font-medium">Failed to load employment data</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refreshData()}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Employment Section Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUpIcon className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle className="text-lg">Work & Employment</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Employment history, current positions, and future assignments
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Statistics Summary */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mr-4">
                <span className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  {statistics.active} active
                </span>
                <span>{statistics.total} total</span>
                {/* Future records are calculated from employmentRecords directly */}
                {employmentRecords.filter(r => new Date(r.startDate) > new Date()).length > 0 && (
                  <span className="text-blue-600">
                    {employmentRecords.filter(r => new Date(r.startDate) > new Date()).length} future
                  </span>
                )}
              </div>
              
              <Button
                onClick={handleAddRecord}
                disabled={isLoading || isFormLoading}
                className="flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Employment
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Loading employment data...</span>
              </div>
            </div>
          ) : (
            <EmploymentTimeline
              employmentRecords={employmentRecords}
              onAddRecord={handleAddRecord}
              onEditRecord={handleEditRecord}
              onViewRecord={handleViewRecord}
              onEndRecord={handleEndRecord}
              showAddButton={false} // We have the header button
            />
          )}
        </CardContent>
      </Card>

      {/* Employment Form Dialog */}
      <Dialog 
        open={!!formMode} 
        onOpenChange={(open) => !open && setFormMode(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode?.type === 'create' && 'Add New Employment Record'}
              {formMode?.type === 'edit' && 'Edit Employment Record'}
              {formMode?.type === 'view' && 'Employment Record Details'}
            </DialogTitle>
          </DialogHeader>
          
          {formMode && (
            <EmploymentForm
              personId={personId}
              employmentRecord={formMode.record}
              existingRecords={employmentRecords}
              onSubmit={handleFormSubmit}
              onCancel={() => setFormMode(null)}
              isLoading={isFormLoading}
              className="mt-4"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteConfirm?.show || false} 
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employment Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employment record for{' '}
              <strong>{deleteConfirm?.record.jobTitle || 'this position'}</strong> at{' '}
              <strong>{deleteConfirm?.record.employerName || 'this company'}</strong>?
              <br />
              <br />
              This action cannot be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm.record)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Employment Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EmploymentSection;