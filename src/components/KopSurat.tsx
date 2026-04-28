/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SchoolInfo } from "@/src/types";

interface KopSuratProps {
  school: SchoolInfo;
}

export default function KopSurat({ school }: KopSuratProps) {
  return (
    <div className="flex flex-col items-center mb-6 w-full">
      <div className="flex w-full items-center justify-between gap-4 mb-2">
        <div className="w-[85px] h-[85px] flex-shrink-0 flex items-center justify-center">
          <img src={school.logo} alt="Logo" className="max-w-full max-h-full object-contain grayscale" />
        </div>
        <div className="flex-grow text-center pr-[85px]">
          <h2 className="text-[14px] font-bold uppercase leading-tight tracking-tight">
            {school.kementerian}
          </h2>
          <h2 className="text-[14px] font-bold uppercase leading-tight tracking-tight">
            KANTOR KEMENTERIAN AGAMA {school.kabupaten.toUpperCase()}
          </h2>
          <h1 className="text-[18px] font-bold uppercase leading-tight my-0.5">
            {school.name}
          </h1>
          <p className="text-[11px] leading-tight font-normal">
            {school.address}
          </p>
          <p className="text-[11px] leading-tight font-normal">
            Telp/Fax. {school.phone}
          </p>
          <p className="text-[11px] leading-tight flex justify-center gap-2">
            <span>website : <span className="text-blue-700 underline">{school.website}</span></span>
            <span>e-mail : <span className="text-blue-700 underline">{school.email}</span></span>
          </p>
        </div>
      </div>
      {/* Official Double Line */}
      <div className="w-full border-b-[3px] border-black pb-0.5">
        <div className="border-b-[1px] border-black"></div>
      </div>
    </div>
  );
}
