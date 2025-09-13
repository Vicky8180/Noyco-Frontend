import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const WidgetContainer = dynamic(() => import("../components/WidgetContainer"), { ssr: false });

export default function IframePage() {
  const router = useRouter();
  const { hospitalId } = router.query;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  if (!hospitalId) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <WidgetContainer hospitalId={hospitalId} apiBase={apiBase} />
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
} 