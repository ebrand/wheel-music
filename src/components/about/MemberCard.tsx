import Image from "next/image";
import { BandMember } from "@/types/database";
import { Card } from "@/components/ui/Card";

export function MemberCard({ member }: { member: BandMember }) {
  return (
    <Card className="text-center">
      {member.image_url && (
        <div className="relative mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full">
          <Image
            src={member.image_url}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold">
        {member.url ? (
          <a href={member.url} target="_blank" rel="noopener noreferrer">
            {member.name}
          </a>
        ) : (
          member.name
        )}
      </h3>
      <p className="text-sm text-accent">{member.role}</p>
      {member.bio && <p className="mt-2 text-sm text-muted">{member.bio}</p>}
    </Card>
  );
}
