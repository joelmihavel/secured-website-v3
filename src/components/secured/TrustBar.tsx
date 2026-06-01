import Image from "next/image";

export function TrustBar() {
  return (
    <div className="relative w-full">
      <div className="mx-auto flex max-w-[1440px] items-center justify-end px-12 py-6">
        {/* QR Code — right side */}
        <div className="flex h-[80px] w-[80px] items-center justify-center rounded-lg border border-[#333] bg-black p-2">
          <div className="flex h-full w-full items-center justify-center rounded bg-white">
            <Image
              src="/assets/logos/flent-icon.svg"
              alt="Scan to download Flent"
              width={30}
              height={30}
              className="opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
