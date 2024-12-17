import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { MenuProvider } from './contexts/MenuContext';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AccountsPage } from './pages/AccountsPage';
import { BidsPage } from './pages/bids/BidsPage';
import { NewAccountPage } from './pages/NewAccountPage';
import { EditAccountPage } from './pages/EditAccountPage';
import { AccountDetailPage } from './pages/AccountDetailPage';
import { ContactsPage } from './pages/ContactsPage';
import { ContactDetailPage } from './pages/ContactDetailPage';
import { NewContactPage } from './pages/NewContactPage';
import { EditContactPage } from './pages/EditContactPage';
import { OpportunityDetailPage } from './pages/OpportunityDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { SettingsPage } from './pages/SettingsPage';
import { LeadsPage } from './pages/LeadsPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <MenuProvider>
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <DashboardPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/accounts" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <AccountsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/accounts/new" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <NewAccountPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/accounts/:id" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <AccountDetailPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/accounts/:id/edit" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <EditAccountPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/contacts" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ContactsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/contacts/new" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <NewContactPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/contacts/:id" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ContactDetailPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/contacts/:id/edit" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <EditContactPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/products" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ProductsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/opportunities" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <OpportunitiesPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/opportunities/:id" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <OpportunityDetailPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/leads" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <LeadsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/tasks" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <TasksPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/calendar" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <CalendarPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/settings" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <SettingsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/dashboard/bids" element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <BidsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                } />

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </MenuProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}