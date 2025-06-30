import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "git",
    dependencies: [], // Git n'a pas de dépendances
  };
}

export default async function installGit() {
  await installSmartPackage("Git", "git", {
    successMessage: "Git installed successfully 🔗📝",
  });
}
