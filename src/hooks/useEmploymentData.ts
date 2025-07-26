import { useState, useEffect, useCallback, useMemo } from 'react';
import { EmploymentService } from '../services/api/employmentService';
import { EmploymentRecord } from '../types/frontend.types';
import { PersonEmployment } from '../types/api.types';
import { mapPersonEmploymentToRecord } from '../services/mappers/personMapper';

interface UseEmploymentDataProps {
  personId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseEmploymentDataReturn {
  employmentRecords: EmploymentRecord[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  statistics: {
    total: number;
    active: number;
    historical: number;
    withEndDate: number;
    averageTenureDays: number;
    currentEmployers: string[];
    jobTitles: string[];
    departments: string[];
    locations: string[];
  };
  refreshData: () => Promise<void>;
  addOptimisticRecord: (record: Partial<EmploymentRecord>) => void;
  updateOptimisticRecord: (id: string, updates: Partial<EmploymentRecord>) => void;
  removeOptimisticRecord: (id: string) => void;
  revertOptimisticChanges: () => void;
}

export function useEmploymentData({ 
  personId, 
  autoRefresh = false, 
  refreshInterval = 30000 
}: UseEmploymentDataProps): UseEmploymentDataReturn {
  const [apiData, setApiData] = useState<PersonEmployment[]>([]);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, Partial<EmploymentRecord>>>(new Map());
  const [optimisticRemovals, setOptimisticRemovals] = useState<Set<string>>(new Set());
  const [optimisticAdditions, setOptimisticAdditions] = useState<EmploymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert API data to frontend format with optimistic updates applied
  const employmentRecords = useMemo(() => {
    // Start with API data converted to frontend format
    let records = apiData
      .filter(record => !optimisticRemovals.has(record.id))
      .map(record => {
        const frontendRecord = mapPersonEmploymentToRecord(record);
        const optimisticUpdate = optimisticUpdates.get(record.id);
        return optimisticUpdate ? { ...frontendRecord, ...optimisticUpdate } : frontendRecord;
      });

    // Add optimistic additions
    records = [...records, ...optimisticAdditions];

    // Sort by start date (newest first)
    return records.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [apiData, optimisticUpdates, optimisticRemovals, optimisticAdditions]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const stats = EmploymentService.getEmploymentStatistics(apiData);
    return {
      ...stats,
      currentEmployers: stats.currentEmployers.filter(Boolean) as string[],
      jobTitles: stats.jobTitles.filter(Boolean) as string[],
      departments: stats.departments.filter(Boolean) as string[],
      locations: stats.locations.filter(Boolean) as string[]
    };
  }, [apiData]);

  // Fetch employment data
  const fetchData = useCallback(async (isRefresh = false) => {
    // Handle new person case - don't try to fetch from API
    if (!personId || personId === 'new') {
      setApiData([]);
      setError(null);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      setError(null);
      const data = await EmploymentService.getEmploymentRecords(personId);
      setApiData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch employment data';
      setError(message);
      console.error('Failed to fetch employment data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [personId]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      fetchData(true);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, fetchData]);

  // Optimistic update functions
  const addOptimisticRecord = useCallback((record: Partial<EmploymentRecord>) => {
    const optimisticRecord: EmploymentRecord = {
      id: `optimistic-${Date.now()}`,
      personId,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
      isSecondaryContract: false,
      isPrimaryEmployment: true,
      isFutureAssignment: false,
      status: {
        status: 'active',
        statusDate: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...record,
    } as EmploymentRecord;

    setOptimisticAdditions(prev => [...prev, optimisticRecord]);
  }, [personId]);

  const updateOptimisticRecord = useCallback((id: string, updates: Partial<EmploymentRecord>) => {
    setOptimisticUpdates(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(id) || {};
      newMap.set(id, { ...existing, ...updates });
      return newMap;
    });
  }, []);

  const removeOptimisticRecord = useCallback((id: string) => {
    // Check if it's an optimistic addition
    const isOptimisticAddition = optimisticAdditions.some(record => record.id === id);
    
    if (isOptimisticAddition) {
      setOptimisticAdditions(prev => prev.filter(record => record.id !== id));
    } else {
      setOptimisticRemovals(prev => new Set([...prev, id]));
    }
  }, [optimisticAdditions]);

  const revertOptimisticChanges = useCallback(() => {
    setOptimisticUpdates(new Map());
    setOptimisticRemovals(new Set());
    setOptimisticAdditions([]);
  }, []);

  const refreshData = useCallback(() => fetchData(true), [fetchData]);

  return {
    employmentRecords,
    isLoading,
    isRefreshing,
    error,
    statistics,
    refreshData,
    addOptimisticRecord,
    updateOptimisticRecord,
    removeOptimisticRecord,
    revertOptimisticChanges,
  };
}

export default useEmploymentData;