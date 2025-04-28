import { grafikEnum, topSallerEnum } from "@/lib/zod-schema/dashboard";
interface model {
   type: string;
   mounth: number;
   total: number;
}

interface DashboardModel {
   cartModel: model[];
   totalRevanue: number;
   totalOrder: number;
   totalCostumer: number;
   totalItemSold: number;
   recentOrder: any;
   topSaller: any;
}

interface DashboardControllerParams {
   topSeller: topSallerEnum;
   grafik: grafikEnum;
   year: number;
}

