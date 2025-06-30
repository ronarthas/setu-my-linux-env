import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Remmina",
    dependencies: [],
  };
}

export default async function installRemmina() {
  await installSmartPackage("Remmina", "remmina", {
    successMessage: "Remmina installed successfully 🖥️🔗",
  });
}
