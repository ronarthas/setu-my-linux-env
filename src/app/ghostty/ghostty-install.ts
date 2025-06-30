import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Ghostty",
    dependencies: [],
  };
}

export default async function installGhostty() {
  await installSmartPackage("Ghostty", "ghostty", {
    successMessage: "Ghostty terminal installed successfully 👻💻",
  });
}
