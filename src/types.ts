import type { Database } from "./db/database.types";

/**
 * @file Shared TypeScript types for the application.
 * This file defines various data structures used throughout the frontend and backend,
 * including database entity types derived from Supabase schema, Data Transfer Objects (DTOs)
 * for API communication, command models for operations, and view models for the UI.
 * @module types
 * @see module:db/database.types
 */

type Tables = Database["public"]["Tables"];

// Database entity types (derived from database schema)
/** @description Represents a user record from the 'users' table. */
export type User = Tables["users"]["Row"];
/** @description Represents an assessment process record from the 'assessment_processes' table. */
export type AssessmentProcess = Tables["assessment_processes"]["Row"];
/** @description Represents a goal record from the 'goals' table. */
export type Goal = Tables["goals"]["Row"];
/** @description Represents a goal category record from the 'goal_categories' table. */
export type GoalCategory = Tables["goal_categories"]["Row"];
/** @description Represents a self-assessment record from the 'self_assessments' table. */
export type SelfAssessment = Tables["self_assessments"]["Row"];
/** @description Represents a manager assessment record from the 'manager_assessments' table. */
export type ManagerAssessment = Tables["manager_assessments"]["Row"];

// Enums
/**
 * @description Possible statuses for an assessment process.
 * - `in_definition`: The assessment process is being defined (goals are being set).
 * - `in_self_assessment`: Employees are performing self-assessment.
 * - `awaiting_manager_assessment`: Managers are assessing their subordinates.
 * - `completed`: The assessment process is finished.
 */
export type AssessmentProcessStatus = Database["public"]["Enums"]["assessment_process_status"];

// Authentication DTOs
/** @description Data Transfer Object for login requests. */
export interface LoginRequest {
  /** @description User's email address. */
  email: string;
  /** @description User's password. */
  password: string;
}

/** @description Data Transfer Object for login responses. */
export interface LoginResponse {
  /** @description Authentication token (e.g., JWT). */
  token: string;
  /** @description Basic information about the logged-in user. */
  user: {
    id: string;
    email: string;
  };
}

/** @description Represents a user's profile information. */
export interface UserProfile {
  id: string;
  email: string;
  managerId: string | null;
}

// User DTOs
/** @description Data Transfer Object for user information. */
export interface UserDTO {
  id: string;
  email: string;
  /** @description Full name of the user. */
  name: string;
  managerId: string | null;
  /** @description Optional list of direct subordinates. */
  subordinates?: UserDTO[];
}

// Extended user view model for dashboard
export interface UserViewModel extends UserDTO {
  isManager: boolean;
  managerName?: string;
}

export interface EmployeeDTO {
  id: string;
  email: string;
  name: string;
}

export interface UserListResponse {
  users: UserDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface EmployeeListResponse {
  employees: EmployeeDTO[];
  total: number;
  page: number;
  limit: number;
}

// Assessment Process DTOs
/** @description Data Transfer Object for assessment process information. */
export interface AssessmentProcessDTO {
  id: string;
  /** @description Name or title of the assessment process. */
  name: string;
  status: AssessmentProcessStatus;
  /** @description Indicates if the process is currently active. */
  active: boolean;
  /** @description Start date of the assessment process (ISO string). */
  startDate: string;
  /** @description End date of the assessment process (ISO string). */
  endDate: string;
}

export interface AssessmentProcessListResponse {
  processes: AssessmentProcessDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface StatusHistoryEntry {
  status: AssessmentProcessStatus;
  changedAt: string;
  changedBy: {
    id: string;
    name: string;
  };
}

export interface StatusHistoryResponse {
  history: StatusHistoryEntry[];
}

// Assessment Process Command Models
export interface UpdateAssessmentProcessStatusCommand {
  status: AssessmentProcessStatus;
}

export interface UpdateAssessmentProcessStatusResponse {
  id: string;
  status: AssessmentProcessStatus;
  previousStatus: AssessmentProcessStatus;
  changedAt: string;
}

// Goal Category DTOs
export interface GoalCategoryDTO {
  id: string;
  name: string;
}

export interface GoalCategoryListResponse {
  categories: GoalCategoryDTO[];
}

// Goal DTOs
/** @description Data Transfer Object for goal information. */
export interface GoalDTO {
  id: string;
  title: string;
  description: string;
  /** @description Weight of the goal, typically a number (e.g., 0-1 or percentage). */
  weight: number;
  category: {
    id: string;
    name: string;
  };
}

/** @description Detailed Data Transfer Object for a goal, including employee and process info. */
export interface GoalDetailDTO extends GoalDTO {
  employee: {
    id: string;
    name: string;
  };
  process: {
    id: string;
    name: string;
  };
}

export interface GoalListResponse {
  goals: GoalDTO[];
  totalWeight: number;
}

// Goal Command Models
export interface CreateGoalCommand {
  title: string;
  description: string;
  weight: number;
  categoryId: string;
}

export interface UpdateGoalCommand {
  title: string;
  description: string;
  weight: number;
  categoryId: string;
}

export interface GoalResponse extends GoalDTO {
  validationErrors: string[];
}

// Predefined Goal DTOs
export interface PredefinedGoalDTO {
  id: string;
  description: string;
  categoryId: string;
  categoryName: string;
}

export interface PredefinedGoalListResponse {
  goals: PredefinedGoalDTO[];
  total: number;
  page: number;
  limit: number;
}

// Assessment DTOs
export interface AssessmentDTO {
  id: string;
  rating: number;
  comments: string | null;
  createdAt: string;
  updatedAt?: string;
}

// Assessment Command Models
export interface CreateAssessmentCommand {
  rating: number;
  comments: string | null;
}

export interface AssessmentResponse {
  id: string;
  rating: number;
  comments: string | null;
  createdAt: string;
}

// Pagination Query Parameters
export interface PaginationQueryParams {
  page?: number;
  limit?: number;
}

// Filter Query Parameters
export type UserFilterQueryParams = PaginationQueryParams;

export interface AssessmentProcessFilterQueryParams extends PaginationQueryParams {
  status?: AssessmentProcessStatus;
  active?: boolean;
}

export interface PredefinedGoalFilterQueryParams extends PaginationQueryParams {
  category?: string;
}

// Dashboard view models
export interface AssessmentProcessViewModel extends AssessmentProcessDTO {
  statusLabel: string;
  formattedStartDate: string;
  formattedEndDate: string;
}

/**
 * @description View model for the main dashboard.
 * Contains all necessary data to render the dashboard UI, including user details,
 * assessment processes, employee lists, and UI state like loading indicators and errors.
 */
export interface DashboardViewModel {
  /** @description Information about the currently logged-in user. */
  user: UserViewModel;
  /** @description List of assessment processes relevant to the user. */
  processes: AssessmentProcessViewModel[];
  /** @description List of employees (e.g., subordinates for a manager). */
  employees: EmployeeDTO[];
  /** @description The currently selected assessment process in the UI (if any). */
  selectedProcess?: AssessmentProcessViewModel;
  /** @description The currently selected employee in the UI (if any). */
  selectedEmployee?: EmployeeDTO;
  /** @description Indicates if the current user is a manager. */
  isManager: boolean;
  /** @description Indicates if data is currently being loaded for the dashboard. */
  isLoading: boolean;
  /** @description An optional error message to display on the dashboard. */
  error?: string;
}

/**
 * @description Mapping of assessment process statuses to human-readable Polish labels.
 * Used for displaying statuses in the user interface.
 * @constant {Record<AssessmentProcessStatus, string>} STATUS_LABELS
 */
export const STATUS_LABELS: Record<AssessmentProcessStatus, string> = {
  in_definition: "W definiowaniu",
  in_self_assessment: "W samoocenie",
  awaiting_manager_assessment: "W ocenie kierownika",
  completed: "Zakończony",
};
