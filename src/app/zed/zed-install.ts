import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Zed",
    dependencies: [],
  };
}

export default async function installZed() {
  await installSmartPackage("Zed", "zed", {
    successMessage: "Zed editor installed successfully 📝✨",
  });
}
