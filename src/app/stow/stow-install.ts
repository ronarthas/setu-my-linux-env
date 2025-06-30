import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Stow",
    dependencies: ["git"], // Stow dépend de Git
  };
}

export default async function installStow() {
  await installSmartPackage("Stow", "stow", {
    successMessage: "Stow successfully installed 📦🔗",
  });
}
