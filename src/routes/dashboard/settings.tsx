import { createFileRoute } from "@tanstack/react-router";
import { PrefrencesForm } from "@/modules/prefrences/prefrences-form";

export const Route = createFileRoute("/dashboard/settings")({
  component: () => <PrefrencesForm />,
});
