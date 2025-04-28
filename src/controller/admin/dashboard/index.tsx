import { DashboardControllerParams } from "@/types/dashboard/dashboard";

export async function GetDataDashboard(params: DashboardControllerParams) {
   var response = await fetch(`/api/admin/dashboard/?topSaller=${params.topSeller}&grafik=${params.grafik}&year=${params.year}`);
   return response;
}
