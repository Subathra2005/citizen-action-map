import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  department?: string;
  deptId?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  description: string;
  category: string;
  photo?: string;
  location?: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'escalated';
  dateRaised: string;
  slaDeadline: string;
  upvotes: number;
  upvotedBy: string[];
  assignedAdminId?: string;
  assignedAdminName?: string;
  progressSteps: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
  };
  currentStep?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
  department?: string;
  isCritical: boolean;
}

export interface AppState {
  user: User | null;
  complaints: Complaint[];
  isAuthenticated: boolean;
  users: User[];
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SUBMIT_COMPLAINT'; payload: Complaint }
  | { type: 'UPDATE_COMPLAINT'; payload: { id: string; updates: Partial<Complaint> } }
  | { type: 'UPVOTE_COMPLAINT'; payload: { complaintId: string; userId: string } }
  | { type: 'ASSIGN_COMPLAINT'; payload: { complaintId: string; adminId: string; adminName: string } }
  | { type: 'UPDATE_PROGRESS'; payload: { complaintId: string; progressSteps: any; currentStep: string } }
  | { type: 'RESOLVE_COMPLAINT'; payload: { complaintId: string } }
  | { type: 'ADD_FEEDBACK'; payload: { complaintId: string; feedback: { rating: number; comment: string } } }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  user: null,
  complaints: [],
  isAuthenticated: false,
  users: [
    {
      id: 'user123',
      name: 'John Citizen',
      email: 'user@demo.com',
      role: 'user',
    },
    {
      id: 'admin123',
      name: 'Sarah Wilson',
      email: 'admin@demo.com',
      role: 'admin',
      department: 'PWD',
      deptId: 'pwd_001',
    },
  ],
};

const categories = [
  'Road Infrastructure',
  'Water Supply',
  'Electricity',
  'Waste Management',
  'Public Transport',
  'Healthcare',
  'Education',
  'Public Safety',
  'Parks & Recreation',
  'Building Permits'
];

const departmentMapping: { [key: string]: string } = {
  'Road Infrastructure': 'PWD',
  'Water Supply': 'Water Department',
  'Electricity': 'Electricity Board',
  'Waste Management': 'Sanitation Department',
  'Public Transport': 'Transport Department',
  'Healthcare': 'Health Department',
  'Education': 'Education Department',
  'Public Safety': 'Police Department',
  'Parks & Recreation': 'Parks Department',
  'Building Permits': 'Municipal Corporation'
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    case 'REGISTER_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user?.id === action.payload.id ? action.payload : state.user,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };

    case 'SUBMIT_COMPLAINT':
      const newComplaint = {
        ...action.payload,
        department: departmentMapping[action.payload.category] || 'General',
        isCritical: false,
      };
      return {
        ...state,
        complaints: [...state.complaints, newComplaint],
      };

    case 'UPDATE_COMPLAINT':
      return {
        ...state,
        complaints: state.complaints.map(complaint =>
          complaint.id === action.payload.id
            ? { ...complaint, ...action.payload.updates }
            : complaint
        ),
      };

    case 'UPVOTE_COMPLAINT':
      return {
        ...state,
        complaints: state.complaints.map(complaint => {
          if (complaint.id === action.payload.complaintId) {
            const hasUpvoted = complaint.upvotedBy.includes(action.payload.userId);
            if (hasUpvoted) return complaint;
            
            const newUpvotes = complaint.upvotes + 1;
            const newUpvotedBy = [...complaint.upvotedBy, action.payload.userId];
            const isCritical = newUpvotes >= 20;
            
            // Update SLA if becomes critical
            let slaDeadline = complaint.slaDeadline;
            if (isCritical && !complaint.isCritical) {
              const raisedDate = new Date(complaint.dateRaised);
              slaDeadline = new Date(raisedDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
            }
            
            return {
              ...complaint,
              upvotes: newUpvotes,
              upvotedBy: newUpvotedBy,
              isCritical,
              slaDeadline,
            };
          }
          return complaint;
        }),
      };

    case 'ASSIGN_COMPLAINT':
      return {
        ...state,
        complaints: state.complaints.map(complaint =>
          complaint.id === action.payload.complaintId
            ? {
                ...complaint,
                status: 'assigned',
                assignedAdminId: action.payload.adminId,
                assignedAdminName: action.payload.adminName,
              }
            : complaint
        ),
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        complaints: state.complaints.map(complaint =>
          complaint.id === action.payload.complaintId
            ? {
                ...complaint,
                status: 'in-progress',
                progressSteps: action.payload.progressSteps,
                currentStep: action.payload.currentStep,
              }
            : complaint
        ),
      };

    case 'RESOLVE_COMPLAINT':
      return {
        ...state,
        complaints: state.complaints.map(complaint =>
          complaint.id === action.payload.complaintId
            ? { ...complaint, status: 'resolved' }
            : complaint
        ),
      };

    case 'ADD_FEEDBACK':
      return {
        ...state,
        complaints: state.complaints.map(complaint =>
          complaint.id === action.payload.complaintId
            ? { ...complaint, feedback: action.payload.feedback }
            : complaint
        ),
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  categories: string[];
  departmentMapping: { [key: string]: string };
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('civicAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('civicAppState', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch, categories, departmentMapping }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};