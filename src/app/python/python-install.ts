import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Python",
    dependencies: [], // Python est un package de base, pas de dépendances
  };
}

export default async function installPython() {
  await installSmartPackage("Python", "python", {
    successMessage: "Python installed successfully 🐍✨",
  });
}
