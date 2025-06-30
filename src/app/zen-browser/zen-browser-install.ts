import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Zen Browser",
    dependencies: [],
  };
}

export default async function installZenBrowser() {
  await installSmartPackage("Zen Browser", "zen-browser", {
    successMessage: "Zen Browser installed successfully 🧘✨🌐",
  });
}
