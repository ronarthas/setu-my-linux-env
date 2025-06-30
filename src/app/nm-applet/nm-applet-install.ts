import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Nm Applet",
    dependencies: [],
  };
}

export default async function installNmApplet() {
  await installSmartPackage("Nm Applet", "network-manager-applet", {
    successMessage: "NetworkManager Applet installed successfully 📶🔧",
  });
}
