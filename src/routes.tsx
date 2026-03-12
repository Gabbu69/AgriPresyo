import React from 'react';
import { Navigate } from 'react-router-dom';

export type UserRole = 'consumer' | 'vendor' | 'admin';

interface ProtectedRouteProps {
  element: React.ReactNode;
  isAllowed: boolean;
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Redirects to home if user doesn't have access to the route
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  isAllowed,
  redirectTo = '/'
}) => {
  return isAllowed ? element : <Navigate to={redirectTo} replace />;
};

/**
 * Route Mapping
 * Defines all application routes and their metadata
 */
export const ROUTES = {
  HOME: '/',
  MARKET: '/market',
  BUDGET: '/budget',
  VENDORS: '/vendors',
  ADMIN: '/admin'
};

/**
 * Navigation links for desktop and mobile
 * Displayed based on user role
 */
export const getNavigationItems = (role: UserRole, isAdminUnlocked: boolean) => {
  const items = [
    { path: ROUTES.MARKET, label: 'MARKET', icon: 'Store' },
    { path: ROUTES.BUDGET, label: 'BUDGET', icon: 'Calculator' },
    ...(role !== 'vendor' ? [{ path: ROUTES.VENDORS, label: 'SHOPS', icon: 'ShoppingBag' }] : []),
  ];

  if (role === 'vendor') {
    items.push({ path: ROUTES.HOME, label: 'DASHBOARD', icon: 'LayoutGrid' });
  }

  if (role === 'admin' && isAdminUnlocked) {
    items.push({ path: ROUTES.ADMIN, label: 'ADMIN CONSOLE', icon: 'ShieldCheck' });
  }

  return items;
};

/**
 * Mobile nav labels (abbreviated for 375px viewport)
 */
export const getMobileNavLabel = (path: string): string => {
  switch (path) {
    case ROUTES.MARKET:
      return 'Mkts';
    case ROUTES.BUDGET:
      return 'Budget';
    case ROUTES.VENDORS:
      return 'Shops';
    case ROUTES.HOME:
      return 'Dash';
    case ROUTES.ADMIN:
      return 'Admin';
    default:
      return 'Nav';
  }
};

/**
 * Check if route is active (for navigation styling)
 */
export const isRouteActive = (pathname: string, routePath: string): boolean => {
  if (routePath === ROUTES.HOME) {
    return pathname === ROUTES.HOME || pathname === ROUTES.MARKET;
  }
  return pathname === routePath;
};
