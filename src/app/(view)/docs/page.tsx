"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { AssetsJson } from "@/assets";

const LoadingSwagger = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p>Loading Component...</p>,
});

export default function docs() {
  return <LoadingSwagger withCredentials spec={AssetsJson.openAPIDocs} />;
}
