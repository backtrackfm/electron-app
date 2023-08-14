import { CreateVersionForm } from "@/components/forms/create-version-form";

export default function CreateVersionPage({
  params,
}: {
  params: {
    projectId: string;
    branchId: string;
  };
}) {
  return (
    <div>
      <CreateVersionForm
        branchId={params.branchId}
        projectId={params.projectId}
      />
    </div>
  );
}
