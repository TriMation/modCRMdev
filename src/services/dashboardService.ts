import { supabase } from '../config/supabase';

export interface DashboardMetrics {
  totalLeads: number;
  totalOpportunities: number;
  totalTasks: number;
  totalValue: number;
  leadsByStage: { stage: string; count: number; value: number }[];
  opportunitiesByStage: { stage: string; count: number; value: number }[];
  opportunities: any[];
  upcomingTasks: any[];
  monthlyRevenue: { month: string; value: number; count: number }[];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    // Get all required data in parallel
    const [
      { data: leads },
      { data: opportunities },
      { data: tasks },
      { data: leadStages },
      { data: opportunityStages }
    ] = await Promise.all([
      supabase.from('leads').select('*'),
      supabase.from('opportunities').select('*'),
      supabase.from('tasks').select('*').order('due_date').limit(5),
      supabase.from('lead_stages').select('*'),
      supabase.from('opportunity_stages').select('*')
    ]);

    // Calculate metrics
    const totalLeads = leads?.length || 0;
    const totalOpportunities = opportunities?.length || 0;
    const totalTasks = tasks?.length || 0;
    const totalValue = (opportunities || []).reduce((sum, opp) => sum + (opp.value || 0), 0);

    // Group leads by stage
    const leadsByStage = (leadStages || []).map(stage => ({
      stage: stage.name,
      count: (leads || []).filter(lead => lead.stage_id === stage.id).length,
      value: (leads || [])
        .filter(lead => lead.stage_id === stage.id)
        .reduce((sum, lead) => sum + (lead.value || 0), 0)
    }));

    // Group opportunities by stage
    const opportunitiesByStage = (opportunityStages || []).map(stage => ({
      stage: stage.name,
      count: (opportunities || []).filter(opp => opp.stage_id === stage.id).length,
      value: (opportunities || [])
        .filter(opp => opp.stage_id === stage.id)
        .reduce((sum, opp) => sum + (opp.value || 0), 0)
    }));

    // Calculate monthly revenue
    const monthlyRevenue = calculateMonthlyRevenue(opportunities || []);

    return {
      totalLeads,
      totalOpportunities,
      totalTasks,
      totalValue,
      leadsByStage,
      opportunitiesByStage,
      opportunities: opportunities || [],
      upcomingTasks: tasks || [],
      monthlyRevenue
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
}

function calculateMonthlyRevenue(opportunities: any[]): { month: string; value: number; count: number }[] {
  const monthlyData = new Map<string, { value: number; count: number }>();
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const futureMonths = new Date(now.getFullYear(), now.getMonth() + 6, 1);

  // Initialize all months
  for (let d = new Date(sixMonthsAgo); d <= futureMonths; d.setMonth(d.getMonth() + 1)) {
    const monthKey = d.toISOString().substring(0, 7);
    monthlyData.set(monthKey, { value: 0, count: 0 });
  }

  // Aggregate opportunity data
  opportunities.forEach(opp => {
    const closeDate = new Date(opp.close_date);
    if (closeDate >= sixMonthsAgo && closeDate <= futureMonths) {
      const monthKey = closeDate.toISOString().substring(0, 7);
      const current = monthlyData.get(monthKey) || { value: 0, count: 0 };
      monthlyData.set(monthKey, {
        value: current.value + (opp.value || 0),
        count: current.count + 1
      });
    }
  });

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      value: data.value,
      count: data.count
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function getMonthRange(period: string): { start: Date; end: Date } {
  const now = new Date();
  switch (period) {
    case 'last6':
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 5, 1),
        end: now
      };
    case 'prev3':
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 3, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0)
      };
    case 'next3':
      return {
        start: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        end: new Date(now.getFullYear(), now.getMonth() + 3, 31)
      };
    case 'future6':
      return {
        start: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        end: new Date(now.getFullYear(), now.getMonth() + 6, 31)
      };
    default:
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 5, 1),
        end: now
      };
  }
}