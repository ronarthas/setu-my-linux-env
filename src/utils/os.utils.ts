import { $ } from "bun";
import { readFileSync, existsSync } from "fs";
import { platform } from "os";

async function detectOSAndDistro(): Promise<string> {
  const osType = platform();

  // Si c'est Linux, on retourne la distribution
  if (osType === "linux") {
    const distro = await detectLinuxDistro();
    return distro.name;
  }

  // Sinon on retourne l'OS simplifié
  switch (osType) {
    case "win32":
      return "Windows";
    case "darwin":
      return "macOS";
    default:
      return osType;
  }
}

async function detectLinuxDistro() {
  try {
    // Méthode 1: /etc/os-release (standard moderne)
    if (existsSync("/etc/os-release")) {
      const osRelease = readFileSync("/etc/os-release", "utf8");
      const lines = osRelease.split("\n");

      let idLike = null;
      let name = null;
      let version = null;

      for (const line of lines) {
        if (line.startsWith("ID_LIKE=")) {
          idLike = line.split("=")[1].replace(/"/g, "");
        }
        if (line.startsWith("NAME=")) {
          name = line.split("=")[1].replace(/"/g, "");
        }
        if (line.startsWith("VERSION=")) {
          version = line.split("=")[1].replace(/"/g, "");
        }
      }

      // Priorité à ID_LIKE pour les distributions basées sur d'autres
      const distroBase = idLike || name;

      if (distroBase) {
        const distroLower = distroBase.toLowerCase();
        if (distroLower.includes("ubuntu")) return { name: "Ubuntu", version };
        if (distroLower.includes("debian")) return { name: "Debian", version };
        if (distroLower.includes("fedora")) return { name: "Fedora", version };
        if (distroLower.includes("arch"))
          return { name: "Arch Linux", version };
        if (distroLower.includes("centos")) return { name: "CentOS", version };
        if (distroLower.includes("rhel") || distroLower.includes("red hat"))
          return { name: "Red Hat", version };
        if (distroLower.includes("opensuse"))
          return { name: "openSUSE", version };
        if (distroLower.includes("mint"))
          return { name: "Linux Mint", version };
        if (distroLower.includes("manjaro"))
          return { name: "Manjaro", version };
        if (distroLower.includes("alpine"))
          return { name: "Alpine Linux", version };

        return { name: distroBase, version };
      }
    }

    // Méthode 2: Fichiers spécifiques aux distributions
    const distroFiles = [
      { file: "/etc/debian_version", name: "Debian" },
      { file: "/etc/redhat-release", name: "Red Hat" },
      { file: "/etc/fedora-release", name: "Fedora" },
      { file: "/etc/arch-release", name: "Arch Linux" },
      { file: "/etc/alpine-release", name: "Alpine Linux" },
    ];

    for (const { file, name } of distroFiles) {
      if (existsSync(file)) {
        try {
          const content = readFileSync(file, "utf8").trim();
          return { name, version: content };
        } catch (e) {
          return { name, version: null };
        }
      }
    }

    // Méthode 3: Commande lsb_release (si disponible)
    try {
      const lsbResult = await $`lsb_release -d`.text();
      const description = lsbResult.split("\t")[1]?.trim();
      if (description) {
        return { name: description, version: null };
      }
    } catch (e) {
      // lsb_release n'est pas disponible
    }

    // Méthode 4: uname pour les cas de base
    try {
      const unameResult = await $`uname -a`.text();
      return { name: "Linux (Unknown)", version: unameResult.trim() };
    } catch (e) {
      return { name: "Linux (Unknown)", version: null };
    }
  } catch (error) {
    console.error("Erreur lors de la détection de la distribution:", error);
    return { name: "Linux (Error)", version: null };
  }
}

// Fonction utilitaire pour afficher les informations
function displaySystemInfo(info: string) {
  console.log("=== Système détecté ===");
  console.log(info);
}

// Utilisation
async function main() {
  const systemInfo = await detectOSAndDistro();
  displaySystemInfo(systemInfo);
  return systemInfo;
}

// Export pour utilisation en module
export { detectOSAndDistro, displaySystemInfo };

// Exécution directe si le script est appelé
if (import.meta.main) {
  main();
}
