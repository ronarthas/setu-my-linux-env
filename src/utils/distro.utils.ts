import { detectOSAndDistro } from "./os.utils";
import { commandExists } from "./install.utils";

// Cache pour éviter de re-détecter l'OS à chaque fois
let cachedDistroInfo: DistroInfo | null = null;

export interface DistroInfo {
  name: string;
  family: "arch" | "debian" | "redhat" | "alpine" | "unknown";
  packageManager: "pacman" | "paru" | "apt" | "yum" | "dnf" | "apk";
  packageManagerInstallFlags: string[];
  packageManagerCheckCommand: string;
}

export interface PackageMapping {
  [distroFamily: string]: {
    packageName: string;
    packageManager?: "pacman" | "paru" | "apt" | "yum" | "dnf" | "apk";
    alternativeInstallMethod?: {
      checkCommand: string;
      installCommand: string;
    };
  };
}

/**
 * Détecte et cache les informations de distribution
 */
export async function getDistroInfo(): Promise<DistroInfo> {
  if (cachedDistroInfo) {
    return cachedDistroInfo;
  }

  const distroName = await detectOSAndDistro();
  const normalizedName = distroName.toLowerCase();

  let distroInfo: DistroInfo;

  // Arch-based distributions
  if (normalizedName.includes("arch") || normalizedName.includes("manjaro") || normalizedName.includes("endeavour")) {
    // Check if paru is available, fallback to pacman
    const hasParu = await commandExists("paru");
    distroInfo = {
      name: distroName,
      family: "arch",
      packageManager: hasParu ? "paru" : "pacman",
      packageManagerInstallFlags: ["--noconfirm"],
      packageManagerCheckCommand: "pacman -Q"
    };
  }
  // Debian-based distributions
  else if (normalizedName.includes("ubuntu") || normalizedName.includes("debian") || normalizedName.includes("mint")) {
    distroInfo = {
      name: distroName,
      family: "debian",
      packageManager: "apt",
      packageManagerInstallFlags: ["-y"],
      packageManagerCheckCommand: "dpkg -l"
    };
  }
  // Red Hat-based distributions
  else if (normalizedName.includes("fedora") || normalizedName.includes("centos") || normalizedName.includes("rhel") || normalizedName.includes("red hat")) {
    // Check if dnf is available, fallback to yum
    const hasDnf = await commandExists("dnf");
    distroInfo = {
      name: distroName,
      family: "redhat",
      packageManager: hasDnf ? "dnf" : "yum",
      packageManagerInstallFlags: ["-y"],
      packageManagerCheckCommand: hasDnf ? "dnf list installed" : "yum list installed"
    };
  }
  // Alpine Linux
  else if (normalizedName.includes("alpine")) {
    distroInfo = {
      name: distroName,
      family: "alpine",
      packageManager: "apk",
      packageManagerInstallFlags: ["--no-cache"],
      packageManagerCheckCommand: "apk info -e"
    };
  }
  // Unknown distribution
  else {
    console.warn(`⚠️ Unknown distribution: ${distroName}. Defaulting to generic settings.`);
    distroInfo = {
      name: distroName,
      family: "unknown",
      packageManager: "apt", // Default fallback
      packageManagerInstallFlags: ["-y"],
      packageManagerCheckCommand: "which"
    };
  }

  cachedDistroInfo = distroInfo;
  return distroInfo;
}

/**
 * Résout le nom du package selon la distribution
 */
export function resolvePackageName(packageMapping: PackageMapping, distroFamily: string): {
  packageName: string;
  packageManager?: string;
  alternativeInstallMethod?: {
    checkCommand: string;
    installCommand: string;
  };
} | null {
  // Essayer d'abord la famille exacte
  if (packageMapping[distroFamily]) {
    return packageMapping[distroFamily];
  }

  // Fallback vers 'default' si disponible
  if (packageMapping.default) {
    return packageMapping.default;
  }

  // Essayer 'all' (packages universels)
  if (packageMapping.all) {
    return packageMapping.all;
  }

  return null;
}

/**
 * Génère la commande d'installation selon la distribution
 */
export function generateInstallCommand(
  packageManager: string,
  packageName: string,
  additionalFlags: string[] = []
): string {
  const flags = additionalFlags.length > 0 ? additionalFlags.join(" ") + " " : "";

  switch (packageManager) {
    case "pacman":
      return `sudo pacman -S ${flags}${packageName}`;
    case "paru":
      return `paru -S ${flags}${packageName}`;
    case "apt":
      // Update package list first for apt
      return `sudo apt update && sudo apt install ${flags}${packageName}`;
    case "yum":
      return `sudo yum install ${flags}${packageName}`;
    case "dnf":
      return `sudo dnf install ${flags}${packageName}`;
    case "apk":
      return `sudo apk add ${flags}${packageName}`;
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}

/**
 * Vérifie si un package est installé selon la distribution
 */
export async function isPackageInstalledOnDistro(
  packageName: string,
  distroInfo: DistroInfo
): Promise<boolean> {
  try {
    const { packageManager, packageManagerCheckCommand } = distroInfo;

    switch (packageManager) {
      case "pacman":
      case "paru":
        const { $ } = await import("bun");
        await $`${packageManagerCheckCommand.split(" ")} ${packageName}`.quiet();
        return true;
      case "apt":
        const { $ : $2 } = await import("bun");
        await $2`${packageManagerCheckCommand.split(" ")} ${packageName}`.quiet();
        return true;
      case "yum":
      case "dnf":
        const { $ : $3 } = await import("bun");
        await $3`${packageManagerCheckCommand.split(" ")} ${packageName}`.quiet();
        return true;
      case "apk":
        const { $ : $4 } = await import("bun");
        await $4`${packageManagerCheckCommand.split(" ")} ${packageName}`.quiet();
        return true;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Affiche des informations sur la distribution détectée
 */
export async function displayDistroInfo(): Promise<void> {
  const distroInfo = await getDistroInfo();
  console.log("🔍 Distribution détectée:");
  console.log(`   Nom: ${distroInfo.name}`);
  console.log(`   Famille: ${distroInfo.family}`);
  console.log(`   Gestionnaire: ${distroInfo.packageManager}`);
  console.log(`   Flags: ${distroInfo.packageManagerInstallFlags.join(" ")}`);
}

/**
 * Valide que le gestionnaire de paquets est disponible
 */
export async function validatePackageManager(packageManager: string): Promise<boolean> {
  return await commandExists(packageManager);
}

/**
 * Reset du cache (utile pour les tests)
 */
export function resetDistroCache(): void {
  cachedDistroInfo = null;
}
