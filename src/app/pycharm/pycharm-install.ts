import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Pycharm",
    dependencies: ["python"],
  };
}

export default async function installPycharm() {
  await installSmartPackage("Pycharm", "pycharm-community", {
    successMessage: "PyCharm Community installed successfully 🐍💻",
  });
}
