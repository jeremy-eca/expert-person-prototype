import { useState, useCallback } from 'react';
import { EmploymentService, CreateEmploymentRequest, UpdateEmploymentRequest } from '../services/api/employmentService';
import { EmploymentRecord } from '../types/frontend.types';
import { PersonEmployment } from '../types/api.types';

interface UseEmploymentOperationsProps {
  personId: string;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

interface UseEmploymentOperationsReturn {
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createEmployment: (data: CreateEmploymentRequest) => Promise<PersonEmployment>;
  updateEmployment: (employmentId: string, data: UpdateEmploymentRequest) => Promise<PersonEmployment>;
  deleteEmployment: (employmentId: string) => Promise<void>;
  endEmployment: (employmentId: string, endDate?: string) => Promise<PersonEmployment>;
  validateEmployment: (data: CreateEmploymentRequest | UpdateEmploymentRequest, existingRecords?: PersonEmployment[], employmentId?: string) => { isValid: boolean; errors: string[] };
}

export function useEmploymentOperations({ 
  personId, 
  onSuccess, 
  onError 
}: UseEmploymentOperationsProps): UseEmploymentOperationsReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLoading = isCreating || isUpdating || isDeleting;

  const createEmployment = useCallback(async (data: CreateEmploymentRequest): Promise<PersonEmployment> => {
    setIsCreating(true);
    try {
      const result = await EmploymentService.createEmploymentRecord(data);
      onSuccess?.('Employment record created successfully');
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create employment record';
      onError?.(message);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [onSuccess, onError]);

  const updateEmployment = useCallback(async (
    employmentId: string, 
    data: UpdateEmploymentRequest
  ): Promise<PersonEmployment> => {
    setIsUpdating(true);
    try {
      const result = await EmploymentService.updateEmploymentRecord(employmentId, data);
      onSuccess?.('Employment record updated successfully');
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update employment record';
      onError?.(message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess, onError]);

  const deleteEmployment = useCallback(async (employmentId: string): Promise<void> => {
    setIsDeleting(true);
    try {
      await EmploymentService.deleteEmploymentRecord(employmentId);
      onSuccess?.('Employment record deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete employment record';
      onError?.(message);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [onSuccess, onError]);

  const endEmployment = useCallback(async (
    employmentId: string, 
    endDate?: string
  ): Promise<PersonEmployment> => {
    setIsUpdating(true);
    try {
      const result = await EmploymentService.endEmploymentRecord(employmentId, endDate);
      onSuccess?.('Employment record ended successfully');
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to end employment record';
      onError?.(message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess, onError]);

  const validateEmployment = useCallback((
    data: CreateEmploymentRequest | UpdateEmploymentRequest,
    existingRecords: PersonEmployment[] = [],
    employmentId?: string
  ) => {
    return EmploymentService.validateEmploymentRecord(data, existingRecords, employmentId);
  }, []);

  return {
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createEmployment,
    updateEmployment,
    deleteEmployment,
    endEmployment,
    validateEmployment
  };
}

export default useEmploymentOperations;