import { getApiClient } from './api-client';
import { PersonEmployment } from '../../types/api.types';
import { EmploymentRecord } from '../../types/frontend.types';

export interface CreateEmploymentRequest {
  personId: string;
  jobTitle?: string;
  jobFunction?: string;
  department?: string;
  employerName?: string;
  employmentType?: string;
  jobGrade?: string;
  roleDescription?: string;
  employerLocation?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isSecondaryContract: boolean;
  managers?: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  employeeReferences?: string[];
}

export interface UpdateEmploymentRequest {
  jobTitle?: string;
  jobFunction?: string;
  department?: string;
  employerName?: string;
  employmentType?: string;
  jobGrade?: string;
  roleDescription?: string;
  employerLocation?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  isSecondaryContract?: boolean;
  managers?: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  employeeReferences?: string[];
}

export interface EmploymentSearchParams {
  personId?: string;
  isActive?: boolean;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export class EmploymentService {
  /**
   * Get all employment records for a specific person
   */
  static async getEmploymentRecords(personId: string): Promise<PersonEmployment[]> {
    try {
      const response = await getApiClient().get(`/persons/${personId}/employment`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch employment records:', error);
      throw new Error('Unable to fetch employment records. Please try again.');
    }
  }

  /**
   * Get a specific employment record by ID
   */
  static async getEmploymentRecord(employmentId: string): Promise<PersonEmployment> {
    try {
      const response = await getApiClient().get(`/employment/${employmentId}`);
      if (!response.data) {
        throw new Error('Employment record not found');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employment record:', error);
      throw new Error('Unable to fetch employment record. Please try again.');
    }
  }

  /**
   * Create a new employment record
   */
  static async createEmploymentRecord(data: CreateEmploymentRequest): Promise<PersonEmployment> {
    try {
      // Validate required fields
      if (!data.personId || !data.startDate) {
        throw new Error('Person ID and start date are required');
      }

      // Convert frontend format to API format
      const apiData = {
        person_id: data.personId,
        job_title: data.jobTitle,
        job_function: data.jobFunction,
        department: data.department,
        employer_name: data.employerName,
        employment_type: data.employmentType,
        job_grade: data.jobGrade,
        role_description: data.roleDescription,
        employer_location: data.employerLocation,
        employment_start_date: data.startDate,
        employment_end_date: data.endDate,
        is_active: data.isActive,
        managers: data.managers || [],
        // Note: isSecondaryContract and employeeReferences would need custom field support
      };

      const response = await getApiClient().post(`/persons/${data.personId}/employment`, apiData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create employment record:', error);
      const message = error.response?.data?.message || 'Unable to create employment record. Please try again.';
      throw new Error(message);
    }
  }

  /**
   * Update an existing employment record
   */
  static async updateEmploymentRecord(
    employmentId: string, 
    data: UpdateEmploymentRequest
  ): Promise<PersonEmployment> {
    try {
      // Convert frontend format to API format
      const apiData = {
        job_title: data.jobTitle,
        job_function: data.jobFunction,
        department: data.department,
        employer_name: data.employerName,
        employment_type: data.employmentType,
        job_grade: data.jobGrade,
        role_description: data.roleDescription,
        employer_location: data.employerLocation,
        employment_start_date: data.startDate,
        employment_end_date: data.endDate,
        is_active: data.isActive,
        managers: data.managers || [],
      };

      // Remove undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(apiData).filter(([_, value]) => value !== undefined)
      );

      const response = await getApiClient().put(`/employment/${employmentId}`, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update employment record:', error);
      const message = error.response?.data?.message || 'Unable to update employment record. Please try again.';
      throw new Error(message);
    }
  }

  /**
   * Delete an employment record
   */
  static async deleteEmploymentRecord(employmentId: string): Promise<void> {
    try {
      await getApiClient().delete(`/employment/${employmentId}`);
    } catch (error: any) {
      console.error('Failed to delete employment record:', error);
      const message = error.response?.data?.message || 'Unable to delete employment record. Please try again.';
      throw new Error(message);
    }
  }

  /**
   * End an employment record (set end date and mark as inactive)
   */
  static async endEmploymentRecord(
    employmentId: string, 
    endDate: string = new Date().toISOString().split('T')[0]
  ): Promise<PersonEmployment> {
    try {
      return await this.updateEmploymentRecord(employmentId, {
        endDate,
        isActive: false
      });
    } catch (error) {
      console.error('Failed to end employment record:', error);
      throw new Error('Unable to end employment record. Please try again.');
    }
  }

  /**
   * Validate employment record for conflicts and business rules
   */
  static validateEmploymentRecord(
    newRecord: CreateEmploymentRequest | UpdateEmploymentRequest,
    existingRecords: PersonEmployment[] = [],
    employmentId?: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate date format and logic
    if ('startDate' in newRecord && newRecord.startDate) {
      const startDate = new Date(newRecord.startDate);
      if (isNaN(startDate.getTime())) {
        errors.push('Invalid start date format');
      }

      if (newRecord.endDate) {
        const endDate = new Date(newRecord.endDate);
        if (isNaN(endDate.getTime())) {
          errors.push('Invalid end date format');
        } else if (endDate <= startDate) {
          errors.push('End date must be after start date');
        }
      }
    }

    // Check for overlapping employment periods
    if ('startDate' in newRecord && newRecord.startDate) {
      const newStart = new Date(newRecord.startDate);
      const newEnd = newRecord.endDate ? new Date(newRecord.endDate) : null;

      for (const existing of existingRecords) {
        // Skip the record being updated
        if (employmentId && existing.id === employmentId) continue;

        const existingStart = new Date(existing.employment_start_date || '');
        const existingEnd = existing.employment_end_date ? new Date(existing.employment_end_date) : null;

        // Check for overlap
        const hasOverlap = (
          newStart <= (existingEnd || new Date()) &&
          (newEnd || new Date()) >= existingStart
        );

        if (hasOverlap && existing.is_active && newRecord.isActive !== false) {
          errors.push(`Employment period overlaps with existing record: ${existing.job_title || 'Unknown Position'}`);
        }
      }
    }

    // Validate required fields for create operations
    if ('personId' in newRecord) {
      if (!newRecord.personId) {
        errors.push('Person ID is required');
      }
      if (!newRecord.startDate) {
        errors.push('Start date is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get employment statistics for a person
   */
  static getEmploymentStatistics(records: PersonEmployment[]) {
    const active = records.filter(r => r.is_active);
    const historical = records.filter(r => !r.is_active);
    const withEndDate = records.filter(r => r.employment_end_date);
    
    // Calculate average tenure
    const completedRecords = records.filter(r => r.employment_end_date);
    const avgTenure = completedRecords.length > 0 
      ? completedRecords.reduce((sum, record) => {
          const start = new Date(record.employment_start_date || '');
          const end = new Date(record.employment_end_date!);
          const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / completedRecords.length
      : 0;

    return {
      total: records.length,
      active: active.length,
      historical: historical.length,
      withEndDate: withEndDate.length,
      averageTenureDays: Math.round(avgTenure),
      currentEmployers: active.map(r => r.employer_name).filter(Boolean),
      jobTitles: [...new Set(records.map(r => r.job_title).filter(Boolean))],
      departments: [...new Set(records.map(r => r.department).filter(Boolean))],
      locations: [...new Set(records.map(r => r.employer_location).filter(Boolean))]
    };
  }
}

export default EmploymentService;