import { withBasePath } from "./basePath";

// User-supplied assets, approved by the owner for the public demo. Pose 08 remains excluded.
export const PORTRAIT = withBasePath("/manus-storage/image1_b62490b3.png");
export const CERTIFICATE = withBasePath("/manus-storage/amostart-certificate_033d7950.png");
export const MASCOT = {
  greeting: withBasePath("/manus-storage/maskot-01-privetstvie_a4fe50b5.png"),
  points: withBasePath("/manus-storage/maskot-02-pokazyvaet_6d420ce0.png"),
  thinking: withBasePath("/manus-storage/maskot-03-dumaet_3bc8d2e6.png"),
  serious: withBasePath("/manus-storage/maskot-04-seryoznaya_84580bc8.png"),
  happy: withBasePath("/manus-storage/maskot-05-raduetsya_950b4fa0.png"),
  sad: withBasePath("/manus-storage/maskot-07-grustit_f89f1032.png"),
} as const;

export function mascotForStep(step: number, progress: number): string {
  const poses = [MASCOT.greeting, MASCOT.points, MASCOT.thinking, MASCOT.serious,
    MASCOT.happy, MASCOT.serious, MASCOT.sad, MASCOT.happy];
  if (step === 4 && progress * 8 - 4 > 0.5) return MASCOT.serious;
  return poses[step] ?? MASCOT.greeting;
}
