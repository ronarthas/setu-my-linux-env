import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Discord",
    dependencies: [],
  };
}

export default async function installDiscord() {
  await installSmartPackage("Discord", "discord", {
    successMessage: "Discord installed successfully 💬🎮",
  });
}
