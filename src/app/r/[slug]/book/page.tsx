import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getSalonDetail, resolveBookingSlug } from "@/lib/api/salons";

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let resolved;
  try {
    resolved = await resolveBookingSlug(slug);
  } catch {
    notFound();
  }

  const detail = await getSalonDetail(resolved.salonId);
  if (!detail.salon || detail.services.length === 0) notFound();

  return (
    <div className="px-4 py-6">
      <BookingWizard
        slug={slug}
        salonId={resolved.salonId}
        salonName={resolved.salonName}
        detail={detail}
      />
    </div>
  );
}
